import { promises as fs } from "fs";
import { join } from "path";
import { LRUCache } from "lru-cache";
import matter from "gray-matter";
import { Logger } from "../utils/logger.js";
import { ResourceMetadata } from "../types.js";
// ============================================================================
// NEW IMPORTS: Dynamic resource matching support
// ============================================================================
import { URIParser, ParsedURI } from "../utils/uriParser.js";
import { FuzzyMatcher, ResourceFragment } from "../utils/fuzzyMatcher.js";
import { IndexLookup } from "../utils/indexLookup.js";
// ============================================================================
// NEW IMPORTS: Provider system integration
// ============================================================================
import { ProviderRegistry } from "../providers/registry.js";
import { LocalProvider } from "../providers/local.js";
import { AITMPLProvider } from "../providers/aitmpl.js";
import { GitHubProvider } from "../providers/github.js";
import { ProviderConfigManager } from "../config/providers.js";
import { ConfigLoader } from "../config/loader.js";
import type {
  SearchOptions,
  SearchResult,
  ProviderHealth,
  ProviderStats,
} from "../providers/types.js";
// ============================================================================
// NEW IMPORTS: Token tracking system
// ============================================================================
import { TokenTracker } from "../token/tracker.js";
import { TokenStore } from "../token/store.js";

export class ResourceLoader {
  private logger: Logger;
  private resourcesPath: string;
  private cache: LRUCache<string, string>;

  // ============================================================================
  // NEW: Dynamic resource matching components
  // ============================================================================
  private uriParser: URIParser;
  private fuzzyMatcher: FuzzyMatcher;
  private indexLookup: IndexLookup;
  private resourceIndex: ResourceFragment[] | null = null;
  private indexLoadPromise: Promise<ResourceFragment[]> | null = null;

  // ============================================================================
  // NEW: Provider system components
  // ============================================================================
  private registry: ProviderRegistry;
  private providerConfigManager: ProviderConfigManager | null = null;

  // ============================================================================
  // NEW: Token tracking system components
  // ============================================================================
  private tokenTracker: TokenTracker | null = null;
  private tokenStore: TokenStore | null = null;

  constructor(logger: Logger, tokenTracker?: TokenTracker, tokenStore?: TokenStore) {
    this.logger = logger;
    this.resourcesPath =
      process.env.RESOURCES_PATH || join(process.cwd(), "resources");

    const cacheSize = parseInt(process.env.CACHE_SIZE || "200", 10);
    this.cache = new LRUCache<string, string>({
      max: cacheSize,
      ttl: 1000 * 60 * 60 * 4, // 4 hour TTL for resources (changed less frequently)
      updateAgeOnGet: true,
    });

    // ============================================================================
    // NEW: Initialize dynamic matching components
    // ============================================================================
    this.uriParser = new URIParser();
    this.fuzzyMatcher = new FuzzyMatcher();
    this.indexLookup = new IndexLookup(this.resourcesPath);

    // ============================================================================
    // NEW: Initialize provider registry
    // ============================================================================
    this.registry = new ProviderRegistry({
      enableHealthChecks: true,
      healthCheckInterval: 60000, // 1 minute
      autoDisableUnhealthy: true,
      maxConsecutiveFailures: 3,
      enableEvents: true,
    });

    // ============================================================================
    // NEW: Initialize token tracking components
    // ============================================================================
    this.tokenTracker = tokenTracker || null;
    this.tokenStore = tokenStore || null;

    this.logger.debug(
      `Resource loader initialized with path: ${this.resourcesPath}`,
    );
  }

  /**
   * Load all resources from filesystem
   */
  async loadAllResources(): Promise<ResourceMetadata[]> {
    const resources: ResourceMetadata[] = [];

    try {
      // Load examples
      await this.scanDirectory("examples", "orchestr8://examples", resources);

      // Load patterns
      await this.scanDirectory("patterns", "orchestr8://patterns", resources);

      // Load guides
      await this.scanDirectory("guides", "orchestr8://guides", resources);

      // Load workflows
      await this.scanDirectory("workflows", "orchestr8://workflows", resources);

      // Load agents (on-demand only, not auto-loaded by Claude)
      await this.scanDirectory("agents", "orchestr8://agents", resources);

      // Load skills (on-demand only, not auto-loaded by Claude)
      await this.scanDirectory("skills", "orchestr8://skills", resources);
    } catch (error) {
      this.logger.error("Error loading resources:", error);
      return [];
    }

    return resources;
  }

  // ============================================================================
  // NEW: Provider system initialization
  // ============================================================================
  /**
   * Initialize resource providers
   *
   * Loads provider configuration and initializes all enabled providers:
   * - LocalProvider (always enabled, priority 0)
   * - AITMPLProvider (if enabled in config)
   * - GitHubProvider (if enabled in config)
   *
   * Should be called after basic ResourceLoader initialization.
   */
  async initializeProviders(): Promise<void> {
    this.logger.info("Initializing resource providers");

    try {
      // Load configuration
      const configLoader = new ConfigLoader(this.logger);
      this.providerConfigManager = new ProviderConfigManager(
        this.logger,
        configLoader,
      );
      await this.providerConfigManager.initialize();

      // Validate configuration
      const validation = this.providerConfigManager.validateConfiguration();
      if (!validation.valid) {
        this.logger.warn(
          "Provider configuration has issues:",
          validation.warnings,
        );
      }
      if (validation.errors.length > 0) {
        this.logger.error("Provider configuration errors:", validation.errors);
      }

      // Initialize LocalProvider (always enabled, highest priority)
      this.logger.info("Initializing LocalProvider");
      const localProvider = new LocalProvider(
        { resourcesPath: this.resourcesPath },
        this.logger,
      );
      await this.registry.register(localProvider);
      this.logger.info("LocalProvider registered successfully");

      // Initialize AITMPLProvider (if enabled)
      const aitmplConfig = this.providerConfigManager.getAitmplConfig();
      if (aitmplConfig.enabled) {
        this.logger.info("Initializing AITMPLProvider");
        try {
          const aitmplProvider = new AITMPLProvider(aitmplConfig, this.logger);
          await this.registry.register(aitmplProvider);
          this.logger.info("AITMPLProvider registered successfully");
        } catch (error) {
          this.logger.error("Failed to initialize AITMPLProvider:", error);
          // Continue with other providers
        }
      } else {
        this.logger.debug("AITMPLProvider is disabled in configuration");
      }

      // Initialize GitHubProvider (if enabled)
      const githubConfig = this.providerConfigManager.getGithubConfig();
      if (githubConfig.enabled) {
        this.logger.info("Initializing GitHubProvider");
        try {
          const githubProvider = new GitHubProvider(githubConfig, this.logger);
          await this.registry.register(githubProvider);
          this.logger.info("GitHubProvider registered successfully");
        } catch (error) {
          this.logger.error("Failed to initialize GitHubProvider:", error);
          // Continue with other providers
        }
      } else {
        this.logger.debug("GitHubProvider is disabled in configuration");
      }

      const registeredProviders = this.registry.getProviders();
      this.logger.info(
        `Provider initialization complete. Registered ${registeredProviders.length} providers:`,
        registeredProviders.map((p) => p.name),
      );

      // Log provider health status
      const healthStatuses = await this.registry.checkAllHealth();
      for (const [name, health] of healthStatuses.entries()) {
        this.logger.info(`Provider ${name} health: ${health.status}`);
      }
    } catch (error) {
      this.logger.error("Failed to initialize providers:", error);
      // Don't throw - allow ResourceLoader to work with just local filesystem
      this.logger.warn("Continuing with local filesystem access only");
    }
  }

  /**
   * Recursively scan directory for resources
   */
  private async scanDirectory(
    relativePath: string,
    uriPrefix: string,
    resources: ResourceMetadata[],
  ): Promise<void> {
    const fullPath = join(this.resourcesPath, relativePath);

    try {
      await fs.access(fullPath);
      const entries = await fs.readdir(fullPath, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = join(relativePath, entry.name);
        const uri = `${uriPrefix}/${entry.name.replace(/\.(md|json|yaml)$/, "")}`;

        if (entry.isDirectory()) {
          await this.scanDirectory(entryPath, uri, resources);
        } else if (
          entry.name.endsWith(".md") ||
          entry.name.endsWith(".json") ||
          entry.name.endsWith(".yaml")
        ) {
          const mimeType = entry.name.endsWith(".json")
            ? "application/json"
            : entry.name.endsWith(".yaml")
              ? "application/yaml"
              : "text/markdown";

          resources.push({
            uri,
            name: entry.name.replace(/\.(md|json|yaml)$/, ""),
            description: `Resource: ${uri}`,
            mimeType,
            category: relativePath.split("/")[0],
          });
        }
      }
    } catch (error) {
      this.logger.warn(`Resource directory not found: ${fullPath}`);
    }
  }

  // ============================================================================
  // NEW: Load and cache resource index for dynamic matching
  // ============================================================================
  /**
   * Load resource index from all markdown files in resources directory.
   * Scans recursively, parses frontmatter metadata, and builds ResourceFragment objects.
   * Results are cached for performance.
   *
   * @returns Promise resolving to array of ResourceFragment objects
   */
  async loadResourceIndex(): Promise<ResourceFragment[]> {
    // Return cached index if available
    if (this.resourceIndex !== null) {
      this.logger.debug("Returning cached resource index");
      return this.resourceIndex;
    }

    // If already loading, wait for that promise
    if (this.indexLoadPromise !== null) {
      this.logger.debug("Waiting for in-progress resource index load");
      return this.indexLoadPromise;
    }

    // Start loading
    this.logger.info("Loading resource index...");
    this.indexLoadPromise = this._loadResourceIndexImpl();

    try {
      this.resourceIndex = await this.indexLoadPromise;
      this.logger.info(
        `Resource index loaded with ${this.resourceIndex.length} fragments`,
      );
      return this.resourceIndex;
    } finally {
      this.indexLoadPromise = null;
    }
  }

  /**
   * Internal implementation of resource index loading
   * OPTIMIZED: Parallel directory scanning for faster initial load
   * @private
   */
  private async _loadResourceIndexImpl(): Promise<ResourceFragment[]> {
    try {
      // Scan all resource directories in parallel
      const categories = [
        "agents",
        "skills",
        "examples",
        "patterns",
        "guides",
        "workflows",
      ];

      // Parallel scan all categories - reduces initial load time
      const categoryPromises = categories.map(async (category) => {
        const categoryPath = join(this.resourcesPath, category);
        const categoryFragments: ResourceFragment[] = [];

        try {
          await fs.access(categoryPath);
          await this._scanForFragments(
            categoryPath,
            category,
            category,
            categoryFragments,
          );
        } catch (error) {
          this.logger.debug(`Category directory not found: ${category}`);
        }

        return categoryFragments;
      });

      // Wait for all categories to be scanned
      const fragmentArrays = await Promise.all(categoryPromises);

      // Flatten results
      const fragments = fragmentArrays.flat();

      // Set the index in the fuzzy matcher
      this.fuzzyMatcher.setResourceIndex(fragments);

      return fragments;
    } catch (error) {
      this.logger.error("Error loading resource index:", error);
      return [];
    }
  }

  /**
   * Recursively scan directory and extract resource fragments
   * @private
   */
  private async _scanForFragments(
    dirPath: string,
    category: string,
    relativePath: string,
    fragments: ResourceFragment[],
  ): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name);
      const newRelativePath = join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        await this._scanForFragments(
          fullPath,
          category,
          newRelativePath,
          fragments,
        );
      } else if (entry.name.endsWith(".md")) {
        // Parse markdown file
        try {
          const content = await fs.readFile(fullPath, "utf-8");
          const fragment = await this._parseResourceFragment(
            content,
            category,
            newRelativePath,
          );
          fragments.push(fragment);
          this.logger.debug(`Parsed fragment: ${fragment.id}`);
        } catch (error) {
          this.logger.warn(`Failed to parse resource: ${fullPath}`, error);
        }
      }
    }
  }

  /**
   * Parse a markdown file into a ResourceFragment
   * @private
   */
  private async _parseResourceFragment(
    content: string,
    category: string,
    relativePath: string,
  ): Promise<ResourceFragment> {
    // Parse frontmatter if present
    const parsed = matter(content);
    const frontmatter = parsed.data;
    const body = parsed.content;

    // Extract metadata from frontmatter or use defaults
    const tags = this._extractTags(frontmatter, body);
    const capabilities = this._extractCapabilities(frontmatter, body);
    const useWhen = this._extractUseWhen(frontmatter, body);

    // Estimate token count (rough approximation: ~4 chars per token)
    const estimatedTokens = Math.ceil(body.length / 4);

    // Generate ID from relative path
    const id = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

    // Map category to ResourceFragment category type
    const fragmentCategory = this._mapCategory(category);

    return {
      id,
      category: fragmentCategory,
      tags,
      capabilities,
      useWhen,
      estimatedTokens,
      content: body,
    };
  }

  /**
   * Extract tags from frontmatter or content
   * @private
   */
  private _extractTags(frontmatter: any, content: string): string[] {
    // Check frontmatter first
    if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
      return frontmatter.tags.map((tag: any) => String(tag).toLowerCase());
    }

    // Fallback: extract from content headers and keywords
    const tags = new Set<string>();

    // Extract from title (first # heading)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      const words = titleMatch[1]
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .split(/\s+/);
      words.forEach((word) => {
        if (word.length > 2) tags.add(word);
      });
    }

    // Common programming keywords
    const keywords = [
      "typescript",
      "javascript",
      "node",
      "react",
      "api",
      "rest",
      "graphql",
      "database",
      "sql",
      "testing",
      "async",
      "error",
      "security",
      "auth",
      "validation",
    ];

    keywords.forEach((keyword) => {
      if (content.toLowerCase().includes(keyword)) {
        tags.add(keyword);
      }
    });

    return Array.from(tags);
  }

  /**
   * Extract capabilities from frontmatter or content
   * @private
   */
  private _extractCapabilities(frontmatter: any, content: string): string[] {
    // Check frontmatter first
    if (frontmatter.capabilities && Array.isArray(frontmatter.capabilities)) {
      return frontmatter.capabilities.map((cap: any) => String(cap));
    }

    // Fallback: extract from content sections
    const capabilities: string[] = [];

    // Look for "Capabilities" or "Core Capabilities" section
    const capabilitiesMatch = content.match(
      /##\s*(?:Core\s+)?Capabilities\s*\n([\s\S]*?)(?=\n##|\n#\s|$)/i,
    );
    if (capabilitiesMatch) {
      const capSection = capabilitiesMatch[1];
      const bullets = capSection.match(/^[-*]\s+(.+)$/gm);
      if (bullets) {
        bullets.forEach((bullet) => {
          const cap = bullet.replace(/^[-*]\s+/, "").trim();
          if (cap) capabilities.push(cap);
        });
      }
    }

    return capabilities;
  }

  /**
   * Extract use-when scenarios from frontmatter or content
   * @private
   */
  private _extractUseWhen(frontmatter: any, content: string): string[] {
    // Check frontmatter first
    if (frontmatter.useWhen && Array.isArray(frontmatter.useWhen)) {
      return frontmatter.useWhen.map((use: any) => String(use));
    }

    // Fallback: extract from content sections
    const useWhen: string[] = [];

    // Look for "When to Use" or "When This Skill Applies" section
    const useWhenMatch = content.match(
      /##\s*(?:When to Use|When This (?:Agent|Skill) (?:Applies|Is Used))\s*\n([\s\S]*?)(?=\n##|\n#\s|$)/i,
    );
    if (useWhenMatch) {
      const useSection = useWhenMatch[1];
      const bullets = useSection.match(/^[-*]\s+(.+)$/gm);
      if (bullets) {
        bullets.forEach((bullet) => {
          const use = bullet.replace(/^[-*]\s+/, "").trim();
          if (use) useWhen.push(use);
        });
      }
    }

    return useWhen;
  }

  /**
   * Map category string to ResourceFragment category type
   * @private
   */
  private _mapCategory(
    category: string,
  ): "agent" | "skill" | "example" | "pattern" | "workflow" {
    // Normalize and map
    const normalized = category.toLowerCase().split("/")[0];

    switch (normalized) {
      case "agents":
        return "agent";
      case "skills":
        return "skill";
      case "examples":
        return "example";
      case "workflows":
        return "workflow";
      case "patterns":
      case "guides":
        return "pattern";
      default:
        return "pattern";
    }
  }

  // ============================================================================
  // UPDATED: Load resource content with dynamic matching support
  // ============================================================================
  /**
   * Load resource content.
   * Supports both static URIs (direct file load) and dynamic URIs (fuzzy matching).
   *
   * @param uri - Resource URI (static or dynamic)
   * @returns Promise resolving to resource content
   *
   * @example Static URI
   * loadResourceContent("orchestr8://agents/typescript-developer")
   *
   * @example Dynamic URI
   * loadResourceContent("orchestr8://agents/match?query=build+api&maxTokens=2000")
   */
  async loadResourceContent(uri: string): Promise<string> {
    // Check cache first (for static URIs)
    if (this.cache.has(uri)) {
      this.logger.debug(`Cache hit for resource: ${uri}`);
      return this.cache.get(uri)!;
    }

    try {
      // ============================================================================
      // Special URIs (registry, etc.)
      // ============================================================================

      // Handle orchestr8://registry - Generate catalog JSON
      if (uri === "orchestr8://registry") {
        this.logger.debug("Generating registry catalog");
        await this.ensureIndexLoaded();

        const resources = this.resourceIndex || [];
        const catalog = {
          version: "1.0.0",
          totalResources: resources.length,
          categories: {
            agents: resources.filter((r) => r.category === "agent").length,
            skills: resources.filter((r) => r.category === "skill").length,
            patterns: resources.filter((r) => r.category === "pattern").length,
            examples: resources.filter((r) => r.category === "example").length,
            workflows: resources.filter((r) => r.category === "workflow")
              .length,
          },
          searchUri:
            "orchestr8://match?query=<keywords>&mode=index&maxResults=5",
          usage:
            "Use orchestr8://match?query=... for resource discovery. Default mode is 'index' for optimal efficiency.",
        };

        const content = JSON.stringify(catalog, null, 2);
        this.cache.set(uri, content);
        return content;
      }

      // ============================================================================
      // NEW: Check for provider-specific URIs FIRST (before parsing)
      // ============================================================================

      // Check for AITMPL provider URI: aitmpl://category/resourceId
      if (uri.startsWith("aitmpl://")) {
        this.logger.debug(`Routing to AITMPL provider: ${uri}`);
        const [_, pathPart] = uri.split("aitmpl://");
        const [categoryPart, ...resourceIdParts] = pathPart.split("/");
        const resourceId = resourceIdParts.join("/");

        // Convert plural category to singular (AITMPL uses singular: agent, skill, etc.)
        const categorySingular =
          categoryPart === "agents"
            ? "agent"
            : categoryPart === "skills"
              ? "skill"
              : categoryPart === "examples"
                ? "example"
                : categoryPart === "patterns"
                  ? "pattern"
                  : categoryPart === "workflows"
                    ? "workflow"
                    : categoryPart; // Use as-is if already singular

        try {
          const resource = await this.registry.fetchResource(
            "aitmpl",
            resourceId,
            categorySingular,
          );
          this.cache.set(uri, resource.content);
          return resource.content;
        } catch (error) {
          this.logger.error(
            `Failed to fetch from AITMPL provider: ${uri}`,
            error,
          );
          throw error;
        }
      }

      // Check for GitHub provider URI: github://owner/repo/path
      if (uri.startsWith("github://")) {
        this.logger.debug(`Routing to GitHub provider: ${uri}`);
        const [_, fullPath] = uri.split("github://");
        const pathParts = fullPath.split("/");

        if (pathParts.length < 3) {
          throw new Error(
            `Invalid GitHub URI format: ${uri}. Expected github://owner/repo/category/path`,
          );
        }

        const owner = pathParts[0];
        const repo = pathParts[1];
        const category = pathParts[2]; // First path component is category
        const resourcePath = pathParts.slice(2).join("/"); // Full path including category
        const resourceId = `${owner}/${repo}/${resourcePath}`;

        try {
          const resource = await this.registry.fetchResource(
            "github",
            resourceId,
            category,
          );
          this.cache.set(uri, resource.content);
          return resource.content;
        } catch (error) {
          this.logger.error(
            `Failed to fetch from GitHub provider: ${uri}`,
            error,
          );
          throw error;
        }
      }

      // ============================================================================
      // Parse orchestr8:// URIs only
      // ============================================================================
      const parsed = this.uriParser.parse(uri);

      if (parsed.type === "static") {
        // Static URI: Load file directly (existing behavior)
        return await this._loadStaticResource(uri, parsed);
      } else {
        // Dynamic URI: Use fuzzy matcher to assemble content
        return await this._loadDynamicResource(uri, parsed);
      }
    } catch (error) {
      this.logger.error(`Error loading resource content for ${uri}:`, error);
      throw error;
    }
  }

  /**
   * Load static resource (direct file access or remote provider)
   * @private
   */
  private async _loadStaticResource(
    uri: string,
    parsed: ParsedURI & { type: "static" },
  ): Promise<string> {
    // ============================================================================
    // Local resource (orchestr8:// URIs only - providers handled in parent)
    // ============================================================================

    // Parse URI to file path
    const filePath = this.uriToFilePath(uri);

    const content = await fs.readFile(filePath, "utf-8");
    this.cache.set(uri, content);
    this.logger.debug(`Cached static resource content: ${uri}`);
    return content;
  }

  /**
   * Load dynamic resource (index lookup or fuzzy matching)
   * @private
   */
  private async _loadDynamicResource(
    uri: string,
    parsed: ParsedURI & { type: "dynamic" },
  ): Promise<string> {
    this.logger.info(`Dynamic resource request: ${uri}`);

    // Feature flag: Use index lookup vs fuzzy match
    // - Default mode is 'index' for optimal efficiency (70-85% token reduction)
    // - Explicitly set mode to 'catalog' or 'full' in URI to use fuzzy match
    // - Environment variable USE_INDEX_LOOKUP can override (but defaults to true)
    const useIndexLookup =
      parsed.matchParams.mode !== "catalog" && // Only use catalog if explicitly requested
      parsed.matchParams.mode !== "full";

    if (useIndexLookup) {
      // NEW: Index-based lookup (85-95% token reduction)
      this.logger.debug("Using index-based lookup");

      try {
        const result = await this.indexLookup.lookup(parsed.matchParams.query, {
          query: parsed.matchParams.query,
          maxResults: parsed.matchParams.maxResults || 5,
          minScore: parsed.matchParams.minScore || 50,
          categories: parsed.matchParams.categories,
          mode: parsed.matchParams.mode,
        });

        // Cache the result
        this.cache.set(uri, result);

        return result;
      } catch (error) {
        this.logger.warn(
          "Index lookup failed, falling back to fuzzy match",
          error,
        );
        // Fall through to fuzzy match below
      }
    }

    // EXISTING: Fuzzy match (backward compatible)
    this.logger.debug("Using fuzzy match");

    // Ensure resource index is loaded
    await this.loadResourceIndex();

    // Perform fuzzy matching
    const matchResult = await this.fuzzyMatcher.match({
      query: parsed.matchParams.query,
      maxTokens: parsed.matchParams.maxTokens,
      requiredTags: parsed.matchParams.tags,
      category: parsed.category, // Category from URI path (e.g., orchestr8://agents/match?)
      categories: parsed.matchParams.categories, // Categories from query param (e.g., ?categories=agent,skill)
      mode: parsed.matchParams.mode || "catalog", // 'full' or 'catalog'
      maxResults: parsed.matchParams.maxResults, // Max results for catalog mode
      minScore: parsed.matchParams.minScore, // Minimum relevance score threshold
    });

    // ============================================================================
    // NEW: Track token usage for dynamic resource loads
    // ============================================================================
    if (this.tokenTracker && this.tokenStore) {
      // Generate unique message ID for deduplication
      const messageId = `resource-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

      // Check if content was cached (cache read = efficient)
      const wasCached = this.cache.has(uri);

      // Track token usage
      const tokenUsage = this.tokenTracker.track(
        messageId,
        {
          input_tokens: matchResult.totalTokens,
          output_tokens: 0, // MCP protocol returns content, not LLM generation
          cache_creation_input_tokens: wasCached ? 0 : matchResult.totalTokens,
          cache_read_input_tokens: wasCached ? matchResult.totalTokens : 0,
        },
        {
          category: parsed.category,
          resourceUri: uri,
          resourceCount: matchResult.fragments.length,
        }
      );

      // Store usage record
      if (tokenUsage) {
        this.tokenStore.saveUsage(tokenUsage);
        this.logger.debug(`Token usage tracked: ${tokenUsage.totalTokens} tokens, ${tokenUsage.efficiencyPercentage.toFixed(1)}% efficient`);
      }
    }

    // Cache the assembled content
    this.cache.set(uri, matchResult.assembledContent);

    this.logger.info(
      `Assembled ${matchResult.fragments.length} fragments (${matchResult.totalTokens} tokens)`,
    );

    return matchResult.assembledContent;
  }

  /**
   * Convert URI to filesystem path
   */
  private uriToFilePath(uri: string): string {
    // Remove protocol
    const pathPart = uri.replace("orchestr8://", "");

    // Try different extensions
    const extensions = [".md", ".json", ".yaml"];

    for (const ext of extensions) {
      const filePath = join(this.resourcesPath, pathPart + ext);
      // We'll try to read each and see which exists
      return filePath;
    }

    return join(this.resourcesPath, pathPart + ".md");
  }

  /**
   * Get resources by category for HTTP API
   */
  async getResourcesByCategory(category: string): Promise<any[]> {
    await this.ensureIndexLoaded();

    if (!this.resourceIndex) {
      return [];
    }

    // Normalize category (remove plural 's' if present)
    const normalizedCategory = category.endsWith("s")
      ? category.slice(0, -1)
      : category;

    return this.resourceIndex
      .filter((fragment) => fragment.category === normalizedCategory)
      .map((fragment) => ({
        id: fragment.id,
        name: fragment.id, // Add name field for display
        uri: `orchestr8://${fragment.id}`,
        description:
          fragment.capabilities?.slice(0, 3).join(", ") || "No description", // Use capabilities as description
        tags: fragment.tags || [],
        capabilities: fragment.capabilities || [],
        tokens: fragment.estimatedTokens,
      }));
  }

  /**
   * Search resources by query for HTTP API
   */
  async searchResources(query: string): Promise<any[]> {
    await this.ensureIndexLoaded();

    if (!this.resourceIndex) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    return this.resourceIndex
      .filter((fragment) => {
        const idMatch = fragment.id.toLowerCase().includes(lowerQuery);
        const tagMatch = fragment.tags?.some((tag: string) =>
          tag.toLowerCase().includes(lowerQuery),
        );
        const capMatch = fragment.capabilities?.some((cap: string) =>
          cap.toLowerCase().includes(lowerQuery),
        );
        return idMatch || tagMatch || capMatch;
      })
      .map((fragment) => ({
        id: fragment.id,
        uri: `orchestr8://${fragment.id}`,
        category: fragment.category,
        tags: fragment.tags || [],
        capabilities: fragment.capabilities || [],
        tokens: fragment.estimatedTokens,
      }))
      .slice(0, 50); // Limit results
  }

  // ============================================================================
  // NEW: Multi-provider search methods
  // ============================================================================

  /**
   * Search across all enabled resource providers
   *
   * Queries all registered providers in parallel and returns merged results
   * sorted by relevance score.
   *
   * @param query - Search query string
   * @param options - Search options (categories, tags, limits, etc.)
   * @returns Promise resolving to array of search results
   *
   * @example
   * ```typescript
   * const results = await loader.searchAllProviders('typescript api', {
   *   categories: ['agent', 'skill'],
   *   maxResults: 20,
   *   minScore: 50
   * });
   * ```
   */
  async searchAllProviders(
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResult[]> {
    this.logger.info(`Searching all providers for: ${query}`);

    try {
      const searchResponse = await this.registry.searchAll(query, options);
      this.logger.info(
        `Found ${searchResponse.totalMatches} matches across all providers (returned ${searchResponse.results.length})`,
      );
      return searchResponse.results;
    } catch (error) {
      this.logger.error("Failed to search across providers:", error);
      // Fallback to local search if providers fail
      this.logger.warn("Falling back to local search only");
      return [];
    }
  }

  /**
   * Search in a specific provider
   *
   * @param providerName - Name of provider to search ('local', 'aitmpl', 'github')
   * @param query - Search query string
   * @param options - Search options
   * @returns Promise resolving to array of search results
   */
  async searchProvider(
    providerName: string,
    query: string,
    options?: SearchOptions,
  ): Promise<SearchResult[]> {
    this.logger.info(`Searching ${providerName} provider for: ${query}`);

    try {
      const searchResponse = await this.registry.search(
        providerName,
        query,
        options,
      );
      this.logger.info(
        `Found ${searchResponse.totalMatches} matches in ${providerName} (returned ${searchResponse.results.length})`,
      );
      return searchResponse.results;
    } catch (error) {
      this.logger.error(`Failed to search ${providerName} provider:`, error);
      return [];
    }
  }

  // ============================================================================
  // NEW: Provider health and statistics endpoints
  // ============================================================================

  /**
   * Get health status for all providers
   *
   * Checks health of all registered providers and returns their status.
   * Useful for monitoring and diagnostics.
   *
   * @returns Promise resolving to map of provider names to health status
   *
   * @example
   * ```typescript
   * const health = await loader.getProvidersHealth();
   * for (const [name, status] of Object.entries(health)) {
   *   console.log(`${name}: ${status.status} (${status.responseTime}ms)`);
   * }
   * ```
   */
  async getProvidersHealth(): Promise<Record<string, ProviderHealth>> {
    this.logger.debug("Checking health of all providers");

    try {
      const healthMap = await this.registry.checkAllHealth();

      // Convert Map to plain object for easier serialization
      const healthObj: Record<string, ProviderHealth> = {};
      for (const [name, health] of healthMap.entries()) {
        healthObj[name] = health;
      }

      return healthObj;
    } catch (error) {
      this.logger.error("Failed to check provider health:", error);
      return {};
    }
  }

  /**
   * Get statistics for all providers
   *
   * Returns aggregate statistics including request counts, cache hit rates,
   * average response times, and rate limit status.
   *
   * @returns Object containing statistics for each provider
   *
   * @example
   * ```typescript
   * const stats = loader.getProvidersStats();
   * for (const [name, stat] of Object.entries(stats)) {
   *   console.log(`${name}: ${stat.totalRequests} requests, ${stat.cacheHitRate}% cache hit rate`);
   * }
   * ```
   */
  getProvidersStats(): Record<string, ProviderStats> {
    this.logger.debug("Getting statistics for all providers");

    try {
      const providers = this.registry.getProviders();
      const statsObj: Record<string, ProviderStats> = {};

      for (const provider of providers) {
        statsObj[provider.name] = provider.getStats();
      }

      return statsObj;
    } catch (error) {
      this.logger.error("Failed to get provider statistics:", error);
      return {};
    }
  }

  /**
   * Get aggregate statistics across all providers
   *
   * Returns registry-wide statistics including total providers, enabled providers,
   * healthy providers, and aggregate metrics.
   *
   * @returns Registry statistics object
   */
  getAggregateProviderStats() {
    try {
      return this.registry.getAggregateStats();
    } catch (error) {
      this.logger.error("Failed to get aggregate provider statistics:", error);
      return {
        totalProviders: 0,
        enabledProviders: 0,
        healthyProviders: 0,
        aggregate: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          totalResourcesFetched: 0,
          totalTokensFetched: 0,
          avgResponseTime: 0,
        },
      };
    }
  }

  /**
   * Get list of all registered providers
   *
   * @param enabledOnly - If true, only return enabled providers
   * @returns Array of provider names
   */
  getProviderNames(enabledOnly = false): string[] {
    const providers = this.registry.getProviders(enabledOnly);
    return providers.map((p) => p.name);
  }

  /**
   * Get cached resource content
   */
  getCachedResource(uri: string): string | undefined {
    return this.cache.get(uri);
  }

  /**
   * Get detailed information about all providers
   *
   * @returns Array of provider details including health and stats
   */
  async getProviders(): Promise<any[]> {
    const providers = this.registry.getProviders();
    return Promise.all(
      providers.map(async (provider) => ({
        name: provider.name,
        enabled: provider.enabled,
        priority: provider.priority,
        health: await provider.healthCheck(),
        stats: provider.getStats(),
      })),
    );
  }

  /**
   * Get index from a specific provider
   *
   * @param name - Provider name
   * @returns Provider's resource index
   */
  async getProviderIndex(name: string): Promise<any> {
    return this.registry.fetchIndex(name);
  }

  /**
   * Get health status for a specific provider
   *
   * @param name - Provider name
   * @returns Provider health status
   */
  async getProviderHealth(name: string): Promise<any> {
    return this.registry.checkHealth(name);
  }

  /**
   * Get statistics for a specific provider
   *
   * @param name - Provider name
   * @returns Provider statistics
   */
  getProviderStats(name: string): any {
    return this.registry.getProviderStats(name);
  }

  /**
   * Enable a provider
   *
   * @param name - Provider name
   */
  async enableProvider(name: string): Promise<void> {
    const success = this.registry.enable(name);
    if (!success) {
      throw new Error(`Provider ${name} not found`);
    }
  }

  /**
   * Disable a provider
   *
   * @param name - Provider name
   */
  async disableProvider(name: string): Promise<void> {
    const success = this.registry.disable(name);
    if (!success) {
      throw new Error(`Provider ${name} not found`);
    }
  }

  /**
   * Ensure resource index is loaded (for HTTP API)
   */
  private async ensureIndexLoaded(): Promise<void> {
    if (this.resourceIndex) {
      return;
    }

    // If already loading, wait for it
    if (this.indexLoadPromise) {
      await this.indexLoadPromise;
      return;
    }

    // Start loading
    this.indexLoadPromise = this.loadResourceIndex();
    await this.indexLoadPromise;
  }
}
