# SDK Basics

**Start here!** These foundational tutorials teach core Claude Agent SDK concepts that apply to ALL agent types.

## Why Start Here?

Whether you're building a code review agent, research agent, or any other type, you'll use these same patterns:
- How to handle streaming messages
- How tools work
- How to track costs
- How to handle errors

Master these concepts once, use them everywhere.

## Tutorial

### 01-basic-sdk.ts

**What it does**: Lists files in a directory and describes what it finds.

**What you'll learn**:
- The agentic loop pattern (`for await (const message of query(...))`)
- Message types: `system`, `assistant`, `result`
- How Claude autonomously uses tools
- Real-time streaming and progress
- Session tracking and cost monitoring

**Run it**:
```bash
# Using npm scripts
npm run basics:sdk

# Or directly with tsx
npx tsx agents/00-basics/01-basic-sdk.ts
```

**Expected output**:
```
🤖 Starting Basic Agent Demo

📋 Session ID: abc123...
🛠️  Available tools: Glob, Read

💭 I'll list the files in the current directory...
🔧 Using tool: Glob
💭 I found several directories and files...
🔧 Using tool: Read

✅ Done: success
💰 Cost: $0.0023
```

## Next Steps

Once you understand these basics, explore the agent recipes:

1. **[Code Review Agent](../code-review/)** - Two levels showing practical code analysis
2. **[Research Agent](../research/)** - Coming soon
3. **[Bookkeeping Agent](../bookkeeping/)** - Coming soon
4. **[Documentation Agent](../documentation/)** - Coming soon
5. **[Testing Agent](../testing/)** - Coming soon

## Key Takeaways

### The Agentic Loop
```typescript
for await (const message of query({
  prompt: "Your task here...",
  options: { ... }
})) {
  // Handle messages as they stream
}
```

This pattern is the foundation of every agent. Claude streams messages as it works, and you handle them in real-time.

### Message Types

- **`system`**: Initialization, session info
- **`assistant`**: Claude's thinking and tool usage
- **`result`**: Final outcome, costs, success/failure

### Tool Autonomy

You don't tell Claude which tools to use or when. You just:
1. Define available tools
2. Give Claude a task
3. Handle the streaming results

Claude figures out the rest!

---

**Questions?** Check the [Getting Started Guide](../../docs/getting-started.md) or [Architecture Docs](../../docs/architecture.md)
