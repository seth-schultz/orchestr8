/**
 * Fuzzy matching system for dynamic resource assembly
 * Matches user queries against resource fragments and assembles relevant content
 */

import { Logger } from "./logger.js";
import { promises as fs } from "fs";
import { join } from "path";
import matter from "gray-matter";

const logger = new Logger("FuzzyMatcher");

/**
 * Resource fragment with metadata for matching
 */
export interface ResourceFragment {
  /** Unique identifier for the resource */
  id: string;
  /** Category of the resource */
  category: "agent" | "skill" | "example" | "pattern" | "workflow";
  /** Tags for keyword matching */
  tags: string[];
  /** Capabilities this resource provides */
  capabilities: string[];
  /** Use cases when this resource is relevant */
  useWhen: string[];
  /** Estimated token count for the resource */
  estimatedTokens: number;
  /** The actual content of the resource */
  content: string;
}

/**
 * Request for matching resources to a query
 */
export interface MatchRequest {
  /** User's query or request */
  query: string;
  /** Optional category filter (single category) */
  category?: string;
  /** Optional categories filter (multiple categories) */
  categories?: string[];
  /** Maximum tokens to include in result (default: 3000) */
  maxTokens?: number;
  /** Tags that must be present in matched resources */
  requiredTags?: string[];
  /** Response mode: 'full' returns content, 'catalog' returns lightweight index, 'index' uses useWhen index, 'minimal' returns ultra-compact JSON */
  mode?: 'full' | 'catalog' | 'index' | 'minimal';
  /** Maximum number of results to return in catalog mode */
  maxResults?: number;
  /** Minimum relevance score threshold (0-100) */
  minScore?: number;
}

/**
 * Result of fuzzy matching operation
 */
export interface MatchResult {
  /** Selected resource fragments */
  fragments: ResourceFragment[];
  /** Total tokens in assembled content */
  totalTokens: number;
  /** Relevance scores for each fragment */
  matchScores: number[];
  /** Assembled content ready for use */
  assembledContent: string;
}

/**
 * Scored resource fragment
 */
interface ScoredResource {
  resource: ResourceFragment;
  score: number;
}

/**
 * FuzzyMatcher class implements intelligent resource matching and assembly
 *
 * Matches user queries against a library of resource fragments and assembles
 * the most relevant content within a token budget.
 */
export class FuzzyMatcher {
  private resourceIndex: ResourceFragment[] = [];
  private indexLoaded: boolean = false;
  private indexLoadPromise: Promise<ResourceFragment[]> | null = null;
  private resourcesPath: string;

  constructor() {
    this.resourcesPath =
      process.env.RESOURCES_PATH || join(process.cwd(), "resources");
  }

  /**
   * Main matching algorithm
   *
   * @param request - The match request with query and filters
   * @returns Promise resolving to match result with assembled content
   *
   * @example
   * ```typescript
   * const matcher = new FuzzyMatcher();
   * const result = await matcher.match({
   *   query: "build typescript rest api",
   *   maxTokens: 2500
   * });
   * console.log(result.assembledContent);
   * ```
   */
  async match(request: MatchRequest): Promise<MatchResult> {
    logger.info("Starting fuzzy match", { query: request.query });

    // 1. Load all resource metadata (cached)
    const allResources = await this.loadResourceIndex();
    logger.debug(`Loaded ${allResources.length} resources`);

    // 2. Extract keywords from query
    const keywords = this.extractKeywords(request.query);
    logger.debug("Extracted keywords", { keywords });

    // 3. Score each resource
    const scored = allResources.map((resource) => ({
      resource,
      score: this.calculateScore(resource, keywords, request),
    }));

    // Filter by minimum score threshold
    const minScore = request.minScore ?? 10;
    const validScored = scored.filter((s) => s.score >= minScore);
    logger.debug(`Filtered to ${validScored.length} matches above threshold (${minScore})`);

    // 4. Sort by relevance (highest score first)
    validScored.sort((a, b) => b.score - a.score);

    // 5. Select top resources (catalog mode: by maxResults, full mode: by token budget)
    const mode = request.mode || 'catalog';
    const selected = mode === 'catalog'
      ? validScored.slice(0, request.maxResults || 15)
      : this.selectWithinBudget(validScored, request.maxTokens || 3000);

    logger.info(`Selected ${selected.length} resources (mode: ${mode})`, {
      totalTokens: selected.reduce(
        (sum, s) => sum + s.resource.estimatedTokens,
        0,
      ),
    });

    // 6. Assemble content (minimal, catalog, or full)
    const assembled =
      mode === 'minimal' ? this.assembleMinimal(selected) :
      mode === 'catalog' ? this.assembleCatalog(selected) :
      this.assembleContent(selected);

    return {
      fragments: selected.map((s) => s.resource),
      totalTokens: assembled.tokens,
      matchScores: selected.map((s) => s.score),
      assembledContent: assembled.content,
    };
  }

  /**
   * Extract keywords from user query
   *
   * Normalizes query text and extracts meaningful keywords by:
   * - Converting to lowercase
   * - Removing common stop words
   * - Splitting on whitespace and punctuation
   * - Filtering out short words
   *
   * @param query - User's query string
   * @returns Array of extracted keywords
   *
   * @example
   * ```typescript
   * const keywords = matcher.extractKeywords("Build a TypeScript REST API");
   * // Returns: ["build", "typescript", "rest", "api"]
   * ```
   */
  extractKeywords(query: string): string[] {
    // Normalize: lowercase and remove special characters
    const normalized = query.toLowerCase().replace(/[^\w\s-]/g, " ");

    // Common stop words to filter out
    const stopWords = new Set([
      "a",
      "an",
      "the",
      "and",
      "or",
      "but",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
      "with",
      "by",
      "from",
      "as",
      "is",
      "was",
      "are",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "should",
      "could",
      "may",
      "might",
      "can",
      "i",
      "you",
      "he",
      "she",
      "it",
      "we",
      "they",
      "this",
      "that",
      "these",
      "those",
    ]);

    // Split and filter
    const words = normalized
      .split(/\s+/)
      .filter((word) => word.length > 1 && !stopWords.has(word));

    // Return unique keywords
    return Array.from(new Set(words));
  }

  /**
   * Calculate relevance score for a resource
   *
   * Scoring algorithm considers:
   * - EXACT matches in tags (+15 per match)
   * - EXACT matches in capabilities (+12 per match)
   * - EXACT matches in useWhen (+8 per match)
   * - FUZZY matches (Levenshtein-based, scaled by similarity)
   * - Multi-keyword phrase matching (+20 for phrases)
   * - Category filter bonus (+15 if matches)
   * - Required tags (must have all or score = 0)
   * - Size preference (smaller resources < 1000 tokens get +5)
   *
   * PERFORMANCE OPTIMIZATIONS:
   * - Pre-compute lowercase versions of resource fields (done once at index load)
   * - Use Sets for O(1) tag lookup instead of array.includes
   * - Batch keyword processing to reduce iterations
   * - Early exit on disqualification
   * - Fuzzy matching only for keywords without exact matches
   *
   * @param resource - Resource fragment to score
   * @param keywords - Extracted keywords from query
   * @param request - Original match request
   * @returns Relevance score (0 = no match, higher = more relevant)
   *
   * @example
   * ```typescript
   * const score = matcher.calculateScore(resource, ["typescript", "api"], request);
   * // Returns: 25+ (if resource has matching tags and capabilities)
   * ```
   */
  calculateScore(
    resource: ResourceFragment,
    keywords: string[],
    request: MatchRequest,
  ): number {
    // Required tags check (must have all or disqualified) - early exit
    if (request.requiredTags && request.requiredTags.length > 0) {
      const hasAll = request.requiredTags.every((tag) =>
        resource.tags.includes(tag),
      );
      if (!hasAll) {
        logger.debug(`Resource ${resource.id} missing required tags`);
        return 0; // Disqualified
      }
    }

    let score = 0;

    // Category filter bonus (+15) - check first as it's cheapest
    // Support both single category and multiple categories
    const matchesCategory =
      (request.category && resource.category === request.category) ||
      (request.categories && request.categories.includes(resource.category));

    if (matchesCategory) {
      score += 15;
      logger.debug(`Category match for ${resource.id}`);
    }

    // Pre-convert resource fields to lowercase once for all keyword checks
    // This reduces repeated toLowerCase() calls from O(n*m) to O(n+m)
    const tagsLower = resource.tags; // Already lowercase from parsing
    const capabilitiesLower = resource.capabilities.map((c) => c.toLowerCase());
    const useWhenLower = resource.useWhen.map((u) => u.toLowerCase());

    // Track which keywords found exact matches (for fuzzy fallback)
    const keywordsWithoutExactMatch = new Set(keywords);

    // Detect multi-word phrases in query (e.g., "rest api", "error handling")
    const queryText = keywords.join(" ");

    // Exact keyword matching - optimized with single pass
    for (const keyword of keywords) {
      let foundExact = false;

      // EXACT Tag matches (+15 each) - higher weight for exact matches
      for (const tag of tagsLower) {
        if (tag === keyword) {
          score += 15;
          foundExact = true;
          logger.debug(`EXACT tag match for "${keyword}" in ${resource.id}`);
          break;
        } else if (tag.includes(keyword)) {
          score += 10;
          foundExact = true;
          logger.debug(`Substring tag match for "${keyword}" in ${resource.id}`);
          break;
        }
      }

      // EXACT Capability matches (+12 each)
      for (const cap of capabilitiesLower) {
        if (cap === keyword) {
          score += 12;
          foundExact = true;
          logger.debug(`EXACT capability match for "${keyword}" in ${resource.id}`);
          break;
        } else if (cap.includes(keyword)) {
          score += 8;
          foundExact = true;
          logger.debug(`Substring capability match for "${keyword}" in ${resource.id}`);
          break;
        }
      }

      // EXACT Use-when matches (+8 each)
      for (const useCase of useWhenLower) {
        if (useCase.includes(keyword)) {
          score += 5;
          foundExact = true;
          logger.debug(`Use-when match for "${keyword}" in ${resource.id}`);
          break;
        }
      }

      if (foundExact) {
        keywordsWithoutExactMatch.delete(keyword);
      }
    }

    // Phrase matching bonus - check for multi-word sequences
    // e.g., "rest api" should score higher than separate "rest" + "api"
    if (keywords.length >= 2) {
      const allFields = [...tagsLower, ...capabilitiesLower, ...useWhenLower];
      for (const field of allFields) {
        // Check if the field contains multiple consecutive keywords
        for (let i = 0; i < keywords.length - 1; i++) {
          const phrase = `${keywords[i]} ${keywords[i + 1]}`;
          if (field.includes(phrase)) {
            score += 20;
            logger.debug(`Multi-word phrase match: "${phrase}" in ${resource.id}`);
            break; // Only count once per field
          }
        }
      }
    }

    // Fuzzy matching for keywords without exact matches
    // Uses Levenshtein distance for typo tolerance
    if (keywordsWithoutExactMatch.size > 0 && keywords.length <= 5) {
      // Only do fuzzy matching for reasonable query sizes
      const allFields = [...tagsLower, ...capabilitiesLower];

      for (const keyword of keywordsWithoutExactMatch) {
        let bestFuzzyScore = 0;

        for (const field of allFields) {
          // Split field into words for word-level fuzzy matching
          const fieldWords = field.split(/\s+/);

          for (const word of fieldWords) {
            if (word.length > 2 && keyword.length > 2) {
              const similarity = this.calculateLevenshteinSimilarity(keyword, word);

              // Only count if similarity is high enough (>70%)
              if (similarity > 0.7) {
                const fuzzyScore = Math.floor(similarity * 8); // Max +8 points for perfect fuzzy match
                if (fuzzyScore > bestFuzzyScore) {
                  bestFuzzyScore = fuzzyScore;
                }
              }
            }
          }
        }

        if (bestFuzzyScore > 0) {
          score += bestFuzzyScore;
          logger.debug(`Fuzzy match for "${keyword}" in ${resource.id}: +${bestFuzzyScore}`);
        }
      }
    }

    // Prefer smaller, more focused resources (+5 if < 1000 tokens)
    if (resource.estimatedTokens < 1000) {
      score += 5;
    }

    logger.debug(`Final score for ${resource.id}: ${score}`);
    return score;
  }

  /**
   * Calculate Levenshtein-based similarity between two strings
   * Returns a value between 0 (no similarity) and 1 (identical)
   *
   * Uses normalized Levenshtein distance for fuzzy matching.
   * This helps catch typos and minor variations in keywords.
   *
   * @param str1 - First string (keyword)
   * @param str2 - Second string (field word)
   * @returns Similarity score (0.0 to 1.0)
   *
   * @example
   * ```typescript
   * calculateLevenshteinSimilarity("typescript", "typscript") // Returns ~0.9
   * calculateLevenshteinSimilarity("async", "sync") // Returns ~0.6
   * calculateLevenshteinSimilarity("foo", "bar") // Returns ~0.0
   * ```
   */
  private calculateLevenshteinSimilarity(str1: string, str2: string): number {
    // Early exit optimizations
    if (str1 === str2) return 1.0;
    if (str1.length === 0 || str2.length === 0) return 0.0;

    // Optimize: if length difference is too large, similarity will be low
    const lengthDiff = Math.abs(str1.length - str2.length);
    const maxLength = Math.max(str1.length, str2.length);
    if (lengthDiff / maxLength > 0.5) return 0.0; // >50% length difference = not similar

    const distance = this.levenshteinDistance(str1, str2);

    // Normalize: similarity = 1 - (distance / maxLength)
    const similarity = 1 - (distance / maxLength);

    return Math.max(0, similarity);
  }

  /**
   * Calculate Levenshtein distance between two strings
   * Returns the minimum number of single-character edits required
   *
   * Optimized implementation with single-row space complexity O(n)
   * instead of full matrix O(m*n)
   *
   * @param str1 - First string
   * @param str2 - Second string
   * @returns Edit distance (0 = identical)
   */
  private levenshteinDistance(str1: string, str2: string): number {
    // Optimize: always process shorter string as columns
    if (str1.length > str2.length) {
      [str1, str2] = [str2, str1];
    }

    const len1 = str1.length;
    const len2 = str2.length;

    // Early exit
    if (len1 === 0) return len2;
    if (len2 === 0) return len1;

    // Use single row optimization (O(n) space instead of O(m*n))
    let prevRow = Array.from({ length: len1 + 1 }, (_, i) => i);

    for (let i = 1; i <= len2; i++) {
      let currentRow = [i];

      for (let j = 1; j <= len1; j++) {
        const insertCost = currentRow[j - 1] + 1;
        const deleteCost = prevRow[j] + 1;
        const substituteCost = prevRow[j - 1] + (str1[j - 1] === str2[i - 1] ? 0 : 1);

        currentRow[j] = Math.min(insertCost, deleteCost, substituteCost);
      }

      prevRow = currentRow;
    }

    return prevRow[len1];
  }

  /**
   * Select top resources within token budget
   *
   * Greedily selects highest-scoring resources while staying within budget.
   * Always includes top 3 resources even if they exceed 80% of budget.
   *
   * @param scored - Array of scored resources (should be sorted by score)
   * @param maxTokens - Maximum token budget
   * @returns Selected resources within budget
   *
   * @example
   * ```typescript
   * const selected = matcher.selectWithinBudget(scoredResources, 3000);
   * // Returns top resources totaling <= 3000 tokens
   * ```
   */
  selectWithinBudget(
    scored: ScoredResource[],
    maxTokens: number,
  ): ScoredResource[] {
    const selected: ScoredResource[] = [];
    let totalTokens = 0;

    for (const item of scored) {
      const wouldExceedBudget =
        totalTokens + item.resource.estimatedTokens > maxTokens;

      // Always include top 3, even if over budget
      if (selected.length < 3) {
        selected.push(item);
        totalTokens += item.resource.estimatedTokens;
        continue;
      }

      // After top 3, only add if within budget
      if (!wouldExceedBudget) {
        selected.push(item);
        totalTokens += item.resource.estimatedTokens;
      }

      // Stop if we have enough and used 80%+ of budget
      if (selected.length >= 3 && totalTokens > maxTokens * 0.8) {
        logger.debug(
          `Stopping selection at ${selected.length} resources, ${totalTokens} tokens`,
        );
        break;
      }
    }

    return selected;
  }

  /**
   * Assemble final content from selected fragments
   *
   * Orders fragments by category (agents -> skills -> patterns -> examples)
   * and formats them with clear separators and metadata.
   *
   * @param fragments - Selected scored resources
   * @returns Object with assembled content and total token count
   *
   * @example
   * ```typescript
   * const assembled = matcher.assembleContent(selectedFragments);
   * console.log(assembled.content); // Formatted content ready for use
   * console.log(assembled.tokens);  // Total token count
   * ```
   */
  assembleContent(fragments: ScoredResource[]): {
    content: string;
    tokens: number;
  } {
    // Sort by category for logical ordering
    const categoryOrder: Record<ResourceFragment["category"], number> = {
      agent: 0,
      skill: 1,
      pattern: 2,
      example: 3,
      workflow: 4,
    };

    const ordered = [...fragments].sort((a, b) => {
      return (
        categoryOrder[a.resource.category] - categoryOrder[b.resource.category]
      );
    });

    // Assemble with clear separators
    const contentParts = ordered.map(({ resource, score }) => {
      return `
## ${this.categoryLabel(resource.category)}: ${resource.id}
**Relevance Score:** ${score}
**Tags:** ${resource.tags.join(", ")}
**Capabilities:** ${resource.capabilities.join(", ")}

${resource.content}
`;
    });

    const content = contentParts.join("\n---\n");

    const tokens = ordered.reduce(
      (sum, { resource }) => sum + resource.estimatedTokens,
      0,
    );

    return { content, tokens };
  }

  /**
   * Assemble catalog (lightweight index) from selected fragments
   *
   * Returns a compact listing with MCP URIs for on-demand loading.
   * Each entry includes: title, tags, capabilities, estimated tokens, and MCP URI.
   *
   * @param fragments - Selected scored resources
   * @returns Object with catalog content and total token count
   */
  assembleCatalog(fragments: ScoredResource[]): {
    content: string;
    tokens: number;
  } {
    // Sort by category for logical ordering
    const categoryOrder: Record<ResourceFragment["category"], number> = {
      agent: 0,
      skill: 1,
      pattern: 2,
      example: 3,
      workflow: 4,
    };

    const ordered = [...fragments].sort((a, b) => {
      return (
        categoryOrder[a.resource.category] - categoryOrder[b.resource.category]
      );
    });

    // Build catalog header
    const header = `# 📚 Orchestr8 Resource Catalog

**Query Results:** ${ordered.length} matched resources
**Total Tokens Available:** ${ordered.reduce((sum, s) => sum + s.resource.estimatedTokens, 0)}

## How to Use This Catalog

This catalog provides a lightweight index of relevant resources. Each entry includes:
- **Relevance Score** - How well it matches your query (higher = better)
- **Tags** - Keywords for quick identification
- **Capabilities** - What this resource provides
- **Use When** - Specific scenarios where this resource is most valuable
- **Estimated Tokens** - Context cost if you load it
- **MCP URI** - How to load the full content

### Loading Strategy

**IMPORTANT:** Only load a resource when you actually need it for execution. Review the catalog first:

1. **Scan "Use When"** - Identify which resources apply to your specific task
2. **Load selectively** - Fetch only resources needed for current phase
3. **Load JIT** - Get additional resources as you encounter specific needs during execution
4. **Requery as needed** - Search catalog again with refined queries when:
   - Initial results don't have what you need
   - New requirements emerge during execution
   - You need more specific or different expertise

**To load a resource:**
Simply reference it using the \`orchestr8://\` URI shown in each entry below. Claude will automatically load it via MCP.

Example: orchestr8://agents/api-designer-rest

**To requery the catalog:**
Reference: orchestr8://match?query=<refined-search>&categories=<cats>&minScore=15

---

## Matched Resources
`;

    // Build catalog entries
    const entries = ordered.map(({ resource, score }, index) => {
      const categoryLabel = this.categoryLabel(resource.category);
      const resourceId = resource.id.split('/').pop();
      const mcpUri = `orchestr8://${resource.category}s/${resourceId}`;

      // Format useWhen section
      const useWhenSection = resource.useWhen && resource.useWhen.length > 0
        ? `**Use When:**
${resource.useWhen.slice(0, 4).map(use => `  - ${use}`).join('\n')}${resource.useWhen.length > 4 ? '\n  - ...' : ''}`
        : '';

      return `
### ${index + 1}. ${categoryLabel}: ${resource.id}

**Relevance Score:** ${score}/100
**Tags:** ${resource.tags.slice(0, 8).join(", ")}${resource.tags.length > 8 ? '...' : ''}
**Capabilities:**
${resource.capabilities.slice(0, 4).map(cap => `  - ${cap}`).join('\n')}${resource.capabilities.length > 4 ? '\n  - ...' : ''}
${useWhenSection}
**Estimated Tokens:** ~${resource.estimatedTokens}

**Load this resource:** orchestr8://${resource.category}s/${resourceId}
`;
    });

    const content = header + entries.join('\n---\n');

    // Estimate catalog token count (much smaller than full content)
    const tokens = Math.ceil(content.length / 4);

    logger.info(`Assembled catalog: ${ordered.length} resources, ~${tokens} tokens`);

    return { content, tokens };
  }

  /**
   * Assemble minimal JSON response (ultra-compact)
   *
   * Returns bare minimum: URIs, scores, tokens, and top tags only.
   * Token cost: ~300-500 tokens (vs ~1500 for catalog mode)
   *
   * @param fragments - Selected scored resources
   * @returns Object with minimal JSON content and token count
   */
  assembleMinimal(fragments: ScoredResource[]): { content: string; tokens: number } {
    const results = fragments.map(({ resource, score }) => ({
      uri: `orchestr8://${resource.category}s/${resource.id.split('/').pop()}`,
      category: resource.category,
      score,
      tokens: resource.estimatedTokens,
      tags: resource.tags.slice(0, 5)  // Top 5 tags only
    }));

    const output = {
      matches: results.length,
      totalTokens: results.reduce((sum, r) => sum + r.tokens, 0),
      results,
      usage: "Load resources via ReadMcpResourceTool using the uri field"
    };

    const jsonStr = JSON.stringify(output, null, 2);

    logger.info(`Assembled minimal mode: ${results.length} resources, ~${Math.ceil(jsonStr.length / 4)} tokens`);

    return {
      content: jsonStr,
      tokens: Math.ceil(jsonStr.length / 4)
    };
  }

  /**
   * Load resource index (cached)
   *
   * Scans the resources directory recursively for markdown files in category directories,
   * parses frontmatter metadata, and builds an in-memory index of ResourceFragment objects.
   * Results are cached for performance.
   *
   * @returns Promise resolving to array of resource fragments
   */
  private async loadResourceIndex(): Promise<ResourceFragment[]> {
    // Return cached index if available
    if (this.indexLoaded) {
      logger.debug("Returning cached resource index");
      return this.resourceIndex;
    }

    // If already loading, wait for that promise
    if (this.indexLoadPromise !== null) {
      logger.debug("Waiting for in-progress resource index load");
      return this.indexLoadPromise;
    }

    // Start loading
    logger.info("Loading resource index...");
    this.indexLoadPromise = this._loadResourceIndexImpl();

    try {
      this.resourceIndex = await this.indexLoadPromise;
      this.indexLoaded = true;
      logger.info(
        `Resource index loaded with ${this.resourceIndex.length} fragments`,
      );
      return this.resourceIndex;
    } catch (error) {
      logger.error("Error loading resource index:", error);
      throw error;
    } finally {
      this.indexLoadPromise = null;
    }
  }

  /**
   * Internal implementation of resource index loading
   * Scans all category directories in parallel for optimal performance
   * @private
   */
  private async _loadResourceIndexImpl(): Promise<ResourceFragment[]> {
    try {
      // Define categories to scan
      const categories: Array<{
        dir: string;
        type: ResourceFragment["category"];
      }> = [
        { dir: "agents", type: "agent" },
        { dir: "skills", type: "skill" },
        { dir: "examples", type: "example" },
        { dir: "patterns", type: "pattern" },
        { dir: "guides", type: "pattern" },
        { dir: "best-practices", type: "pattern" },
      ];

      // Scan all categories in parallel for faster initial load
      const categoryPromises = categories.map(async ({ dir, type }) => {
        const categoryPath = join(this.resourcesPath, dir);
        const categoryFragments: ResourceFragment[] = [];

        try {
          await fs.access(categoryPath);
          await this._scanFragmentsDirectory(
            categoryPath,
            type,
            dir,
            categoryFragments,
          );
        } catch (error) {
          logger.debug(`Category directory not found: ${categoryPath}`);
        }

        return categoryFragments;
      });

      // Wait for all categories to be scanned
      const fragmentArrays = await Promise.all(categoryPromises);

      // Flatten results
      const fragments = fragmentArrays.flat();

      logger.info(`Scanned ${fragments.length} resource fragments`);
      return fragments;
    } catch (error) {
      logger.error("Error loading resource index:", error);
      return [];
    }
  }

  /**
   * Recursively scan a directory for fragment files
   * @private
   */
  private async _scanFragmentsDirectory(
    dirPath: string,
    category: ResourceFragment["category"],
    categoryName: string,
    fragments: ResourceFragment[],
  ): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          // Recursively scan subdirectories
          await this._scanFragmentsDirectory(
            fullPath,
            category,
            categoryName,
            fragments,
          );
        } else if (entry.name.endsWith(".md")) {
          // Parse markdown file
          try {
            const content = await fs.readFile(fullPath, "utf-8");
            const fragment = this._parseResourceFragment(
              content,
              category,
              categoryName,
              fullPath,
            );
            fragments.push(fragment);
            logger.debug(`Parsed fragment: ${fragment.id}`);
          } catch (error) {
            logger.warn(`Failed to parse resource fragment: ${fullPath}`, error);
          }
        }
      }
    } catch (error) {
      logger.warn(`Error scanning directory: ${dirPath}`, error);
    }
  }

  /**
   * Parse a markdown file into a ResourceFragment
   * @private
   */
  private _parseResourceFragment(
    content: string,
    category: ResourceFragment["category"],
    categoryName: string,
    filePath: string,
  ): ResourceFragment {
    // Parse frontmatter
    const parsed = matter(content);
    const frontmatter = parsed.data;
    const body = parsed.content;

    // Extract metadata from frontmatter with fallbacks
    // Extract ID from file path - look for category directory pattern
    const pathParts = filePath.split(/[\/\\]/);
    const resourcesIndex = pathParts.findIndex(p => p === 'resources');
    const categoryIndex = resourcesIndex + 1;
    const filenameIndex = pathParts.length - 1;

    const id =
      frontmatter.id ||
      pathParts.slice(categoryIndex + 1, filenameIndex + 1).join('/')
        .replace(/\.md$/, "") ||
      "unknown";

    const tags = Array.isArray(frontmatter.tags)
      ? frontmatter.tags.map((tag: any) => String(tag).toLowerCase())
      : [];

    const capabilities = Array.isArray(frontmatter.capabilities)
      ? frontmatter.capabilities.map((cap: any) => String(cap))
      : [];

    const useWhen = Array.isArray(frontmatter.useWhen)
      ? frontmatter.useWhen.map((use: any) => String(use))
      : [];

    const estimatedTokens =
      typeof frontmatter.estimatedTokens === "number"
        ? frontmatter.estimatedTokens
        : Math.ceil(body.length / 4); // Rough approximation: ~4 chars per token

    return {
      id: `${categoryName}/${id}`,
      category,
      tags,
      capabilities,
      useWhen,
      estimatedTokens,
      content: body,
    };
  }

  /**
   * Set resource index manually (useful for testing)
   *
   * @param resources - Array of resource fragments
   */
  setResourceIndex(resources: ResourceFragment[]): void {
    this.resourceIndex = resources;
    this.indexLoaded = true;
    logger.info(`Resource index set with ${resources.length} resources`);
  }

  /**
   * Get human-readable label for resource category
   *
   * @param category - Resource category
   * @returns Formatted category label
   */
  private categoryLabel(category: ResourceFragment["category"]): string {
    const labels: Record<ResourceFragment["category"], string> = {
      agent: "Agent",
      skill: "Skill",
      pattern: "Pattern",
      example: "Example",
      workflow: "Workflow",
    };
    return labels[category];
  }
}
