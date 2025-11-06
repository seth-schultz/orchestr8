# Claude Code Orchestration System

This is an enterprise-grade orchestration system that enables autonomous end-to-end project completion through hierarchical multi-agent coordination.

## System Architecture

You have access to a hierarchical orchestration system powered by a fast Rust MCP server that uses just-in-time (JIT) agent loading:

```
Claude Code Session
    ↓
MCP Server (Rust) - Stdio-based, zero port conflicts
    ↓
DuckDB Agent Registry - In-memory, <1ms queries
    ↓
/agent-definitions/ Directory - 74 agent definitions, lazy-loaded on demand
    ↓
Meta-Orchestrators (Layer 1) → Specialized Agents (Layer 2) → Workflows (Layer 4)
```

### Layer 1: Meta-Orchestrators
- Use `project-orchestrator` for end-to-end project coordination
- Use `feature-orchestrator` for complete feature development lifecycle
- Use `workflow-coordinator` for cross-agent workflow management

**Agent Discovery:** Meta-orchestrators query the MCP server to discover and load agents dynamically. All agent selection happens through MCP, never direct file access.

### Layer 2: Specialized Agents (JIT Loaded via MCP)

All 74 agents are stored in `/agent-definitions/` and loaded on-demand via MCP when workflows need them:

**Development:** architect, frontend-developer, backend-developer, fullstack-developer, api-designer, database-specialist
**Quality:** code-reviewer, test-engineer, security-auditor, performance-analyzer, accessibility-expert
**DevOps:** ci-cd-engineer, docker-specialist, kubernetes-expert, infrastructure-engineer
**Documentation:** technical-writer, api-documenter, architecture-documenter
**Analysis:** requirements-analyzer, dependency-analyzer, code-archaeologist
**And 49 additional language, framework, and domain specialists**

**JIT Loading Process:**
1. Metadata loaded at startup (<1ms per query via DuckDB)
2. Agent discovered by role/capability (<1ms query)
3. Definition loaded from disk on-demand (<10ms cold, <1ms cached)
4. Cached in LRU (20 agents max in memory simultaneously)
5. Released after use to optimize memory

**Agent Discovery Tools (via MCP):**
- `discover_agents(query)` - Search agents by keyword
- `get_agent_definition(name)` - Get full agent definition JIT
- `discover_agents_by_capability(capability)` - Capability-based search
- `discover_agents_by_role(role)` - Role-based with fallback chain

### Layer 3: Skills
Skills are automatically activated based on context. Available categories: languages, frameworks, tools, practices, domains.

### Layer 4: Workflows
Use slash commands for end-to-end automation: `/new-project`, `/add-feature`, `/refactor`, `/fix-bug`, `/security-audit`, `/optimize-performance`, `/deploy`

Workflows query the MCP server for agents instead of using hardcoded references, ensuring all discovery is dynamic and scalable.

## Core Operating Principles

### 1. Plan-Then-Execute Methodology
**ALWAYS** follow this pattern:
1. **Analyze** requirements thoroughly
2. **Design** solution architecture
3. **Plan** detailed implementation steps
4. **Ask for approval** before coding
5. **Execute** implementation
6. **Validate** at each quality gate
7. **Document** changes

**DO NOT** start coding immediately. Take time to think and plan.

### 2. Orchestration Pattern
For complex tasks:
1. **Decompose** into subtasks
2. **Assign** to specialized agents via Task tool
3. **Execute** agents in parallel when possible
4. **Monitor** progress and dependencies
5. **Synthesize** results
6. **Validate** integration

### 3. Quality Gates
Every change must pass through appropriate gates:
- **Design Gate**: Architecture review, feasibility
- **Implementation Gate**: Code review, style compliance
- **Test Gate**: All tests passing (unit, integration, e2e)
- **Security Gate**: No vulnerabilities, secrets, or compliance issues
- **Performance Gate**: Meets performance requirements
- **Accessibility Gate**: WCAG 2.1 AA compliance (for UI)

### 4. Context Management
**Optimize token usage:**
- Fork context for specialized agents
- Summarize results, don't paste full outputs
- Reference files instead of pasting content
- Keep orchestrator context compact
- Store details in files, not conversation

### 5. Error Handling
**Always be resilient:**
- Implement retry logic with exponential backoff
- Provide graceful degradation
- Have rollback strategies
- Log errors comprehensively
- Recover automatically when possible

## Development Standards

### Code Quality
- Follow SOLID principles
- Write clean, readable, maintainable code
- Use meaningful variable and function names
- Keep functions small and focused
- Minimize complexity (cyclomatic complexity < 10)
- Follow language-specific idioms and best practices

### Testing Requirements
- **Unit Tests**: 80%+ code coverage
- **Integration Tests**: Critical user paths
- **E2E Tests**: Key user journeys
- **Performance Tests**: For critical operations
- Test edge cases and error conditions
- Use TDD when appropriate

### Security Standards
- **Never** commit secrets, API keys, or credentials
- Use environment variables for configuration
- Validate and sanitize all inputs
- Use parameterized queries (prevent SQL injection)
- Implement proper authentication and authorization
- Follow OWASP Top 10 guidelines
- Regular dependency audits
- Principle of least privilege

### Documentation Standards
- **README**: Setup, usage, architecture overview
- **Code Comments**: Why, not what (code explains what)
- **API Documentation**: All public APIs documented
- **Architecture Docs**: Design decisions and rationale
- **Inline Docs**: Complex algorithms explained
- **Examples**: Common use cases demonstrated

### Git Standards
- **Commit Messages**: Follow Conventional Commits
  - `feat:` new features
  - `fix:` bug fixes
  - `docs:` documentation
  - `refactor:` code refactoring
  - `test:` test additions/changes
  - `chore:` maintenance tasks
- **Branch Naming**: `feature/`, `bugfix/`, `hotfix/`, `refactor/`
- **PR Standards**: Description, testing notes, screenshots (for UI)
- **Code Review**: Required before merge

### Performance Standards
- **Web Performance**:
  - Lighthouse score > 90
  - First Contentful Paint < 1.8s
  - Time to Interactive < 3.8s
  - Bundle size monitored
- **API Performance**:
  - Response time < 200ms (p50)
  - Response time < 500ms (p95)
  - Error rate < 0.1%
  - Proper caching strategies
- **Database Performance**:
  - Indexed queries
  - N+1 query prevention
  - Connection pooling
  - Query optimization

### Accessibility Standards
- WCAG 2.1 Level AA compliance
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios (4.5:1 for text)
- Focus indicators
- Error messages accessible

## Orchestration Workflow

### Just-In-Time Agent Loading Flow

All workflows follow this MCP-powered pattern:

```
User: /add-feature "description"
    ↓
Workflow loads: commands/add-feature.md
    ↓
Workflow queries MCP: "I need an architect definition"
    ↓
MCP discovers and loads: agents/development/architect.md (JIT)
    ↓
Workflow invokes @architect with full definition
    ↓
After use: Agent definition released, memory freed
```

This pattern ensures:
- Only needed agents are loaded in context
- Memory usage stays constant regardless of total agents
- Discovery happens in <1ms via DuckDB
- Full definitions loaded in <10ms (cold) or <1ms (cached)

### For Large Projects
```
1. Use `project-orchestrator` agent
2. Provide high-level requirements
3. Orchestrator queries MCP to discover needed agents
4. Orchestrator will:
   - Analyze requirements (requirements-analyzer via MCP)
   - Design architecture (architect via MCP)
   - Decompose into features
   - Coordinate specialized agents (JIT loaded as needed)
   - Validate at each gate
   - Generate documentation
   - Deploy to environment
```

### For New Features
```
1. Use `feature-orchestrator` agent or `/add-feature` command
2. Provide feature description
3. Workflow queries MCP for relevant agents
4. Orchestrator will:
   - Analyze requirements (requirements-analyzer via MCP)
   - Design implementation (architect via MCP)
   - Implement (frontend/backend/fullstack via MCP)
   - Write tests (test-engineer via MCP)
   - Review code (code-reviewer via MCP)
   - Check security (security-auditor via MCP)
   - Update documentation
```

### For Bug Fixes
```
1. Use `/fix-bug` command
2. Provide bug description and reproduction steps
3. Workflow:
   - Reproduce bug
   - Identify root cause (code-archaeologist if needed)
   - Design fix
   - Implement fix
   - Write regression test
   - Validate fix
   - Update docs if needed
```

### For Refactoring
```
1. Use `/refactor` command
2. Specify code to refactor and goals
3. Workflow:
   - Analyze current code
   - Design refactoring strategy
   - Ensure tests exist (write if missing)
   - Refactor incrementally
   - Verify tests still pass
   - Validate no behavior change
   - Update documentation
```

### For Security Audits
```
1. Use `/security-audit` command
2. Workflow:
   - Dependency scanning
   - Static analysis (SAST)
   - Secret detection
   - Code review for vulnerabilities
   - Generate security report
   - Prioritize findings
   - Create remediation plan
```

### For Performance Optimization
```
1. Use `/optimize-performance` command
2. Specify target (frontend, backend, database, etc.)
3. Workflow:
   - Profile current performance
   - Identify bottlenecks
   - Design optimizations
   - Implement changes
   - Benchmark improvements
   - Validate no regressions
   - Document optimizations
```

## Agent Discovery and Invocation

### MCP Agent Discovery (Automatic)

Workflows automatically query the MCP server for agents:
- Query by role: "Give me a system architect"
- Query by capability: "Find agents with Kubernetes expertise"
- Query by keywords: "Search for authentication agents"
- All queries happen through MCP, never direct access

### When to Use Orchestrators
- Complex, multi-step tasks
- Full project lifecycle
- Multiple domain areas
- Requires coordination
- Let orchestrators query MCP for needed agents

### When to Use Specialized Agents
- Single domain task
- Clear, focused goal
- Known requirements
- Parallel execution possible
- Agents are discovered and loaded JIT by orchestrators

### When to Use Skills
- Skills are auto-activated, don't explicitly invoke
- They provide context-specific expertise
- They augment agent capabilities

### When to Use Workflows
- Standardized, repeatable processes
- End-to-end automation
- Quality gates required
- Documentation needed
- Workflows handle all MCP agent discovery automatically

## Anti-Patterns to Avoid

### DO NOT
- ❌ Start coding without a plan
- ❌ Skip quality gates to "move faster"
- ❌ Commit secrets or credentials
- ❌ Write code without tests
- ❌ Ignore security vulnerabilities
- ❌ Skip documentation
- ❌ Merge without code review
- ❌ Deploy without validation
- ❌ Ignore performance issues
- ❌ Violate accessibility standards

### DO
- ✅ Plan thoroughly before executing
- ✅ Use appropriate orchestrators/agents
- ✅ Execute agents in parallel when possible
- ✅ Validate at each quality gate
- ✅ Write comprehensive tests
- ✅ Document decisions and changes
- ✅ Follow security best practices
- ✅ Optimize for performance
- ✅ Ensure accessibility
- ✅ Handle errors gracefully

## Observability

### Logging
- Use structured logging (JSON format)
- Include correlation IDs
- Log levels: DEBUG, INFO, WARN, ERROR
- Log agent invocations and results
- Log quality gate pass/fail

### Monitoring
- Track token usage per task
- Monitor agent execution time
- Measure quality gate success rates
- Track error rates
- Monitor performance metrics

### Tracing
- Trace request flow across agents
- Identify bottlenecks
- Optimize critical paths
- Visualize dependencies

## Emergency Procedures

### Rollback
If something breaks:
1. Identify last known good state
2. Use git to revert changes
3. Rollback database migrations if needed
4. Redeploy previous version
5. Verify rollback success
6. Post-mortem analysis

### Circuit Breaker
If an agent repeatedly fails:
1. Stop using that agent
2. Fallback to alternative approach
3. Log failure details
4. Investigate root cause
5. Fix and re-enable

## Best Practices Summary

1. **Plan first, code later** - Think before acting
2. **Use orchestrators** - For complex, multi-domain tasks
3. **Trust MCP discovery** - Let workflows query MCP for agents, not direct access
4. **Parallelize** - Execute independent agents concurrently (JIT loaded)
5. **Validate constantly** - Quality gates at every step
6. **Optimize context** - Only active agents in memory, definitions lazy-loaded
7. **Test comprehensively** - Unit, integration, e2e, performance
8. **Secure by default** - Security at every layer
9. **Document thoroughly** - For humans and agents
10. **Monitor everything** - Logs, metrics, traces, agent discovery latency

### JIT Loading Best Practices
- Workflows query MCP for agents (automatic, no manual invocation needed)
- Trust the <1ms discovery time (DuckDB-backed)
- Cold agent definitions load in <10ms, cached loads in <1ms
- Memory stays constant: only 20 agents max in memory simultaneously
- Definitions released after use to free memory for other agents

## Getting Started

For new users:
1. Read `ARCHITECTURE.md` for system design
2. Review agent definitions in `agents/`
3. Explore skills in `skills/`
4. Try workflow commands in `commands/`
5. Start with `/new-project` or `/add-feature`

For existing projects:
1. Checkout this repo into `.claude/` directory
2. Customize `CLAUDE.md` for your project
3. Use orchestrators or workflows as needed
4. Extend with custom agents/skills/workflows

## Support

- See `README.md` for detailed documentation
- See `ARCHITECTURE.md` for system design
- Review examples in `examples/` directory
- Check agent documentation in `agents/`
- Explore skill documentation in `skills/`
