# Claude Agent Cookbook

> **Practical, ready-to-use recipes for building AI agents with the Claude Agent SDK**

A growing collection of agent implementations demonstrating different use cases, patterns, and techniques for building autonomous AI agents with Claude. Each "recipe" is a complete, working example you can learn from and adapt to your needs.

## What is This?

Think of this as a cookbook for AI agents - instead of food recipes, you get code recipes. Each agent demonstrates how to solve a specific problem using the Claude Agent SDK, from simple file operations to complex multi-agent orchestration.

Unlike traditional code examples that just show API calls, these agents are **fully autonomous** - you give them a task, and Claude figures out which tools to use, how to use them, and returns structured results. No manual tool orchestration needed.

## What Makes Agent SDK Different?

**Claude executes tools directly** - You don't implement tool logic or build execution loops. Just define what tools are available, and Claude autonomously decides when and how to use them.

**Built-in agentic behavior** - Claude naturally breaks down tasks, uses tools in sequence, and adjusts its approach based on results.

**Streaming by design** - Watch Claude work in real-time as it thinks, calls tools, and builds toward the solution.

**Production-ready tools** - File operations, search, web access, shell commands, and sub-agent delegation included out of the box.

## Available Recipes

| Recipe | Status | Description | Complexity |
|--------|--------|-------------|------------|
| [**Code Review**](agents/code-review/) | ✅ **Ready** | Automated code analysis for bugs, security, performance | Progressive (3 levels) |
| [**Research**](agents/research/) | 🔜 Coming Soon | Web research and information synthesis | - |
| [**Bookkeeping**](agents/bookkeeping/) | 🔜 Coming Soon | Financial data processing and expense tracking | - |
| [**Documentation**](agents/documentation/) | 🔜 Coming Soon | Auto-generate docs from code | - |
| [**Testing**](agents/testing/) | 🔜 Coming Soon | Generate test cases and identify edge cases | - |

Want to add a new recipe? See [Contributing](#contributing)!

## Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** (comes with Node.js)
- **Anthropic API key** ([get one free](https://console.anthropic.com/settings/keys))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/claude-agent-cookbook.git
cd claude-agent-cookbook

# Install dependencies
npm install

# Set up your API key (see next section)
```

## API Key Setup

⚠️ **Important**: You need an Anthropic API key to run these agents.

Choose one of these three methods:

### Method 1: Environment File (Recommended for Development)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your key
# ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

### Method 2: Shell Export (Good for Temporary Sessions)

```bash
# Export for current terminal session
export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here

# Then run any agent
npx tsx agents/code-review/01-basic.ts
```

### Method 3: Anthropic CLI (Persistent Configuration)

```bash
# Install Anthropic CLI globally
npm install -g @anthropic-ai/sdk

# Configure your API key (will be saved)
anthropic configure

# Follow prompts to enter your API key
```

**Security Best Practices:**
- ✅ Never commit your `.env` file to git (already in `.gitignore`)
- ✅ Never hardcode API keys in source code
- ✅ Use environment variables or secure vaults in production
- ❌ Don't share your API key publicly

**Get your API key**: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)

## Featured Recipe: Code Review Agent

The **Code Review Agent** is a fully-implemented example showing three levels of complexity:

### Level 1: Basic SDK Usage
Learn fundamental concepts - streaming, tools, session tracking

```bash
npx tsx agents/code-review/01-basic.ts
```

**What you learn**: Message streams, tool permissions, cost monitoring

### Level 2: Simple Code Review
Build a practical agent with multi-tool orchestration

```bash
npx tsx agents/code-review/02-simple.ts [directory]
```

**What you learn**: Permission modes, autonomous tool coordination, real-time progress

### Level 3: Advanced with Structured Output
Production-ready patterns with JSON schemas and sub-agents

```bash
npx tsx agents/code-review/03-advanced.ts [directory]
```

**What you learn**: Structured outputs, sub-agent delegation, type-safe results

### Example Output

```
==================================================
🔍 Code Review Agent (Advanced)
📁 Directory: .
==================================================

🔧 Glob: **/*.ts
🔧 Read: example.ts
🤖 Delegating to sub-agent: security-scanner
🔧 Grep: "password" in .

✅ Review complete! Cost: $0.0342

==================================================
📊 REVIEW RESULTS
==================================================

Score: 45/100
Issues Found: 5

🔴 CRITICAL (2)
------------------------------

[bug] example.ts:2
  Off-by-one error in loop condition
  💡 Change `i <= users.length` to `i < users.length`

[security] example.ts:9
  Sensitive password logged to console
  💡 Remove console.log or redact sensitive data
```

See the [Code Review Agent README](agents/code-review/README.md) for full documentation.

## Project Structure

```
claude-agent-cookbook/
├── agents/
│   ├── code-review/         # ✅ Fully implemented (3 progressive levels)
│   │   ├── 01-basic.ts
│   │   ├── 02-simple.ts
│   │   ├── 03-advanced.ts
│   │   ├── example.ts       # Test code with intentional bugs
│   │   ├── examples/
│   │   │   └── sample-output.txt
│   │   └── README.md
│   │
│   ├── research/            # 🔜 Web research and synthesis
│   ├── bookkeeping/         # 🔜 Financial data processing
│   ├── documentation/       # 🔜 Auto-generate docs
│   └── testing/             # 🔜 Test case generation
│
├── docs/
│   ├── getting-started.md   # Detailed setup guide
│   └── architecture.md      # Design decisions and patterns
│
├── .env.example             # API key template
├── .gitignore               # Includes Cursor IDE support
├── LICENSE                  # MIT License
├── CONTRIBUTING.md          # How to add new recipes
└── README.md                # You are here
```

## What You'll Learn

Across the cookbook recipes, you'll learn:

### SDK Fundamentals
- Streaming message handling and real-time progress
- Tool permission modes (bypass, prompt, restricted)
- Cost tracking and session management
- Error handling patterns

### Advanced Patterns
- Structured outputs with JSON schemas (type-safe AI responses!)
- Sub-agent orchestration for specialized tasks
- Multi-tool coordination strategies
- Model selection for cost/performance tradeoffs

### Production Practices
- TypeScript type safety with AI
- Organized result presentation
- CLI argument handling
- Graceful error handling and user feedback

### Real-World Applications
- Code analysis workflows
- Information gathering and synthesis
- Data processing pipelines
- Automation and tooling

## Cost Considerations

Each agent run costs approximately:

- **Level 1 (Basic)**: $0.001 - $0.005 (simple queries)
- **Level 2 (Simple)**: $0.01 - $0.05 (multi-tool tasks)
- **Level 3 (Advanced)**: $0.03 - $0.10 (with sub-agents)

Costs depend on:
- Number of files/sources analyzed
- Complexity of the task
- Model used (Opus > Sonnet > Haiku)
- Number of conversation turns

💡 **Tip**: Start with Sonnet or Haiku for cheaper experimentation, use Opus for production quality.

## IDE Support

This cookbook works great with:
- ✅ **Cursor** - AI-powered editor (`.cursor/` in `.gitignore`)
- ✅ **VS Code** - Popular choice for TypeScript
- ✅ **Any editor** - Standard TypeScript project

## Contributing

We'd love your contributions! Here's how you can help:

### Add a New Recipe
The most valuable contribution! See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

Quick steps:
1. Create `agents/your-agent-name/` directory
2. Implement your agent (progressive levels encouraged)
3. Add README explaining the recipe
4. Update this main README to list your recipe
5. Submit a pull request

### Improve Existing Recipes
- Enhance documentation
- Add error handling
- Optimize performance
- Add new features or levels

### Report Issues or Ideas
- Found a bug? Open an issue
- Have an idea for a new recipe? Start a discussion
- Want to improve docs? PRs welcome!

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## Resources

### Documentation
- **[Getting Started Guide](docs/getting-started.md)** - Detailed setup with all 3 API key methods
- **[Architecture Guide](docs/architecture.md)** - Design decisions and patterns explained
- **[Contributing Guide](CONTRIBUTING.md)** - How to add new agent recipes

### External Resources
- **Claude Agent SDK**: [github.com/anthropics/claude-agent-sdk-typescript](https://github.com/anthropics/claude-agent-sdk-typescript)
- **Anthropic API Docs**: [docs.anthropic.com](https://docs.anthropic.com/)
- **Claude Console**: [console.anthropic.com](https://console.anthropic.com/)
- **Get API Key**: [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
- **TypeScript Handbook**: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)

## Troubleshooting

### "ANTHROPIC_API_KEY environment variable not set"
→ Follow the [API Key Setup](#api-key-setup) section above

### "Module not found: @anthropic-ai/claude-agent-sdk"
→ Run `npm install`

### "Permission denied" when running agents
→ Some operations require approval. Use `permissionMode: "bypassPermissions"` for read-only operations, or manually approve prompts.

### TypeScript errors
→ Run `npm run typecheck` to see detailed errors

## License

MIT License - see [LICENSE](LICENSE) file for details.

Feel free to use these recipes in your own projects, commercial or otherwise!

## Author

**Andrew Henry** - [GitHub Profile](https://github.com/yourusername)

## Acknowledgments

- Built with [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-typescript) by Anthropic
- Inspired by the [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- Inspired by ["The Complete Guide to Building Agents"](https://x.com/dabit3/status/2009131298250428923) by [Nader Dabit](https://x.com/dabit3)
- Educational approach influenced by progressive disclosure learning principles

---

**Found this helpful?** Star the repo ⭐ and share with others!

**Questions or feedback?** Open an issue or start a discussion on [GitHub](https://github.com/yourusername/claude-agent-cookbook/issues)
