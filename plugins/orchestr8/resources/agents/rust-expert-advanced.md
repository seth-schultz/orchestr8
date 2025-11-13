---
id: rust-expert-advanced
category: agent
tags: [rust, systems, memory-safety, ownership, borrowing, lifetimes]
capabilities:
  - Advanced ownership and borrowing patterns
  - Lifetime management and elision rules
  - Zero-cost abstractions and performance optimization
  - Smart pointer patterns (Box, Rc, Arc, RefCell)
useWhen:
  - Rust projects requiring complex lifetime annotations beyond elision rules with multiple borrowed references and struct lifetime parameters
  - Systems programming demanding zero-cost abstractions with smart pointers (Box<T>, Rc<T>, Arc<T>, RefCell<T>) for ownership sharing patterns
  - Performance-critical code optimization using iterator monomorphization, const evaluation, #[inline] attributes, and LLVM-friendly patterns validated by cargo bench
  - Solving ownership compilation errors involving move semantics, borrow checker violations, or designing builder patterns with ownership transfer
  - Implementing memory-safe abstractions over unsafe code for FFI, low-level operations, or performance hotspots with documented safety invariants
  - Designing concurrent Rust applications with Arc<Mutex<T>> patterns, RAII resource management, and thread-safe reference counting
estimatedTokens: 680
---

# Rust Advanced Expertise

## Ownership Patterns

**Ownership rules:**
```rust
// Rule 1: Each value has one owner
let s = String::from("hello"); // s owns the string

// Rule 2: Transfer ownership (move)
let s2 = s; // s is invalid, s2 now owns

// Rule 3: Value dropped when owner out of scope
{
    let s3 = String::from("world");
} // s3 dropped here
```

**Borrowing patterns:**
```rust
// Immutable borrow (many allowed)
let s = String::from("data");
let r1 = &s;
let r2 = &s; // OK - multiple immutable

// Mutable borrow (exclusive)
let mut s = String::from("data");
let r = &mut s; // Only one mutable borrow
// let r2 = &mut s; // ERROR

// Borrow scope ends at last use
let mut s = String::from("data");
let r1 = &s;
println!("{}", r1); // r1 last use
let r2 = &mut s; // OK - r1 no longer used
```

## Lifetime Management

**Lifetime elision rules:**
```rust
// Explicit lifetime
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

// Elided (compiler infers)
fn first_word(s: &str) -> &str {
    &s[..1]
}

// Struct with lifetimes
struct Excerpt<'a> {
    part: &'a str,
}

impl<'a> Excerpt<'a> {
    fn announce(&self) -> &str { // elided
        self.part
    }
}
```

**'static lifetime:**
```rust
// String literals have 'static lifetime
let s: &'static str = "I live forever";

// Leak to create 'static
let s: &'static str = Box::leak(Box::new(String::from("leaked")));
```

## Smart Pointers

**Box<T> - heap allocation:**
```rust
// Recursive types require Box
enum List {
    Cons(i32, Box<List>),
    Nil,
}

// Large stack → heap
let big_data = Box::new([0u8; 1_000_000]);
```

**Rc<T> - reference counting:**
```rust
use std::rc::Rc;

let data = Rc::new(vec![1, 2, 3]);
let data2 = Rc::clone(&data); // cheap clone
let data3 = Rc::clone(&data);

println!("refs: {}", Rc::strong_count(&data)); // 3
```

**Arc<T> - atomic reference counting:**
```rust
use std::sync::Arc;
use std::thread;

let data = Arc::new(vec![1, 2, 3]);
let data_clone = Arc::clone(&data);

thread::spawn(move || {
    println!("{:?}", data_clone); // thread-safe
});
```

**RefCell<T> - interior mutability:**
```rust
use std::cell::RefCell;

let data = RefCell::new(vec![1, 2, 3]);
data.borrow_mut().push(4); // runtime borrow check

// Combine with Rc for shared mutable
use std::rc::Rc;
let shared = Rc::new(RefCell::new(5));
*shared.borrow_mut() += 1;
```

## Zero-Cost Abstractions

**Iterators (compile to loops):**
```rust
// High-level (zero overhead)
let sum: i32 = (1..100)
    .filter(|x| x % 2 == 0)
    .map(|x| x * 2)
    .sum();

// Monomorphization eliminates overhead
fn process<T: Iterator<Item = i32>>(iter: T) -> i32 {
    iter.sum() // specialized at compile time
}
```

**Generic specialization:**
```rust
// Generic
fn print<T: std::fmt::Display>(val: T) {
    println!("{}", val);
}

// Monomorphized to separate functions:
// print_i32(i32), print_String(String), etc.
```

## Memory Layout Control

**repr directives:**
```rust
#[repr(C)] // C-compatible layout
struct CCompat {
    x: u32,
    y: u16,
}

#[repr(packed)] // No padding
struct Packed {
    x: u8,
    y: u32, // misaligned!
}

#[repr(align(16))] // Force alignment
struct Aligned {
    data: [u8; 16],
}
```

## Common Patterns

**RAII (Resource Acquisition Is Initialization):**
```rust
struct File {
    handle: std::fs::File,
}

impl Drop for File {
    fn drop(&mut self) {
        // Automatic cleanup
        println!("Closing file");
    }
}

// File closed automatically
{
    let f = File { handle: /* ... */ };
} // drop() called here
```

**Builder pattern with ownership:**
```rust
struct Config {
    host: String,
    port: u16,
}

struct ConfigBuilder {
    host: Option<String>,
    port: Option<u16>,
}

impl ConfigBuilder {
    fn new() -> Self {
        Self { host: None, port: None }
    }

    fn host(mut self, host: String) -> Self {
        self.host = Some(host);
        self // move ownership back
    }

    fn port(mut self, port: u16) -> Self {
        self.port = Some(port);
        self
    }

    fn build(self) -> Result<Config, String> {
        Ok(Config {
            host: self.host.ok_or("host required")?,
            port: self.port.ok_or("port required")?,
        })
    }
}

// Usage
let config = ConfigBuilder::new()
    .host("localhost".to_string())
    .port(8080)
    .build()?;
```

## Performance Tips

✅ Use `&str` over `String` when possible (no allocation)
✅ Prefer iterators over manual loops (LLVM optimization)
✅ Clone only when necessary (use borrowing)
✅ Use `Cow<str>` for conditional cloning
✅ Profile with `cargo bench` before optimizing
✅ Leverage compile-time evaluation with `const`
✅ Use `#[inline]` for hot path functions
✅ Avoid unnecessary allocations (reuse buffers)

## Unsafe Guidelines

```rust
unsafe {
    // ONLY use when:
    // 1. Interfacing with C
    // 2. Implementing low-level abstractions
    // 3. Performance critical (proven by profiling)

    // ALWAYS maintain invariants
    // DOCUMENT why it's safe
}

// Safe abstraction over unsafe
pub fn get_unchecked(slice: &[i32], idx: usize) -> i32 {
    assert!(idx < slice.len()); // maintain safety invariant
    unsafe { *slice.get_unchecked(idx) }
}
```

## Modular Loading

This is the advanced module of the Rust expert agent:

**Core Module:** `orchestr8://agents/rust-expert-core` (~700 tokens)
- Essential Rust concepts for most development tasks
- Ownership, borrowing, basic lifetimes, traits, concurrency
- Load this first for typical Rust projects

**Advanced Module:** `orchestr8://agents/rust-expert-advanced` (~680 tokens - this module)
- Complex ownership patterns and lifetime management
- Smart pointers (Box, Rc, Arc, RefCell)
- Zero-cost abstractions and performance optimization
- Memory layout control and unsafe code
- Builder patterns with ownership transfer
- RAII resource management

**When to Load Advanced:**
- Debugging complex borrow checker errors
- Implementing shared ownership patterns
- Performance optimization requiring deep understanding
- FFI or unsafe code integration
- Advanced concurrent programming with Arc/Mutex patterns
- Custom memory layout requirements

**Progression Path:**
1. Start with core module for foundational knowledge
2. Load advanced when encountering complex ownership scenarios
3. Reference both modules for comprehensive Rust expertise
