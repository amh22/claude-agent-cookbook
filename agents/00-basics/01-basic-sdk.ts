import { query } from "@anthropic-ai/claude-agent-sdk"

/**
 * SDK Basics: Foundational Agent Concepts
 *
 * What this does: Lists files in a directory and describes what it finds.
 *
 * This tutorial demonstrates fundamental concepts that apply to ALL agent types:
 * - Streaming message handling
 * - Tool permissions and selection
 * - Session tracking
 * - Cost monitoring
 *
 * Key Concept: What makes the Agent SDK different?
 * Claude executes tools directly - you don't implement tool logic,
 * just handle the streaming responses as Claude autonomously works.
 *
 * Start here before building any agent - these concepts are universal!
 *
 * Learn more: https://github.com/anthropics/claude-agent-sdk-typescript
 */

async function main() {
  console.log("🤖 Starting Basic Agent Demo\n")

  // The agentic loop: Claude streams messages as it works through the task
  // This is async iteration - messages arrive in real-time as Claude thinks and acts
  for await (const message of query({
    prompt: "What files are in this directory? Briefly describe what you find.",
    options: {
      model: "opus", // or "sonnet" or "haiku" - each has different speed/cost tradeoffs
      allowedTools: ["Glob", "Read"], // Tools Claude can use autonomously
      maxTurns: 250, // Max conversation turns before stopping (prevents runaway costs)
    },
  })) {
    // Handle different message types that stream from Claude

    // SYSTEM messages: Session metadata and initialization
    if (message.type === "system") {
      if (message.subtype === "init") {
        console.log("📋 Session ID:", message.session_id)
        console.log("🛠️  Available tools:", message.tools.join(", "))
        console.log()
      }
    }

    // ASSISTANT messages: Claude's reasoning and tool usage
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("text" in block) {
          // Claude's reasoning and responses
          console.log(`💭 ${block.text}`)
        } else if ("name" in block) {
          // Tool being called (Claude decides when and how to use tools)
          console.log(`🔧 Using tool: ${block.name}`)
        }
      }
    }

    // RESULT messages: Final outcome and cost tracking
    if (message.type === "result") {
      console.log(`\n${message.subtype === "success" ? "✅" : "❌"} Done: ${message.subtype}`)
      console.log(`💰 Cost: $${message.total_cost_usd.toFixed(4)}`)
    }
  }
}

// Run the agent
main().catch((error) => {
  console.error("❌ Error:", error.message)

  // Common errors and solutions
  if (error.message.includes("ANTHROPIC_API_KEY")) {
    console.error("\n💡 Tip: Set your API key using one of these methods:")
    console.error("   1. Create a .env file with: ANTHROPIC_API_KEY=sk-ant-api03-...")
    console.error("   2. Export in shell: export ANTHROPIC_API_KEY=sk-ant-api03-...")
    console.error("   3. Use Anthropic CLI: anthropic configure")
    console.error("\nGet your key at: https://console.anthropic.com/settings/keys")
  }

  process.exit(1)
})
