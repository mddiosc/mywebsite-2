---
title: 'RTK-AI in depth: how to cut token usage by 80% with agents'
description: 'I mentioned it briefly in the previous post. RTK-AI deserves its own space: what it is, how it works under the hood, how to configure it, and what real difference it makes in long agent sessions.'
date: '2026-04-21'
tags: ['ai', 'llm', 'agents', 'rtk-ai', 'opencode', 'dev-tools', 'dx', 'performance']
author: 'Miguel Angel de Dios'
slug: 'rtk-ai-token-optimization-agents'
featured: false
---

## What I left pending

In [AI agents for real development: opencode, memory and hybrid LLMs](/en/blog/2026-04-18-agent-era-hybrid-llms-memory) I mentioned RTK-AI in a couple of paragraphs. Enough to understand it exists and what it's for, but without going into detail.

The reason is that it deserves its own space. The problem it solves is real, the impact is measurable, and the configuration has nuances that don't fit in a passing mention.

This post is exactly that: RTK-AI in depth.

---

## The problem nobody tells you before using agents

When you start working with autonomous agents like opencode or Claude Code, the first positive impact is clear: the agent does things. It reads files, runs commands, proposes changes, passes tests.

The second impact — the negative one — arrives when you see the bill.

Agents run a lot of commands during a session. And the output of those commands is verbose by nature:

- `npm install` returns hundreds of lines of resolved dependencies
- `tsc --noEmit` lists every error with path, line, column and description
- `git log --oneline -50` is 50 lines of commits
- `jest --verbose` can return thousands of lines between passed tests, failures and coverage

All that output reaches the LLM at every step of the agent cycle. The model processes it, includes it in its context and responds. Input tokens, output tokens, accumulated context tokens.

In a long session — debugging a bug, refactoring a module, generating a test suite — consumption spikes in ways you don't anticipate when you start.

RTK-AI attacks exactly this point.

---

## What RTK-AI is

RTK stands for **Rust Token Killer**. The name says it all: it's written in Rust and its goal is to kill unnecessary tokens.

Technically it's a **CLI proxy**. It sits between the commands the agent runs and the LLM that processes them. It intercepts the output of each command, filters it, compresses it and returns only what the model actually needs to make the next decision.

It doesn't modify commands. It doesn't change agent behavior. It just reduces noise before it reaches the model.

The reduction in practice is between **60% and 90%** depending on the type of command. The most verbose commands — package installers, verbose test runners, git logs — are where it shows the most.

---

## How it works under the hood

RTK has filtering rules per command type. For each known command, it knows which parts of the output are relevant for an agent and which are noise.

For example, for `npm install`:

- **Relevant**: installed packages, warnings, errors
- **Noise**: progress bars, transitive dependency resolution, internal timings

For `tsc --noEmit`:

- **Relevant**: errors with path and message
- **Noise**: redundant context lines, separators, repeated summaries

For `git log`:

- **Relevant**: short hash, commit message
- **Noise**: author and date metadata when not needed for the task

The result is that the model receives the information it needs to act, without the volume that only serves to consume context.

---

## Installation and integration

Installation varies depending on your operating system and the agent you use. The [official RTK-AI repository](https://github.com/rtk-ai/rtk) has up-to-date instructions for each platform, including how to integrate it with Claude Code and opencode via hooks.

The idea is the same in all cases: RTK acts as a proxy between the commands the agent runs and the LLM. Once configured, every command automatically goes through the filter without you having to do anything else.

---

## Useful day-to-day commands

Once configured, RTK works in the background without you having to think about it. But there are commands I use regularly to understand what's happening:

```bash
rtk gain              # total token savings since you installed it
rtk gain --history    # breakdown by command — how much each one saves
rtk discover          # detects commands RTK doesn't cover yet in your project
```

The `rtk discover` command is especially useful when starting on a new project. It analyzes the commands you run habitually and tells you which ones don't have filtering rules yet — candidates for adding custom rules.

To debug without filtering — when you need to see the raw output exactly as the command returns it:

```bash
rtk proxy --raw git log --oneline -20
```

---

## Custom rules

Projects have their own commands that RTK doesn't know by default. Internal build scripts, test runners with specific flags, company tools.

RTK lets you define custom filtering rules in a project-local configuration file:

```toml
# .rtk/rules.toml

[[rule]]
command = "pnpm run test:e2e"
filter = [
  { pattern = "^\\s+✓", keep = true },   # passing test lines
  { pattern = "^\\s+✗", keep = true },   # failing test lines
  { pattern = "^Error", keep = true },   # errors
  { pattern = ".*", keep = false }       # everything else, out
]

[[rule]]
command = "pnpm run build"
filter = [
  { pattern = "^dist/", keep = true },   # generated files
  { pattern = "^ERROR", keep = true },   # build errors
  { pattern = ".*", keep = false }
]
```

Rules are applied in order. The first one that matches decides whether the line is kept or discarded. The `.*` pattern at the end acts as a catch-all to discard everything that didn't match before.

---

## Real numbers

In a typical opencode session debugging a bug in a React TypeScript project:

| Command | Tokens without RTK | Tokens with RTK | Reduction |
| --- | --- | --- | --- |
| `pnpm install` | ~1,800 | ~120 | 93% |
| `tsc --noEmit` | ~950 | ~280 | 71% |
| `pnpm run test` | ~3,200 | ~640 | 80% |
| `git log --oneline -30` | ~420 | ~420 | 0% |
| `git diff HEAD~3` | ~2,100 | ~890 | 58% |

The `git log` doesn't get reduced because it's already compact by nature — RTK is smart enough not to touch what's already clean.

The cumulative impact in a 2-3 hour session with an active agent can be the difference between 50,000 tokens and 12,000 tokens. At cloud API prices, that's significant.

---

## What RTK doesn't do

It's worth being explicit about the limits:

**It doesn't improve response quality.** RTK filters noise, it doesn't add signal. If a command's output doesn't contain the information the model needs, RTK won't fix that.

**It doesn't work well with interactive commands.** Commands that wait for user input or have dynamic output (spinners, real-time progress bars) can behave unexpectedly through the proxy.

**Custom rules require maintenance.** If you change your build scripts or test flags, filtering rules can become outdated and start discarding things that do matter.

**It doesn't eliminate the long context problem.** RTK reduces token volume per command, but if your session accumulates many commands over hours, context keeps growing. For that, the memory strategy with engram is the natural complement — but that's another post.

---

## When it's worth configuring

If you use agents occasionally for short tasks, RTK's impact is marginal. The overhead of configuring it doesn't pay off.

If you use agents regularly for long sessions — bug investigation, refactoring, test generation — RTK pays off quickly. The token reduction has a direct effect on cost and on agent loop speed.

My personal criterion: if an agent session lasts more than 30 minutes or involves more than 20 command executions, RTK is earning its place.

---

## The full stack

RTK isn't an isolated tool. It fits into a broader stack I've been building to work with agents sustainably:

- **opencode** — the agent that runs the full cycle
- **RTK-AI** — reduces token noise on every command
- **engram** — persistent memory between sessions
- **LM Studio** — local models for routine tasks

Each piece attacks a different problem in the same flow. RTK attacks per-session cost. engram attacks context loss between sessions. LM Studio attacks per-model cost.

If you want to see how they all fit together in a real session, the entry point is [AI agents for real development: opencode, memory and hybrid LLMs](/en/blog/2026-04-18-agent-era-hybrid-llms-memory).

---

_This post is part of a series about the AI agent development stack I use day to day._

---

_RTK-AI is an open source project created by [Patrick Szymkowiak](https://github.com/pszymkowiak), with contributions from [Florian Bruniaux](https://github.com/FlorianBruniaux) and [Adrien Eppling](https://github.com/aeppling). You can find the repository, report issues and contribute at [github.com/rtk-ai/rtk](https://github.com/rtk-ai/rtk)._
