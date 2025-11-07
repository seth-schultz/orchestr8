use orchestr8_async::{
    AsyncTask, Database, TaskPriority, TaskQueue, TaskStatus, Workflow, WorkflowExecutor,
    WorkflowPhase,
};
use std::sync::Arc;
use uuid::Uuid;

#[tokio::test]
async fn test_task_lifecycle() {
    let db = Arc::new(Database::in_memory().unwrap());

    // Create task
    let task = AsyncTask::new(
        "Test Task".to_string(),
        "test-agent".to_string(),
        "Do something".to_string(),
    );

    db.insert_task(&task).unwrap();

    // Verify pending status
    let retrieved = db.get_task(task.id).unwrap().unwrap();
    assert_eq!(retrieved.status, TaskStatus::Pending);
    assert!(retrieved.started_at.is_none());
    assert!(retrieved.completed_at.is_none());

    // Update to running
    db.update_task_status(task.id, TaskStatus::Running)
        .unwrap();
    let running = db.get_task(task.id).unwrap().unwrap();
    assert_eq!(running.status, TaskStatus::Running);
    assert!(running.started_at.is_some());

    // Complete task
    db.update_task_result(task.id, "Success!".to_string())
        .unwrap();
    let completed = db.get_task(task.id).unwrap().unwrap();
    assert_eq!(completed.status, TaskStatus::Completed);
    assert!(completed.completed_at.is_some());
    assert_eq!(completed.result, Some("Success!".to_string()));
}

#[tokio::test]
async fn test_task_dependencies() {
    let db = Arc::new(Database::in_memory().unwrap());

    // Create two tasks - task2 depends on task1
    let task1 = AsyncTask::new(
        "Task 1".to_string(),
        "agent1".to_string(),
        "First task".to_string(),
    );

    let task2 = AsyncTask::new(
        "Task 2".to_string(),
        "agent2".to_string(),
        "Second task".to_string(),
    )
    .with_dependencies(vec![task1.id]);

    db.insert_task(&task1).unwrap();
    db.insert_task(&task2).unwrap();

    // Task2 should not be ready while task1 is pending
    assert!(!db.are_dependencies_completed(&task2).unwrap());

    // Complete task1
    db.update_task_result(task1.id, "Done".to_string())
        .unwrap();

    // Now task2 should be ready
    assert!(db.are_dependencies_completed(&task2).unwrap());
}

#[tokio::test]
async fn test_workflow_creation() {
    let db = Arc::new(Database::in_memory().unwrap());
    let queue = Arc::new(TaskQueue::new(db.clone(), 2));
    let executor = WorkflowExecutor::new(db.clone(), queue);

    // Create workflow
    let workflow_id = executor
        .create_workflow("Test Workflow".to_string(), Some("Test description".to_string()))
        .unwrap();

    // Verify workflow exists
    let workflow = db.get_workflow(workflow_id).unwrap().unwrap();
    assert_eq!(workflow.name, "Test Workflow");
    assert_eq!(workflow.status, TaskStatus::Pending);
}

#[tokio::test]
async fn test_workflow_phases() {
    let db = Arc::new(Database::in_memory().unwrap());
    let queue = Arc::new(TaskQueue::new(db.clone(), 2));
    let executor = WorkflowExecutor::new(db.clone(), queue);

    // Create workflow
    let workflow_id = executor
        .create_workflow("Test Workflow".to_string(), None)
        .unwrap();

    // Add phases with dependencies
    executor
        .add_phase(
            workflow_id,
            "phase1".to_string(),
            "Phase 1".to_string(),
            vec![],
        )
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase2".to_string(),
            "Phase 2".to_string(),
            vec!["phase1".to_string()],
        )
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase3".to_string(),
            "Phase 3".to_string(),
            vec!["phase2".to_string()],
        )
        .unwrap();

    // Verify phases
    let phases = db.get_workflow_phases(workflow_id).unwrap();
    assert_eq!(phases.len(), 3);

    // Verify dependencies
    let phase2 = phases.iter().find(|p| p.phase_id == "phase2").unwrap();
    assert_eq!(phase2.depends_on, vec!["phase1".to_string()]);

    // Phase 2 should not be ready yet
    assert!(!db
        .are_phase_dependencies_completed(workflow_id, phase2)
        .unwrap());

    // Complete phase 1
    db.update_phase_status(workflow_id, "phase1", TaskStatus::Completed)
        .unwrap();

    // Now phase 2 should be ready
    assert!(db
        .are_phase_dependencies_completed(workflow_id, phase2)
        .unwrap());
}

#[tokio::test]
async fn test_workflow_tasks() {
    let db = Arc::new(Database::in_memory().unwrap());
    let queue = Arc::new(TaskQueue::new(db.clone(), 2));
    let executor = WorkflowExecutor::new(db.clone(), queue);

    // Create workflow and phase
    let workflow_id = executor
        .create_workflow("Test Workflow".to_string(), None)
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase1".to_string(),
            "Phase 1".to_string(),
            vec![],
        )
        .unwrap();

    // Add tasks to phase
    let task1 = AsyncTask::new(
        "Task 1".to_string(),
        "agent1".to_string(),
        "First task".to_string(),
    );

    let task2 = AsyncTask::new(
        "Task 2".to_string(),
        "agent2".to_string(),
        "Second task".to_string(),
    );

    executor
        .add_phase_task(workflow_id, "phase1".to_string(), task1)
        .unwrap();

    executor
        .add_phase_task(workflow_id, "phase1".to_string(), task2)
        .unwrap();

    // Verify tasks
    let tasks = db.get_workflow_tasks(workflow_id).unwrap();
    assert_eq!(tasks.len(), 2);
    assert!(tasks.iter().all(|t| t.workflow_id == Some(workflow_id)));
    assert!(tasks.iter().all(|t| t.phase_id == Some("phase1".to_string())));
}

#[tokio::test]
async fn test_task_priority_ordering() {
    let db = Arc::new(Database::in_memory().unwrap());

    // Create tasks with different priorities
    let low_task = AsyncTask::new(
        "Low Priority".to_string(),
        "agent".to_string(),
        "Low".to_string(),
    )
    .with_priority(TaskPriority::Low);

    let high_task = AsyncTask::new(
        "High Priority".to_string(),
        "agent".to_string(),
        "High".to_string(),
    )
    .with_priority(TaskPriority::High);

    let critical_task = AsyncTask::new(
        "Critical Priority".to_string(),
        "agent".to_string(),
        "Critical".to_string(),
    )
    .with_priority(TaskPriority::Critical);

    // Insert in reverse priority order
    db.insert_task(&low_task).unwrap();
    db.insert_task(&high_task).unwrap();
    db.insert_task(&critical_task).unwrap();

    // Get pending tasks - should be ordered by priority
    let pending = db.get_pending_tasks(10).unwrap();
    assert_eq!(pending.len(), 3);

    // Critical should be first
    assert_eq!(pending[0].priority, TaskPriority::Critical);
    assert_eq!(pending[1].priority, TaskPriority::High);
    assert_eq!(pending[2].priority, TaskPriority::Low);
}

#[tokio::test]
async fn test_task_logging() {
    let db = Arc::new(Database::in_memory().unwrap());

    let task = AsyncTask::new(
        "Test Task".to_string(),
        "agent".to_string(),
        "Test".to_string(),
    );

    db.insert_task(&task).unwrap();

    // Add logs
    db.add_task_log(task.id, "INFO", "Task started", None)
        .unwrap();
    db.add_task_log(task.id, "DEBUG", "Processing...", None)
        .unwrap();
    db.add_task_log(task.id, "INFO", "Task completed", None)
        .unwrap();

    // Retrieve logs
    let logs = db.get_task_logs(task.id).unwrap();
    assert_eq!(logs.len(), 3);
    assert_eq!(logs[0].1, "INFO");
    assert_eq!(logs[1].1, "DEBUG");
    assert_eq!(logs[2].1, "INFO");
}

#[tokio::test]
async fn test_workflow_status() {
    let db = Arc::new(Database::in_memory().unwrap());
    let queue = Arc::new(TaskQueue::new(db.clone(), 2));
    let executor = WorkflowExecutor::new(db.clone(), queue);

    // Create workflow with phases and tasks
    let workflow_id = executor
        .create_workflow("Test Workflow".to_string(), None)
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase1".to_string(),
            "Phase 1".to_string(),
            vec![],
        )
        .unwrap();

    let task1 = AsyncTask::new(
        "Task 1".to_string(),
        "agent1".to_string(),
        "Test 1".to_string(),
    );
    let task2 = AsyncTask::new(
        "Task 2".to_string(),
        "agent2".to_string(),
        "Test 2".to_string(),
    );

    let task1_id = executor
        .add_phase_task(workflow_id, "phase1".to_string(), task1)
        .unwrap();
    let task2_id = executor
        .add_phase_task(workflow_id, "phase1".to_string(), task2)
        .unwrap();

    // Get workflow status
    let status = executor.get_workflow_status(workflow_id).unwrap();
    assert_eq!(status.total_tasks, 2);
    assert_eq!(status.completed_tasks, 0);

    // Complete one task
    db.update_task_result(task1_id, "Done".to_string())
        .unwrap();

    let status = executor.get_workflow_status(workflow_id).unwrap();
    assert_eq!(status.completed_tasks, 1);

    // Complete second task
    db.update_task_result(task2_id, "Done".to_string())
        .unwrap();

    let status = executor.get_workflow_status(workflow_id).unwrap();
    assert_eq!(status.completed_tasks, 2);
}

#[tokio::test]
async fn test_task_retry() {
    let db = Arc::new(Database::in_memory().unwrap());

    let task = AsyncTask::new(
        "Retryable Task".to_string(),
        "agent".to_string(),
        "Test".to_string(),
    );

    db.insert_task(&task).unwrap();

    // Fail the task
    db.update_task_error(task.id, "Something went wrong".to_string())
        .unwrap();

    let failed_task = db.get_task(task.id).unwrap().unwrap();
    assert_eq!(failed_task.status, TaskStatus::Failed);
    assert!(failed_task.can_retry());

    // Reset to pending for retry
    db.update_task_status(task.id, TaskStatus::Pending)
        .unwrap();

    let retry_task = db.get_task(task.id).unwrap().unwrap();
    assert_eq!(retry_task.status, TaskStatus::Pending);
}

#[tokio::test]
async fn test_phase_tasks_by_phase_id() {
    let db = Arc::new(Database::in_memory().unwrap());
    let queue = Arc::new(TaskQueue::new(db.clone(), 2));
    let executor = WorkflowExecutor::new(db.clone(), queue);

    let workflow_id = executor
        .create_workflow("Test".to_string(), None)
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase1".to_string(),
            "Phase 1".to_string(),
            vec![],
        )
        .unwrap();

    executor
        .add_phase(
            workflow_id,
            "phase2".to_string(),
            "Phase 2".to_string(),
            vec![],
        )
        .unwrap();

    // Add tasks to different phases
    for i in 1..=3 {
        let task = AsyncTask::new(
            format!("Task {}", i),
            "agent".to_string(),
            "Test".to_string(),
        );
        executor
            .add_phase_task(workflow_id, "phase1".to_string(), task)
            .unwrap();
    }

    for i in 4..=5 {
        let task = AsyncTask::new(
            format!("Task {}", i),
            "agent".to_string(),
            "Test".to_string(),
        );
        executor
            .add_phase_task(workflow_id, "phase2".to_string(), task)
            .unwrap();
    }

    // Get tasks by phase
    let phase1_tasks = db.get_phase_tasks(workflow_id, "phase1").unwrap();
    let phase2_tasks = db.get_phase_tasks(workflow_id, "phase2").unwrap();

    assert_eq!(phase1_tasks.len(), 3);
    assert_eq!(phase2_tasks.len(), 2);
}
