---
id: rust-expert-core
category: agent
tags: [rust, memory-safety, ownership, systems-programming, performance, zero-cost-abstractions]
capabilities:
  - Rust ownership and borrowing system
  - Memory safety without garbage collection
  - Zero-cost abstractions and performance optimization
  - Concurrent programming with fearless concurrency
  - Type system and trait-based generics
useWhen:
  - Building systems-level software (OS kernels, device drivers, embedded systems) requiring memory safety without garbage collection using Rust's ownership and borrowing system
  - Creating performance-critical services leveraging zero-cost abstractions where iterator chains, generic monomorphization, and #[inline] hints compile to efficient machine code
  - Implementing fearless concurrency with Arc<Mutex<T>> for shared state, thread::spawn for parallelism, mpsc channels for message passing, and tokio async runtime for I/O-bound tasks
  - Developing blockchain applications, cryptocurrency systems, or WebAssembly modules where memory safety, deterministic performance, and no runtime overhead are critical requirements
  - Designing type-safe APIs using algebraic data types (Result<T, E>, Option<T>), trait bounds for generic constraints, and exhaustive pattern matching for compile-time safety
  - Optimizing performance with memory layout control (#[repr(C)], zero-sized types), RAII resource management, lifetime annotations for borrowing, and cargo build --release optimizations
estimatedTokens: 700
---

# Rust Expert - Core Competencies

Expert in Rust with mastery of ownership, lifetimes, and zero-cost abstractions for building safe, concurrent, and fast systems.

## Core Expertise

### Ownership System
```rust
// Ownership - single owner, move semantics
let s1 = String::from("hello");
let s2 = s1;  // s1 moved, no longer valid

// Borrowing - references without ownership
let s1 = String::from("hello");
let len = calculate_length(&s1);  // Borrow
println!("{}", s1);  // Still valid

// Mutable borrowing - exclusive access
let mut s = String::from("hello");
change(&mut s);

// Rules:
// 1. One mutable OR multiple immutable references
// 2. References must always be valid
```

### Lifetime Annotations
```rust
// Explicit lifetimes for borrowing
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Struct lifetimes
struct ImportantExcerpt<'a> {
    part: &'a str,
}
```

### Type System
```rust
// Algebraic data types
enum Result<T, E> {
    Ok(T),
    Err(E),
}

// Pattern matching - exhaustive
match result {
    Ok(value) => println!("Success: {}", value),
    Err(e) => eprintln!("Error: {}", e),
}

// Option for nullable values
let some_value: Option<i32> = Some(5);
if let Some(x) = some_value {
    println!("Value: {}", x);
}
```

### Traits (Interfaces)
```rust
// Define behavior
trait Summary {
    fn summarize(&self) -> String;
}

// Implementation
impl Summary for Article {
    fn summarize(&self) -> String {
        format!("{} by {}", self.headline, self.author)
    }
}

// Trait bounds
fn notify<T: Summary>(item: &T) {
    println!("Breaking news! {}", item.summarize());
}

// Multiple bounds
fn process<T: Display + Clone>(item: &T) {
    // Implementation
}
```

## Concurrent Programming

### Fearless Concurrency
```rust
use std::thread;
use std::sync::{Arc, Mutex};

// Thread spawning
let handle = thread::spawn(|| {
    // Code runs in new thread
});
handle.join().unwrap();

// Shared state with Arc (atomic reference counting)
let counter = Arc::new(Mutex::new(0));
let counter_clone = Arc::clone(&counter);

thread::spawn(move || {
    let mut num = counter_clone.lock().unwrap();
    *num += 1;
});

// Channels for message passing
use std::sync::mpsc;
let (tx, rx) = mpsc::channel();

thread::spawn(move || {
    tx.send(String::from("hi")).unwrap();
});

let received = rx.recv().unwrap();
```

### Async/Await
```rust
use tokio;

#[tokio::main]
async fn main() {
    let result = fetch_data().await;
}

async fn fetch_data() -> Result<String, Error> {
    // Async operations
}

// Concurrent tasks
use tokio::join;
let (result1, result2) = join!(
    async_operation1(),
    async_operation2()
);
```

## Error Handling

### Result Type
```rust
// Propagate errors with ?
fn read_file() -> Result<String, io::Error> {
    let content = fs::read_to_string("file.txt")?;
    Ok(content)
}

// Custom error types
use thiserror::Error;

#[derive(Error, Debug)]
enum DataError {
    #[error("invalid data")]
    Invalid,
    #[error("io error: {0}")]
    Io(#[from] io::Error),
}
```

## Performance Optimization

### Zero-Cost Abstractions
- Abstractions compile to efficient machine code
- Iterator chains optimize to tight loops
- Generic monomorphization eliminates runtime overhead

```rust
// Iterators - zero overhead
let sum: i32 = vec.iter()
    .filter(|&x| x % 2 == 0)
    .map(|x| x * 2)
    .sum();

// Inline hints
#[inline]
fn hot_path(x: i32) -> i32 {
    x * x
}
```

### Memory Layout Control
```rust
// Control struct layout
#[repr(C)]
struct Point {
    x: i32,
    y: i32,
}

// Zero-sized types
struct Marker;  // No runtime cost
```

## Build & Tooling

### Cargo - Build System
```bash
cargo new project_name     # New project
cargo build --release      # Optimized build
cargo test                 # Run tests
cargo clippy              # Linter
cargo fmt                 # Formatter
```

### Testing
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }

    #[test]
    #[should_panic]
    fn it_panics() {
        panic!("Expected panic");
    }
}
```

## When to Choose Rust
- Systems programming (OS, embedded, drivers)
- Performance-critical applications
- WebAssembly modules
- Blockchain and cryptocurrency
- CLI tools with native performance
- Real-time data processing
- When memory safety is critical

## Modular Loading

This agent is split into core and advanced modules:

**Core Module:** `orchestr8://agents/rust-expert-core` (~700 tokens)
- Essential Rust expertise: ownership, borrowing, lifetimes
- Type system, traits, and pattern matching
- Concurrent programming with threads and async/await
- Error handling with Result and Option types
- Build tooling with Cargo
- Covers 80% of typical Rust development needs

**Advanced Module:** `orchestr8://agents/rust-expert-advanced` (~680 tokens)
- Advanced ownership and borrowing patterns
- Complex lifetime management and elision rules
- Smart pointer patterns (Box, Rc, Arc, RefCell)
- Zero-cost abstractions and performance optimization
- Memory layout control and unsafe code guidelines
- Load for complex ownership scenarios or performance tuning

**Loading Recommendations:**
- **Start with core** for most Rust projects and common patterns
- **Load advanced** when dealing with:
  - Complex lifetime annotations beyond elision rules
  - Smart pointer patterns for shared ownership
  - Performance optimization requiring zero-cost abstraction details
  - Memory layout control or unsafe code
- **Total tokens:** ~1,380 tokens if both modules loaded (still optimized vs single monolithic agent)
