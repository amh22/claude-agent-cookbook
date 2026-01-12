import { query } from "@anthropic-ai/claude-agent-sdk"

/**
 * Level 2: Simple Code Review Agent
 *
 * Builds on Level 1 by:
 * - Implementing a practical use case (code review)
 * - Using multiple tools in coordination (Read, Glob, Grep)
 * - Bypassing permissions for read-only operations
 * - Formatting output for human consumption
 *
 * This demonstrates how Claude autonomously orchestrates multiple tools
 * to accomplish a complex task without explicit programming of the logic.
 *
 * Key Learning: Permission Modes
 * - "bypassPermissions": Auto-approve safe operations (like file reads)
 * - "prompt": Ask user to approve each operation (more secure but slower)
 * - Default: Requires approval for potentially dangerous operations
 */

async function reviewCode(directory: string) {
  console.log(`\n${"=".repeat(50)}`)
  console.log(`🔍 Code Review Agent (Simple)`)
  console.log(`📁 Directory: ${directory}`)
  console.log(`${"=".repeat(50)}\n`)

  let toolCallCount = 0

  for await (const message of query({
    prompt: `Review the code in ${directory} for:
1. Bugs and potential crashes
2. Security vulnerabilities
3. Performance issues
4. Code quality improvements

Be specific about file names and line numbers when you find issues.`,
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob", "Grep"],
      // Permission mode: auto-approve safe read operations
      // In production with sensitive code, you might want "prompt" for manual approval
      permissionMode: "bypassPermissions",
      maxTurns: 250,
    },
  })) {
    // Show Claude's analysis as it happens (real-time feedback)
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("text" in block) {
          // Show reasoning and findings
          console.log(block.text)
        } else if ("name" in block) {
          // Show tool usage (helps track progress)
          toolCallCount++
          console.log(`\n[Tool ${toolCallCount}] ${block.name}`)
        }
      }
    }

    // Show completion status
    if (message.type === "result") {
      console.log(`\n${"=".repeat(50)}`)
      if (message.subtype === "success") {
        console.log(`✅ Review complete!`)
        console.log(`🔧 Tools used: ${toolCallCount}`)
        console.log(`💰 Cost: $${message.total_cost_usd.toFixed(4)}`)
      } else {
        console.log(`❌ Review failed: ${message.subtype}`)
      }
      console.log(`${"=".repeat(50)}`)
    }
  }
}

// Main execution
const directory = process.argv[2] || "."
reviewCode(directory).catch((error) => {
  console.error("\n❌ Error:", error.message)

  if (error.message.includes("ANTHROPIC_API_KEY")) {
    console.error("\n💡 Tip: Set your API key using one of these methods:")
    console.error("   1. Create a .env file with: ANTHROPIC_API_KEY=sk-ant-api03-...")
    console.error("   2. Export in shell: export ANTHROPIC_API_KEY=sk-ant-api03-...")
    console.error("   3. Use Anthropic CLI: anthropic configure")
    console.error("\nGet your key at: https://console.anthropic.com/settings/keys")
  }

  process.exit(1)
})
