# Testing Agent (Coming Soon)

## Overview
An AI agent for generating test cases, identifying edge cases, analyzing test coverage, and suggesting improvements to test suites.

## Planned Features
- Unit test generation from source code
- Edge case identification
- Test coverage analysis and gap detection
- Test data generation (fixtures, mocks)
- Integration test suggestions
- Flaky test detection
- Test quality assessment

## Use Cases
- Generate tests for untested code
- Improve test coverage for legacy code
- Identify missing edge cases
- Create test data and fixtures
- Review existing test quality
- Suggest integration test scenarios
- Generate property-based tests

## Implementation Ideas
- **Tools**: Read, Glob, Grep, Write, Bash (to run existing tests)
- **Output Format**: Test files matching project's framework (Jest, Mocha, pytest, etc.)
- **Analysis Approach**:
  - Detect testing framework from package.json/requirements.txt
  - Analyze function signatures and types
  - Identify boundary conditions and edge cases
  - Parse existing tests to understand patterns
  - Run tests to identify failures
- **Progressive levels**:
  - Level 1: Simple unit test generation for pure functions
  - Level 2: Edge case identification and parametrized tests
  - Level 3: Integration tests, mocks, and coverage analysis

## How It Differs from Code Review Agent
- Generates new test files instead of analyzing for issues
- Focuses on testability and edge cases
- Outputs executable test code
- Needs to understand testing frameworks
- Must match existing project test patterns
- May need to run tests to validate generated code

## Example Test Generation
```typescript
// Input: Source function
function divide(a: number, b: number): number {
  return a / b
}

// Output: Generated tests
describe('divide', () => {
  it('should divide two positive numbers', () => {
    expect(divide(10, 2)).toBe(5)
  })

  it('should handle negative numbers', () => {
    expect(divide(-10, 2)).toBe(-5)
  })

  it('should handle division by zero', () => {
    expect(() => divide(10, 0)).toThrow()
  })

  it('should handle floating point results', () => {
    expect(divide(5, 2)).toBeCloseTo(2.5)
  })
})
```

---

**Want to implement this agent?** See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines on adding new recipes!

**Have ideas?** Open an issue on GitHub to discuss the implementation approach.
