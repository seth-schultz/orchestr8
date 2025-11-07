# Orchestr8 Async Execution Implementation Roadmap

## Overview

This document provides a concrete, phased implementation plan to add async execution capabilities to orchestr8, enabling fire-and-forget task launching, background job execution, and autonomous workflow management.

---

## Phase 1: Foundation (Weeks 1-2) - Database & Task Async Wrapper

### 1.1 Set Up Execution Database

**Database Provider Options:**
- DuckDB (currently used by MCP server - good fit)
- SQLite (simple, file-based)
- PostgreSQL (more robust, if database available)

**Recommended: Extend existing DuckDB usage in MCP server**

**Schema to Create:**

```sql
-- Workflow Executions
CREATE TABLE IF NOT EXISTS workflow_executions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    workflow_name VARCHAR,
    status VARCHAR, -- 'pending', 'running', 'completed', 'failed'
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    metadata STRUCT
);

-- Task Executions
CREATE TABLE IF NOT EXISTS task_executions (
    id VARCHAR PRIMARY KEY,
    workflow_id VARCHAR,
    agent_name VARCHAR,
    task_description TEXT,
    status VARCHAR, -- 'pending', 'running', 'completed', 'failed'
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    result STRUCT,
    error TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3
);

-- Task Results
CREATE TABLE IF NOT EXISTS task_results (
    id VARCHAR PRIMARY KEY,
    task_execution_id VARCHAR,
    result_type VARCHAR, -- 'file', 'summary', 'notification'
    result_content STRUCT,
    created_at TIMESTAMP
);

-- Notifications Queue
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR,
    workflow_id VARCHAR,
    notification_type VARCHAR, -- 'task_complete', 'phase_complete', 'failure', 'update'
    message TEXT,
    metadata STRUCT,
    delivered BOOLEAN DEFAULT FALSE,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP
);

-- Webhook Callbacks
CREATE TABLE IF NOT EXISTS webhook_callbacks (
    id VARCHAR PRIMARY KEY,
    task_execution_id VARCHAR,
    callback_url VARCHAR,
    method VARCHAR DEFAULT 'POST',
    payload STRUCT,
    retry_count INTEGER DEFAULT 0,
    status VARCHAR DEFAULT 'pending',
    last_attempt TIMESTAMP
);
```

**Implementation Tasks:**
- [ ] Create database initialization script
- [ ] Add schema migration logic to MCP server startup
- [ ] Create helper functions for CRUD operations
- [ ] Add connection pooling if using remote database
- [ ] Add schema versioning for future migrations

---

### 1.2 Create TaskAsync Wrapper Function

**New Tool/Function Specification:**

```python
def task_async(
    agent_definition: str,
    prompt: str,
    options: dict = None
) -> dict:
    """
    Launch a task asynchronously without waiting for completion.
    
    Args:
        agent_definition: Path to agent markdown file or agent name
        prompt: Task prompt/description
        options: {
            'on_completion': 'callback_url' or 'notification',
            'on_failure': 'retry' or 'callback',
            'timeout': '2h' or integer seconds,
            'callback_url': 'webhook URL',
            'max_retries': 3,
            'retry_backoff': 'exponential',
            'priority': 'high'|'normal'|'low',
            'tags': ['tag1', 'tag2'],
            'metadata': {...}
        }
    
    Returns:
        {
            'task_id': 'uuid',
            'status': 'queued',
            'workflow_id': 'uuid',
            'estimated_duration': 'seconds',
            'check_status_url': '/status/task_id',
            'message': 'Task started successfully'
        }
    
    Implementation:
    1. Generate task_id (UUID)
    2. Store task in task_executions table with status='pending'
    3. Store options in metadata
    4. Queue task for background execution
    5. Return task_id immediately
    6. [Background] Execute Task() tool in separate context
    7. [Background] Update task status to 'running'
    8. [Background] Capture result and store in task_results
    9. [Background] Update task status to 'completed'
    10. [Background] Execute on_completion callback
    """
    
    # Implementation outline
    task_id = uuid.uuid4().hex[:12]
    
    # Store in database
    store_task_execution({
        'id': task_id,
        'agent_name': parse_agent_name(agent_definition),
        'task_description': prompt,
        'status': 'pending',
        'created_at': now(),
        'metadata': options or {}
    })
    
    # Queue for background execution
    queue_background_job({
        'task_id': task_id,
        'agent_definition': agent_definition,
        'prompt': prompt,
        'options': options
    })
    
    # Return immediately
    return {
        'task_id': task_id,
        'status': 'queued',
        'message': f'Task {task_id} queued for execution'
    }
```

**Integration Points:**
- Add to Claude Code plugin as new tool
- Make available to all agents
- Document in CLAUDE.md
- Add examples to agent instructions

**Implementation Tasks:**
- [ ] Create task_async function in Python/JavaScript
- [ ] Implement task queuing mechanism
- [ ] Add task status tracking
- [ ] Create background job executor
- [ ] Add error handling and logging
- [ ] Write unit tests for task_async

---

### 1.3 Simple Notification System

**Notification Types:**
```
- 'phase_start': When a phase begins
- 'phase_complete': When a phase completes
- 'task_complete': When individual task completes
- 'task_failure': When task fails
- 'milestone': Custom milestone events
- 'update': Progress updates
```

**Implementation:**

```python
def send_notification(
    user_id: str,
    notification_type: str,
    message: str,
    workflow_id: str = None,
    metadata: dict = None
):
    """Send notification to user (stub for now)"""
    
    notification = {
        'id': uuid.uuid4().hex[:12],
        'user_id': user_id,
        'workflow_id': workflow_id,
        'notification_type': notification_type,
        'message': message,
        'metadata': metadata,
        'created_at': now()
    }
    
    # Store in database
    db.insert('notifications', notification)
    
    # For now: Log notification
    # Future: Send via websocket, email, Slack, etc.
    print(f"[NOTIFICATION] {user_id}: {message}")
    
    return notification['id']


def get_notifications(user_id: str, workflow_id: str = None):
    """Retrieve pending notifications for user"""
    
    query = "SELECT * FROM notifications WHERE user_id = ? AND delivered = FALSE"
    params = [user_id]
    
    if workflow_id:
        query += " AND workflow_id = ?"
        params.append(workflow_id)
    
    query += " ORDER BY created_at DESC"
    
    return db.execute(query, params).fetchall()
```

**Implementation Tasks:**
- [ ] Create notification storage schema
- [ ] Implement send_notification function
- [ ] Implement get_notifications function  
- [ ] Create notification retrieval API endpoint
- [ ] Add stub for email notifications
- [ ] Plan integration with user notification preferences

---

## Phase 2: Integration (Weeks 3-4) - Command Updates & Callbacks

### 2.1 Update Commands to Use TaskAsync

**Commands to Update (Priority Order):**

1. `/orchestr8:add-feature` - Most common, highest impact
2. `/orchestr8:review-pr` - Fast execution, good test case
3. `/orchestr8:deploy` - Complex, multi-phase workflow
4. `/orchestr8:new-project` - Long-running, perfect use case

**Example: add-feature Command Refactor**

**Before (Current - Synchronous):**
```markdown
## Phase 1: Analysis & Design (0-20%)

Analysis Phase:
└─ Wait for requirements-analyzer → 20 min (BLOCKS)

## Phase 2: Implementation (20-70%)

Backend Phase:
└─ Wait for backend-developer → 25 min (BLOCKS)

Frontend Phase:
└─ Wait for frontend-developer → 25 min (BLOCKS)

[User blocked entire time: ~70 minutes]
```

**After (Async):**
```markdown
## Phase 1: Analysis & Design (0-20%)

IMMEDIATELY:
1. Launch requirements-analyzer (async)
   → Returns task_id_analysis
2. Return to user: "Feature workflow started. Analyzing requirements..."
3. Release context

BACKGROUND:
└─ Analysis runs to completion
└─ On completion: Trigger Phase 2 launch

## Phase 2: Implementation (auto-triggered)

AUTOMATICALLY:
1. Launch backend-developer (async)
   → Returns task_id_backend
2. Launch frontend-developer (async)
   → Returns task_id_frontend
3. Wait for both to complete (no user context needed)

## Phase 3: Quality Gates (auto-triggered)

AUTOMATICALLY (all parallel):
1. Launch code-reviewer (async)
2. Launch test-engineer (async)
3. Launch security-auditor (async)
4. Launch performance-analyzer (async)
5. Launch accessibility-expert (async)
6. Wait for all 5 to complete

[User freed immediately. Rest happens in background: ~70 minutes total wall-clock]
```

**Implementation Tasks:**
- [ ] Update feature-orchestrator to use task_async
- [ ] Add callback hooks between phases
- [ ] Create phase dependency logic
- [ ] Update add-feature.md with new flow
- [ ] Test async execution end-to-end
- [ ] Update user communication in commands

---

### 2.2 Implement Webhook Callback System

**Webhook Flow:**

```
Task Completion
    ↓
Update task_executions status = 'completed'
    ↓
Store result in task_results
    ↓
Check if webhook callback configured
    ↓
If yes:
    POST to callback_url with:
    {
        'task_id': '...',
        'status': 'completed',
        'workflow_id': '...',
        'result': {...},
        'timestamp': '...'
    }
    ↓
    If POST fails:
        Add to retry queue
        Retry with exponential backoff
        Max 3 retries
```

**Webhook Handler for Phase Transitions:**

```python
@webhook_handler('/internal/task-complete')
def on_task_complete(task_id: str, status: str, result: dict):
    """
    Called when a background task completes.
    Triggers next phase if dependencies met.
    """
    
    # Get task info
    task = db.get_task(task_id)
    workflow = db.get_workflow(task.workflow_id)
    
    # Check if dependent phase can start
    dependencies = get_phase_dependencies(task.phase)
    
    if all_dependencies_complete(dependencies, workflow):
        # All predecessor tasks complete
        # Launch next phase
        trigger_next_phase(workflow.id, task.phase)
        
        # Notify user
        send_notification(
            workflow.user_id,
            'phase_complete',
            f'Completed {task.phase}, starting next phase...',
            workflow.id
        )
```

**Implementation Tasks:**
- [ ] Create webhook endpoint in MCP server
- [ ] Implement callback execution with retry logic
- [ ] Add phase dependency resolution
- [ ] Create next-phase trigger logic
- [ ] Add webhook failure handling and logging
- [ ] Create webhook test suite

---

### 2.3 Add Result Polling API

**Endpoint Specifications:**

```
GET /api/v1/tasks/{task_id}/status
Response:
{
    "task_id": "...",
    "status": "running",
    "progress": {
        "percent": 45,
        "current_step": "Analyzing backend requirements",
        "estimated_time_remaining": 600
    },
    "created_at": "...",
    "started_at": "...",
    "estimated_completion": "..."
}

GET /api/v1/tasks/{task_id}/result
Response:
{
    "task_id": "...",
    "status": "completed",
    "result": {...},
    "result_type": "summary",
    "files_created": [...],
    "completed_at": "..."
}

GET /api/v1/workflows/{workflow_id}/tasks
Response:
{
    "workflow_id": "...",
    "tasks": [
        {"id": "...", "status": "completed", ...},
        {"id": "...", "status": "running", ...},
        {"id": "...", "status": "pending", ...}
    ]
}
```

**Implementation Tasks:**
- [ ] Create REST API endpoints
- [ ] Add status calculation logic
- [ ] Add result retrieval logic
- [ ] Implement progress estimation
- [ ] Add authentication/authorization
- [ ] Create API documentation

---

## Phase 3: Enhancement (Weeks 5-6) - Advanced Features

### 3.1 Auto-Retry with Exponential Backoff

**Implementation:**

```python
def execute_task_with_retry(task_id: str):
    """
    Execute task with automatic retry on failure.
    """
    
    task = db.get_task(task_id)
    max_retries = task.metadata.get('max_retries', 3)
    
    for attempt in range(max_retries):
        try:
            # Execute task
            result = Task(
                agent_definition=task.agent_name,
                prompt=task.task_description
            )
            
            # Mark as completed
            db.update_task(task_id, {
                'status': 'completed',
                'result': result,
                'completed_at': now()
            })
            
            return result
            
        except Exception as e:
            
            retry_count = attempt + 1
            
            if retry_count < max_retries:
                # Calculate backoff: 2^attempt seconds
                backoff = 2 ** attempt
                
                print(f"Task failed, retrying in {backoff}s... (attempt {retry_count}/{max_retries})")
                
                # Update task status
                db.update_task(task_id, {
                    'status': 'retrying',
                    'retry_count': retry_count,
                    'error': str(e),
                    'next_retry': now() + timedelta(seconds=backoff)
                })
                
                time.sleep(backoff)
            else:
                # All retries exhausted
                db.update_task(task_id, {
                    'status': 'failed',
                    'retry_count': retry_count,
                    'error': str(e),
                    'completed_at': now()
                })
                
                send_notification(
                    task.user_id,
                    'task_failure',
                    f'Task {task_id} failed after {retry_count} attempts: {str(e)}',
                    task.workflow_id
                )
                
                raise
```

**Implementation Tasks:**
- [ ] Create retry execution wrapper
- [ ] Implement exponential backoff
- [ ] Add retry status tracking
- [ ] Create retry metrics dashboard
- [ ] Add maximum retry limits
- [ ] Test failure scenarios

---

### 3.2 Advanced Monitoring & Metrics

**Metrics to Track:**

```
Per-Task Metrics:
- Execution time
- CPU/memory usage
- Success/failure rate
- Retry attempts
- Queue wait time

Per-Workflow Metrics:
- Total execution time
- Phase durations
- Success rate
- Cost (if applicable)
- Token usage (for Claude models)

Per-Agent Metrics:
- Average execution time
- Success rate
- Common failure modes
- Performance trend
```

**Dashboard Queries:**

```sql
-- Average task execution time by agent
SELECT 
    agent_name,
    AVG(EXTRACT(EPOCH FROM (completed_at - started_at))) as avg_duration,
    COUNT(*) as total_tasks,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count
FROM task_executions
WHERE completed_at > now() - interval '7 days'
GROUP BY agent_name
ORDER BY avg_duration DESC;

-- Workflow success rate by type
SELECT
    workflow_name,
    COUNT(*) as total,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful,
    ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM workflow_executions
WHERE created_at > now() - interval '30 days'
GROUP BY workflow_name;

-- Most common failure modes
SELECT
    agent_name,
    error,
    COUNT(*) as occurrences
FROM task_executions
WHERE status = 'failed' AND completed_at > now() - interval '7 days'
GROUP BY agent_name, error
ORDER BY occurrences DESC
LIMIT 20;
```

**Implementation Tasks:**
- [ ] Create metrics collection functions
- [ ] Add dashboard queries
- [ ] Create simple metrics UI
- [ ] Add performance trending
- [ ] Create failure analysis reports
- [ ] Set up alerting for high failure rates

---

### 3.3 Distributed Execution Support

**Architecture:**

```
Multiple Claude Contexts
    ↓
├─ Task Executor 1 (picking tasks from queue)
├─ Task Executor 2 (picking tasks from queue)
├─ Task Executor 3 (picking tasks from queue)
└─ Task Executor N (picking tasks from queue)
    ↓
All pulling from same task queue
    ↓
Results written to shared database
```

**Implementation:**

```python
def task_executor_loop():
    """
    Runs in dedicated Claude Code context.
    Continuously picks tasks from queue and executes them.
    """
    
    while True:
        # Pick next pending task (FIFO with priority)
        task = db.get_next_pending_task(
            order_by=['priority', 'created_at']
        )
        
        if not task:
            # No tasks, wait and retry
            sleep(5)
            continue
        
        try:
            # Mark as running
            db.update_task(task.id, {
                'status': 'running',
                'started_at': now(),
                'executor_id': get_executor_id()
            })
            
            # Execute task with retry logic
            result = execute_task_with_retry(task.id)
            
            # Call webhook if configured
            if task.metadata.get('callback_url'):
                call_webhook(task, result)
            
            # Send notification
            send_notification(
                task.user_id,
                'task_complete',
                f'Task {task.id} completed successfully',
                task.workflow_id
            )
            
        except Exception as e:
            print(f"Error executing task {task.id}: {e}")
            # Retry logic handles it
        
        sleep(1)  # Rate limiting
```

**Implementation Tasks:**
- [ ] Create task queue priority system
- [ ] Implement task executor loop
- [ ] Add executor heartbeat/health check
- [ ] Create multi-executor coordination
- [ ] Add load balancing logic
- [ ] Test with multiple concurrent executors

---

## Phase 4: Optimization (Weeks 7-8) - Advanced Patterns

### 4.1 Agent-to-Agent Async Communication

**Pattern:**

```
Agent A (Research Orchestrator)
    ├─ Launches Task: Literature Review (async)
    │  └─ Webhook: /webhook/lit-review-complete
    │
    └─ Launches Task: Data Analysis (async)
       └─ Webhook: /webhook/data-analysis-complete

When both complete:
Agent A triggered via webhook
    ↓
Resumes context
    ↓
Synthesizes results
    ↓
Launches Task: Report Generation (async)
```

**Implementation:**

```python
# In research orchestrator
lit_review_task = task_async(
    'literature-reviewer',
    'Analyze sources on topic X',
    options={
        'callback_url': '/internal/lit-review-complete',
        'on_completion': 'trigger_synthesis'
    }
)

data_analysis_task = task_async(
    'data-analyst',
    'Analyze dataset Y',
    options={
        'callback_url': '/internal/data-analysis-complete',
        'on_completion': 'trigger_synthesis'
    }
)

# Orchestrator returns immediately
return {
    'workflow_started': True,
    'tasks': [lit_review_task, data_analysis_task],
    'message': 'Research tasks started, synthesis will begin when complete'
}

# Webhook handler
@webhook_handler('/internal/lit-review-complete')
def on_lit_review_complete(task_id, result):
    workflow = db.get_workflow_for_task(task_id)
    
    # Check if all tasks complete
    if all_research_tasks_complete(workflow.id):
        # Trigger synthesis
        trigger_synthesis(workflow.id)

def trigger_synthesis(workflow_id):
    # Agent A resumes and synthesizes results
    synthesis_task = task_async(
        'report-generator',
        'Create final report',
        options={
            'callback_url': '/internal/synthesis-complete'
        }
    )
```

**Implementation Tasks:**
- [ ] Create agent coordination patterns
- [ ] Implement cross-agent webhooks
- [ ] Add task dependency tracking
- [ ] Create workflow graph visualization
- [ ] Document agent communication patterns
- [ ] Test complex multi-agent workflows

---

### 4.2 Scheduled Task Execution

**Use Cases:**

```
- Daily research updates
- Weekly performance reports
- Scheduled deployments
- Recurring code analysis
```

**Implementation:**

```python
def schedule_task(
    agent_definition: str,
    prompt: str,
    schedule: str,  # Cron expression: "0 9 * * MON"
    options: dict = None
):
    """
    Schedule a task to run periodically.
    """
    
    scheduled_task = {
        'id': uuid.uuid4().hex[:12],
        'agent_name': parse_agent_name(agent_definition),
        'prompt': prompt,
        'schedule': schedule,
        'options': options,
        'active': True,
        'created_at': now(),
        'last_run': None,
        'next_run': calculate_next_run(schedule)
    }
    
    db.insert('scheduled_tasks', scheduled_task)
    
    return scheduled_task['id']


def scheduled_task_executor():
    """
    Runs periodically to check for scheduled tasks.
    """
    
    while True:
        # Get all scheduled tasks due to run
        tasks = db.query("""
            SELECT * FROM scheduled_tasks
            WHERE active = TRUE AND next_run <= now()
        """)
        
        for task in tasks:
            # Launch task
            result = task_async(
                task.agent_name,
                task.prompt,
                options=task.options
            )
            
            # Update schedule
            db.update_scheduled_task(task.id, {
                'last_run': now(),
                'next_run': calculate_next_run(task.schedule)
            })
        
        sleep(60)  # Check every minute
```

**Implementation Tasks:**
- [ ] Create scheduled_tasks table
- [ ] Implement schedule parser (cron)
- [ ] Create scheduled executor loop
- [ ] Add task enable/disable
- [ ] Create schedule history tracking
- [ ] Add scheduled task management API

---

### 4.3 Research Workflow Optimization

**Multi-Day Research Pattern:**

```
User initiates: "Research competitive AI agents, 2 weeks, comprehensive"
    ↓
System immediately returns: "Research started (research_123)"
    ↓
Background orchestration begins:

Day 1:
├─ Literature Review Task (async)
├─ Source Collection Task (async)
└─ Metadata Extraction Task (async)

Day 2-3:
├─ Data Analysis (waits for source collection)
├─ Market Research (parallel)
└─ Technology Assessment (parallel)

Day 4-5:
├─ Comparative Analysis
├─ Trend Identification
└─ Gap Analysis

Day 6-7:
├─ Synthesis
├─ Executive Summary
└─ Detailed Report Generation

Day 8:
└─ Final Review & Delivery

User receives updates:
- Day 1: "Literature review started (234 sources found)"
- Day 3: "Initial analysis complete (key trends identified)"
- Day 7: "Draft report ready for review"
- Day 8: "Research complete, ready for presentation"
```

**Implementation Tasks:**
- [ ] Design multi-phase research workflows
- [ ] Create research project management UI
- [ ] Add milestone tracking
- [ ] Create research progress dashboard
- [ ] Implement periodic status reports
- [ ] Add research archive and retrieval

---

## Implementation Checklist

### Phase 1 (Weeks 1-2)
- [ ] DuckDB schema creation
- [ ] task_async function
- [ ] Notification system basics
- [ ] Background job queue
- [ ] Database initialization

### Phase 2 (Weeks 3-4)
- [ ] Update add-feature command
- [ ] Webhook callback system
- [ ] Result polling API
- [ ] Phase dependency logic
- [ ] End-to-end async testing

### Phase 3 (Weeks 5-6)
- [ ] Auto-retry logic
- [ ] Metrics collection
- [ ] Monitoring dashboard
- [ ] Distributed executor
- [ ] Multi-instance testing

### Phase 4 (Weeks 7-8)
- [ ] Agent-to-agent communication
- [ ] Scheduled tasks
- [ ] Research workflows
- [ ] Performance optimization
- [ ] Comprehensive testing

---

## Success Metrics

**After Phase 1:**
- Tasks can be launched asynchronously
- Basic task tracking working
- Database stores workflow state

**After Phase 2:**
- Commands return immediately
- Users notified of task completion
- Can poll for task status

**After Phase 3:**
- Failed tasks automatically retry
- Metrics dashboard working
- Multiple tasks executing in parallel

**After Phase 4:**
- Multi-day research workflows supported
- Agents can communicate asynchronously
- Performance improved 30-50%

---

## Testing Strategy

### Unit Tests
- task_async function
- Retry logic
- Webhook callbacks
- Database operations

### Integration Tests
- Full async workflow execution
- Multi-phase workflows
- Failure and recovery scenarios
- Notification delivery

### End-to-End Tests
- Complete add-feature workflow
- Complete deploy workflow
- Multi-day research workflow
- Multi-agent collaboration

### Load Testing
- Multiple concurrent workflows
- Large result files
- Database performance
- Webhook delivery at scale

---

## References

- Original ASYNC_EXECUTION_ANALYSIS.md
- Orchestr8 ARCHITECTURE.md
- Feature Orchestrator Agent Definition
- Project Orchestrator Agent Definition

