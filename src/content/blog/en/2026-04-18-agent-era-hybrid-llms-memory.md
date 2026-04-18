---
title: 'AI agents for real development: opencode, memory, and hybrid LLMs'
description: 'How I started using autonomous agents like opencode and rtk-ai, combined with local and cloud LLMs and persistent memory via engram, to handle full development workflows without context loss.'
date: '2026-04-18'
tags: ['ai', 'llm', 'agents', 'opencode', 'engram', 'local-llm', 'developer-tools', 'dx']
author: 'Miguel Angel de Dios'
slug: 'agent-era-hybrid-llms-memory'
featured: false
---

## Why I stopped using AI just for autocomplete

For a long time my AI usage was simple: tab to accept a suggestion, ask the chat for a snippet, copy and paste.

That works. But it scales poorly.

The moment a task involves more than one file, more than one decision, or more than one session — that workflow breaks. You lose context. You re-explain the same thing. You paste the same error three times.

The shift that changed things for me was moving from _AI as assistant_ to _AI as agent_.

---

## What an agent actually means in practice

Not a chatbot. Not an autocomplete.

An agent is a system that takes a goal and runs a full cycle to achieve it:

1. **Investigate** — reads the codebase before touching anything (`glob`, `grep`, file reads).
2. **Plan** — breaks the goal into discrete tasks (`todo-write`), not one big prompt.
3. **Execute** — runs commands, edits files, installs packages, runs tests.
4. **Verify** — checks output at each step and decides whether to continue or retry.

The difference: it does not stop at the suggestion. It acts.

`opencode` is the tool that made this click for me. CLI-first, it navigates your project, proposes a plan, and carries it out. It asks when it needs a human call. Otherwise it keeps going.

---

## The memory problem

Here is what breaks most agent setups: no persistent memory.

Every session starts from scratch. The agent rediscovers the same patterns, hits the same walls, and has no memory of why you made a decision two hours ago. For short tasks, fine. For anything that spans sessions — a feature, a refactor, a bug hunt — it is painful.

`engram` solves this.

After a non-trivial discovery, the agent saves it:

```bash
mem_save \
  --title "CORS fix on /api/auth" \
  --type bugfix \
  --content "What: added credentials:true in fetch and updated express CORS origin config.
Why: Safari was silently blocking preflight requests.
Where: src/api/server.ts, src/hooks/useAuth.ts
Learned: Safari handles credentialed CORS differently from Chrome."
```

Next session, before starting:

```bash
mem_context --project my-app --limit 10
mem_search "CORS auth Safari"
```

The agent now knows what was tried, what worked, and why. That is the difference between a tool and something that actually accumulates knowledge.

---

## RTK: cutting token usage before it becomes a problem

One thing that catches you off guard when working with agents: the token bill.

Agents run many commands — `git log`, `npm install`, `tsc --noEmit`, test runners. The raw output of those commands is verbose. Passing all of it to the LLM on every step is wasteful and slows the loop down.

This is exactly what `rtk-ai` (RTK — Rust Token Killer) solves.

RTK is a high-performance CLI proxy that sits between your commands and the LLM. It filters and compresses command output before it reaches the model — reducing token consumption by **60–90%** in practice.

It integrates directly into Claude Code via a hook:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "/Users/yourname/.claude/hooks/rtk-rewrite.sh"
          }
        ]
      }
    ]
  }
}
```

Once set up, every Bash command the agent runs passes through RTK automatically. You can also check how much you are saving:

```bash
rtk gain              # total token savings so far
rtk gain --history    # per-command breakdown
rtk discover          # find commands not yet covered by RTK
```

And if you need to debug the raw output without filtering:

```bash
rtk proxy git log --oneline -20
```

In a long agent session — investigating a codebase, running tests, checking types — RTK makes a real difference. Less noise reaching the model means faster responses, lower cost, and less context pollution.

---

## Hybrid LLMs: spending tokens where they matter

Not every task needs the most powerful model.

Running everything through Claude Opus or GPT is like hiring a senior architect to rename a variable. It works. It is also unnecessary.

A practical routing setup:

```json
{
  "models": {
    "default": "lmstudio/qwen/qwen3.6-35b-a3b",
    "complex": "anthropic/claude-opus-4-5",
    "fast": "lmstudio/google/gemma-4-e4b"
  },
  "routing": {
    "simple_edit": "default",
    "architecture": "complex",
    "explanation": "fast"
  }
}
```

I run local models via **LM Studio**. My current stack:

| Model                                 | Params  | Use case                                              |
| ------------------------------------- | ------- | ----------------------------------------------------- |
| `qwen/qwen3.6-35b-a3b`                | 35B MoE | Default workhorse — good balance of quality and speed |
| `google/gemma-4-26b-a4b`              | 26B MoE | Reasoning-heavy local tasks                           |
| `google/gemma-4-e4b`                  | 7.5B    | Fast responses, lightweight tasks                     |
| `mistralai/ministral-3-14b-reasoning` | 14B     | Structured reasoning, step-by-step problems           |
| `openai/gpt-oss-20b`                  | 20B     | Code generation, currently loaded by default          |

**Local models** handle:

- Linting and formatting
- Simple refactors and renames
- Boilerplate generation
- Anything with sensitive data that cannot leave the machine

**Cloud models** take over for:

- Architecture decisions
- Multi-file refactors with complex dependencies
- Comprehensive test generation
- Ambiguous requirements that need real reasoning

The benefit is not just cost. Local models respond in milliseconds. That keeps the agent loop tight on the simple steps.

### Rough provider guide

| Provider                       | Best for                                    |
| ------------------------------ | ------------------------------------------- |
| Claude (Anthropic)             | Long context, precise instruction-following |
| GPT (OpenAI)                   | Speed, strong code generation               |
| Gemini (Google)                | Research-heavy, large context               |
| Qwen 3.6 / GPT-OSS 20B (local) | Routine tasks, private data, zero cost      |

---

## What a full session looks like

```text
Session start
├── mem_context()           ← recover previous state
├── mem_search("topic X")  ← check what we already tried

├── opencode: investigate (glob, grep, file reads)
├── opencode: plan (todo-write)

└── per task:
    ├── local LLM if simple (qwen3.6, gemma-4-e4b, gpt-oss-20b)
    ├── Claude/GPT if complex
    ├── execute and verify
    └── mem_save() if something is worth keeping
```

I review the plan before execution. Approve, adjust if needed, then monitor. The cognitive load shifts from "write every line" to "define the goal clearly and review the output critically".

That is a different skill. Turns out it is also more interesting.

---

## What actually changes

This is not about replacing developers.

It is about changing what you spend your time on.

The skills that matter more now:

- Defining goals precisely — vague prompts produce vague code
- Reviewing output critically — trust but verify, every time
- Designing the agent setup — tools, models, memory strategy
- Building feedback loops — tests and CI that catch what the agent misses

The agent writes the code. You write the spec, the constraints, and the quality bar.

---

If you want to go deeper, in a follow-up post I can share a practical setup for running `opencode` with local LM Studio models and engram memory on a real React project.
