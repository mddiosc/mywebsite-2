---
title: 'Vectos: performance improvements and token efficiency for agents'
description: 'A follow-up to the first Vectos post: what changed in the retrieval layer, what the benchmarks show, and why token efficiency matters so much when working with agents on real repositories.'
date: '2026-05-16'
tags: ['ai', 'llm', 'agents', 'embeddings', 'rag', 'vectos', 'mcp', 'performance', 'tokens', 'dx']
author: 'Miguel Angel de Dios'
slug: 'vectos-performance-token-efficiency-agents'
featured: true
---

## From intuition to measurement

In the first post about `Vectos`, I explained the core idea: a local semantic retrieval layer that helps agents find relevant code earlier instead of spending so much context getting oriented badly.

At that point the thesis was clear, but it was still closer to an intuition validated through real usage than to a systematic measurement.

Since then I have been working on exactly that part: improving retrieval, comparing against traditional tools, and measuring the real token cost more carefully.

The short version is this:

> Vectos is not only trying to find better results. It is trying to make the agent read less before it can decide better.

That difference matters a lot.

Because in an agent workflow, the cost is not only the first search. It is everything that follows: noisy results, unnecessary reads, wasted context, and reasoning built on mediocre signals.

---

## What changed in retrieval

The first useful version of Vectos could already index a project, generate embeddings, and search by intent. It worked, but the architecture was still fairly direct:

```text
embedding -> cosine similarity -> results
```

The current version has moved toward a more hybrid stack:

```text
jina-embeddings-v3 -> HNSW -> BM25 -> RRF -> compact preview
```

In practical terms:

- `jina-embeddings-v3` provides `1024`-dimensional embeddings for code, text, and multilingual queries.
- `HNSW` avoids relying on linear vector search as the index grows.
- `BM25` adds classic text retrieval for specific terms.
- `RRF` fuses semantic and textual signals without forcing a single ranking source.
- The compact preview returns paths, ranges, signatures, and hints instead of dumping entire files.

This does not make Vectos magic. But it changes the ergonomics for the agent quite a bit: instead of receiving a wall of literal matches, it gets a short list of candidates with enough context to decide whether it needs to read more.

---

## The number I care about: total workflow cost

Comparing only the cost of a search can be misleading.

`glob` can return very few tokens, but it usually cannot answer anything by itself. It tells you which files might exist, not which part satisfies the intent.

`grep` can be exact, but when terms are generic it returns a lot of noise. In Tailwind repositories, a query like `dark mode` can end up matching hundreds of `dark:*` classes that have nothing to do with the actual toggle implementation.

`ast-grep` is very powerful for structural patterns, but it does not understand a conceptual question like “how does language switching work” unless you already know which pattern to search for.

So I started measuring the complete cost:

```text
search + follow-up reads needed to answer
```

In a benchmark with ten real queries against a React/TypeScript project with Tailwind, i18n, routing, and documentation, the average numbers looked like this:

| Workflow | Average tokens per query |
| --- | ---: |
| Vectos | ~489 |
| grep + reads | ~8,183 |
| glob + reads | ~3,299 |
| ast-grep + reads | ~1,748 |
| Read file, already knowing what to read | ~3,397 |

The practical readout: in that scenario, Vectos reduced total workflow cost by about `17x` versus `grep`, `7x` versus `glob + read`, and `4x` versus `ast-grep + read`.

I do not treat those ratios as universal law. I do treat them as a strong signal of where the savings come from: not from “cheaper search,” but from cutting the exploration tree earlier.

---

## Why grep breaks down with generic terms

`grep` is still an excellent tool.

If I am searching for a unique identifier, a concrete import, an error code, or an exact literal, I usually want `grep`. There is no need to overengineer that.

The problem appears when the agent does not yet know the system's exact words.

Examples from the benchmark:

| Intent | Vectos | grep | Source of noise |
| --- | ---: | ---: | --- |
| Dark mode / theme toggle | ~150 tokens | ~7,956 tokens | `335` matches from Tailwind `dark:*` classes |
| Form validation and errors | ~155 tokens | ~7,729 tokens | `error`, `form`, and `validation` appear everywhere |
| Internationalization | ~170 tokens | ~6,355 tokens | locale keys, strings, and helpers mixed together |
| Routing and navigation | ~145 tokens | ~4,611 tokens | `Link`, `route`, and `navigate` spread across templates |

This is where a scoped semantic search helps most: when the intent is clear, but the exact words are not.

In that situation, I do not want the agent processing `300` lines just to discover that the relevant implementation was in one hook and one small component. I want it to start there.

---

## What signatures and hints add

One improvement that looks small but changes the workflow a lot is the output shape.

Vectos should not only return “this file looks relevant.” That forces the agent to read too early.

So the result tries to include compact signals:

- file path
- line range
- relevant signatures or symbols
- hints about why the result may matter
- separation between code search and documentation search

In the benchmark, roughly half of the Vectos queries provided enough context in the result itself to avoid an immediate follow-up read.

That matters because the savings compound:

```text
less search output
+ fewer follow-up reads
+ fewer tool calls
+ more free context for reasoning
```

Measured as a full ten-query session, the pattern looked like this:

| Workflow | Estimated session cost |
| --- | ---: |
| grep + reads | ~85,800 tokens |
| glob + reads | ~36,960 tokens |
| Vectos + targeted reads | ~11,390 tokens |

That `~87%` reduction versus a `grep`-based workflow does not come from one optimization. It comes from avoiding work the agent should not need to do in the first place.

---

## Documentation is another place where it shows

Documentation search has a similar problem.

Markdown files are often long, mix guides, references, decisions, and examples, and a text search can find too many matches without pointing to the right section.

That is why Vectos keeps a separate docs index:

```bash
vectos index . --docs
vectos search --docs "how to run tests"
```

In measurements over bilingual documentation, conceptual queries also showed large differences:

| Intent | Vectos | grep |
| --- | ---: | ---: |
| Testing strategy | ~115 tokens | ~6,418 tokens |
| Internationalization | ~120 tokens | ~5,419 tokens |
| Component architecture | ~120 tokens | ~3,039 tokens |
| Development setup | ~113 tokens | ~1,050 tokens |
| Recaptcha security | ~130 tokens | ~450 tokens |

The `recaptcha` case is interesting because it shows the limit: when the term is very specific, `grep` already performs quite well. Vectos still returns less noise, but the difference is no longer spectacular.

That is healthy. The tool does not need to win everywhere. It needs to win where the real workflow hurts.

---

## Performance is not only tokens

There is also a raw performance side.

Moving from linear vector search to `HNSW` changes how much room the index has to grow. In small projects it may not matter much, but it is a necessary decision if I want Vectos to be useful in medium repositories or monorepos.

The MCP payload matters too. An agent does not consume an idealized table; it consumes a real tool response. In a representative check inside the Vectos repository itself, a `3`-result payload measured around `1242 bytes`; with `5` results, `1966 bytes`; with `10`, `3818 bytes`.

The practical conclusion is simple: result count scales almost linearly. Keeping the default window at `5` results is a good balance between coverage and cost.

More results do not always mean better context. Sometimes they only mean more pending decisions for the agent.

---

## Where I would not use Vectos

The more I use it, the clearer it becomes that Vectos should not try to replace every tool.

I would use `grep` for:

- exact strings
- concrete imports
- unique IDs
- error codes
- regex patterns

I would use `glob` for:

- discovering files by name
- listing `*.spec.ts`
- finding folder conventions

I would use `ast-grep` for:

- structural refactors
- finding usages of a concrete API
- locating repeated AST patterns

I would use `Vectos` when the question is closer to:

- “where is this flow implemented”
- “what controls this experience”
- “how does this feature connect”
- “which docs explain this decision”
- “where should I start reading”

That boundary matters to me because it keeps Vectos from becoming a generic tool without focus. Its value is orientation, not replacing every system primitive.

---

## What this changes in my workflow

The clearest improvement is not that every search is perfect.

The improvement is that the agent starts better.

And when an agent starts better:

- it reads less garbage
- it uses less context
- it makes fewer exploration calls
- it reaches the right file earlier
- it leaves more tokens for reasoning, editing, and verification

That is why I keep investing in Vectos.

Not because embeddings are interesting on their own. But because a huge part of agent work is translating a human intention into the right point in the codebase.

If that translation improves, the whole workflow improves.

---

## Next focus

After these measurements, the priorities are clearer:

- keep improving hybrid ranking quality
- refine previews so they answer more without forcing file reads
- keep MCP payloads small
- make incremental reindexing increasingly invisible
- keep validating against real repositories, not just convenient fixtures

Vectos is still experimental, but I no longer see it only as a promising intuition. I now have better data to explain why this layer makes sense.

Agents do not need more context by default.

They need better orientation before spending context.

If you want to try it or follow its evolution, the repository is here:

[github.com/mddiosc/vectos](https://github.com/mddiosc/vectos)

_Related:_

- [Vectos: what it is, how it works, and why I am building it](/en/blog/2026-04-25-vectos-semantic-code-retrieval-agents)
- [Why memory is not enough for working with agents on real code](/en/blog/2026-04-24-unified-memory-code-embeddings-local)
