---
title: 'Vectos: what it is, how it works, and why I am building it'
description: 'After seeing the real cost of repeated code searches in agent workflows, I built Vectos as a semantic code-retrieval layer. This is the practical summary of what it does, how it works, and where it stands today.'
date: '2026-04-25'
tags: ['ai', 'llm', 'agents', 'embeddings', 'rag', 'vectos', 'mcp', 'dev-tools', 'dx']
author: 'Miguel Angel de Dios'
slug: 'vectos-semantic-code-retrieval-agents'
featured: true
---

## What Vectos is

In the previous post I described the problem that pushed me to build it: working with agents on real repositories creates too many repeated searches, too many useless file reads, and too much absurd token spend.

`Vectos` exists to attack exactly that part of the workflow.

Put simply, it is a **semantic code-retrieval** layer designed to help an agent locate useful project context earlier and stop rediscovering the repository on every task.

It does not try to replace the model.
It does not try to be historical memory.
It does not try to “understand the whole project” magically.

It tries to do something more practical: orient better.

I also consider it **experimental** right now. It is already functional and I am using it for real work, but it is still under construction and I am adding capabilities as I find real friction points in agent workflows. I do not present it as finished. I present it as something already useful, with a lot of room to improve.

The repository is here if you want to follow it or try it:

- [github.com/mddiosc/vectos](https://github.com/mddiosc/vectos)

---

## What it actually does

The core idea is simple:

1. index useful project files
2. split the code into reasonable chunks
3. generate embeddings
4. allow intent-based search
5. return the most promising code first

But what matters is making that concrete.

When an agent needs to solve a task, Vectos can act as a pre-orientation layer:

- it indexes the project locally
- it stores a vector representation of code fragments
- it accepts semantic queries such as “where X connects to Y” or “what part controls this flow”
- it returns the files or chunks most likely to be relevant

That changes the agent's starting point. And that detail, which sounds small on paper, changes quite a lot about the quality of the context the model starts reasoning from.

Instead of beginning with:

```text
glob -> grep -> read -> discard -> repeat
```

it can begin with something more like:

```text
search by intent -> retrieve 3-5 relevant chunks -> read only there
```

It does not remove exploration completely. But it makes exploration much shorter, cheaper, and more useful.

### Mini example

Imagine you are in a medium-sized repository and you ask an agent something like this:

```text
Find where project and case-study content get merged for the page.
```

Without a layer like Vectos, the agent will usually chain literal searches, open several “maybe relevant” files, and spend quite a few steps before landing in the right place.

With Vectos in the middle, the flow can be much shorter:

1. the agent queries Vectos through MCP with that intent
2. Vectos returns the most promising chunks
3. the agent reads only those files before reasoning or editing

That kind of reduction does not look spectacular as a single action, but repeated across the day it creates a meaningful difference in time, cost, and context cleanliness.

---

## How it works

This was a major part of the challenge. It was not enough to simply “have embeddings.” I had to decide what to index, how to chunk it, and how to reduce noise so retrieval would actually help.

These have been the most important choices.

### 1. Index less, but better

One of the first lessons was that indexing more things does not automatically improve anything.

If you include too many semantically low-value files, the index fills with noise and retrieval gets worse. That is why it makes more sense to prioritize actionable code and exclude some material that adds volume without adding signal.

### 2. Better chunking for TypeScript and React

Splitting plain text is not the same as splitting code with components, hooks, exported functions, or tests.

That is why a significant part of the work has been improving how TypeScript and React code is segmented and described, so the index better reflects the units an agent actually needs to locate.

### 3. Incremental reindexing

If every change requires reindexing the whole project, the experience breaks down quickly.

Vectos already supports incremental reindexing so only the changed parts need to be updated. That detail matters much more than it sounds once the tool is part of the day-to-day development loop.

### 4. MCP for agent integration

Another important point is that I did not want this to be just an isolated CLI utility.

Vectos exposes capabilities through **MCP**, so agents like OpenCode can use it directly as a semantic retrieval tool inside their normal workflow.

That matters because the value is not only in indexing. It is in letting the agent ask for and retrieve relevant code without leaving the working session. To me, that is the point where it stops being a technical demo and starts becoming a useful part of the real workflow.

---

## What kind of savings it can bring

I want to be careful here: I do not want to claim universal numbers yet, because this depends heavily on the repository, the model, and the kind of task.

But I do already have a fairly clear sense of where the savings come from.

The savings do not come from “magic.” They come from reducing:

- repeated searching
- irrelevant file reads
- mediocre context sent to the model
- use of expensive cloud models for orientation work

In real validation runs, I have already seen a very clear improvement in retrieval quality after reducing index noise.

For example, in one of the projects where I tested it, moving from indexing too many things to prioritizing useful signal reduced the index from roughly `16227` chunks to `1567`, and retrieval improved materially for real queries.

That does not automatically mean “10x less cost” in every case. But it does point to something important: when noise goes down, the agent needs fewer useless steps to get to the code that matters.

My product hypothesis is this:

- if you reduce blind exploration, you reduce tokens
- if you reduce irrelevant tokens, you reduce cost
- if you improve the initial context, you also improve the quality of downstream reasoning

So this is not only an economic optimization. It is also a cognitive optimization of the workflow.

---

## How it fits with Engram

I think the right distinction here is fairly simple.

`Engram` answers:

> “What did we learn before?”

`Vectos` answers:

> “Where is the relevant code now?”

They do not compete. They complement each other.

If you use both, the workflow improves a lot:

1. recover prior memory
2. retrieve relevant current code
3. read only what matters
4. save new learnings

But if you only use `Vectos`, it still makes sense. That independence matters to me.

---

## What problem it solves and what it does not

What it does solve:

- reduces useless file reads
- reduces repetitive searching
- reduces wasteful token spend
- improves the agent's orientation at the start of a task
- creates a more practical bridge between semantic search and agents through MCP

What it does not solve:

- it does not replace model reasoning
- it does not replace testing, validation, or engineering judgment
- it does not turn every vague query into perfect context
- it does not replace historical product memory or prior decisions

That boundary matters to me because it avoids hype. The real value of a tool like this is not promising magic. It is removing friction where friction repeats the most.

---

## Where it stands right now

Right now I see it as an **experimental but already quite functional** product.

It is already meaningful to use, test, and work with on real projects. But it is also clear that there is still room to keep refining:

- chunking quality
- language coverage
- reindexing and index maintenance
- MCP and agent ergonomics
- retrieval quality across different repository shapes

That is exactly the interesting part of building it in public: starting from a concrete friction point rather than an abstract promise, and improving it against real use cases.

---

## What I want to validate

Right now I am interested not only in whether Vectos “works,” but whether this middle layer truly improves agent workflows on real projects.

The question is not only technical.

It is also a product question:

> Is it worth having a dedicated code-retrieval layer so expensive context and tokens can be reserved for the reasoning that actually matters?

My current view is yes.

And the more I work with agents, the more convinced I become of this: a large part of the cost is not in thinking, but in orienting badly.

If you want to try it or follow its evolution, the repo is here:

- [github.com/mddiosc/vectos](https://github.com/mddiosc/vectos)

---

_Related:_

- [Why memory is not enough when working with agents on real code](/en/blog/2026-04-24-unified-memory-code-embeddings-local)
