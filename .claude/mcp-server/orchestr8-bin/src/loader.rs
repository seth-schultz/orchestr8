/*!
 * Agent registry loader with JIT (Just-In-Time) loading support
 *
 * Architecture:
 * - Metadata-only loading at startup (<500ms for all agents)
 * - Lazy full definition loading on demand via get_agent_definition_jit()
 * - LRU cache for recently accessed full definitions
 * - Glob pattern matching for discovery from {agent_dir}/**/*.md
 */

use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use tracing::{debug, info, warn};

/// Agent metadata from frontmatter (loaded at startup for fast discovery)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentMetadata {
    pub name: String,
    pub description: String,
    pub model: String,
    #[serde(default)]
    pub capabilities: Vec<String>,
    pub plugin: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fallbacks: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub use_when: Option<String>,
    pub file_path: String,
}

/// Complete agent definition (loaded on-demand via JIT)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentDefinition {
    pub name: String,
    pub description: String,
    pub model: String,
    #[serde(default)]
    pub capabilities: Vec<String>,
    pub plugin: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fallbacks: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub use_when: Option<String>,
    pub file_path: String,
    /// Full markdown content (loaded on-demand)
    pub content: String,
}

/// Agent registry from YAML (roles mapping)
#[derive(Debug, Deserialize)]
struct AgentRegistry {
    roles: HashMap<String, RoleDefinition>,
}

#[derive(Debug, Deserialize)]
struct RoleDefinition {
    primary: String,
    #[serde(default)]
    fallbacks: Vec<String>,
    #[serde(default)]
    capabilities: Vec<String>,
    model: String,
    use_when: String,
}

/// Agent frontmatter from markdown files
#[derive(Debug, Deserialize)]
struct AgentFrontmatter {
    name: String,
    description: String,
    model: String,
    #[serde(default)]
    capabilities: Vec<String>,
}

/// Agent loader with JIT support
pub struct AgentLoader {
    root_dir: PathBuf,
    agent_dir: PathBuf,
    plugins: Vec<String>,
}

impl AgentLoader {
    /// Create new loader with agent directory for JIT discovery
    pub fn new(root_dir: &Path, agent_dir: &Path) -> Self {
        Self {
            root_dir: root_dir.to_path_buf(),
            agent_dir: agent_dir.to_path_buf(),
            plugins: Vec::new(),
        }
    }

    pub fn plugin_count(&self) -> usize {
        self.plugins.len()
    }

    /// Load agent metadata only (fast startup for JIT, <500ms target)
    /// Metadata includes: name, description, model, capabilities, file_path
    pub fn load_agent_metadata(&mut self) -> Result<Vec<AgentMetadata>> {
        let mut agents = Vec::new();
        let mut seen_names = std::collections::HashSet::new();

        // Use glob to find all .md files in agent_dir and subdirectories
        let pattern = self
            .agent_dir
            .join("**/*.md")
            .to_string_lossy()
            .to_string();

        debug!("Scanning agents with glob pattern: {}", pattern);

        match glob::glob(&pattern) {
            Ok(paths) => {
                for entry in paths {
                    match entry {
                        Ok(path) => {
                            // Extract category from path (e.g., agents/database/postgres.md -> "database")
                            let category = path
                                .parent()
                                .and_then(|p| p.file_name())
                                .and_then(|n| n.to_str())
                                .unwrap_or("root")
                                .to_string();

                            match self.load_agent_metadata_from_file(&path, &category) {
                                Ok(agent) => {
                                    if seen_names.insert(agent.name.clone()) {
                                        agents.push(agent);
                                    } else {
                                        debug!("Skipping duplicate agent: {}", agent.name);
                                    }
                                }
                                Err(e) => {
                                    warn!(
                                        "Failed to load metadata from {}: {}",
                                        path.display(),
                                        e
                                    );
                                }
                            }
                        }
                        Err(e) => {
                            warn!("Failed to iterate path: {}", e);
                        }
                    }
                }
            }
            Err(e) => {
                warn!("Failed to glob agent directory: {}", e);
            }
        }

        // Also load from plugin directories for backward compatibility
        let plugins_dir = self.root_dir.join("plugins");
        if plugins_dir.exists() {
            debug!("Also scanning legacy plugins directory: {}", plugins_dir.display());
            let plugin_agents = self.load_plugins(&plugins_dir)?;

            for agent in plugin_agents {
                if seen_names.insert(agent.name.clone()) {
                    agents.push(agent);
                } else {
                    debug!("Skipping duplicate agent: {}", agent.name);
                }
            }
        }

        // Load from agent-registry.yml for role definitions
        let registry_path = self.root_dir.join(".claude/agent-registry.yml");
        if registry_path.exists() {
            debug!(
                "Also loading agent registry from {}",
                registry_path.display()
            );
            let registry_agents = self.load_registry(&registry_path)?;

            for agent in registry_agents {
                if seen_names.insert(agent.name.clone()) {
                    agents.push(agent);
                } else {
                    debug!("Skipping duplicate agent from registry: {}", agent.name);
                }
            }
        }

        info!("Loaded metadata for {} unique agents", agents.len());
        Ok(agents)
    }

    /// Load complete agent definition on-demand (JIT loading)
    /// This includes the full markdown content and all metadata
    pub fn get_agent_definition_jit(&self, agent_path: &Path) -> Result<AgentDefinition> {
        if !agent_path.exists() {
            anyhow::bail!("Agent file not found: {}", agent_path.display());
        }

        let content = fs::read_to_string(agent_path)
            .context("Failed to read agent file")?;

        // Extract YAML frontmatter
        let frontmatter = extract_frontmatter(&content)?;

        let agent_fm: AgentFrontmatter = serde_yaml::from_str(&frontmatter)
            .context("Failed to parse agent frontmatter")?;

        // Extract capabilities from description if not specified
        let capabilities = if agent_fm.capabilities.is_empty() {
            extract_capabilities_from_description(&agent_fm.description)
        } else {
            agent_fm.capabilities
        };

        // Get category from file path
        let plugin = agent_path
            .parent()
            .and_then(|p| p.file_name())
            .and_then(|n| n.to_str())
            .unwrap_or("root")
            .to_string();

        Ok(AgentDefinition {
            name: agent_fm.name,
            description: agent_fm.description,
            model: agent_fm.model,
            capabilities,
            plugin,
            role: None,
            fallbacks: None,
            use_when: None,
            file_path: agent_path.display().to_string(),
            content, // Full markdown content
        })
    }

    /// Load roles from agent-registry.yml
    fn load_registry(&self, path: &Path) -> Result<Vec<AgentMetadata>> {
        let content = fs::read_to_string(path)
            .context("Failed to read agent-registry.yml")?;

        let registry: AgentRegistry = serde_yaml::from_str(&content)
            .context("Failed to parse agent-registry.yml")?;

        let mut agents = Vec::new();

        for (role_name, role_def) in registry.roles {
            // Parse primary agent (format: "plugin:agent-name")
            let (plugin, agent_name) = parse_agent_ref(&role_def.primary)?;

            agents.push(AgentMetadata {
                name: agent_name,
                description: format!("Role: {} - {}", role_name, role_def.use_when),
                model: role_def.model,
                capabilities: role_def.capabilities,
                plugin,
                role: Some(role_name),
                fallbacks: Some(role_def.fallbacks),
                use_when: Some(role_def.use_when),
                file_path: path.display().to_string(),
            });
        }

        debug!("Loaded {} roles from registry", agents.len());
        Ok(agents)
    }

    /// Load agents from all plugins
    fn load_plugins(&mut self, plugins_dir: &Path) -> Result<Vec<AgentMetadata>> {
        let mut all_agents = Vec::new();

        for entry in fs::read_dir(plugins_dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_dir() {
                let plugin_name = path
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();

                match self.load_plugin_agents(&path, &plugin_name) {
                    Ok(agents) => {
                        if !agents.is_empty() {
                            info!("Loaded {} agents from plugin: {}", agents.len(), plugin_name);
                            self.plugins.push(plugin_name);
                            all_agents.extend(agents);
                        }
                    }
                    Err(e) => {
                        warn!("Failed to load plugin {}: {}", plugin_name, e);
                    }
                }
            }
        }

        Ok(all_agents)
    }

    /// Load agents from a single plugin
    fn load_plugin_agents(&self, plugin_dir: &Path, plugin_name: &str) -> Result<Vec<AgentMetadata>> {
        let agents_dir = plugin_dir.join("agents");
        if !agents_dir.exists() {
            return Ok(Vec::new());
        }

        let mut agents = Vec::new();

        for entry in fs::read_dir(&agents_dir)? {
            let entry = entry?;
            let path = entry.path();

            if path.is_file() && path.extension().and_then(|e| e.to_str()) == Some("md") {
                match self.load_agent_from_markdown(&path, plugin_name) {
                    Ok(agent) => agents.push(agent),
                    Err(e) => {
                        warn!("Failed to load agent from {}: {}", path.display(), e);
                    }
                }
            }
        }

        Ok(agents)
    }

    /// Load agent metadata from a markdown file (metadata-only, fast)
    fn load_agent_metadata_from_file(&self, path: &Path, category: &str) -> Result<AgentMetadata> {
        let content = fs::read_to_string(path)?;

        // Extract YAML frontmatter (between --- lines)
        let frontmatter = extract_frontmatter(&content)?;

        let agent_fm: AgentFrontmatter = serde_yaml::from_str(&frontmatter)
            .context("Failed to parse agent frontmatter")?;

        // Extract capabilities from description if not specified
        let capabilities = if agent_fm.capabilities.is_empty() {
            extract_capabilities_from_description(&agent_fm.description)
        } else {
            agent_fm.capabilities
        };

        Ok(AgentMetadata {
            name: agent_fm.name,
            description: agent_fm.description,
            model: agent_fm.model,
            capabilities,
            plugin: category.to_string(),
            role: None,
            fallbacks: None,
            use_when: None,
            file_path: path.display().to_string(),
        })
    }

    /// Load a single agent from markdown file with frontmatter (legacy, for plugins)
    fn load_agent_from_markdown(&self, path: &Path, plugin: &str) -> Result<AgentMetadata> {
        let content = fs::read_to_string(path)?;

        // Extract YAML frontmatter (between --- lines)
        let frontmatter = extract_frontmatter(&content)?;

        let agent_fm: AgentFrontmatter = serde_yaml::from_str(&frontmatter)
            .context("Failed to parse agent frontmatter")?;

        // Extract capabilities from description if not specified
        let capabilities = if agent_fm.capabilities.is_empty() {
            extract_capabilities_from_description(&agent_fm.description)
        } else {
            agent_fm.capabilities
        };

        Ok(AgentMetadata {
            name: agent_fm.name,
            description: agent_fm.description,
            model: agent_fm.model,
            capabilities,
            plugin: plugin.to_string(),
            role: None,
            fallbacks: None,
            use_when: None,
            file_path: path.display().to_string(),
        })
    }
}

/// Parse agent reference in format "plugin:agent-name"
fn parse_agent_ref(agent_ref: &str) -> Result<(String, String)> {
    let parts: Vec<&str> = agent_ref.split(':').collect();
    if parts.len() != 2 {
        anyhow::bail!("Invalid agent reference format: {}", agent_ref);
    }
    Ok((parts[0].to_string(), parts[1].to_string()))
}

/// Extract YAML frontmatter from markdown content
fn extract_frontmatter(content: &str) -> Result<String> {
    let lines: Vec<&str> = content.lines().collect();

    // Find frontmatter boundaries
    let mut start_idx = None;
    let mut end_idx = None;

    for (i, line) in lines.iter().enumerate() {
        if line.trim() == "---" {
            if start_idx.is_none() {
                start_idx = Some(i);
            } else if end_idx.is_none() {
                end_idx = Some(i);
                break;
            }
        }
    }

    match (start_idx, end_idx) {
        (Some(start), Some(end)) if start < end => {
            let frontmatter_lines = &lines[start + 1..end];
            Ok(frontmatter_lines.join("\n"))
        }
        _ => anyhow::bail!("No valid frontmatter found"),
    }
}

/// Extract capabilities from description text
fn extract_capabilities_from_description(description: &str) -> Vec<String> {
    let mut capabilities = Vec::new();

    // Common patterns to look for
    let patterns = [
        "react", "vue", "angular", "typescript", "python", "rust", "go",
        "docker", "kubernetes", "aws", "azure", "gcp", "terraform",
        "testing", "security", "performance", "accessibility",
        "api", "database", "frontend", "backend", "fullstack",
    ];

    let lower_desc = description.to_lowercase();
    for pattern in patterns {
        if lower_desc.contains(pattern) {
            capabilities.push(pattern.to_string());
        }
    }

    capabilities
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_agent_ref() {
        let (plugin, agent) = parse_agent_ref("frontend-frameworks:react-specialist").unwrap();
        assert_eq!(plugin, "frontend-frameworks");
        assert_eq!(agent, "react-specialist");
    }

    #[test]
    fn test_extract_frontmatter() {
        let content = r#"---
name: test-agent
description: Test agent
model: haiku
---

# Test Agent

Some content here.
"#;

        let frontmatter = extract_frontmatter(content).unwrap();
        assert!(frontmatter.contains("name: test-agent"));
        assert!(frontmatter.contains("model: haiku"));
    }

    #[test]
    fn test_extract_capabilities() {
        let desc = "Expert React developer with TypeScript and testing skills";
        let caps = extract_capabilities_from_description(desc);
        assert!(caps.contains(&"react".to_string()));
        assert!(caps.contains(&"typescript".to_string()));
        assert!(caps.contains(&"testing".to_string()));
    }
}
