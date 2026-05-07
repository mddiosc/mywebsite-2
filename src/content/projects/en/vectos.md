---
slug: vectos
title: 'Vectos: Local-First Code Context Engine for AI Agents'
summary: 'A local-first engine that indexes source code into project-scoped SQLite databases, generates embeddings, and exposes semantic search over MCP so AI agents can retrieve relevant code without repetitive file exploration.'
published: '2026-04-25'
featured: true
role: 'Creator / Product Owner'
status: 'Experimental, functional and under active development'
outcomes:
  - 'Hybrid retrieval: semantic search with cosine similarity + text fallback'
  - 'Two-index model: separate code and documentation databases per project'
  - 'MCP integration with search_code, search_docs, and index_project tools'
  - 'Nx workspace-aware: automatic dependency resolution for monorepos'
  - 'Incremental reindexing for fast feedback during active development'
repoName: vectos
relatedPosts:
  - 'vectos-semantic-code-retrieval-agents'
  - 'unified-memory-code-embeddings-local'
---

## Context

Working with AI agents on real repositories revealed a costly pattern: too many repeated searches, too many useless file reads, and too much token spend on exploration rather than reasoning.

`Vectos` was built to remove that friction. It is a **local-first code context engine** that indexes source code into project-scoped SQLite databases, generates embeddings for code chunks, and exposes structured search over MCP — so agents can retrieve relevant context without rediscovering the repository on every task.

It is not a replacement for model reasoning, nor a historical memory system. It is a focused orientation tool — experimental, already functional, and under active development.

## What it does

```text
# Install
curl -fsSL https://github.com/mddiosc/vectos/releases/latest/download/install.sh | sh

# Index and search
vectos index .
vectos search "checkout payment flow"

# Separate docs index (README, ADRs, etc.)
vectos index . --docs
vectos search --docs "API reference"

# Connect an agent client
vectos setup opencode
```

Instead of the typical agent loop:

```text
glob → grep → read → discard → repeat
```

Vectos enables a tighter alternative:

```text
search by intent → retrieve 3–5 relevant chunks → read only there
```

## Architecture

### Storage model

Vectos stores everything in per-project SQLite databases under `~/.vectos/projects/`. Each indexed chunk carries:

- Original code text
- File path and line ranges
- Language and file category (`source`, `infra_config`, `scripts`, `docs`, `dependency_metadata`)
- Embedding vector (configurable provider)

### Two-index model

| Database           | Content                             | Search        |
| ------------------ | ----------------------------------- | ------------- |
| `<project>.db`     | Source code                         | `search_code` |
| `<project>-docs.db` | Documentation (README, ADRs, guides) | `search_docs` |

Code and docs indexes coexist without polluting each other. Both share the same project scope.

### Hybrid retrieval

1. Embed the query using the configured provider
2. Rank indexed chunks by cosine similarity
3. Fall back to text search if semantic retrieval fails or returns nothing
4. Preserve project scope and file category metadata in results

If the embedding provider, model, or vector dimensions change, Vectos detects the mismatch and reports a reindex requirement — it never mixes embeddings from different providers.

### Chunking strategy

- **Go**: function-oriented boundaries
- **TypeScript/React**: exported functions, hooks, components, classes, and test blocks when derivable
- **Fallback**: generic chunking for unsupported languages

### Nx workspace support

Vectos detects Nx workspaces and resolves logical project scopes automatically:

```bash
vectos index --project app-main .
```

It resolves the selected project plus its internal dependency roots via the Nx project graph, excluding helper projects (`e2e`, `storybook`, `docs`) by default.

### Incremental reindexing

Only changed files are reindexed. Index metadata (provider, model, dimensions) is stored alongside each database, so compatibility is checked before retrieval.

## MCP integration

Vectos exposes its capabilities over **MCP** (Model Context Protocol):

| Tool              | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `search_code`     | Semantic + text search over source code             |
| `search_docs`     | Semantic search over documentation                  |
| `index_project`   | Full or incremental indexing with optional docs flag |

Agents like OpenCode, Claude, and Codex connect via `vectos setup <client>` and query the index directly without leaving their working session.

## How it fits with Engram

`Engram` answers: "What did we learn before?"

`Vectos` answers: "Where is the relevant code now?"

They complement each other in a recommended workflow:

1. Recover prior memory (Engram)
2. Retrieve current code (Vectos)
3. Read only focused files
4. Save new learnings (Engram)

But Vectos works independently. It is a complete, standalone product with no dependency on Engram or any other session-memory system.

## What it solves and what it does not

**Solves:**

- Reduces useless file reads and repetitive searching
- Reduces wasteful token spend on blind codebase exploration
- Improves agent orientation before reasoning begins
- Provides a practical bridge between semantic search and agent workflows via MCP

**Does not solve:**

- Does not replace model reasoning, testing, or engineering judgment
- Does not turn every vague query into perfect context
- Does not replace historical product memory (that is Engram's domain)

## Current state

Vectos is experimental but functional for real projects. Active development areas:

- Chunking quality for more languages
- Reindexing and index maintenance ergonomics
- MCP integration depth and tool discoverability
- Retrieval quality across different repository shapes and monorepo patterns

## Key lessons

1. **Index less, but better** — filtering low-signal files improves retrieval more than indexing everything. In real tests, noise reduction from ~16K to ~1.5K chunks improved quality materially.
2. **Orientation is a major hidden cost** — a large share of token spend in agent workflows goes into finding code, not reasoning about it.
3. **MCP turns a utility into a workflow component** — the real value is not in indexing alone, but in letting agents retrieve code without leaving context.
4. **Standalone-first design matters** — Vectos works fine on its own; Engram is an optional complement, not a requirement.
