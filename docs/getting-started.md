# Getting Started with Claude Agent Cookbook

This guide will get you up and running with the Claude Agent Cookbook in under 5 minutes.

## Prerequisites

Before you begin, make sure you have:

- **Node.js** version 18.0.0 or higher ([download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **An Anthropic API key** (free to create - [get one here](https://console.anthropic.com/settings/keys))
- **A code editor** (VS Code, Cursor, or your preferred editor)

### Check Your Node Version

```bash
node --version
# Should show v18.0.0 or higher
```

If you need to upgrade Node.js, visit [nodejs.org](https://nodejs.org/) or use a version manager like [nvm](https://github.com/nvm-sh/nvm).

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/claude-agent-cookbook.git
cd claude-agent-cookbook
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@anthropic-ai/claude-agent-sdk` - The core agent framework
- `typescript` - For type checking
- `tsx` - For running TypeScript files directly

## API Key Setup

⚠️ **Critical Step**: You need an Anthropic API key to run any agent.

### Get Your API Key

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in (it's free to start)
3. Navigate to [Settings > API Keys](https://console.anthropic.com/settings/keys)
4. Click "Create Key"
5. Copy your key (starts with `sk-ant-api03-...`)

### Choose Your Setup Method

Pick ONE of the following three methods based on your workflow:

---

## Method 1: Environment File (.env)

**✅ Recommended for**: Development, local experimentation

**Pros**: Persistent, automatic, works with all tools

**Setup**:

```bash
# 1. Copy the example file
cp .env.example .env

# 2. Edit .env file and add your key
# (Use any text editor)
```

Edit `.env` to look like this:

```bash
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Optional: Configure model (default: opus)
# MODEL=opus

# Optional: Max conversation turns (default: 250)
# MAX_TURNS=250
```

**Run an agent**:

```bash
# The .env file is loaded automatically
npx tsx agents/code-review/01-basic.ts
```

**Security Note**: The `.env` file is already in `.gitignore` to prevent accidental commits.

---

## Method 2: Shell Export

**✅ Recommended for**: Temporary sessions, CI/CD, testing

**Pros**: No files to manage, session-specific, easy cleanup

**Setup**:

```bash
# Export for current terminal session
export ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Verify it's set
echo $ANTHROPIC_API_KEY
```

**Run an agent**:

```bash
# Works immediately in the same terminal
npx tsx agents/code-review/01-basic.ts
```

**Notes**:
- Only works in the current terminal session
- Must re-export if you close the terminal
- Good for CI/CD pipelines and scripts

**Make it permanent** (optional):

Add to your shell config file:

```bash
# For bash: ~/.bashrc or ~/.bash_profile
# For zsh: ~/.zshrc
echo 'export ANTHROPIC_API_KEY=sk-ant-api03-your-key-here' >> ~/.zshrc

# Reload your shell config
source ~/.zshrc
```

---

## Method 3: Anthropic CLI

**✅ Recommended for**: Global configuration, multiple projects

**Pros**: Persistent across projects, managed by official tool

**Setup**:

```bash
# 1. Install Anthropic CLI globally
npm install -g @anthropic-ai/sdk

# 2. Configure your API key
anthropic configure

# 3. Follow the interactive prompts:
# - Enter your API key when prompted
# - Press Enter to confirm
```

The CLI stores your key securely in your home directory.

**Run an agent**:

```bash
# Works automatically with configured key
npx tsx agents/code-review/01-basic.ts
```

**Notes**:
- Key is stored in `~/.anthropic/config`
- Works across all projects on your machine
- Can be updated anytime with `anthropic configure`

---

## Verify Your Setup

Test that everything works:

```bash
npx tsx agents/code-review/01-basic.ts
```

Expected output:

```
🤖 Starting Basic Agent Demo

📋 Session ID: abc123...
🛠️  Available tools: Glob, Read

💭 I'll list the files in the current directory...
🔧 Using tool: Glob
...
✅ Done: success
💰 Cost: $0.0023
```

If you see this, you're all set! 🎉

## Troubleshooting

### Error: "ANTHROPIC_API_KEY environment variable not set"

**Problem**: Your API key isn't configured

**Solutions**:
1. Check that your `.env` file exists and contains your key
2. Verify the export with `echo $ANTHROPIC_API_KEY`
3. Make sure you're in the correct directory
4. Try a different method from above

### Error: "Invalid API key"

**Problem**: Your key is incorrect or expired

**Solutions**:
1. Get a new key from [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Check for typos (keys start with `sk-ant-api03-`)
3. Ensure no extra spaces or quotes around the key

### Error: "Module not found: @anthropic-ai/claude-agent-sdk"

**Problem**: Dependencies not installed

**Solution**:
```bash
npm install
```

### Error: "node: command not found"

**Problem**: Node.js not installed

**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Permission errors when reading files

**Problem**: Agent trying to read restricted files

**Solutions**:
- The agents use `bypassPermissions` mode for read operations
- Check file system permissions: `ls -la`
- Try running in a different directory

## Security Best Practices

### ✅ DO:
- Use environment variables for API keys
- Keep your `.env` file local (it's in `.gitignore`)
- Rotate your API keys periodically
- Use separate keys for development and production
- Set usage limits in the Anthropic Console

### ❌ DON'T:
- Commit `.env` files to git
- Hardcode API keys in source code
- Share API keys in screenshots or logs
- Use production keys for testing
- Post API keys in public forums or issues

## What's Next?

Now that you're set up, explore the agents:

### Start Learning
1. **[Code Review Agent](../agents/code-review/README.md)** - Three progressive levels teaching SDK concepts
2. Run Level 1 to understand basics: `npx tsx agents/code-review/01-basic.ts`
3. Progress to Level 2 for multi-tool coordination
4. Master Level 3 with structured outputs and sub-agents

### Experiment
- Modify prompts to change agent behavior
- Try different models: `opus`, `sonnet`, `haiku`
- Add custom tools or sub-agents
- Test on your own codebases

### Contribute
- Add a new agent recipe
- Improve documentation
- Report bugs or suggest features

See [CONTRIBUTING.md](../CONTRIBUTING.md) for details.

## Additional Resources

- **[Main README](../README.md)** - Overview of all recipes
- **[Architecture Guide](./architecture.md)** - Design decisions and patterns
- **[Code Review Agent](../agents/code-review/README.md)** - Detailed guide to the featured recipe
- **[Claude Agent SDK Docs](https://github.com/anthropics/claude-agent-sdk-typescript)** - Official SDK documentation
- **[Anthropic API Docs](https://docs.anthropic.com/)** - API reference

## Need Help?

- **Bug reports**: [Open an issue](https://github.com/yourusername/claude-agent-cookbook/issues)
- **Questions**: Start a [discussion](https://github.com/yourusername/claude-agent-cookbook/discussions)
- **Feature requests**: Open an issue with "Feature Request" label

---

Happy building! 🚀
