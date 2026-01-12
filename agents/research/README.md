# Research Agent (Coming Soon)

## Overview
An AI agent for conducting web research, gathering information from multiple sources, and synthesizing comprehensive reports.

## Planned Features
- Web search and content extraction
- Multi-source information gathering
- Fact verification and source citing
- Structured report generation with markdown output
- Configurable research depth (quick overview vs. deep dive)
- Source credibility assessment

## Use Cases
- Market research and competitive analysis
- Academic literature reviews
- News gathering and summarization
- Due diligence research
- Technical documentation research
- Industry trend analysis

## Implementation Ideas
- **Tools**: WebSearch, WebFetch, Read, Write
- **Output Format**: Markdown reports with citations
- **Sub-agents**:
  - fact-checker: Verify claims across sources
  - synthesizer: Combine findings into coherent narrative
- **Progressive levels**:
  - Level 1: Simple web search and summarization
  - Level 2: Multi-source synthesis with citations
  - Level 3: Deep research with fact-checking and structured reports

## How It Differs from Code Review Agent
- Primarily uses web-based tools (WebSearch, WebFetch) vs. file system tools
- Outputs markdown reports instead of structured issue lists
- Focuses on information gathering and synthesis rather than analysis
- Requires evaluation of source credibility and fact-checking

---

**Want to implement this agent?** See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new recipes!

**Have ideas?** Open an issue on GitHub to discuss the implementation approach.
