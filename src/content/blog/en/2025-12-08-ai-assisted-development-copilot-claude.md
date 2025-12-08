---
title: "AI-Assisted Development: How GitHub Copilot and Claude Transformed My Workflow"
description: "My real experience using GitHub Copilot, Claude, and other AI tools for development. Patterns, effective prompts, and how to maximize productivity without sacrificing quality."
date: "2025-12-08"
tags: ["ai", "github-copilot", "claude", "developer-tools", "productivity", "vibe-coding"]
author: "Marco Di Dionisio"
slug: "ai-assisted-development-copilot-claude"
featured: true
---

A year ago, I was skeptical about AI tools for coding. "Just glorified autocomplete," I thought. Today, GitHub Copilot and Claude are an integral part of my daily workflow. This post documents my journey and lessons learned.

## The Mindset Shift

The most common mistake is seeing AI as a developer replacement. Reality is different:

```text
❌ Expectation: "AI writes all the code for me"
✅ Reality: "AI is an expert copilot that accelerates my work"

❌ Expectation: "I can copy and paste without understanding"
✅ Reality: "I need to understand and validate every suggestion"

❌ Expectation: "It works the same for everything"
✅ Reality: "Different tools for different tasks"
```

## My Current AI Stack

### GitHub Copilot: The Code Companion

Copilot shines at immediate implementation tasks:

```typescript
// I write a descriptive comment...
// Function to validate email with regex supporting international domains

// Copilot suggests:
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// But if I need more robustness, I refine the comment:
// Function to validate email per RFC 5322, supporting unicode characters in domain

function validateEmailRFC5322(email: string): boolean {
  const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return emailRegex.test(email);
}
```

**Where Copilot excels:**

- ✅ Completing repetitive patterns
- ✅ Generating boilerplate
- ✅ Unit tests based on implementation
- ✅ JSDoc documentation
- ✅ Code following project conventions

### Claude: The Architect and Mentor

Claude (especially with Claude Code in VS Code) is my tool for tasks requiring deeper reasoning:

**Architecture review:**

```text
Prompt: "Review this folder structure for a React project with 
micro-frontends. Identify potential scalability issues and suggest 
improvements based on current best practices."

[paste the structure]
```

**Complex debugging:**

```text
Prompt: "This component has a memory leak that only appears after 
10+ navigations. The useEffect has cleanup but something persists. 
Here's the complete component code and the hooks it uses..."

[paste relevant code]
```

**Refactoring with context:**

```text
Prompt: "I need to migrate this class component to functional 
component with hooks. Keep the same public API but improve error 
handling and add support for request cancellation."
```

## Vibe Coding: The Art of Prompt Engineering

The term "vibe coding" perfectly captures how I work with AI. It's not just writing prompts, it's establishing an effective communication flow.

### Effective Prompt Patterns

**1. Context → Task → Constraints**

```text
❌ "Make a login form"

✅ "Context: React application with TypeScript, using React Hook Form 
and Zod for validation. Styling with Tailwind CSS.

Task: Create a login form with email and password.

Constraints:
- Client-side validation before submit
- Show inline errors
- Loading state during submit
- Accessible (WCAG 2.1 AA)
- No additional libraries"
```

**2. Input/Output examples**

```text
✅ "Generate a hook for debounce. 

Usage example:
const debouncedSearch = useDebounce(searchTerm, 300);

useEffect(() => {
  if (debouncedSearch) {
    fetchResults(debouncedSearch);
  }
}, [debouncedSearch]);

The hook should:
- Be generic (work with any type)
- Clean up timeout on unmount
- Allow manually canceling the debounce"
```

**3. Guided iteration**

```text
Initial prompt: "Create a table component with sorting"
[review the result]

Follow-up: "Good, but I need the sorting to be multi-column 
and persist in URL params"
[review]

Refinement: "Perfect. Now add virtualization to handle 
10k+ rows without performance issues"
```

### My Vibe Coding Workflow

```text
1. DEFINE - Write what I need in natural language
2. GENERATE - AI produces a first version
3. EVALUATE - Critically review the code
4. REFINE - Request specific changes or manually adjust
5. INTEGRATE - Adapt to my project context
6. VALIDATE - Tests and final review
```

## Real Use Cases

### Case 1: Generating Tests

One of the most valuable applications. Copilot understands the implementation and generates relevant tests:

```typescript
// My implementation
export function calculateDiscount(
  price: number,
  discountPercent: number,
  maxDiscount?: number
): number {
  const discount = price * (discountPercent / 100);
  const finalDiscount = maxDiscount 
    ? Math.min(discount, maxDiscount) 
    : discount;
  return Math.round((price - finalDiscount) * 100) / 100;
}

// I write: "// Tests for calculateDiscount"
// Copilot generates:

describe('calculateDiscount', () => {
  it('should calculate basic percentage discount', () => {
    expect(calculateDiscount(100, 10)).toBe(90);
  });

  it('should handle decimal prices', () => {
    expect(calculateDiscount(99.99, 15)).toBe(84.99);
  });

  it('should apply max discount cap', () => {
    expect(calculateDiscount(1000, 50, 100)).toBe(900);
  });

  it('should not apply cap when discount is lower', () => {
    expect(calculateDiscount(100, 10, 50)).toBe(90);
  });

  it('should handle zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('should handle 100% discount', () => {
    expect(calculateDiscount(100, 100)).toBe(0);
  });
});
```

### Case 2: Automatic Documentation

```typescript
// I select the function and ask Claude:
// "Generate complete JSDoc documentation including examples"

/**
 * Calculates the final price after applying a percentage discount.
 * 
 * @param price - The original price before discount
 * @param discountPercent - The discount percentage (0-100)
 * @param maxDiscount - Optional maximum discount amount cap
 * @returns The final price after discount, rounded to 2 decimal places
 * 
 * @example
 * // Basic discount
 * calculateDiscount(100, 10) // Returns: 90
 * 
 * @example
 * // With maximum discount cap
 * calculateDiscount(1000, 50, 100) // Returns: 900 (capped at $100 off)
 * 
 * @throws {Error} If price is negative
 * @throws {Error} If discountPercent is outside 0-100 range
 */
export function calculateDiscount(
  price: number,
  discountPercent: number,
  maxDiscount?: number
): number {
  // ...
}
```

### Case 3: Legacy Code Refactoring

I had a 500-line class component. Instead of refactoring manually:

```text
Prompt to Claude:

"I have this React class component that needs modernizing. 

Requirements:
1. Convert to functional component with hooks
2. Extract reusable logic into custom hooks
3. Maintain exactly the same functionality
4. Improve error handling
5. Add strict TypeScript types

The current component has:
- Complex state with multiple related properties
- componentDidMount with data fetching
- componentDidUpdate with props comparison
- Multiple event handlers
- Complex conditional rendering

[component code]"
```

Claude not only refactored but identified a subtle bug in `componentDidUpdate` that was causing infinite renders in edge cases.

### Case 4: Learning New APIs

When I needed to implement Web Workers for the first time:

```text
Prompt:

"Explain how to use Web Workers in a React application with 
TypeScript. I need to process heavy images without blocking the UI.

Include:
- Worker setup with TypeScript
- Bidirectional communication with the main thread
- Error handling
- Cleanup when component unmounts
- Practical example of resizing an image"
```

Claude's response included not just the code, but explanations of each decision and common gotchas that saved me hours of debugging.

## Mistakes I Made and How to Avoid Them

### Mistake 1: Blind Trust

```typescript
// Copilot suggested this for "shuffle array"
function shuffleArray<T>(array: T[]): T[] {
  return array.sort(() => Math.random() - 0.5);
}

// ❌ Problem: This implementation is NOT a uniform shuffle
// The sort() algorithm doesn't guarantee uniform distribution

// ✅ The correct solution (Fisher-Yates):
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

**Lesson:** Always verify critical algorithms. AI can give solutions "that work" but aren't optimal.

### Mistake 2: Not Giving Enough Context

```text
❌ "Create a hook for data fetching"
// Result: Generic implementation that doesn't fit my project

✅ "Create a data fetching hook that:
- Uses our axios instance in /lib/axios
- Integrates with React Query for caching
- Follows our error handling pattern with toast notifications
- Supports TypeScript generics for response type
- Includes retry logic with exponential backoff"
// Result: Code that fits perfectly
```

### Mistake 3: Using the Wrong Tool

| Task | Best Tool |
|------|-----------|
| Autocomplete code in context | Copilot |
| Generate boilerplate | Copilot |
| Explain complex code | Claude |
| Debugging with reasoning | Claude |
| Architectural refactoring | Claude |
| Inline documentation | Copilot |
| Code review | Claude |
| Complex regex | Claude |

## Optimal Configuration

### VS Code with Copilot

```json
// settings.json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "yaml": true
  },
  "github.copilot.advanced": {
    "inlineSuggestCount": 3
  },
  "editor.inlineSuggest.enabled": true,
  "editor.suggestSelection": "first"
}
```

### Keyboard Shortcuts I Use

```text
Alt + ] / Alt + [  → Navigate between Copilot suggestions
Tab               → Accept suggestion
Esc               → Reject suggestion
Ctrl + Enter      → View suggestions panel
Cmd + I           → Open Copilot Chat
Cmd + Shift + I   → Open Claude Code (if installed)
```

### Prompt Templates I Save

```markdown
## Template: New React Component
Create a functional React component in TypeScript named [NAME].

Props:
- [list props with types]

Behavior:
- [describe functionality]

Technical requirements:
- Use forwardRef if ref needed
- Memoize if receiving callbacks
- Accessible (appropriate aria labels)
- Styles with Tailwind CSS

## Template: Code Review
Review this code and provide feedback in these categories:
1. Potential bugs
2. Performance
3. Security  
4. Maintainability
5. Testing

Be specific with problematic code lines.

## Template: Debugging
I have a bug with these characteristics:
- Expected behavior: [X]
- Current behavior: [Y]
- Steps to reproduce: [1, 2, 3]
- Relevant code: [attached]
- Already tried: [list]

Help me identify the root cause.
```

## The Future of AI-Assisted Development

My prediction for the coming years:

1. **Autonomous agents**: AI that can execute complete tasks (like Devin, but more mature)
2. **Context-aware coding**: Tools that understand the entire project, not just the current file
3. **Automatic testing**: Test generation based on specifications
4. **Documentation as code**: Documentation that stays automatically synchronized

But developers will remain essential for:

- Defining what to build
- Making architecture decisions
- Validating quality and security
- Understanding the business domain

## Conclusion

AI hasn't replaced me. It's made me more productive and allows me to focus on interesting problems while delegating the tedious stuff. The key is:

- ✅ Understanding each tool's strengths
- ✅ Writing prompts with sufficient context
- ✅ Always verifying output
- ✅ Iterating and refining
- ✅ Maintaining critical thinking

"Vibe coding" isn't programming without thinking. It's programming in collaboration with tools that amplify our capabilities.

How are you using AI in your development? What tools have worked best for you? 🤖
