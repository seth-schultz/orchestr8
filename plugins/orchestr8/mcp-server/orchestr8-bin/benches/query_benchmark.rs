/*!
 * Performance benchmarks for agent queries
 */

use criterion::{black_box, criterion_group, criterion_main, Criterion, BenchmarkId};
use orchestr8_bin::{Database, AgentMetadata, AgentQueryParams};
use std::path::PathBuf;
use tempfile::tempdir;

fn create_test_db() -> (Database, PathBuf) {
    let dir = tempdir().unwrap();
    let db_path = dir.path().join("bench.duckdb");
    let db = Database::new(&db_path).unwrap();
    db.initialize_schema().unwrap();

    // Create sample agents
    let mut agents = Vec::new();
    for i in 0..100 {
        agents.push(AgentMetadata {
            name: format!("agent-{}", i),
            description: format!("Test agent {} for React and TypeScript development", i),
            model: if i % 10 == 0 { "sonnet".to_string() } else { "haiku".to_string() },
            capabilities: vec!["react".to_string(), "typescript".to_string(), "testing".to_string()],
            plugin: format!("plugin-{}", i % 5),
            role: Some(format!("role-{}", i % 10)),
            fallbacks: None,
            use_when: Some("building web applications".to_string()),
            file_path: format!("/path/agent-{}.md", i),
        });
    }

    db.index_agents(&agents).unwrap();

    (db, dir.into_path())
}

fn bench_query_by_role(c: &mut Criterion) {
    let (db, _dir) = create_test_db();

    c.bench_function("query_by_role", |b| {
        b.iter(|| {
            let params = AgentQueryParams {
                context: None,
                role: Some("role-5".to_string()),
                capability: None,
                limit: Some(10),
            };
            let results = db.query_agents(black_box(&params)).unwrap();
            black_box(results);
        });
    });
}

fn bench_query_by_capability(c: &mut Criterion) {
    let (db, _dir) = create_test_db();

    c.bench_function("query_by_capability", |b| {
        b.iter(|| {
            let params = AgentQueryParams {
                context: None,
                role: None,
                capability: Some("react".to_string()),
                limit: Some(10),
            };
            let results = db.query_agents(black_box(&params)).unwrap();
            black_box(results);
        });
    });
}

fn bench_query_by_context(c: &mut Criterion) {
    let (db, _dir) = create_test_db();

    c.bench_function("query_by_context", |b| {
        b.iter(|| {
            let params = AgentQueryParams {
                context: Some("web development".to_string()),
                role: None,
                capability: None,
                limit: Some(10),
            };
            let results = db.query_agents(black_box(&params)).unwrap();
            black_box(results);
        });
    });
}

fn bench_query_combined(c: &mut Criterion) {
    let (db, _dir) = create_test_db();

    c.bench_function("query_combined", |b| {
        b.iter(|| {
            let params = AgentQueryParams {
                context: Some("React".to_string()),
                role: Some("role-5".to_string()),
                capability: Some("typescript".to_string()),
                limit: Some(10),
            };
            let results = db.query_agents(black_box(&params)).unwrap();
            black_box(results);
        });
    });
}

fn bench_query_various_limits(c: &mut Criterion) {
    let (db, _dir) = create_test_db();
    let mut group = c.benchmark_group("query_limits");

    for limit in [1, 5, 10, 25, 50].iter() {
        group.bench_with_input(BenchmarkId::from_parameter(limit), limit, |b, &limit| {
            b.iter(|| {
                let params = AgentQueryParams {
                    context: Some("React".to_string()),
                    role: None,
                    capability: None,
                    limit: Some(limit),
                };
                let results = db.query_agents(black_box(&params)).unwrap();
                black_box(results);
            });
        });
    }

    group.finish();
}

criterion_group!(
    benches,
    bench_query_by_role,
    bench_query_by_capability,
    bench_query_by_context,
    bench_query_combined,
    bench_query_various_limits
);

criterion_main!(benches);
