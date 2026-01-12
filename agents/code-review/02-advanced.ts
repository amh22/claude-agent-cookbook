import { query, AgentDefinition } from "@anthropic-ai/claude-agent-sdk"

/**
 * Level 3: Full-Featured Code Review Agent
 *
 * Advanced features demonstrated:
 * - Structured JSON output with schema validation
 * - TypeScript type safety for AI responses
 * - Sub-agent delegation for specialized tasks
 * - Organized result presentation
 * - CLI argument handling
 *
 * This shows production-ready patterns for building reliable agents
 * with predictable, parseable outputs that can integrate with other systems.
 *
 * Key Learning: Structured Outputs
 * Using JSON schemas ensures Claude returns data in a specific format,
 * making it reliable for automation, APIs, and integrations.
 *
 * Key Learning: Sub-Agents
 * Specialized agents (like security-scanner) can focus on specific tasks,
 * potentially using different models for cost/performance optimization.
 */

// TypeScript interface for type-safe review results
// This ensures we can work with the AI's output safely in our code
interface ReviewResult {
  issues: Array<{
    severity: "low" | "medium" | "high" | "critical"
    category: "bug" | "security" | "performance" | "style"
    file: string
    line?: number
    description: string
    suggestion?: string
  }>
  summary: string
  overallScore: number // 0-100
}

// JSON Schema enforces output structure
// Claude will ALWAYS return data matching this schema, no parsing errors!
const reviewSchema = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
          category: { type: "string", enum: ["bug", "security", "performance", "style"] },
          file: { type: "string" },
          line: { type: "number" },
          description: { type: "string" },
          suggestion: { type: "string" },
        },
        required: ["severity", "category", "file", "description"],
      },
    },
    summary: { type: "string" },
    overallScore: { type: "number" },
  },
  required: ["issues", "summary", "overallScore"],
}

async function runCodeReview(directory: string): Promise<ReviewResult | null> {
  console.log(`\n${"=".repeat(50)}`)
  console.log(`🔍 Code Review Agent (Advanced)`)
  console.log(`📁 Directory: ${directory}`)
  console.log(`${"=".repeat(50)}\n`)

  console.log("⚙️  Configuration:")
  console.log(`   Model: opus`)
  console.log(`   Output: Structured JSON`)
  console.log(`   Sub-agents: security-scanner\n`)

  let result: ReviewResult | null = null

  for await (const message of query({
    prompt: `Perform a thorough code review of ${directory}.

Analyze all source files for:
1. Bugs and potential runtime errors
2. Security vulnerabilities
3. Performance issues
4. Code quality and maintainability

Be specific with file paths and line numbers where possible.`,
    options: {
      model: "opus",
      allowedTools: ["Read", "Glob", "Grep", "Task"],
      permissionMode: "bypassPermissions",
      maxTurns: 250,

      // Structured output: ensures consistent, parseable responses
      // This is crucial for production systems that need reliable data
      outputFormat: {
        type: "json_schema",
        schema: reviewSchema,
      },

      // Sub-agents: specialized agents for focused tasks
      // The security-scanner uses a cheaper model (sonnet) since it has
      // a narrower scope than the main agent
      agents: {
        "security-scanner": {
          description: "Deep security analysis for vulnerabilities",
          prompt: `You are a security expert. Scan for:
- Injection vulnerabilities (SQL, XSS, command injection)
- Authentication and authorization flaws
- Sensitive data exposure (passwords, API keys in code)
- Insecure dependencies
- Missing input validation`,
          tools: ["Read", "Grep", "Glob"],
          model: "sonnet", // Sub-agents can use different models for cost optimization
        } as AgentDefinition,
      },
    },
  })) {
    // Progress updates - show what the agent is doing
    if (message.type === "assistant") {
      for (const block of message.message.content) {
        if ("name" in block) {
          if (block.name === "Task") {
            // Task tool is used to delegate to sub-agents
            const subagentType = (block.input as any).subagent_type
            console.log(`🤖 Delegating to sub-agent: ${subagentType}`)
          } else {
            // Show tool usage with human-readable context
            console.log(`🔧 ${block.name}: ${getToolSummary(block)}`)
          }
        }
      }
    }

    // Final structured result - type-safe access to Claude's analysis
    if (message.type === "result") {
      if (message.subtype === "success" && message.structured_output) {
        // Type-safe! TypeScript knows this matches ReviewResult interface
        result = message.structured_output as ReviewResult
        console.log(`\n✅ Review complete! Cost: $${message.total_cost_usd.toFixed(4)}`)
      } else {
        console.log(`\n❌ Review failed: ${message.subtype}`)
      }
    }
  }

  return result
}

/**
 * Extracts human-readable summary from tool input
 * Helps users understand what the agent is doing in real-time
 */
function getToolSummary(block: any): string {
  const input = block.input || {}
  switch (block.name) {
    case "Read":
      return input.file_path || "file"
    case "Glob":
      return input.pattern || "pattern"
    case "Grep":
      return `"${input.pattern}" in ${input.path || "."}`
    case "Bash":
      return input.command || input.cmd || ""
    default:
      return ""
  }
}

/**
 * Pretty-prints the structured review results
 * Groups issues by severity and shows them in order of importance
 */
function printResults(result: ReviewResult) {
  console.log(`\n${"=".repeat(50)}`)
  console.log(`📊 REVIEW RESULTS`)
  console.log(`${"=".repeat(50)}\n`)

  console.log(`Score: ${result.overallScore}/100`)
  console.log(`Issues Found: ${result.issues.length}\n`)
  console.log(`Summary: ${result.summary}\n`)

  // Group issues by severity for better readability
  const byCategory = {
    critical: result.issues.filter((i) => i.severity === "critical"),
    high: result.issues.filter((i) => i.severity === "high"),
    medium: result.issues.filter((i) => i.severity === "medium"),
    low: result.issues.filter((i) => i.severity === "low"),
  }

  // Print issues by severity (most critical first)
  for (const [severity, issues] of Object.entries(byCategory)) {
    if (issues.length === 0) continue

    const icon =
      severity === "critical" ? "🔴" :
      severity === "high" ? "🟠" :
      severity === "medium" ? "🟡" : "🟢"

    console.log(`\n${icon} ${severity.toUpperCase()} (${issues.length})`)
    console.log("-".repeat(30))

    for (const issue of issues) {
      const location = issue.line ? `${issue.file}:${issue.line}` : issue.file
      console.log(`\n[${issue.category}] ${location}`)
      console.log(`  ${issue.description}`)
      if (issue.suggestion) {
        console.log(`  💡 ${issue.suggestion}`)
      }
    }
  }
}

// CLI entry point
async function main() {
  const directory = process.argv[2] || "."

  const result = await runCodeReview(directory)

  if (result) {
    printResults(result)
  } else {
    console.error("\n❌ No results returned")
    process.exit(1)
  }
}

main().catch((error) => {
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
