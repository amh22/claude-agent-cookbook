# Code Review Agent

Automated code analysis powered by Claude - find bugs, security vulnerabilities, performance issues, and code quality problems.

## Overview

This agent demonstrates **progressive implementation** with two levels, showing the evolution from simple to advanced patterns.

**Prerequisites**: Complete the [SDK Basics tutorial](../00-basics/) first to understand foundational concepts!

### Why Two Levels?

1. **Learn incrementally** - Master practical patterns step-by-step
2. **See the evolution** - Understand how simple agents gain advanced features
3. **Choose your complexity** - Use the level that matches your needs

## The Two Levels

### Level 1: Simple Code Review (`01-simple.ts`)

**Goal**: Build a practical agent that performs real work

**What it does**:
- Reviews code in a specified directory
- Finds bugs, security issues, performance problems
- Uses multiple tools (Read, Glob, Grep) in coordination
- Provides human-readable output

**What you learn**:
- Multi-tool orchestration (Claude decides which tools to use when)
- Permission modes: `bypassPermissions` for auto-approval
- Tool call tracking and progress indicators
- Real-world error handling
- Formatting output for human consumption

**Run it**:
```bash
# Using npm scripts (reviews examples directory with buggy-code.ts)
npm run code-review:simple

# Or review a specific directory
npx tsx agents/code-review/01-simple.ts /path/to/your/code

# Review entire repository
npx tsx agents/code-review/01-simple.ts .
```

**Key Code**:
```typescript
options: {
  allowedTools: ["Read", "Glob", "Grep"],
  permissionMode: "bypassPermissions", // Auto-approve safe operations
}
```

**Estimated cost**: $0.01 - $0.05

---

### Level 2: Advanced with Structured Output (`02-advanced.ts`)

**Goal**: Advanced patterns with type-safe, machine-readable results

**What it does**:
- Performs comprehensive code review
- Returns **structured JSON output** with TypeScript types
- Delegates security analysis to specialized **sub-agent**
- Categorizes issues by severity and type
- Provides specific file locations and fix suggestions

**What you learn**:
- **Structured outputs**: JSON schema validation ensures reliable data format
- **Sub-agent delegation**: Specialized agents for focused tasks
- **Type safety**: TypeScript interfaces for AI responses
- **Production patterns**: Organized results, proper error handling
- **Model optimization**: Using Sonnet for sub-agents to reduce costs

**Run it**:
```bash
# Using npm scripts (reviews examples directory with buggy-code.ts)
npm run code-review:advanced

# Or review a specific directory
npx tsx agents/code-review/02-advanced.ts /path/to/your/code

# Review entire repository
npx tsx agents/code-review/02-advanced.ts .
```

**Key Code**:
```typescript
options: {
  // Structured output with schema validation
  outputFormat: {
    type: "json_schema",
    schema: reviewSchema,
  },

  // Sub-agent for specialized security analysis
  agents: {
    "security-scanner": {
      description: "Deep security analysis",
      prompt: "You are a security expert...",
      tools: ["Read", "Grep", "Glob"],
      model: "sonnet", // Cheaper model for focused task
    }
  }
}
```

**Estimated cost**: $0.03 - $0.10

## Example Output (Level 2)

```
==================================================
🔍 Code Review Agent (Advanced)
📁 Directory: .
==================================================

⚙️  Configuration:
   Model: opus
   Output: Structured JSON
   Sub-agents: security-scanner

🔧 Glob: **/*.ts
🔧 Read: buggy-code.ts
🤖 Delegating to sub-agent: security-scanner
🔧 Grep: "password" in .

✅ Review complete! Cost: $0.0342

==================================================
📊 REVIEW RESULTS
==================================================

Score: 45/100
Issues Found: 5

Summary: Multiple critical issues found including off-by-one errors,
missing type safety, and security vulnerabilities.

🔴 CRITICAL (2)
------------------------------

[bug] buggy-code.ts:2
  Off-by-one error in loop will cause array index out of bounds
  💡 Change `i <= users.length` to `i < users.length`

[security] buggy-code.ts:9
  Sensitive password logged to console, exposing credentials
  💡 Remove console.log or redact sensitive data

🟠 HIGH (2)
------------------------------

[bug] buggy-code.ts:4
  No null check before accessing user.name property
  💡 Add optional chaining: users[i]?.name

[bug] buggy-code.ts:16
  Fetch call lacks error handling for network failures
  💡 Wrap in try-catch block

🟡 MEDIUM (1)
------------------------------

[style] buggy-code.ts:13
  Missing TypeScript type annotation for url parameter
  💡 Add type: `url: string`
```

Full example output: [examples/sample-output.txt](examples/sample-output.txt)

## Testing with buggy-code.ts

The `buggy-code.ts` file contains intentional bugs for testing the agent:

```typescript
function processUsers(users: any) {
  for (let i = 0; i <= users.length; i++) {  // Off-by-one error
    console.log(users[i].name.toUpperCase()) // No null check
  }
}

function connectToDb(password: string) {
  console.log("Connecting with:", password)  // Sensitive data logged
}

async function fetchData(url) {  // Missing type annotation
  const response = await fetch(url)
  return response.json()  // No error handling
}
```

Run any level against this file to see how the agent identifies these issues.

## What Makes This Different?

Traditional static analysis tools follow fixed rules. This agent:

- ✅ **Understands context** - Knows the difference between a real issue and intentional code
- ✅ **Explains problems** - Describes why something is an issue, not just that it is
- ✅ **Suggests fixes** - Provides specific, actionable solutions
- ✅ **Flexible rules** - Can be customized with natural language prompts
- ✅ **Continuous learning** - Benefits from Claude's updates automatically

## Cost Breakdown

| Level | Typical Cost | What Affects Cost |
|-------|--------------|-------------------|
| Level 1 (Simple) | $0.01 - $0.05 | Number of files read |
| Level 2 (Advanced) | $0.03 - $0.10 | Files + sub-agent execution |

**Cost factors**:
- Number of files analyzed
- Code complexity and size
- Model used (Opus is most expensive)
- Number of conversation turns needed

**Cost optimization tips**:
- Use `.gitignore` patterns to exclude `node_modules`, `dist`, etc.
- Start with smaller directories to test
- Use Level 1 for quick checks, Level 2 for thorough analysis with structured output
- Consider Sonnet model for cheaper operation (change `model: "sonnet"`)

## Extending This Agent

### Add New Issue Categories

Modify the schema to include additional categories:

```typescript
category: "bug" | "security" | "performance" | "style" | "accessibility" | "i18n"
```

### Create Custom Sub-Agents

Add specialized agents for specific analysis:

```typescript
agents: {
  "performance-analyzer": {
    description: "Find performance bottlenecks",
    prompt: "Focus on algorithmic complexity and optimization...",
    tools: ["Read", "Grep"],
    model: "sonnet",
  },
  "accessibility-checker": {
    description: "Check WCAG compliance",
    prompt: "Analyze for accessibility issues...",
    tools: ["Read", "Glob"],
    model: "sonnet",
  }
}
```

### Change the Model

Trade cost for speed or quality:

```typescript
model: "haiku",   // Fastest, cheapest
model: "sonnet",  // Balanced
model: "opus",    // Most thorough (default)
```

### Customize the Prompt

Add project-specific rules:

```typescript
prompt: `Review the code for:
1. Bugs and potential crashes
2. Security vulnerabilities
3. Performance issues
4. Code quality improvements
5. Compliance with our style guide (PEP 8 for Python)
6. Use of deprecated APIs

Be specific about file names and line numbers.`
```

### Output to File

Modify Level 2 to save results:

```typescript
import { writeFileSync } from 'fs'

if (result) {
  writeFileSync('review-results.json', JSON.stringify(result, null, 2))
  printResults(result)
}
```

## Integration Ideas

### CI/CD Pipeline
Run Level 2 in GitHub Actions and fail if critical issues found:

```yaml
- name: Run Code Review Agent
  run: npx tsx agents/code-review/02-advanced.ts src
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### Git Pre-commit Hook
Review changed files before commit:

```bash
#!/bin/bash
npx tsx agents/code-review/02-advanced.ts $(git diff --cached --name-only)
```

### IDE Extension
Integrate with your editor for on-demand reviews

### Dashboard
Parse JSON output from Level 2 into a web dashboard showing trends over time

## Troubleshooting

### "No files found"
→ Check the directory path. Use `.` for current directory.

### "Permission denied"
→ Both levels use `bypassPermissions` for read operations. If you see this, check file permissions.

### "Rate limit exceeded"
→ Anthropic API has rate limits. Wait a moment and retry, or reduce the scope.

### "Cost too high"
→ Use Level 1 for quick checks, or switch to Sonnet model: `model: "sonnet"`

### Agent misses obvious issues
→ Try Opus model for better analysis, or make your prompt more specific about what to look for.

## Learn More

- [Back to Cookbook Home](../../README.md)
- [API Key Setup](../../docs/getting-started.md)
- [Architecture Deep Dive](../../docs/architecture.md)
- [Contributing Guide](../../CONTRIBUTING.md)

---

**Questions?** Open an issue on [GitHub](https://github.com/amh22/claude-agent-cookbook/issues)
