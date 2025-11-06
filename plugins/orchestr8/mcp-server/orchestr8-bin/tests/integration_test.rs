/*!
 * Integration tests for orchestr8-bin MCP server
 */

use serde_json::{json, Value};
use std::io::{BufRead, BufReader, Write};
use std::process::{Command, Stdio};
use std::time::Duration;

#[test]
fn test_mcp_initialize() {
    let mut child = Command::new("./target/release/orchestr8-bin")
        .arg("--root")
        .arg("/Users/seth/Projects/orchestr8")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start server");

    let stdin = child.stdin.as_mut().expect("Failed to open stdin");
    let stdout = child.stdout.take().expect("Failed to open stdout");
    let reader = BufReader::new(stdout);

    // Send initialize request
    let request = json!({
        "jsonrpc": "2.0",
        "method": "initialize",
        "params": {},
        "id": 1
    });

    writeln!(stdin, "{}", request.to_string()).expect("Failed to write request");
    stdin.flush().expect("Failed to flush");

    // Read response
    let mut lines = reader.lines();
    if let Some(Ok(line)) = lines.next() {
        let response: Value = serde_json::from_str(&line).expect("Failed to parse response");

        assert_eq!(response["jsonrpc"], "2.0");
        assert_eq!(response["id"], 1);
        assert!(response["result"].is_object());
        assert_eq!(response["result"]["serverInfo"]["name"], "orchestr8-mcp-server");
    } else {
        panic!("No response received");
    }

    child.kill().expect("Failed to kill server");
}

#[test]
fn test_mcp_agent_query() {
    let mut child = Command::new("./target/release/orchestr8-bin")
        .arg("--root")
        .arg("/Users/seth/Projects/orchestr8")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start server");

    let stdin = child.stdin.as_mut().expect("Failed to open stdin");
    let stdout = child.stdout.take().expect("Failed to open stdout");
    let reader = BufReader::new(stdout);

    // Send query request
    let request = json!({
        "jsonrpc": "2.0",
        "method": "agents/query",
        "params": {
            "context": "react",
            "limit": 5
        },
        "id": 2
    });

    writeln!(stdin, "{}", request.to_string()).expect("Failed to write request");
    stdin.flush().expect("Failed to flush");

    // Read response
    let mut lines = reader.lines();
    if let Some(Ok(line)) = lines.next() {
        let response: Value = serde_json::from_str(&line).expect("Failed to parse response");

        assert_eq!(response["jsonrpc"], "2.0");
        assert_eq!(response["id"], 2);
        assert!(response["result"].is_object());
        assert!(response["result"]["agents"].is_array());
    } else {
        panic!("No response received");
    }

    child.kill().expect("Failed to kill server");
}

#[test]
fn test_mcp_health() {
    let mut child = Command::new("./target/release/orchestr8-bin")
        .arg("--root")
        .arg("/Users/seth/Projects/orchestr8")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::null())
        .spawn()
        .expect("Failed to start server");

    let stdin = child.stdin.as_mut().expect("Failed to open stdin");
    let stdout = child.stdout.take().expect("Failed to open stdout");
    let reader = BufReader::new(stdout);

    // Wait for startup
    std::thread::sleep(Duration::from_millis(100));

    // Send health check
    let request = json!({
        "jsonrpc": "2.0",
        "method": "health",
        "params": {},
        "id": 3
    });

    writeln!(stdin, "{}", request.to_string()).expect("Failed to write request");
    stdin.flush().expect("Failed to flush");

    // Read response
    let mut lines = reader.lines();
    if let Some(Ok(line)) = lines.next() {
        let response: Value = serde_json::from_str(&line).expect("Failed to parse response");

        assert_eq!(response["jsonrpc"], "2.0");
        assert_eq!(response["id"], 3);
        assert_eq!(response["result"]["status"], "healthy");
        assert!(response["result"]["uptime_ms"].is_number());
        assert!(response["result"]["memory_mb"].is_number());
    } else {
        panic!("No response received");
    }

    child.kill().expect("Failed to kill server");
}
