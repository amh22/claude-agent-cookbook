# Architecture & Design Decisions

This document explains the design philosophy, patterns, and technical decisions behind the Claude Agent Cookbook.

## Design Philosophy

### 1. Progressive Disclosure

**Principle**: Start simple, reveal complexity gradually.

The cookbook uses progressive disclosure across recipes:

- **SDK Basics** (`agents/00-basics/`): Foundation - streaming, tool autonomy, session tracking
- **Code Review Level 1** (`01-simple.ts`): Application - multi-tool coordination for real analysis
- **Code Review Level 2** (`02-advanced.ts`): Advanced patterns - structured outputs, sub-agents, type safety

**Why this matters**: Overwhelming beginners with advanced patterns upfront leads to confusion. Progressive levels let learners build confidence before tackling complexity.

### 2. Cookbook Metaphor

**Principle**: Practical, ready-to-use examples over abstract concepts.

Like a cooking recipe, each agent:
- Has a clear purpose ("code review", "research", "bookkeeping")
- Shows the complete implementation, not just snippets
- Includes "ingredients" (tools needed) and "steps" (how to run)
- Provides context on when to use it

**Why this matters**: Developers learn best from working examples they can run, modify, and adapt to their needs.

### 3. Real-World Applicability

**Principle**: Every example should solve an actual problem.

No toy examples or contrived scenarios. Each agent addresses a genuine use case:
- Code review: Real need for automated code analysis
- Research: Actual information gathering workflows
- Bookkeeping: Authentic financial data processing

**Why this matters**: Learning feels more valuable when you can immediately apply it to real projects.

## Cookbook Structure

### Directory Organization

```
claude-agent-cookbook/
├── agents/                    # Agent recipes (the "main content")
│   ├── 00-basics/            # Start here! SDK fundamentals
│   │   ├── 01-basic-sdk.ts   # Core concepts: streaming, tools, sessions
│   │   └── README.md
│   ├── code-review/          # One recipe per directory
│   │   ├── 01-simple.ts      # Progressive levels
│   │   ├── 02-advanced.ts
│   │   ├── examples/         # Test data and sample outputs
│   │   │   └── buggy-code.ts
│   │   └── README.md         # Recipe-specific docs
│   ├── research/             # Future recipes...
│   └── ...
├── docs/                      # Cross-cutting documentation
│   ├── getting-started.md    # Setup guide
│   └── architecture.md       # This file
├── .env.example              # Configuration template
└── README.md                 # Cookbook overview
```

**Design decisions**:

1. **Flat agent structure**: Each agent is self-contained. No nested hierarchies that hide recipes.

2. **Numbered levels**: `01-`, `02-`, `03-` prefix makes progression obvious at a glance.

3. **Dedicated READMEs**: Each agent gets its own documentation. Main README stays high-level.

4. **Examples alongside code**: Output examples live with the agent code for easy reference.

5. **Placeholder directories**: Even unimplemented recipes have READMEs showing the roadmap and inviting contributions.

## Agent Architecture

### SDK Basics (`agents/00-basics/`)

**Purpose**: Teach SDK fundamentals before applying them.

**Key Decisions**:

- **Simple task** (file listing): Focuses on SDK patterns, not domain complexity
- **Minimal tools** (`Glob`, `Read`): Reduces cognitive load
- **Rich comments**: Every concept explained inline
- **Visual output**: Emojis (💭, 🔧, ✅) make message types clear
- **Error handling**: Teaches proper error patterns from the start

**Pattern Demonstrated**:
```typescript
for await (const message of query({ ... })) {
  // Streaming messages - the core pattern
}
```

**Note**: Start here before tackling code review agents!

## Code Review Agent Architecture

### Level 1: Simple Code Review (`01-simple.ts`)

**Purpose**: Show real-world application with autonomous multi-tool use.

**Key Decisions**:

- **Permission mode**: `bypassPermissions` demonstrates trust for read-only operations
- **Tool coordination**: Claude chooses which files to read based on Glob results
- **Progress indicators**: Tool counters help users understand agent activity
- **Natural language prompt**: Shows how to guide agent behavior without rigid rules

**Pattern Demonstrated**:
```typescript
allowedTools: ["Read", "Glob", "Grep"],
permissionMode: "bypassPermissions",
```

Claude autonomously:
1. Uses Glob to find source files
2. Reads promising files
3. Greps for specific patterns
4. Combines findings into analysis

### Level 2: Advanced with Structured Output (`02-advanced.ts`)

**Purpose**: Advanced patterns for reliable, type-safe agent systems.

**Key Decisions**:

1. **Structured Output**:
   - JSON schema ensures predictable data format
   - No parsing errors or inconsistent results
   - Enables integration with other systems
   - TypeScript interfaces provide compile-time safety

2. **Sub-Agent Delegation**:
   - Security scanner focuses on specific domain
   - Uses cheaper model (Sonnet) for cost optimization
   - Clear separation of concerns
   - Demonstrates specialization pattern

3. **Organized Results**:
   - Issues grouped by severity (critical → high → medium → low)
   - Human-readable despite structured format
   - Can be both printed and processed programmatically

**Patterns Demonstrated**:
```typescript
// Type-safe structured output
interface ReviewResult {
  issues: Array<{...}>,
  summary: string,
  overallScore: number
}

// JSON schema validation
outputFormat: {
  type: "json_schema",
  schema: reviewSchema,
}

// Sub-agent specialization
agents: {
  "security-scanner": {
    model: "sonnet",  // Cost optimization
    ...
  }
}
```

## Tool Selection Rationale

### Core Tools

**Glob**: Pattern-based file discovery
- Efficient for finding files by extension
- Better than recursive directory traversal
- Respects .gitignore patterns naturally

**Read**: Direct file access
- Essential for content analysis
- Permission-controlled for safety
- Works with any text file format

**Grep**: Code search and pattern matching
- Fast pattern finding
- Better than reading every file
- Regex support for complex patterns

**Task**: Sub-agent delegation
- Enables specialized agents
- Allows parallel execution
- Clear responsibility separation

### Why Not Bash?

The Agent SDK includes a `Bash` tool that can execute arbitrary shell commands. While powerful, it's often better to use structured tools for file operations.

**Why structured tools are preferred for file operations:**

- **Better error handling**: Structured tools return typed errors (file not found, permission denied, etc.) instead of generic exit codes. Claude can respond to specific error types more intelligently.

- **Clearer intent**: `Read("file.ts")` is immediately clear vs `cat file.ts` or `head -n 50 file.ts`. Tool names make agent behavior easier to understand and debug.

- **Safer execution**: No risk of command injection or unintended shell expansion. `Read(userProvidedPath)` is safe; `Bash("cat " + userProvidedPath)` could be exploited.

- **Easier testing**: Deterministic behavior with predictable inputs/outputs. No shell environment dependencies or PATH issues.

**When Bash is the right choice:**

- **Git operations**: `git status`, `git diff`, `git log` - Git's rich CLI is designed for this
- **Running test suites**: `npm test`, `pytest`, `cargo test` - Testing tools expect shell execution
- **Build scripts**: `npm run build`, `make`, `docker build` - Build tools integrate via shell
- **Process management**: Starting/stopping services, checking running processes
- **Environment-specific commands**: System utilities that don't have structured equivalents

**Example comparison:**

```typescript
// ❌ Less clear: Using Bash for file operations
allowedTools: ["Bash"]
// Claude might: "bash: find . -name '*.ts' | xargs grep 'TODO'"
// Hard to parse output, fragile, unclear errors

// ✅ Better: Using structured tools
allowedTools: ["Glob", "Grep"]
// Claude uses: Glob("**/*.ts") then Grep("TODO")
// Clean structured responses, clear errors, easier to track
```

**Rule of thumb**: Use structured tools for file/data operations, Bash for external commands and processes.

## Sub-Agent Design

### Security Scanner Example

**Purpose**: Specialized security vulnerability detection

**Design Decisions**:

1. **Separate agent**: Focused expertise with dedicated prompt
2. **Cheaper model**: Sonnet instead of Opus (narrower scope = acceptable tradeoff)
3. **Limited tools**: Only needs Read, Grep, Glob (no Task recursion)
4. **Clear delegation**: Main agent explicitly hands off via Task tool

**Benefits**:
- Parallel execution potential (though currently sequential)
- Cost optimization ($$ saved by using Sonnet)
- Clear attribution (security findings clearly from security-scanner)
- Reusable (other agents could delegate to security-scanner too)

**Alternative Approaches Considered**:

1. **Single agent with longer prompt**: Simpler but less focused, harder to optimize
2. **Sequential specialized agents**: More thorough but slower and costlier
3. **Multiple parallel sub-agents**: Fastest but complex coordination

**Chosen approach**: Single sub-agent for security balances thoroughness, cost, and simplicity.

## Structured Output Strategy

### JSON Schema Enforcement

```typescript
outputFormat: {
  type: "json_schema",
  schema: reviewSchema,
}
```

**Benefits**:
- **Guaranteed structure**: Claude always returns valid JSON matching schema
- **Type safety**: TypeScript interfaces match schema exactly
- **No parsing errors**: Valid JSON or error, never malformed data
- **Integration ready**: Easy to pipe into APIs, databases, dashboards

**Tradeoffs**:
- **Less flexible**: Can't express nuanced findings outside schema
- **Upfront design**: Must define schema before implementation
- **May constrain Claude**: Complex insights might be forced into simple categories

**When to Use**:
- Building APIs or integrations
- Need reliable data extraction
- Automating downstream processes
- Type safety is important

**When to Skip**:
- Exploratory analysis
- Human-only consumption
- Rapidly changing requirements
- Want maximum expressiveness

### TypeScript Type Safety

```typescript
interface ReviewResult {
  issues: Array<{
    severity: "low" | "medium" | "high" | "critical"
    // ...
  }>
}

// Type-safe access
const result = message.structured_output as ReviewResult
console.log(result.overallScore) // TypeScript knows this exists!
```

Benefits: Compile-time checking, autocomplete, refactoring safety.

## Error Handling Philosophy

### Graceful Degradation

All implementations handle common failures:

1. **Missing API key**: Clear instructions on setup methods (.env file or shell export)
2. **Network failures**: Informative error messages with context
3. **Tool permission denials**: Guidance on fixing permissions
4. **Invalid inputs**: Helpful feedback on correct usage

### Progressive Enhancement

- **SDK Basics**: Basic error catching with console output
- **Code Review Level 1**: User-friendly messages with troubleshooting hints
- **Code Review Level 2**: Comprehensive handling with proper exit codes

**Example**:
```typescript
if (error.message.includes("ANTHROPIC_API_KEY")) {
  console.error("\n💡 Tip: Set your API key using one of these methods:")
  console.error("   1. Create a .env file...")
  console.error("   2. Export in shell...")
}
```

## Cost Optimization Strategies

### Model Selection

- **Opus**: Most capable, highest cost - use for complex analysis
- **Sonnet**: Balanced performance and cost - use for sub-agents
- **Haiku**: Fastest and cheapest - use for simple tasks

**Pattern**: Main agent uses Opus, sub-agents use Sonnet.

### Turn Limits

```typescript
maxTurns: 250
```

Prevents runaway costs while allowing thorough analysis. Adjust based on needs:
- Simple tasks: 50-100 turns
- Complex analysis: 200-300 turns
- Deep research: 500+ turns (watch costs!)

### Permission Modes

```typescript
permissionMode: "bypassPermissions"
```

For read-only operations, auto-approval eliminates back-and-forth:
- Saves turns (fewer messages)
- Faster execution
- Lower cost

**Security note**: Only use for safe operations like file reads.

## Extensibility Points

### Adding New Issue Categories

Extend the ReviewResult interface:

```typescript
interface ReviewResult {
  issues: Array<{
    category: "bug" | "security" | "performance" | "style"
              | "accessibility" | "i18n" | "documentation"
  }>
}
```

Update schema and prompt accordingly.

### Creating New Sub-Agents

```typescript
agents: {
  "performance-analyzer": {
    description: "Find performance bottlenecks",
    prompt: "Focus on O(n²) algorithms, unnecessary re-renders...",
    tools: ["Read", "Grep"],
    model: "sonnet",
  },
  "accessibility-checker": {
    description: "WCAG compliance",
    prompt: "Check for ARIA labels, keyboard navigation...",
    tools: ["Read", "Glob"],
    model: "sonnet",
  }
}
```

### Custom Output Formats

Modify schema for different integrations:
- **SARIF format**: For GitHub code scanning
- **LSP diagnostics**: For IDE integration
- **Metrics dashboard**: Aggregated statistics

## Lessons Learned

### What Worked Well

1. **Progressive complexity**: Learners appreciate the gradual ramp
2. **Structured outputs**: Make agents reliable enough for automation
3. **Sub-agents**: Specialization improves focus and enables optimization
4. **Type safety**: Catches errors early, improves developer experience
5. **Rich comments**: Inline explanations reduce need for separate docs

### What Could Be Improved

1. **Caching**: Repeated file reads could be cached
2. **Parallelization**: Sub-agents could run concurrently
3. **Incremental analysis**: Analyze only changed files for faster feedback
4. **Configuration files**: .reviewrc.json for custom rules
5. **Result persistence**: Store history for trend analysis

### Common Pitfalls

1. **Too many tools**: More tools = more decisions = slower/costlier
   - Solution: Start minimal, add tools as needed

2. **Vague prompts**: Generic requests get generic results
   - Solution: Be specific about expectations and format

3. **Missing schemas**: Freeform output needs parsing logic
   - Solution: Use JSON schemas for structured data needs

4. **Ignoring costs**: Unmonitored usage can get expensive
   - Solution: Set limits, track spending, optimize models

## Future Directions

### Planned Enhancements

1. **More agent recipes**: Research, bookkeeping, documentation, testing
2. **Plugin system**: User-defined custom agents
3. **Configuration files**: Project-specific settings
4. **Result persistence**: SQLite database for history
5. **Web dashboard**: Visual interface for results

### Architecture Evolution

1. **Shared utilities**: Common code extracted into shared/ directory
2. **Testing infrastructure**: Automated tests for each recipe
3. **CI/CD integration**: GitHub Actions examples
4. **Docker support**: Containerized environment for consistency

## Contributing New Recipes

When adding a new agent recipe, consider:

1. **Clear purpose**: What problem does it solve?
2. **Progressive levels**: Can it be taught incrementally?
3. **Real-world applicability**: Is this a genuine use case?
4. **Tool selection**: What's the minimum set of tools needed?
5. **Cost consideration**: How expensive is typical usage?
6. **Documentation**: Recipe README explaining usage and patterns

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## References

- **[Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript)**: Official SDK documentation
- **[Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)**: Writing effective prompts
- **[JSON Schema Specification](https://json-schema.org/)**: Schema syntax reference
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**: Type system reference

---

Questions about architecture decisions? Open an issue on [GitHub](https://github.com/amh22/claude-agent-cookbook/issues)!
