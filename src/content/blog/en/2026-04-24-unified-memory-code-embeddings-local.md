---
title: 'Why memory is not enough when working with agents on real code'
description: 'Memory keeps an agent from starting from zero, but it does not solve another equally expensive problem: searching the same code again and again. This is the reflection that led me to create Vectos.'
date: '2026-04-24'
tags: ['ai', 'llm', 'agents', 'embeddings', 'rag', 'opencode', 'lm-studio', 'engram', 'vectos', 'dev-tools', 'dx']
author: 'Miguel Angel de Dios'
slug: 'unified-memory-code-embeddings-local'
featured: true
---

## The problem was not just memory

Over the last few months I have been assembling an increasingly serious stack for working with agents:

- **opencode** to investigate, plan, act, and verify
- **engram** so decisions and discoveries survive across sessions
- **RTK-AI** to reduce token noise in commands and outputs
- **LM Studio** to keep a large share of the work on local models

For a while I thought the main bottleneck was memory. And yes, it was... but only partially.

Engram solved a real problem: the agent no longer had to start from zero every session.

But another equally expensive, and much less discussed, problem remained: the agent still had to **re-orient itself in the code almost blindly** over and over again.

That is the need that led me to create **Vectos**: an experiment in semantic code retrieval so every task does not begin with a small, pointless expedition through the repository.

---

## The pathology of infinite code searches

If you work with agents on real repositories, this scene will look familiar:

```text
1. glob src/**/*
2. grep "auth"
3. grep "modal"
4. read 6 files
5. wrong place
6. grep again
7. read 4 more files
8. repeat
```

It is not that the agent is useless. It is that, without a semantic code-retrieval layer, its orientation still depends on:

- file names
- folder structure
- literal matches
- opportunistic reads of “promising” files

In a small project that already costs time. In a medium or large one it costs something worse:

- **tokens**
- **latency**
- **money** if you use cloud models
- **model attention** wasted on irrelevant material

And this is not only an economic problem. It is also a cognitive one. If the model starts a session loaded with mediocre context, it reasons worse.

In other words: you are not just paying more. You are also thinking worse.

---

## Engram could tell me what we knew. It could not tell me where the code lived now

That was the key.

Engram works very well for storing:

- previous technical decisions
- bugs already solved
- project preferences
- historical context from past sessions

That is extremely valuable. But it does not answer this question:

> “Fine, but which file contains the thing I need to change right now?”

Memory and current code are two different kinds of context.

- **Memory**: what we learned before
- **Current code**: what exists now and where it lives

For a while I tried to make memory cover more than it realistically could. It did not work.

Because a bugfix saved two weeks ago does not replace finding the hook, component, test, or function that still governs the current repository.

---

## That is why I started building Vectos

What I needed was not more stored text. I needed the agent to **locate relevant code semantically** before it started reading files at random.

The idea behind Vectos was fairly simple:

- index the project into useful chunks
- generate embeddings for code
- query by intent, not only by literal text
- return only the most promising fragments

What mattered was not the technology by itself, but the workflow shift:

```text
Before:
grep -> glob -> read -> discard -> repeat

After:
search by intent -> locate 3-5 useful chunks -> read only there
```

Yes, that reduces cost. But it also reduces something more important: the friction loop between task, search, and reasoning.

---

## The hidden cost of rediscovering the repo every time

There is one thing in many AI workflows that feels especially wasteful to me: using expensive, powerful models to repeat boring work.

I do not mind paying cloud for:

- a hard architecture decision
- a delicate refactor
- a complex review
- a strange bug with multiple hypotheses

That makes sense.

What feels like a bad deal is paying cloud so the agent can do, for the fifth time, this sequence:

- find where the modal is
- find the related hook
- rediscover how it connects to the store
- read irrelevant files along the way

That work should not fall again and again on the most expensive model in the loop.

It should fall on a cheaper, more local, more specialized layer: code retrieval.

---

## The conversation I want to open

I think we spend a lot of time in AI tooling talking about memory, models, and agents... but still not enough on this middle problem:

**repetitive, clumsy code search as a continuous source of cost, latency, and cognitive noise.**

Not everything is solved by better prompts.
Not everything is solved by more context.
Not everything is solved by larger models.

Sometimes the improvement comes from something less glamorous:

- orienting better
- retrieving less, but better
- paying only for the reasoning that truly matters

That, more than anything else, was the starting point for Vectos.

In the next post I will get into the practical side: what it is, how it works, and which decisions I made so it becomes genuinely useful when working with agents on real repositories.

---

_Previous posts in the series:_

- [AI agents for real development: opencode, memory and hybrid LLMs](/en/blog/2026-04-18-agent-era-hybrid-llms-memory)
- [Local LLMs without excuses: LM Studio and opencode](/en/blog/2026-04-19-local-llms-lm-studio-opencode-llmfit)
- [RTK-AI in depth: how to cut token usage by 80% with agents](/en/blog/2026-04-21-rtk-ai-token-optimization-agents)
- [Vectos: what it is, how it works, and why I am building it](/en/blog/2026-04-25-vectos-semantic-code-retrieval-agents)
