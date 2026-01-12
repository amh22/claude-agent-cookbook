# Contributing to Claude Agent Cookbook

Thank you for your interest in contributing! This cookbook thrives on community contributions - each new recipe helps others learn and build better agents.

## Project Goals

1. **Educational Value**: Teach Claude Agent SDK concepts through practical examples
2. **Portfolio Quality**: Professional code that showcases best practices
3. **Real-World Applicability**: Solve actual problems people face
4. **Community Growth**: Build a comprehensive collection of agent recipes

## Ways to Contribute

### 1. Add a New Agent Recipe ⭐ (Most Valuable!)

New agent implementations are the heart of this cookbook. See [Adding a New Recipe](#adding-a-new-recipe) below for details.

### 2. Improve Existing Recipes

- Enhance documentation and comments
- Add error handling or edge case coverage
- Optimize performance or cost
- Add new features or progressive levels
- Fix bugs

### 3. Improve Documentation

- Fix typos or unclear explanations
- Add more examples or use cases
- Improve getting started guide
- Translate documentation (future)

### 4. Report Issues

- Bug reports with reproduction steps
- Feature requests with clear use cases
- Documentation gaps or confusing sections

### 5. Share Your Experience

- Write about how you used a recipe
- Share modifications you made
- Discuss in GitHub Discussions
- Star the repo if you find it useful! ⭐

## Adding a New Recipe

This is the most valuable contribution! Here's the complete process:

### Step 1: Choose a Use Case

Good agent recipes:
- ✅ Solve a real, common problem
- ✅ Demonstrate unique SDK patterns or tools
- ✅ Can be explained progressively (simple → complex)
- ✅ Have clear success criteria

Examples:
- ✅ Research agent (web search + synthesis)
- ✅ Testing agent (generate test cases)
- ✅ Documentation agent (auto-generate docs)
- ❌ "Hello world" agent (too trivial)
- ❌ "Do anything" agent (too vague)

### Step 2: Plan Your Implementation

Answer these questions:

1. **What problem does it solve?**
   - Be specific: "Generate unit tests from source code"
   - Not vague: "Help with testing"

2. **What tools are needed?**
   - File system: Read, Write, Glob, Grep
   - Web: WebSearch, WebFetch
   - Execution: Bash
   - Delegation: Task

3. **Can it be progressive?**
   - Level 1: Simplest useful version
   - Level 2: Practical with more features
   - Level 3: Production-ready with advanced patterns

4. **What's the output format?**
   - Human-readable text
   - Structured JSON (with schema)
   - Files (generated code, reports)
   - All of the above

5. **Are sub-agents useful?**
   - Could specialized agents help?
   - What would they focus on?

### Step 3: Set Up the Structure

```bash
# Create the agent directory
mkdir -p agents/your-agent-name/examples

# Create the files
touch agents/your-agent-name/01-basic.ts
touch agents/your-agent-name/README.md
touch agents/your-agent-name/examples/sample-output.txt
```

**File structure**:
```
agents/your-agent-name/
├── 01-basic.ts           # Level 1 implementation
├── 02-simple.ts          # Level 2 (optional)
├── 03-advanced.ts        # Level 3 (optional)
├── test-data/            # Sample inputs (if needed)
├── examples/
│   └── sample-output.txt # Example output
└── README.md             # Agent-specific docs
```

### Step 4: Implement the Agent

Use the Code Review Agent as a template:

**01-basic.ts** should include:
```typescript
import { query } from "@anthropic-ai/claude-agent-sdk"

/**
 * Level 1: Basic [Your Agent Name]
 *
 * This example demonstrates:
 * - [Key concept 1]
 * - [Key concept 2]
 * - [Key concept 3]
 *
 * Learn more: [link to relevant docs]
 */

async function main() {
  console.log("🤖 Starting [Your Agent]...\n")

  for await (const message of query({
    prompt: "Your specific task description...",
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob"], // Choose appropriate tools
      maxTurns: 250,
    },
  })) {
    // Handle messages with helpful output
    // Include progress indicators
    // Show costs
  }
}

main().catch((error) => {
  console.error("❌ Error:", error.message)

  // Include helpful API key setup message
  if (error.message.includes("ANTHROPIC_API_KEY")) {
    console.error("\n💡 Tip: Set your API key using one of these methods:")
    // ... (standard error message)
  }

  process.exit(1)
})
```

**Key requirements**:
- ✅ Comprehensive comments explaining WHY, not just WHAT
- ✅ Error handling with helpful messages
- ✅ Progress indicators (emojis welcome!)
- ✅ Cost tracking
- ✅ API key setup guidance
- ✅ Example usage in comments

### Step 5: Write Documentation

**agents/your-agent-name/README.md** should include:

1. **Title and Overview**
   - What it does, why it's useful

2. **The Levels** (if progressive)
   - What each level demonstrates
   - How to run each level
   - What you learn

3. **Example Output**
   - Show what the agent produces
   - Link to sample-output.txt

4. **Use Cases**
   - When to use this agent
   - Real-world applications

5. **Extending This Agent**
   - How to customize
   - Ideas for enhancements

6. **Cost Considerations**
   - Typical costs per run
   - What affects cost

See [agents/code-review/README.md](agents/code-review/README.md) as a template.

### Step 6: Update Main README

Add your recipe to the table in the main [README.md](README.md):

```markdown
| Recipe | Status | Description | Complexity |
|--------|--------|-------------|------------|
| [**Your Agent**](agents/your-agent/) | ✅ **Ready** | Brief description | Progressive (3 levels) |
```

### Step 7: Test Thoroughly

Before submitting:

- [ ] All levels run without errors
- [ ] Error handling works (try without API key, invalid inputs)
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Documentation is clear and complete
- [ ] Sample output matches actual output
- [ ] Costs are reasonable (document if expensive)

### Step 8: Submit Pull Request

```bash
# Create a branch
git checkout -b add-your-agent-recipe

# Commit your changes
git add agents/your-agent-name/
git commit -m "Add [Your Agent] recipe

- Implements 3 progressive levels
- Includes comprehensive documentation
- Demonstrates [key SDK features]"

# Push and create PR
git push origin add-your-agent-recipe
```

**PR Description should include**:
- What the agent does
- Why it's valuable
- Key SDK features it demonstrates
- Any special setup or considerations
- Example output or screenshots

## Code Style Guidelines

### TypeScript

- Use strict mode (already configured)
- Provide type annotations for function parameters
- Use interfaces for structured data
- Prefer `const` over `let`

### Naming

- Files: `kebab-case.ts` for utility files, `01-basic.ts` for levels
- Functions: `camelCase` (e.g., `runCodeReview`)
- Types/Interfaces: `PascalCase` (e.g., `ReviewResult`)
- Constants: `UPPER_SNAKE_CASE` for true constants

### Comments

**DO**: Explain WHY
```typescript
// Use Sonnet for sub-agents to reduce costs
model: "sonnet"
```

**DON'T**: State the obvious
```typescript
// Set model to sonnet
model: "sonnet"
```

**DO**: Add educational context
```typescript
/**
 * Structured output ensures Claude returns valid JSON matching our schema.
 * This eliminates parsing errors and enables type-safe access.
 */
outputFormat: { type: "json_schema", schema: mySchema }
```

### Error Handling

Always include:
- Specific error messages
- Helpful troubleshooting hints
- API key setup reminder if relevant
- Proper exit codes

### Progress Indicators

Use emojis to make output scannable:
- 🤖 Starting/agent actions
- 🔧 Tool usage
- ✅ Success
- ❌ Errors
- 💰 Costs
- 📊 Results

## What Makes a Good PR

### Excellent PRs:

- ✅ Solve a real problem
- ✅ Include comprehensive documentation
- ✅ Have clear, educational comments
- ✅ Follow existing code style
- ✅ Test thoroughly before submitting
- ✅ Keep commits focused and well-described

### Avoid:

- ❌ Major architectural changes without discussion
- ❌ Dependencies beyond what's necessary
- ❌ Changes that break existing recipes
- ❌ Undocumented or poorly commented code
- ❌ Toy examples without real-world value

## Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/claude-agent-cookbook.git
cd claude-agent-cookbook

# Install dependencies
npm install

# Set up API key
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env

# Test existing agents
npx tsx agents/code-review/01-basic.ts
npx tsx agents/code-review/02-simple.ts
npx tsx agents/code-review/03-advanced.ts

# Check TypeScript
npm run typecheck
```

## Testing Checklist

Before submitting, verify:

- [ ] Agent runs successfully with valid inputs
- [ ] Error handling works (try invalid API key, missing files, etc.)
- [ ] All three API key methods work (env file, export, CLI)
- [ ] TypeScript compilation passes
- [ ] Documentation is clear and complete
- [ ] Example output is accurate
- [ ] No secrets or personal data in commits
- [ ] Costs are reasonable and documented

## Need Help?

- **Questions about implementation**: Open an issue with "Question" label
- **Discuss ideas before coding**: Start a GitHub Discussion
- **Stuck on something**: Ask in the PR - we're happy to help!

## Recognition

Contributors will be:
- Listed in commit history (with proper git attribution)
- Mentioned in release notes for their contributions
- Celebrated in the community

Quality contributions, especially new recipes, are highly valued! 🌟

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Ready to contribute?** Start by:
1. Forking the repository
2. Creating a branch
3. Implementing your recipe
4. Submitting a PR

We can't wait to see what you build! 🚀
