# Documentation Agent (Coming Soon)

## Overview
An AI agent for automatically generating documentation from code, creating READMEs, API documentation, and keeping docs synchronized with code changes.

## Planned Features
- README generation from codebase analysis
- API documentation from code comments and function signatures
- Code example generation
- Documentation gap detection
- Changelog generation from git history
- Inline comment suggestions
- Documentation consistency checking

## Use Cases
- Generate README files for new projects
- Create API documentation for libraries
- Update outdated documentation
- Generate code examples and tutorials
- Document legacy codebases
- Maintain changelog files
- Create contributing guidelines

## Implementation Ideas
- **Tools**: Read, Glob, Grep, Write, Bash (for git operations)
- **Output Format**: Markdown files (README.md, API.md, etc.)
- **Analysis Approach**:
  - Parse code structure and exports
  - Extract JSDoc/docstring comments
  - Identify public APIs vs internal code
  - Analyze git history for changes
- **Progressive levels**:
  - Level 1: Basic README from package.json and file structure
  - Level 2: API docs from function signatures and comments
  - Level 3: Full documentation suite with examples and tutorials

## How It Differs from Code Review Agent
- Creates new documentation instead of analyzing for issues
- Focuses on public APIs and user-facing docs
- Outputs markdown files rather than structured findings
- Needs to understand code structure and purpose
- May integrate with git history for changelogs

## Example Output Structure
```
docs/
├── README.md           # Project overview
├── API.md              # API reference
├── GETTING_STARTED.md  # Tutorial
├── EXAMPLES.md         # Code examples
└── CHANGELOG.md        # Version history
```

---

**Want to implement this agent?** See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new recipes!

**Have ideas?** Open an issue on GitHub to discuss the implementation approach.
