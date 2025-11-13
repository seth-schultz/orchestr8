#!/usr/bin/env node

import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PromptLoader } from "./loaders/promptLoader.js";
import { ResourceLoader } from "./loaders/resourceLoader.js";
import { Logger } from "./utils/logger.js";
import { StatsCollector } from "./stats/collector.js";
import { HTTPTransport } from "./transports/http.js";
import { createTokenSystem } from "./token/index.js";
import type { TokenTracker } from "./token/tracker.js";
import type { TokenStore } from "./token/store.js";
import type { TokenMetrics } from "./token/metrics.js";
import type { EfficiencyEngine } from "./token/efficiency.js";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables (suppress output in test mode to avoid stdout pollution)
if (process.env.NODE_ENV !== "test") {
  dotenv.config();
} else {
  // In test mode, load silently by capturing stdout
  const originalWrite = process.stdout.write;
  process.stdout.write = () => true;
  dotenv.config();
  process.stdout.write = originalWrite;
}

// Get current file directory for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize logger (writes to stderr to avoid corrupting MCP protocol)
const logger = new Logger("orchestr8-mcp");

// Check if HTTP mode is enabled via environment variable
const HTTP_MODE =
  process.env.ORCHESTR8_HTTP === "true" || process.env.ORCHESTR8_HTTP === "1";
const HTTP_PORT = parseInt(process.env.ORCHESTR8_HTTP_PORT || "1337", 10);

class Orchestr8Server {
  private server: McpServer;
  private promptLoader: PromptLoader;
  private resourceLoader: ResourceLoader;
  private stats: StatsCollector;
  private httpTransport: HTTPTransport | null = null;

  // Token tracking system
  private tokenTracker!: TokenTracker;
  private tokenStore!: TokenStore;
  private tokenMetrics!: TokenMetrics;
  private efficiencyEngine!: EfficiencyEngine;

  constructor() {
    this.server = new McpServer({
      name: "orchestr8",
      version: "1.0.0",
    });
    this.promptLoader = new PromptLoader(logger);
    // ResourceLoader and StatsCollector will be initialized in initialize() with token system
    this.resourceLoader = null as any; // Temporary
    this.stats = null as any; // Temporary - will be initialized with token metrics
  }

  async initialize(): Promise<void> {
    logger.info("Starting orchestr8 MCP server v1.0.0");

    // ============================================================================
    // NEW: Initialize token tracking system
    // ============================================================================
    logger.info("Initializing token efficiency monitoring...");
    const tokenSystem = createTokenSystem({
      tracking: {
        enabled: true,
        baselineStrategy: "no_jit",
        deduplication: true,
        retentionDays: 7,
        enableTrends: true,
      },
      storage: {
        maxRecords: 10000,
        retentionDays: 7,
        autoCleanup: true,
        cleanupIntervalMs: 60 * 60 * 1000, // 1 hour
      },
    });

    this.tokenTracker = tokenSystem.tracker;
    this.tokenStore = tokenSystem.store;
    this.tokenMetrics = tokenSystem.metrics;
    this.efficiencyEngine = tokenSystem.efficiency;

    logger.info("Token efficiency monitoring initialized");

    // Initialize StatsCollector with token metrics
    this.stats = new StatsCollector(this.tokenMetrics);

    // Initialize ResourceLoader with token system
    this.resourceLoader = new ResourceLoader(
      logger,
      this.tokenTracker,
      this.tokenStore,
    );

    // Load all prompts and resources
    const prompts = await this.promptLoader.loadAllPrompts();
    const resources = await this.resourceLoader.loadAllResources();

    logger.info(`Loaded ${prompts.length} prompts`);
    logger.info(`Loaded ${resources.length} resources`);

    // Pre-load resource index for faster first query
    try {
      await this.resourceLoader.loadResourceIndex();
      logger.info("Resource index pre-loaded for dynamic matching");
    } catch (error) {
      logger.warn(
        "Failed to pre-load resource index, will load on-demand:",
        error,
      );
    }

    // ============================================================================
    // NEW: Initialize provider system
    // ============================================================================
    try {
      await this.resourceLoader.initializeProviders();
      logger.info("Provider system initialized successfully");
    } catch (error) {
      logger.error("Failed to initialize provider system:", error);
      // Don't fail startup - continue with local resources only
      logger.warn("Continuing with local resources only");
    }

    // Register prompts
    this.registerPrompts(prompts);

    // Register resources
    this.registerResources(resources);

    // Register dynamic resource templates
    this.registerDynamicTemplates();

    // Set up hot reload in development
    if (process.env.NODE_ENV !== "production") {
      this.promptLoader.watchForChanges(() => {
        logger.info("Prompts changed - restart server to reload");
      });
    }
  }

  private registerPrompts(prompts: any[]): void {
    for (const prompt of prompts) {
      // Convert prompt arguments to Zod schema
      const argsSchema: any = {};
      if (prompt.arguments && prompt.arguments.length > 0) {
        for (const arg of prompt.arguments) {
          const zodType = arg.required ? z.string() : z.string().optional();
          argsSchema[arg.name] = zodType;
        }
      }

      this.server.registerPrompt(
        prompt.name,
        {
          title: prompt.title,
          description: prompt.description,
          argsSchema:
            Object.keys(argsSchema).length > 0 ? argsSchema : undefined,
        },
        async (args: any, _extra: any) => {
          const startTime = Date.now();
          logger.debug(`Loading prompt: ${prompt.name}`);

          // Track MCP prompt request
          this.stats.logActivity("prompt_get", {
            name: prompt.name,
            args: args,
          });

          try {
            // Convert args to the format expected by loader
            const argValues: Record<string, any> = args || {};

            // Load prompt content with argument substitution
            const content = await this.promptLoader.loadPromptContent(
              prompt,
              argValues,
            );

            const latency = Date.now() - startTime;
            this.stats.trackRequest(`prompt:${prompt.name}`, latency);

            return {
              messages: [
                {
                  role: "user" as const,
                  content: {
                    type: "text" as const,
                    text: content,
                  },
                },
              ],
            };
          } catch (error) {
            this.stats.trackError(error);
            throw error;
          }
        },
      );
    }
  }

  private registerResources(resources: any[]): void {
    // Register lightweight resource registry for discovery
    this.registerResourceRegistry(resources);

    // Register aggregate list resources for each category
    this.registerAggregateListResources(resources);

    // Register individual resources so they appear in resources/list
    this.registerIndividualResources(resources);
  }

  private registerResourceRegistry(resources: any[]): void {
    this.server.registerResource(
      "resource-registry",
      "orchestr8://registry",
      {
        mimeType: "application/json",
        description: "Lightweight resource catalog for discovery",
      },
      async () => {
        // Track MCP registry request
        this.stats.logActivity("resource_read", {
          uri: "orchestr8://registry",
          category: "registry",
        });

        const catalog = {
          version: "1.0.0",
          totalResources: resources.length,
          categories: {
            agents: resources.filter((r) => r.category === "agents").length,
            skills: resources.filter((r) => r.category === "skills").length,
            patterns: resources.filter((r) => r.category === "patterns").length,
            examples: resources.filter((r) => r.category === "examples").length,
            guides: resources.filter((r) => r.category === "guides").length,
            workflows: resources.filter((r) => r.category === "workflows")
              .length,
          },
          searchUri:
            "orchestr8://match?query=<keywords>&mode=index&maxResults=5",
          usage:
            "Use orchestr8://match?query=... for resource discovery. Default mode is 'index' for optimal efficiency.",
        };

        return {
          contents: [
            {
              uri: "orchestr8://registry",
              mimeType: "application/json",
              text: JSON.stringify(catalog, null, 2),
            },
          ],
        };
      },
    );

    logger.debug(
      `Registered resource registry with ${resources.length} total resources`,
    );
  }

  private registerAggregateListResources(resources: any[]): void {
    // Group resources by category
    const byCategory = resources.reduce(
      (acc, resource) => {
        const category = resource.category || "other";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(resource);
        return acc;
      },
      {} as Record<string, any[]>,
    );

    // Register aggregate list resource for each category
    const categories = [
      {
        name: "workflows",
        description: "Complete list of all available workflows",
      },
      { name: "agents", description: "Complete list of all available agents" },
      { name: "skills", description: "Complete list of all available skills" },
      {
        name: "patterns",
        description: "Complete list of all available patterns",
      },
      {
        name: "examples",
        description: "Complete list of all available examples",
      },
      { name: "guides", description: "Complete list of all available guides" },
    ];

    for (const { name, description } of categories) {
      const categoryResources = byCategory[name] || [];
      const aggregateUri = `orchestr8://${name}`;

      this.server.registerResource(
        `${name}-list`,
        aggregateUri,
        {
          mimeType: "application/json",
          description: description,
        },
        async (uri) => {
          const startTime = Date.now();
          logger.debug(`Loading aggregate list: ${aggregateUri}`);

          // Track MCP resource list request
          this.stats.logActivity("resources_list", {
            category: name,
            count: categoryResources.length,
          });

          try {
            // Build JSON list of all resources in this category
            const resourceList = categoryResources.map((r: any) => ({
              name: r.name,
              uri: r.uri,
              description: r.description,
              mimeType: r.mimeType,
            }));

            const jsonContent = JSON.stringify(
              {
                category: name,
                count: resourceList.length,
                resources: resourceList,
              },
              null,
              2,
            );

            const latency = Date.now() - startTime;
            this.stats.trackRequest(`aggregate:${name}`, latency);

            return {
              contents: [
                {
                  uri: uri.toString(),
                  mimeType: "application/json",
                  text: jsonContent,
                },
              ],
            };
          } catch (error) {
            this.stats.trackError(error);
            throw error;
          }
        },
      );

      logger.debug(`Registered aggregate list resource: ${aggregateUri}`);
    }
  }

  private registerIndividualResources(resources: any[]): void {
    logger.info(
      `Registering ${resources.length} individual resources for discovery`,
    );

    for (const resource of resources) {
      this.server.registerResource(
        resource.uri,
        resource.uri,
        {
          mimeType: resource.mimeType,
          description: resource.description,
        },
        async (uri) => {
          const startTime = Date.now();
          logger.debug(`Loading individual resource: ${uri.toString()}`);

          // Track MCP resource request
          this.stats.logActivity("resource_read", {
            uri: uri.toString(),
            category: resource.category,
          });

          try {
            const content = await this.resourceLoader.loadResourceContent(
              uri.toString(),
            );

            const latency = Date.now() - startTime;
            this.stats.trackRequest(`individual:${resource.category}`, latency);

            return {
              contents: [
                {
                  uri: uri.toString(),
                  mimeType: resource.mimeType,
                  text: content,
                },
              ],
            };
          } catch (error) {
            this.stats.trackError(error);
            throw error;
          }
        },
      );
    }

    logger.info(
      `Successfully registered ${resources.length} individual resources`,
    );
  }

  private registerDynamicTemplates(): void {
    const dynamicCategories = [
      {
        category: "agents",
        description:
          "Dynamic agent matching - finds and assembles relevant agent resources based on query",
      },
      {
        category: "skills",
        description:
          "Dynamic skill matching - finds and assembles relevant skill resources based on query",
      },
      {
        category: "examples",
        description:
          "Dynamic example matching - finds and assembles relevant example resources based on query",
      },
      {
        category: "patterns",
        description:
          "Dynamic pattern matching - finds and assembles relevant pattern resources based on query",
      },
      {
        category: "guides",
        description:
          "Dynamic guide matching - finds and assembles relevant guide resources based on query",
      },
      {
        category: "best-practices",
        description:
          "Dynamic best practice matching - finds and assembles relevant best practice resources based on query",
      },
      {
        category: "workflows",
        description:
          "Dynamic workflow matching - finds and assembles relevant workflow resources based on query",
      },
    ];

    for (const { category, description } of dynamicCategories) {
      // Register dynamic matching template (e.g., orchestr8://agents/match?query=...)
      const dynamicTemplateUri = `orchestr8://${category}/match{+rest}`;

      this.server.registerResource(
        `${category}-dynamic`,
        new ResourceTemplate(dynamicTemplateUri, { list: undefined }),
        {
          mimeType: "text/markdown",
          description: description,
        },
        async (uri, params: Record<string, any>) => {
          const startTime = Date.now();
          const fullUri = uri.toString();
          logger.debug(`Loading dynamic resource: ${fullUri}`);

          // Track MCP resource request
          this.stats.logActivity("resource_read", {
            uri: fullUri,
            category: category,
          });

          try {
            const content =
              await this.resourceLoader.loadResourceContent(fullUri);

            const latency = Date.now() - startTime;
            this.stats.trackRequest(`dynamic:${category}`, latency);

            return {
              contents: [
                {
                  uri: fullUri,
                  mimeType: "text/markdown",
                  text: content,
                },
              ],
            };
          } catch (error) {
            this.stats.trackError(error);
            throw error;
          }
        },
      );

      logger.debug(
        `Registered dynamic resource template: ${dynamicTemplateUri}`,
      );

      // Register static resource template (e.g., orchestr8://agents/medium-writer-expert)
      const staticTemplateUri = `orchestr8://${category}/{+resourceId}`;

      this.server.registerResource(
        `${category}-static`,
        new ResourceTemplate(staticTemplateUri, { list: undefined }),
        {
          mimeType: "text/markdown",
          description: `Access individual ${category} resources by ID`,
        },
        async (uri, params: Record<string, any>) => {
          const startTime = Date.now();
          const fullUri = uri.toString();

          // Skip if this is a /match URI (handled by dynamic template)
          if (fullUri.includes("/match")) {
            throw new Error(
              `URI ${fullUri} should be handled by dynamic template`,
            );
          }

          logger.debug(`Loading static resource: ${fullUri}`);

          // Track MCP resource request
          this.stats.logActivity("resource_read", {
            uri: fullUri,
            category: category,
          });

          try {
            const content =
              await this.resourceLoader.loadResourceContent(fullUri);

            const latency = Date.now() - startTime;
            this.stats.trackRequest(`static:${category}`, latency);

            return {
              contents: [
                {
                  uri: fullUri,
                  mimeType: "text/markdown",
                  text: content,
                },
              ],
            };
          } catch (error) {
            this.stats.trackError(error);
            throw error;
          }
        },
      );

      logger.debug(`Registered static resource template: ${staticTemplateUri}`);
    }

    // Register global catch-all template
    const globalTemplateUri = "orchestr8://match{+rest}";
    this.server.registerResource(
      "global-dynamic",
      new ResourceTemplate(globalTemplateUri, { list: undefined }),
      {
        mimeType: "text/markdown",
        description: "Dynamic resource matching across all categories",
      },
      async (uri, params: Record<string, any>) => {
        const startTime = Date.now();
        const fullUri = uri.toString();
        logger.debug(`Loading global dynamic resource: ${fullUri}`);

        // Track MCP resource request
        this.stats.logActivity("resource_read", {
          uri: fullUri,
          category: "global",
        });

        try {
          const content =
            await this.resourceLoader.loadResourceContent(fullUri);

          const latency = Date.now() - startTime;
          this.stats.trackRequest("dynamic:global", latency);

          return {
            contents: [
              {
                uri: fullUri,
                mimeType: "text/markdown",
                text: content,
              },
            ],
          };
        } catch (error) {
          this.stats.trackError(error);
          throw error;
        }
      },
    );
    logger.debug(
      `Registered global dynamic resource template: ${globalTemplateUri}`,
    );
  }

  async startStdio(): Promise<void> {
    logger.info("Starting in stdio mode (Claude Desktop integration)");

    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    logger.info("orchestr8 MCP server started successfully in stdio mode");
  }

  async startHttp(): Promise<void> {
    logger.info(`Starting in HTTP mode on port ${HTTP_PORT}`);

    // Create HTTP transport with methods to access MCP functionality
    const mcpInterface = {
      handleRequest: async (method: string, params: any) => {
        // This would need to be implemented based on MCP server internals
        throw new Error("Direct MCP request handling not yet implemented");
      },
      getAvailableAgents: async () => {
        return this.resourceLoader.getResourcesByCategory("agents");
      },
      getAvailableSkills: async () => {
        return this.resourceLoader.getResourcesByCategory("skills");
      },
      getAvailableWorkflows: async () => {
        return this.resourceLoader.getResourcesByCategory("workflows");
      },
      getAvailablePatterns: async () => {
        return this.resourceLoader.getResourcesByCategory("patterns");
      },
      searchResources: async (query: string) => {
        return this.resourceLoader.searchResources(query);
      },
      getResourceContent: async (uri: string) => {
        return this.resourceLoader.loadResourceContent(uri);
      },
      // ============================================================================
      // NEW: Provider system endpoints
      // ============================================================================
      getProviderNames: () => {
        return this.resourceLoader.getProviderNames(true); // Only enabled providers
      },
      getProvidersHealth: async () => {
        return this.resourceLoader.getProvidersHealth();
      },
      getProvidersStats: () => {
        return this.resourceLoader.getProvidersStats();
      },
      getAggregateProviderStats: () => {
        return this.resourceLoader.getAggregateProviderStats();
      },
      searchAllProviders: async (query: string, options?: any) => {
        return this.resourceLoader.searchAllProviders(query, options);
      },
      searchProvider: async (
        providerName: string,
        query: string,
        options?: any,
      ) => {
        return this.resourceLoader.searchProvider(providerName, query, options);
      },
      // Provider methods (Wave 4: HTTP Transport Integration)
      getProviders: async () => {
        return this.resourceLoader.getProviders();
      },
      getProviderIndex: async (name: string) => {
        return this.resourceLoader.getProviderIndex(name);
      },
      getProviderHealth: async (name: string) => {
        return this.resourceLoader.getProviderHealth(name);
      },
      getAllProvidersHealth: async () => {
        return this.resourceLoader.getProvidersHealth();
      },
      getProviderStats: (name: string) => {
        return this.resourceLoader.getProviderStats(name);
      },
      enableProvider: async (name: string) => {
        return this.resourceLoader.enableProvider(name);
      },
      disableProvider: async (name: string) => {
        return this.resourceLoader.disableProvider(name);
      },
      // ============================================================================
      // NEW: Token system interface
      // ============================================================================
      tokenSystem: {
        tracker: this.tokenTracker,
        store: this.tokenStore,
        metrics: this.tokenMetrics,
        efficiency: this.efficiencyEngine,
      },
    };

    this.httpTransport = new HTTPTransport(
      {
        port: HTTP_PORT,
        staticPath: path.join(__dirname, "web", "static"),
        enableCORS: true,
      },
      mcpInterface,
      this.stats,
    );

    await this.httpTransport.start();

    // Log server startup activity
    this.stats.logActivity("server_start", {
      mode: "HTTP",
      port: HTTP_PORT,
      timestamp: Date.now(),
    });

    logger.info(`orchestr8 MCP server started successfully in HTTP mode`);
    logger.info(`Web UI available at: http://localhost:${HTTP_PORT}`);
  }

  async startDual(): Promise<void> {
    logger.info("Starting in dual mode (stdio + HTTP)");

    // Start stdio for Claude Desktop
    const stdioTransport = new StdioServerTransport();
    await this.server.connect(stdioTransport);
    logger.info("stdio transport ready");

    // Start HTTP for web UI
    await this.startHttp();

    logger.info("orchestr8 MCP server started successfully in dual mode");
  }

  async shutdown(): Promise<void> {
    logger.info("Shutting down orchestr8 MCP server");

    if (this.httpTransport) {
      await this.httpTransport.stop();
    }

    await this.server.close();
  }
}

async function main() {
  try {
    const orchestr8 = new Orchestr8Server();
    await orchestr8.initialize();

    // Determine which mode to run in
    if (HTTP_MODE) {
      // HTTP only mode (for development/testing)
      await orchestr8.startHttp();
    } else if (process.env.NODE_ENV === "test") {
      // Test mode: stdio only (no HTTP to avoid stdout pollution)
      await orchestr8.startStdio();
    } else {
      // Default: Dual mode (stdio for Claude + HTTP for web UI)
      await orchestr8.startDual();
    }

    // Handle graceful shutdown
    const shutdown = async () => {
      await orchestr8.shutdown();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Run the server
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
