// Orchestr8 MCP Dashboard - Main Application
// Version 2.0.0

class Dashboard {
  constructor() {
    this.ws = null;
    this.currentView = "overview";
    this.stats = {};
    this.resources = [];
    this.categories = [];
    this.activityLog = [];
    this.activityPaused = false;
    this.activeFilter = "all";
    this.charts = {};

    this.init();
  }

  init() {
    this.setupWebSocket();
    this.setupEventListeners();
    this.loadInitialData();
    this.setupCharts();
  }

  // ============================================
  // WebSocket Connection
  // ============================================

  setupWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}`;

    console.log("[WebSocket] Attempting to connect to:", wsUrl);
    this.updateConnectionStatus("connecting");

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("[WebSocket] Connected successfully");
        this.updateConnectionStatus("connected");
        this.showToast("Connected to MCP server", "success");

        // Clear any reconnection timeout
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log("[WebSocket] Message received:", message.type);
          this.handleWebSocketMessage(message);

          // Pulse the connection indicator on message
          this.pulseConnectionIndicator();
        } catch (error) {
          console.error("[WebSocket] Parse error:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("[WebSocket] Error:", error);
        this.updateConnectionStatus("error");
        this.showToast("Connection error - will retry", "error");
      };

      this.ws.onclose = (event) => {
        console.log(
          "[WebSocket] Disconnected. Code:",
          event.code,
          "Reason:",
          event.reason,
        );
        this.updateConnectionStatus("disconnected");

        // Only show toast if we were previously connected
        if (event.code !== 1000) {
          this.showToast(
            "Disconnected from server - reconnecting in 5s",
            "warning",
          );
        }

        // Attempt to reconnect after 5 seconds
        this.reconnectTimeout = setTimeout(() => {
          console.log("[WebSocket] Attempting reconnection...");
          this.setupWebSocket();
        }, 5000);
      };
    } catch (error) {
      console.error("[WebSocket] Connection failed:", error);
      this.updateConnectionStatus("error");
      this.reconnectTimeout = setTimeout(() => this.setupWebSocket(), 5000);
    }
  }

  pulseConnectionIndicator() {
    const statusEl = document.getElementById("connectionStatus");
    statusEl.classList.add("pulse-once");
    setTimeout(() => statusEl.classList.remove("pulse-once"), 1000);
  }

  handleWebSocketMessage(message) {
    switch (message.type) {
      case "stats":
        this.updateStats(message.data);
        break;
      case "activity":
        this.addActivity(message.data);
        break;
      case "activity_history":
        this.activityLog = message.data;
        this.renderActivityFeed();
        break;
      default:
        console.log("[WebSocket] Unknown message type:", message.type);
    }
  }

  updateConnectionStatus(status) {
    const statusEl = document.getElementById("connectionStatus");
    statusEl.classList.remove("connected", "error");

    const statusText = statusEl.querySelector(".status-text");

    switch (status) {
      case "connected":
        statusEl.classList.add("connected");
        statusText.textContent = "Connected";
        break;
      case "error":
      case "disconnected":
        statusEl.classList.add("error");
        statusText.textContent =
          status === "error" ? "Connection Error" : "Disconnected";
        break;
      default:
        statusText.textContent = "Connecting...";
    }
  }

  // ============================================
  // Event Listeners
  // ============================================

  setupEventListeners() {
    // Navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.switchView(btn.dataset.view));
    });

    // Provider testing
    const refreshProvidersBtn = document.getElementById("refreshProvidersBtn");
    if (refreshProvidersBtn) {
      refreshProvidersBtn.addEventListener("click", () => this.loadProviders());
    }

    const executeProviderSearchBtn = document.getElementById(
      "executeProviderSearchBtn",
    );
    if (executeProviderSearchBtn) {
      executeProviderSearchBtn.addEventListener("click", () =>
        this.executeProviderSearch(),
      );
    }

    // Header buttons
    document
      .getElementById("refreshBtn")
      .addEventListener("click", () => this.refreshData());
    document
      .getElementById("clearLogsBtn")
      .addEventListener("click", () => this.clearActivityLog());

    // Testing view
    document
      .getElementById("requestType")
      .addEventListener("change", () => this.updateTestingForm());
    document
      .getElementById("executeTestBtn")
      .addEventListener("click", () => this.executeTest());

    // Example buttons
    document.querySelectorAll(".example-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.loadExample(btn.dataset.example),
      );
    });

    // Results tabs
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.switchResultTab(btn.dataset.tab),
      );
    });

    // Copy results button
    document
      .getElementById("copyResultsBtn")
      .addEventListener("click", () => this.copyResults());

    // Resource search
    const searchInput = document.getElementById("resourceSearch");
    if (searchInput) {
      searchInput.addEventListener("input", (e) =>
        this.filterResources(e.target.value),
      );
    }

    // View all activity button
    const viewAllBtn = document.getElementById("viewAllActivityBtn");
    if (viewAllBtn) {
      viewAllBtn.addEventListener("click", () => this.switchView("activity"));
    }

    // Activity filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.setActivityFilter(btn.dataset.filter),
      );
    });

    // Pause activity button
    const pauseBtn = document.getElementById("pauseActivityBtn");
    if (pauseBtn) {
      pauseBtn.addEventListener("click", () => this.toggleActivityPause());
    }

    // View type controls
    document.querySelectorAll("[data-view-type]").forEach((btn) => {
      btn.addEventListener("click", () =>
        this.setViewType(btn.dataset.viewType),
      );
    });

    // Modal close
    document.querySelectorAll(".modal-close").forEach((btn) => {
      btn.addEventListener("click", () => this.closeModal());
    });

    // Close modal on outside click
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal();
      });
    });
  }

  // ============================================
  // View Management
  // ============================================

  switchView(viewName) {
    this.currentView = viewName;

    // Update navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });

    // Update views
    document.querySelectorAll(".view").forEach((view) => {
      view.classList.toggle("active", view.id === `${viewName}View`);
    });

    // Load view-specific data
    switch (viewName) {
      case "explorer":
        this.loadResources();
        break;
      case "activity":
        this.renderActivityFeed();
        break;
      case "providers":
        this.loadProviders();
        break;
    }
  }

  // ============================================
  // Data Loading
  // ============================================

  async loadInitialData() {
    try {
      // Load stats and resources in parallel
      await Promise.all([this.loadStats(), this.loadResources()]);

      // Load categories after resources are loaded (depends on this.resources)
      await this.loadCategories();
    } catch (error) {
      console.error("[Dashboard] Error loading initial data:", error);
      this.showToast("Error loading dashboard data", "error");
    }
  }

  async loadStats() {
    try {
      const response = await fetch("/api/stats");
      const stats = await response.json();
      this.updateStats(stats);
    } catch (error) {
      console.error("[Dashboard] Error loading stats:", error);
    }
  }

  async loadResources() {
    try {
      // Load all resource types
      const [agents, skills, workflows, patterns] = await Promise.all([
        fetch("/api/agents").then((r) => r.json()),
        fetch("/api/skills").then((r) => r.json()),
        fetch("/api/workflows").then((r) => r.json()),
        fetch("/api/patterns").then((r) => r.json()),
      ]);

      // Combine all resources
      this.resources = [
        ...(agents.agents || []),
        ...(skills.skills || []),
        ...(workflows.workflows || []),
        ...(patterns.patterns || []),
      ];

      this.renderResourceGrid();
      this.updateResourceCount();
    } catch (error) {
      console.error("[Dashboard] Error loading resources:", error);
    }
  }

  async loadCategories() {
    try {
      console.log(
        "[Dashboard] Loading categories from",
        this.resources.length,
        "resources",
      );

      // Build categories from resource data
      const categoryCounts = {};

      // Count resources by extracting category from URI
      this.resources.forEach((r) => {
        const category = this.extractCategory(r.uri);
        if (category) {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      // Convert to category array
      this.categories = Object.entries(categoryCounts).map(
        ([category, count]) => ({
          category,
          count,
        }),
      );

      console.log(
        "[Dashboard] Built",
        this.categories.length,
        "categories:",
        this.categories.map((c) => c.category).join(", "),
      );
      this.renderCategories();
    } catch (error) {
      console.error("[Dashboard] Error loading categories:", error);
    }
  }

  async refreshData() {
    this.showToast("Refreshing data...", "success");
    await this.loadInitialData();
  }

  // ============================================
  // Statistics Display
  // ============================================

  updateStats(stats) {
    // Merge with existing stats to prevent flickering/resetting
    this.stats = { ...this.stats, ...stats };

    // Update stat cards - handle both old and new format
    document.getElementById("uptimeValue").textContent = this.formatUptime(
      this.stats.uptime,
    );
    document.getElementById("requestsValue").textContent =
      this.stats.requests?.total || this.stats.requestCount || 0;
    document.getElementById("latencyValue").textContent =
      `${Math.round(this.stats.latency?.avg || 0)}ms`;
    document.getElementById("p95Value").textContent =
      `${Math.round(this.stats.latency?.p95 || 0)}ms`;
    document.getElementById("p99Value").textContent =
      `${Math.round(this.stats.latency?.p99 || 0)}ms`;
    document.getElementById("errorsValue").textContent = this.stats.errors || 0;

    // Memory value - handle bytes from stats collector
    const memoryBytes = this.stats.memory?.heapUsed || this.stats.memoryUsage?.heapUsed || 0;
    document.getElementById("memoryValue").textContent = this.formatMemory(memoryBytes);

    // Update charts
    this.updateCharts(this.stats);
  }

  formatUptime(seconds) {
    if (!seconds) return "--";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }

  formatMemory(bytes) {
    if (!bytes) return "--";

    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)}MB`;
  }

  updateResourceCount() {
    document.getElementById("resourcesValue").textContent =
      this.resources.length;
  }

  // ============================================
  // Charts
  // ============================================

  setupCharts() {
    // Latency chart
    const latencyCtx = document.getElementById("latencyChart");
    if (latencyCtx) {
      this.charts.latency = new Chart(latencyCtx, {
        type: "bar",
        data: {
          labels: ["p50", "p95", "p99", "avg"],
          datasets: [
            {
              label: "Latency (ms)",
              data: [0, 0, 0, 0],
              backgroundColor: "rgba(88, 166, 255, 0.6)",
              borderColor: "rgba(88, 166, 255, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#8b949e" },
              grid: { color: "#30363d" },
            },
            x: {
              ticks: { color: "#8b949e" },
              grid: { color: "#30363d" },
            },
          },
        },
      });
    }

    // Resource usage chart
    const resourceCtx = document.getElementById("resourceChart");
    if (resourceCtx) {
      this.charts.resource = new Chart(resourceCtx, {
        type: "doughnut",
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: [
                "rgba(88, 166, 255, 0.8)",
                "rgba(163, 113, 247, 0.8)",
                "rgba(63, 185, 80, 0.8)",
                "rgba(210, 153, 34, 0.8)",
                "rgba(248, 81, 73, 0.8)",
                "rgba(121, 192, 255, 0.8)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: "#8b949e" },
            },
          },
        },
      });
    }
  }

  updateCharts(stats) {
    // Update latency chart
    if (this.charts.latency && stats.latency) {
      this.charts.latency.data.datasets[0].data = [
        stats.latency.p50 || 0,
        stats.latency.p95 || 0,
        stats.latency.p99 || 0,
        stats.latency.avg || 0,
      ];
      this.charts.latency.update();
    }

    // Update resource usage chart
    if (this.charts.resource) {
      // Use requests by method if available
      if (
        stats.requests?.byMethod &&
        Object.keys(stats.requests.byMethod).length > 0
      ) {
        const labels = Object.keys(stats.requests.byMethod);
        const data = Object.values(stats.requests.byMethod);

        this.charts.resource.data.labels = labels;
        this.charts.resource.data.datasets[0].data = data;
        this.charts.resource.update();
      } else if (stats.resourceUsage) {
        const labels = Object.keys(stats.resourceUsage);
        const data = Object.values(stats.resourceUsage);

        this.charts.resource.data.labels = labels;
        this.charts.resource.data.datasets[0].data = data;
        this.charts.resource.update();
      }
    }
  }

  // ============================================
  // Activity Feed
  // ============================================

  addActivity(activity) {
    if (this.activityPaused) return;

    this.activityLog.push(activity);

    // Keep only last 1000 items
    if (this.activityLog.length > 1000) {
      this.activityLog.shift();
    }

    // Update recent activity in overview
    this.updateRecentActivity();

    // Update activity feed if visible
    if (this.currentView === "activity") {
      this.renderActivityFeed();
    }
  }

  updateRecentActivity() {
    const container = document.getElementById("recentActivityList");
    if (!container) return;

    const recent = this.activityLog.slice(-5).reverse();

    if (recent.length === 0) {
      container.innerHTML = '<div class="activity-empty">No activity yet</div>';
      return;
    }

    container.innerHTML = recent
      .map((activity) => this.renderActivityItem(activity))
      .join("");

    // Attach click handlers to activity items
    this.attachActivityClickHandlers(container);
  }

  renderActivityFeed() {
    const container = document.getElementById("activityFeed");
    if (!container) return;

    let activities = [...this.activityLog].reverse();

    // Apply filter
    if (this.activeFilter !== "all") {
      activities = activities.filter((a) => a.type === this.activeFilter);
    }

    if (activities.length === 0) {
      container.innerHTML =
        '<div class="activity-empty">No activity to display</div>';
      return;
    }

    container.innerHTML = activities
      .map((activity) => this.renderActivityItem(activity))
      .join("");

    // Attach click handlers to activity items
    this.attachActivityClickHandlers(container);
  }

  attachActivityClickHandlers(container) {
    container.querySelectorAll(".activity-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        console.log("[Activity] Item clicked", e.currentTarget);
        const activityData = e.currentTarget.dataset.activity;
        if (activityData) {
          try {
            const activity = JSON.parse(activityData);
            this.showActivityDetail(activity);
          } catch (error) {
            console.error("[Activity] Error parsing activity data:", error);
          }
        }
      });
    });
  }

  showActivityDetail(activity) {
    console.log("[Activity] Showing detail for:", activity);
    const modal = document.getElementById("activityDetailModal");
    const titleEl = document.getElementById("modalActivityTitle");
    const summaryTab = document.getElementById("activitySummaryTab");
    const requestTab = document.getElementById("activityRequestTab");
    const responseTab = document.getElementById("activityResponseTab");
    const rawTab = document.getElementById("activityRawTab");

    // Set title
    titleEl.textContent = activity.type.replace(/_/g, " ").toUpperCase();

    // Build summary
    const summaryHtml = `
            <div class="activity-detail-info">
                <div class="activity-detail-row">
                    <div class="activity-detail-label">Type:</div>
                    <div class="activity-detail-value">${activity.type}</div>
                </div>
                <div class="activity-detail-row">
                    <div class="activity-detail-label">Timestamp:</div>
                    <div class="activity-detail-value">${new Date(activity.timestamp).toLocaleString()}</div>
                </div>
                <div class="activity-detail-row">
                    <div class="activity-detail-label">Detail:</div>
                    <div class="activity-detail-value">${this.getActivityDetail(activity)}</div>
                </div>
                ${
                  activity.data
                    ? `
                <div class="activity-detail-row">
                    <div class="activity-detail-label">Additional Data:</div>
                    <div class="activity-detail-value"><code>${JSON.stringify(activity.data, null, 2)}</code></div>
                </div>
                `
                    : ""
                }
            </div>
        `;

    summaryTab.innerHTML = summaryHtml;

    // Set request data
    if (activity.data && activity.type.includes("request")) {
      requestTab.querySelector(".code-block").textContent = JSON.stringify(
        activity.data,
        null,
        2,
      );
    } else {
      requestTab.querySelector(".code-block").textContent =
        "No request data available";
    }

    // Set response data
    if (activity.data && activity.type.includes("response")) {
      responseTab.querySelector(".code-block").textContent = JSON.stringify(
        activity.data,
        null,
        2,
      );
    } else {
      responseTab.querySelector(".code-block").textContent =
        "No response data available";
    }

    // Set raw JSON
    rawTab.querySelector(".code-block").textContent = JSON.stringify(
      activity,
      null,
      2,
    );

    // Setup tab switching for activity modal
    const activityTabs = modal.querySelectorAll(".tab-btn");
    activityTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        activityTabs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const tabName = btn.dataset.tab;
        modal.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active");
        });
        modal
          .querySelector(
            `#activity${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`,
          )
          .classList.add("active");
      });
    });

    modal.classList.add("active");
  }

  renderActivityItem(activity) {
    const icon = this.getActivityIcon(activity.type);
    const time = this.formatTime(activity.timestamp);
    const detail = this.getActivityDetail(activity);

    return `
            <div class="activity-item" data-activity='${JSON.stringify(activity).replace(/'/g, "&apos;")}'>
                <div class="activity-icon">${icon}</div>
                <div class="activity-content">
                    <div class="activity-title">${activity.type.replace(/_/g, " ")}</div>
                    <div class="activity-detail">${detail}</div>
                </div>
                <div class="activity-time">${time}</div>
            </div>
        `;
  }

  getActivityIcon(type) {
    const icons = {
      server_start: "🚀",
      server_ready: "✅",
      server_stop: "🛑",
      server_exit: "⏹️",
      mcp_request: "📤",
      mcp_response: "📥",
      prompts_list: "📋",
      prompt_get: "📄",
      resources_list: "📦",
      resource_read: "📖",
      custom_request: "⚡",
      error: "❌",
      log: "📝",
    };
    return icons[type] || "•";
  }

  getActivityDetail(activity) {
    const data = activity.data || {};

    switch (activity.type) {
      case "mcp_request":
      case "mcp_response":
        return `Method: ${data.method || "unknown"} (ID: ${data.id || "N/A"})`;
      case "prompts_list":
        return `Loaded ${data.count || 0} prompts`;
      case "prompt_get":
        return `Prompt: ${data.name || "unknown"}`;
      case "resources_list":
        return `Loaded ${data.count || 0} resources`;
      case "resource_read":
        return `URI: ${data.uri || "unknown"}`;
      case "error":
        return data.message || "Unknown error";
      case "log":
        return data.message || "";
      default:
        return JSON.stringify(data);
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;

    return date.toLocaleTimeString();
  }

  setActivityFilter(filter) {
    this.activeFilter = filter;

    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === filter);
    });

    this.renderActivityFeed();
  }

  toggleActivityPause() {
    this.activityPaused = !this.activityPaused;
    const btn = document.getElementById("pauseActivityBtn");
    btn.textContent = this.activityPaused ? "Resume" : "Pause";
    btn.classList.toggle("btn-primary", this.activityPaused);
  }

  clearActivityLog() {
    this.activityLog = [];
    this.updateRecentActivity();
    this.renderActivityFeed();
    this.showToast("Activity log cleared", "success");
  }

  // ============================================
  // Testing Interface
  // ============================================

  updateTestingForm() {
    const type = document.getElementById("requestType").value;
    const container = document.getElementById("dynamicFormFields");

    let html = "";

    switch (type) {
      case "prompts/get":
        html = `
                    <div class="form-group">
                        <label>Prompt Name</label>
                        <input type="text" id="promptName" class="form-control" placeholder="e.g., new-project">
                    </div>
                    <div class="form-group">
                        <label>Arguments (JSON)</label>
                        <textarea id="promptArgs" class="form-control" placeholder='{"key": "value"}'>{}</textarea>
                    </div>
                `;
        break;

      case "resources/read":
        html = `
                    <div class="form-group">
                        <label>Resource URI</label>
                        <input type="text" id="resourceUri" class="form-control"
                               placeholder="orchestr8://agents/typescript-developer">
                    </div>
                `;
        break;

      default:
        html =
          '<div class="form-group"><p style="color: var(--text-secondary);">No additional parameters required</p></div>';
    }

    container.innerHTML = html;
  }

  async executeTest() {
    const type = document.getElementById("requestType").value;
    const btn = document.getElementById("executeTestBtn");

    btn.disabled = true;
    btn.textContent = "Executing...";

    try {
      let result;

      switch (type) {
        case "prompts/list":
          // Prompts are not yet implemented via HTTP API
          result = {
            error:
              "Prompts endpoint not yet implemented in HTTP API. Use MCP protocol via Claude Desktop.",
          };
          break;

        case "prompts/get":
          // Prompts are not yet implemented via HTTP API
          result = {
            error:
              "Prompts endpoint not yet implemented in HTTP API. Use MCP protocol via Claude Desktop.",
          };
          break;

        case "resources/list":
          // Aggregate all resource types
          const [agents, skills, workflows, patterns] = await Promise.all([
            this.apiCall("/api/agents", "GET"),
            this.apiCall("/api/skills", "GET"),
            this.apiCall("/api/workflows", "GET"),
            this.apiCall("/api/patterns", "GET"),
          ]);

          result = {
            resources: [
              ...(agents.agents || []),
              ...(skills.skills || []),
              ...(workflows.workflows || []),
              ...(patterns.patterns || []),
            ],
          };
          break;

        case "resources/read":
          const uri = document.getElementById("resourceUri")?.value;

          if (!uri) {
            throw new Error("Resource URI is required");
          }

          // Use /api/resource?uri= endpoint (singular)
          const encodedUri = encodeURIComponent(uri);
          result = await this.apiCall(`/api/resource?uri=${encodedUri}`, "GET");
          break;
      }

      this.displayTestResults(result, type);
      this.showToast("Test executed successfully", "success");
    } catch (error) {
      console.error("[Testing] Error:", error);
      this.showToast(error.message, "error");
      this.displayTestResults({ error: error.message }, type);
    } finally {
      btn.disabled = false;
      btn.textContent = "Execute Test";
    }
  }

  displayTestResults(result, type) {
    // Display protocol (raw JSON)
    const protocolTab = document.getElementById("protocolTab");
    protocolTab.querySelector(".code-block").textContent = JSON.stringify(
      result,
      null,
      2,
    );

    // Display formatted content
    const contentTab = document.getElementById("contentTab");
    const content = this.extractContent(result, type);
    contentTab.innerHTML = content;

    // Display metadata
    const metadataTab = document.getElementById("metadataTab");
    const metadata = this.extractMetadata(result, type);
    metadataTab.querySelector(".code-block").textContent = JSON.stringify(
      metadata,
      null,
      2,
    );

    // Update stats
    const stats = document.getElementById("resultsStats");
    const size = JSON.stringify(result).length;
    stats.textContent = `Response size: ${this.formatBytes(size)}`;
  }

  extractContent(result, type) {
    if (result.error) {
      return `<div class="results-empty" style="color: var(--accent-error);">Error: ${result.error}</div>`;
    }

    // Handle different response types
    if (type === "prompts/list" && result.prompts) {
      return this.formatPromptsList(result.prompts);
    }

    if (type === "prompts/get" && result.messages) {
      return this.formatPromptContent(result.messages);
    }

    if (type === "resources/list" && result.resources) {
      return this.formatResourcesList(result.resources);
    }

    if (type === "resources/read" && result.content) {
      return this.formatResourceContent(result.content);
    }

    return `<pre class="code-block">${JSON.stringify(result, null, 2)}</pre>`;
  }

  formatPromptsList(prompts) {
    return `
            <div class="markdown-content">
                <h3>Available Prompts (${prompts.length})</h3>
                <ul>
                    ${prompts
                      .map(
                        (p) => `
                        <li>
                            <strong>${p.name}</strong>: ${p.description || "No description"}
                            ${p.arguments ? `<br><small>Arguments: ${p.arguments.map((a) => a.name).join(", ")}</small>` : ""}
                        </li>
                    `,
                      )
                      .join("")}
                </ul>
            </div>
        `;
  }

  formatPromptContent(messages) {
    return `
            <div class="markdown-content">
                ${messages
                  .map((msg) => {
                    const text = msg.content.text || msg.content;
                    return `<div>${marked.parse(text)}</div>`;
                  })
                  .join("")}
            </div>
        `;
  }

  formatResourcesList(resources) {
    return `
            <div class="markdown-content">
                <h3>Available Resources (${resources.length})</h3>
                <ul>
                    ${resources
                      .map(
                        (r) => `
                        <li>
                            <strong>${r.name || r.id || "Unknown"}</strong><br>
                            <small>${r.uri || "No URI"}</small><br>
                            ${r.description ? `<small>${r.description}</small>` : ""}
                        </li>
                    `,
                      )
                      .join("")}
                </ul>
            </div>
        `;
  }

  formatResourceContent(content) {
    if (typeof content === "string") {
      return `<div class="markdown-content">${marked.parse(content)}</div>`;
    }
    return `<pre class="code-block">${JSON.stringify(content, null, 2)}</pre>`;
  }

  extractMetadata(result, type) {
    if (result.error) {
      return { error: result.error };
    }

    const metadata = {
      type,
      timestamp: new Date().toISOString(),
    };

    if (result.prompts) {
      metadata.count = result.prompts.length;
    }
    if (result.resources) {
      metadata.count = result.resources.length;
    }
    if (result.messages) {
      metadata.messageCount = result.messages.length;
    }
    if (result.content) {
      metadata.contentLength = result.content.length;
      metadata.mimeType = "text/markdown";
    }

    return metadata;
  }

  loadExample(exampleName) {
    const typeSelect = document.getElementById("requestType");

    switch (exampleName) {
      case "list-prompts":
        typeSelect.value = "prompts/list";
        break;

      case "list-resources":
        typeSelect.value = "resources/list";
        break;

      case "registry-catalog":
        typeSelect.value = "resources/read";
        this.updateTestingForm();
        setTimeout(() => {
          document.getElementById("resourceUri").value = "orchestr8://registry";
        }, 100);
        break;

      case "typescript-agent":
        typeSelect.value = "resources/read";
        this.updateTestingForm();
        setTimeout(() => {
          document.getElementById("resourceUri").value =
            "orchestr8://agents/typescript-developer";
        }, 100);
        break;

      case "match-api":
        typeSelect.value = "resources/read";
        this.updateTestingForm();
        setTimeout(() => {
          document.getElementById("resourceUri").value =
            "orchestr8://match?query=api+development&maxTokens=2000";
        }, 100);
        break;

      case "match-fullstack":
        typeSelect.value = "resources/read";
        this.updateTestingForm();
        setTimeout(() => {
          document.getElementById("resourceUri").value =
            "orchestr8://match?query=full+stack+development&categories=agent,skill,example&maxTokens=3000";
        }, 100);
        break;

      case "match-minimal":
        typeSelect.value = "resources/read";
        this.updateTestingForm();
        setTimeout(() => {
          document.getElementById("resourceUri").value =
            "orchestr8://match?query=typescript+api&mode=minimal";
        }, 100);
        break;
    }

    this.updateTestingForm();
  }

  switchResultTab(tabName) {
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });

    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.toggle("active", content.id === `${tabName}Tab`);
    });
  }

  copyResults() {
    const activeTab = document.querySelector(".tab-content.active");
    const text = activeTab.textContent;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        this.showToast("Copied to clipboard", "success");
      })
      .catch((err) => {
        this.showToast("Failed to copy", "error");
      });
  }

  // ============================================
  // Resource Explorer
  // ============================================

  renderCategories() {
    const container = document.getElementById("categoryList");
    if (!container) return;

    if (this.categories.length === 0) {
      container.innerHTML = '<div class="loading">No categories</div>';
      return;
    }

    container.innerHTML = `
            <div class="category-item active" data-category="all">
                <span class="category-name">All Resources</span>
                <span class="category-count">${this.resources.length}</span>
            </div>
            ${this.categories
              .map(
                (cat) => `
                <div class="category-item" data-category="${cat.category}">
                    <span class="category-name">${cat.category}</span>
                    <span class="category-count">${cat.count}</span>
                </div>
            `,
              )
              .join("")}
        `;

    // Add click handlers
    container.querySelectorAll(".category-item").forEach((item) => {
      item.addEventListener("click", () => {
        container
          .querySelectorAll(".category-item")
          .forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
        this.filterByCategory(item.dataset.category);
      });
    });
  }

  renderResourceGrid() {
    const container = document.getElementById("resourceGrid");
    if (!container) return;

    if (this.resources.length === 0) {
      container.innerHTML = '<div class="loading">No resources found</div>';
      return;
    }

    container.innerHTML = this.resources
      .map((resource) => {
        const category = this.extractCategory(resource.uri);
        const icon = this.getResourceIcon(category);
        const name = resource.name || resource.id || "Unknown";
        const description =
          resource.description ||
          (resource.capabilities
            ? resource.capabilities.slice(0, 3).join(", ")
            : "No description available");

        return `
                <div class="resource-card" data-uri="${resource.uri}">
                    <div class="resource-header">
                        <div class="resource-icon">${icon}</div>
                        <div class="resource-info">
                            <div class="resource-name">${name}</div>
                            <div class="resource-category">${category || "unknown"}</div>
                        </div>
                    </div>
                    <div class="resource-description">
                        ${description}
                    </div>
                </div>
            `;
      })
      .join("");

    // Add click handlers
    container.querySelectorAll(".resource-card").forEach((card) => {
      card.addEventListener("click", () =>
        this.openResourceModal(card.dataset.uri),
      );
    });
  }

  getResourceIcon(category) {
    const icons = {
      agents: "🤖",
      skills: "⚡",
      examples: "📚",
      patterns: "🔄",
      guides: "📖",
      "best-practices": "✨",
    };
    return icons[category] || "📄";
  }

  extractCategory(uri) {
    const match = uri.match(/^orchestr8:\/\/([^/?]+)/);
    return match ? match[1] : null;
  }

  filterResources(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = this.resources.filter((r) => {
      const name = (r.name || r.id || "").toLowerCase();
      const description = (r.description || "").toLowerCase();
      const uri = (r.uri || "").toLowerCase();
      const tags = (r.tags || []).join(" ").toLowerCase();
      const capabilities = (r.capabilities || []).join(" ").toLowerCase();

      return (
        name.includes(lowerQuery) ||
        description.includes(lowerQuery) ||
        uri.includes(lowerQuery) ||
        tags.includes(lowerQuery) ||
        capabilities.includes(lowerQuery)
      );
    });

    this.renderFilteredResources(filtered);
  }

  filterByCategory(category) {
    if (category === "all") {
      this.renderResourceGrid();
      return;
    }

    const filtered = this.resources.filter((r) => {
      const cat = this.extractCategory(r.uri);
      return cat === category;
    });

    this.renderFilteredResources(filtered);
  }

  renderFilteredResources(resources) {
    const container = document.getElementById("resourceGrid");
    if (!container) return;

    if (resources.length === 0) {
      container.innerHTML =
        '<div class="activity-empty">No resources match your filter</div>';
      return;
    }

    const tempResources = this.resources;
    this.resources = resources;
    this.renderResourceGrid();
    this.resources = tempResources;
  }

  async openResourceModal(uri) {
    console.log("[Resource Explorer] Opening modal for:", uri);
    const modal = document.getElementById("resourceModal");
    const nameEl = document.getElementById("modalResourceName");
    const contentEl = document.getElementById("modalResourceContent");

    if (!modal) {
      console.error("[Resource Explorer] Modal element not found!");
      this.showToast("Error: Modal not found", "error");
      return;
    }

    modal.classList.add("active");
    nameEl.textContent = uri;
    contentEl.innerHTML = '<div class="loading">Loading resource...</div>';

    try {
      const encodedUri = encodeURIComponent(uri);
      const result = await this.apiCall(
        `/api/resource?uri=${encodedUri}`,
        "GET",
      );

      if (result.error) {
        contentEl.innerHTML = `<div style="color: var(--accent-error);">Error: ${result.error}</div>`;
        return;
      }

      const content = result.content;
      if (content) {
        const html = `<div class="markdown-content">${marked.parse(content)}</div>`;
        contentEl.innerHTML = html;
      } else {
        contentEl.innerHTML =
          '<div class="results-empty">No content available</div>';
      }
    } catch (error) {
      contentEl.innerHTML = `<div style="color: var(--accent-error);">Error: ${error.message}</div>`;
    }
  }

  closeModal() {
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.classList.remove("active");
    });
  }

  setViewType(type) {
    document.querySelectorAll("[data-view-type]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.viewType === type);
    });

    const grid = document.getElementById("resourceGrid");
    if (type === "list") {
      grid.style.gridTemplateColumns = "1fr";
    } else {
      grid.style.gridTemplateColumns = "";
    }
  }

  // ============================================
  // Provider Testing
  // ============================================

  async loadProviders() {
    const container = document.getElementById("providersGrid");
    if (!container) return;

    container.innerHTML = '<div class="loading">Loading providers...</div>';

    try {
      const response = await this.apiCall("/api/providers", "GET");
      const providers = response.providers || [];

      if (providers.length === 0) {
        container.innerHTML =
          '<div class="activity-empty">No providers configured</div>';
        return;
      }

      container.innerHTML = providers
        .map((provider) => this.renderProviderCard(provider))
        .join("");

      // Add click handlers for detail buttons
      container.querySelectorAll(".provider-details-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const providerName = e.target.closest(".provider-details-btn").dataset
            .provider;
          this.showProviderDetails(providerName);
        });
      });
    } catch (error) {
      console.error("[Providers] Error loading providers:", error);
      container.innerHTML = `<div class="activity-empty" style="color: var(--accent-error);">Error: ${error.message}</div>`;
    }
  }

  renderProviderCard(provider) {
    const statusClass =
      provider.health?.status === "healthy"
        ? "healthy"
        : provider.health?.status === "degraded"
          ? "degraded"
          : "unhealthy";
    const statusIcon = provider.enabled
      ? provider.health?.status === "healthy"
        ? "✅"
        : "⚠️"
      : "⏸️";

    return `
            <div class="provider-card ${statusClass}">
                <div class="provider-header">
                    <div class="provider-name">
                        <span class="provider-icon">${statusIcon}</span>
                        <strong>${provider.name}</strong>
                    </div>
                    <div class="provider-status">
                        ${provider.enabled ? "Enabled" : "Disabled"}
                    </div>
                </div>

                <div class="provider-stats">
                    <div class="provider-stat">
                        <span class="stat-label">Priority:</span>
                        <span class="stat-value">${provider.priority || "N/A"}</span>
                    </div>
                    <div class="provider-stat">
                        <span class="stat-label">Requests:</span>
                        <span class="stat-value">${provider.stats?.totalRequests || 0}</span>
                    </div>
                    <div class="provider-stat">
                        <span class="stat-label">Success Rate:</span>
                        <span class="stat-value">${
                          provider.stats
                            ? (
                                (provider.stats.successfulRequests /
                                  (provider.stats.totalRequests || 1)) *
                                100
                              ).toFixed(1)
                            : "0"
                        }%</span>
                    </div>
                    <div class="provider-stat">
                        <span class="stat-label">Avg Response:</span>
                        <span class="stat-value">${provider.stats?.avgResponseTime || 0}ms</span>
                    </div>
                </div>

                <div class="provider-health">
                    <div class="health-indicator ${statusClass}">
                        <span class="health-dot"></span>
                        <span>${provider.health?.status || "unknown"}</span>
                    </div>
                    ${
                      provider.health?.responseTime
                        ? `<span class="health-detail">Last check: ${provider.health.responseTime}ms</span>`
                        : ""
                    }
                </div>

                <button class="btn btn-sm provider-details-btn" data-provider="${provider.name}">
                    View Details
                </button>
            </div>
        `;
  }

  async showProviderDetails(providerName) {
    const modal = document.getElementById("providerHealthModal");
    const nameEl = document.getElementById("modalProviderName");
    const contentEl = document.getElementById("modalProviderContent");

    modal.classList.add("active");
    nameEl.textContent = `${providerName} Provider`;
    contentEl.innerHTML =
      '<div class="loading">Loading provider details...</div>';

    try {
      const [health, stats] = await Promise.all([
        this.apiCall(`/api/providers/${providerName}/health`, "GET"),
        this.apiCall(`/api/providers/${providerName}/stats`, "GET"),
      ]);

      const html = `
                <div class="provider-details">
                    <h4>Health Status</h4>
                    <pre class="code-block">${JSON.stringify(health, null, 2)}</pre>

                    <h4>Statistics</h4>
                    <pre class="code-block">${JSON.stringify(stats, null, 2)}</pre>
                </div>
            `;
      contentEl.innerHTML = html;
    } catch (error) {
      contentEl.innerHTML = `<div style="color: var(--accent-error);">Error: ${error.message}</div>`;
    }
  }

  async executeProviderSearch() {
    const provider = document.getElementById("providerTestSelect").value;
    const query = document.getElementById("providerSearchQuery").value;
    const categories = document.getElementById(
      "providerSearchCategories",
    ).value;
    const maxResults = parseInt(
      document.getElementById("providerSearchMaxResults").value,
    );
    const minScore = parseInt(
      document.getElementById("providerSearchMinScore").value,
    );

    if (!query) {
      this.showToast("Please enter a search query", "error");
      return;
    }

    const btn = document.getElementById("executeProviderSearchBtn");
    btn.disabled = true;
    btn.textContent = "Searching...";

    try {
      let endpoint = "/api/search/multi";
      const params = new URLSearchParams({
        q: query,
        maxResults: maxResults.toString(),
        minScore: minScore.toString(),
      });

      if (provider !== "all") {
        params.append("sources", provider);
      }

      if (categories) {
        params.append("categories", categories);
      }

      endpoint += "?" + params.toString();

      const results = await this.apiCall(endpoint, "GET");
      this.displayProviderSearchResults(results);
      this.showToast("Search completed successfully", "success");
    } catch (error) {
      console.error("[Provider Search] Error:", error);
      this.showToast(`Search failed: ${error.message}`, "error");
    } finally {
      btn.disabled = false;
      btn.textContent = "🔍 Search Providers";
    }
  }

  displayProviderSearchResults(results) {
    const resultsDiv = document.getElementById("providerResults");
    const infoDiv = document.getElementById("providerResultsInfo");
    const contentDiv = document.getElementById("providerResultsContent");

    resultsDiv.style.display = "block";

    // Display result info
    const totalResults = results.totalResults || results.results?.length || 0;
    const byProvider = results.byProvider || {};
    const providerCounts = Object.entries(byProvider)
      .map(([name, items]) => `${name}: ${items.length}`)
      .join(", ");

    infoDiv.innerHTML = `
            <div><strong>Total Results:</strong> ${totalResults}</div>
            ${providerCounts ? `<div><strong>By Provider:</strong> ${providerCounts}</div>` : ""}
        `;

    // Display results
    if (!results.results || results.results.length === 0) {
      contentDiv.innerHTML =
        '<div class="activity-empty">No results found</div>';
      return;
    }

    const html = results.results
      .map((result, index) => {
        const resourceId = result.resource?.id || result.id || "Unknown";
        const source = result.resource?.source || result.source || "unknown";
        const category = result.resource?.category || "";

        // Build URI for the resource
        let resourceUri = "";
        if (source === "local") {
          // For local resources, the resourceId already contains the full path (e.g., "agents/typescript-testing")
          // Just prepend the protocol
          resourceUri = `orchestr8://${resourceId}`;
        } else if (source === "aitmpl") {
          // For AITMPL, map singular category to plural
          const categoryPlural =
            category === "agent"
              ? "agents"
              : category === "skill"
                ? "skills"
                : category === "example"
                  ? "examples"
                  : category === "pattern"
                    ? "patterns"
                    : category === "workflow"
                      ? "workflows"
                      : category;
          resourceUri = `aitmpl://${categoryPlural}/${resourceId}`;
        } else if (source === "github") {
          resourceUri = `github://${resourceId}`;
        }

        console.log("[Provider Search] Building result item:", {
          resourceId,
          source,
          category,
          resourceUri,
        });

        // Only make clickable if we have a valid URI
        const clickableClass = resourceUri ? "clickable" : "";
        const viewHint = resourceUri
          ? "👁️ Click to view content"
          : "⚠️ No URI available";

        return `
                <div class="search-result-item ${clickableClass}" data-uri="${resourceUri}" data-name="${resourceId}">
                    <div class="result-header">
                        <strong>${index + 1}. ${resourceId}</strong>
                        <span class="result-score">Score: ${result.score || "N/A"}</span>
                    </div>
                    <div class="result-meta">
                        <span>Source: ${source}</span>
                        ${category ? `<span>Category: ${category}</span>` : ""}
                        ${result.resource?.estimatedTokens ? `<span>Tokens: ${result.resource.estimatedTokens}</span>` : ""}
                    </div>
                    ${
                      result.resource?.capabilities?.length
                        ? `
                        <div class="result-capabilities">
                            <strong>Capabilities:</strong> ${result.resource.capabilities.slice(0, 3).join(", ")}
                            ${result.resource.capabilities.length > 3 ? "..." : ""}
                        </div>
                    `
                        : ""
                    }
                    ${
                      result.matchReason?.length
                        ? `
                        <div class="result-match-reason">
                            <strong>Match Reason:</strong> ${result.matchReason.join(", ")}
                        </div>
                    `
                        : ""
                    }
                    <div class="result-actions">
                        <span class="view-hint">${viewHint}</span>
                    </div>
                </div>
            `;
      })
      .join("");

    contentDiv.innerHTML = html;

    // Add click handlers to make results clickable
    console.log(
      "[Provider Search] Attaching click handlers to",
      contentDiv.querySelectorAll(".search-result-item.clickable").length,
      "items",
    );
    contentDiv
      .querySelectorAll(".search-result-item.clickable")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          console.log(
            "[Provider Search] Result clicked:",
            item.dataset.name,
            item.dataset.uri,
          );
          const uri = item.dataset.uri;
          const name = item.dataset.name;
          if (uri) {
            this.openProviderResourceModal(uri, name);
          } else {
            console.warn("[Provider Search] No URI found for clicked item");
          }
        });
      });
  }

  async openProviderResourceModal(uri, name) {
    console.log("[Provider Search] Opening modal for:", uri, name);
    const modal = document.getElementById("resourceModal");
    const nameEl = document.getElementById("modalResourceName");
    const contentEl = document.getElementById("modalResourceContent");

    if (!modal) {
      console.error("[Provider Search] Modal element not found!");
      this.showToast("Error: Modal not found", "error");
      return;
    }

    modal.classList.add("active");
    nameEl.textContent = name || uri;
    contentEl.innerHTML =
      '<div class="loading">Loading resource content...</div>';

    try {
      const encodedUri = encodeURIComponent(uri);
      const result = await this.apiCall(
        `/api/resource?uri=${encodedUri}`,
        "GET",
      );

      if (result.error) {
        contentEl.innerHTML = `<div style="color: var(--accent-error);">Error: ${result.error}</div>`;
        return;
      }

      const content = result.content;
      if (content) {
        const html = `<div class="markdown-content">${marked.parse(content)}</div>`;
        contentEl.innerHTML = html;
      } else {
        contentEl.innerHTML =
          '<div class="results-empty">No content available</div>';
      }
    } catch (error) {
      contentEl.innerHTML = `<div style="color: var(--accent-error);">Error: ${error.message}</div>`;
    }
  }

  // ============================================
  // API Helpers
  // ============================================

  async apiCall(endpoint, method = "GET", body = null) {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  // ============================================
  // Utilities
  // ============================================

  showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // ============================================
  // Token Efficiency Monitoring
  // ============================================

  async loadTokenMetrics(period = 'last_hour') {
    try {
      const response = await fetch(`/api/tokens/efficiency?period=${period}`);
      if (!response.ok) {
        console.warn('[Dashboard] Token tracking not available:', response.statusText);
        return;
      }

      const data = await response.json();
      this.updateTokenMetrics(data);
    } catch (error) {
      console.warn('[Dashboard] Token metrics error:', error.message);
    }
  }

  updateTokenMetrics(data) {
    // Update efficiency stat
    const efficiency = data.overall.efficiencyPercentage || 0;
    document.getElementById('tokenEfficiency').textContent = `${efficiency.toFixed(1)}%`;

    // Update trend indicator
    const trendEl = document.getElementById('tokenEfficiencyTrend');
    const trend = data.trend?.direction || 'stable';
    const trendChange = data.trend?.efficiencyChange || 0;

    let trendIcon = '→';
    if (trend === 'improving') trendIcon = '↗';
    if (trend === 'declining') trendIcon = '↘';

    trendEl.textContent = `${trendIcon} ${trendChange >= 0 ? '+' : ''}${trendChange.toFixed(1)}% ${trend}`;

    // Update tokens saved
    const tokensSaved = data.overall.tokensSaved || 0;
    document.getElementById('tokensSaved').textContent = this.formatNumber(tokensSaved);
    document.getElementById('tokenBaseline').textContent = this.formatNumber(data.overall.baselineTokens || 0);

    // Update cost saved
    const costSaved = data.overall.costSavingsUSD || 0;
    document.getElementById('costSaved').textContent = `$${costSaved.toFixed(3)}`;
    document.getElementById('actualCost').textContent = `$${(data.overall.costUSD || 0).toFixed(3)}`;

    // Update cache hit rate
    const cacheHitRate = data.cache?.cacheHitRate || 0;
    document.getElementById('cacheHitRate').textContent = `${cacheHitRate.toFixed(1)}%`;
    document.getElementById('cacheHits').textContent = `${data.cache?.totalCacheHits || 0}`;

    // Update timestamp
    document.getElementById('tokenMetricsTimestamp').textContent = new Date(data.timestamp).toLocaleTimeString();

    // Update category efficiency chart
    this.updateCategoryEfficiencyChart(data.byCategory || []);

    // Update top performers list
    this.updateTopPerformersList(data.topPerformers || []);
  }

  updateCategoryEfficiencyChart(categories) {
    const canvas = document.getElementById('categoryEfficiencyChart');
    const ctx = canvas.getContext('2d');

    // Destroy existing chart if it exists
    if (this.categoryEfficiencyChart) {
      this.categoryEfficiencyChart.destroy();
    }

    // Prepare data
    const labels = categories.map(c => c.category.charAt(0).toUpperCase() + c.category.slice(1));
    const efficiencies = categories.map(c => c.efficiency);

    // Create chart
    this.categoryEfficiencyChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Efficiency %',
          data: efficiencies,
          backgroundColor: [
            'rgba(99, 102, 241, 0.8)',
            'rgba(6, 182, 212, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(251, 146, 60, 0.8)',
            'rgba(236, 72, 153, 0.8)',
          ],
          borderColor: [
            'rgb(99, 102, 241)',
            'rgb(6, 182, 212)',
            'rgb(16, 185, 129)',
            'rgb(139, 92, 246)',
            'rgb(251, 146, 60)',
            'rgb(236, 72, 153)',
          ],
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const category = categories[context.dataIndex];
                return [
                  `Efficiency: ${context.parsed.y.toFixed(1)}%`,
                  `Loads: ${category.loadCount}`,
                  `Saved: ${this.formatNumber(category.tokensSaved)} tokens`,
                  `Cost Saved: $${category.costSavingsUSD.toFixed(3)}`,
                ];
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value) => value + '%',
            },
          },
        },
      },
    });
  }

  updateTopPerformersList(performers) {
    const listEl = document.getElementById('topPerformersList');

    if (!performers || performers.length === 0) {
      listEl.innerHTML = '<div class="activity-empty" style="font-size: 0.875rem;">No data yet</div>';
      return;
    }

    listEl.innerHTML = performers.map((performer, index) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem;
                  border-bottom: 1px solid var(--bg-tertiary); font-size: 0.875rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0;">
          <span style="font-weight: 600; color: var(--accent-primary);">#${index + 1}</span>
          <span style="font-family: monospace; font-size: 0.75rem; color: var(--text-secondary);
                       overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"
                title="${performer.uri}">
            ${performer.uri.split('/').pop()}
          </span>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem; flex-shrink: 0;">
          <span style="font-weight: 600; color: var(--accent-success);">${performer.efficiency.toFixed(1)}%</span>
          <span style="font-size: 0.75rem; color: var(--text-tertiary);">
            ${this.formatNumber(performer.tokensSaved)} saved
          </span>
        </div>
      </div>
    `).join('');
  }

  formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  setupTokenMetricsHandlers() {
    // Period selector
    const periodSelect = document.getElementById('tokenPeriodSelect');
    if (periodSelect) {
      periodSelect.addEventListener('change', (e) => {
        this.loadTokenMetrics(e.target.value);
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshTokenMetrics');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const period = periodSelect?.value || 'last_hour';
        this.loadTokenMetrics(period);
        this.showToast('Token metrics refreshed', 'success');
      });
    }
  }
}

// Initialize dashboard when page loads
document.addEventListener("DOMContentLoaded", () => {
  window.dashboard = new Dashboard();

  // Setup token metrics handlers
  window.dashboard.setupTokenMetricsHandlers();

  // Load initial token metrics
  window.dashboard.loadTokenMetrics('last_hour');

  // Auto-refresh token metrics every 30 seconds
  setInterval(() => {
    const periodSelect = document.getElementById('tokenPeriodSelect');
    const period = periodSelect?.value || 'last_hour';
    window.dashboard.loadTokenMetrics(period);
  }, 30000);
});
