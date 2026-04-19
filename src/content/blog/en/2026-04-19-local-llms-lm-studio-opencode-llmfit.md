---
title: 'Local LLMs without excuses: LM Studio and opencode'
description: 'When Claude and OpenAI subscriptions became too expensive, I already had the hardware sitting there. This is the story of going from zero to a fully working local LLM stack — including the wrong turns along the way.'
date: '2026-04-19'
tags: ['ai', 'llm', 'local-llm', 'lm-studio', 'opencode', 'developer-tools', 'dx']
author: 'Miguel Angel de Dios'
slug: 'local-llms-lm-studio-opencode-llmfit'
featured: false
---

## The trigger

Subscription costs for Claude and OpenAI had been creeping up for months. Per-token billing on long agentic sessions adds up faster than you expect, and at some point the monthly total stopped making sense for the kind of routine tasks that make up most of a development day.

The irony was that I already had the hardware. My workstation had been sitting mostly idle between gaming sessions:

- **CPU:** Intel Core i7-12700K (12th Gen, 20 cores)
- **RAM:** 31.1 GB
- **GPU:** NVIDIA GeForce RTX 5060 Ti — 15.9 GB VRAM, CUDA

With 15.9 GB of VRAM, I could run meaningful models locally. The question was not _can I_ — it was _how do I actually get this working the right way_.

This is a follow-up to [AI agents for real development: opencode, memory, and hybrid LLMs](/en/blog/2026-04-18-agent-era-hybrid-llms-memory). The hybrid routing concept is there. Here I go into the local side specifically.

---

## Where do I even start?

The local LLM ecosystem is fragmented. The first time you search for how to run models locally you find Ollama, LM Studio, LiteLLM, llama.cpp, text-generation-webui, vLLM — and no obvious answer to which one you should actually use.

My initial instinct was Ollama. It is the most recommended tool in the places I read, the install is simple, and it worked immediately for basic inference. So I installed it, pulled a couple of models, and tried connecting it to opencode.

That is where things got complicated.

---

## The Ollama problem

Ollama exposes models through its own API format. It is broadly compatible, but broadly is not the same as fully.

When I connected opencode to Ollama, the models would respond — but tool calling was broken in subtle ways. The models would receive a tool definition correctly but then hallucinate the call format, return malformed JSON, or simply ignore the tool and produce a narrative response instead. This is not an Ollama bug exactly — it is a compatibility gap between how Ollama exposes tool schemas and what tools like opencode expect.

I spent a couple of evenings trying to make it work, adjusting system prompts, model parameters, API options. The results were inconsistent. Some tasks worked, others did not, and I could not predict which.

That is when I started looking at alternatives more carefully.

---

## Why LM Studio

LM Studio solved the compatibility problem by taking a different approach: its local server is explicitly designed to be **fully OpenAI-compatible** — same schema, same tool calling format, same response structure. Not approximately compatible. Actually compatible.

The difference showed immediately. Connected opencode to LM Studio and the tool calls worked on the first try.

But the compatibility was not the only thing. The GUI surprised me. When you open LM Studio, it does not just show you a list of all available models — it filters and highlights the ones that are actually a good fit for your specific hardware. Given my VRAM budget, it surfaces the models I can run well and flags the ones that will struggle. That alone saves a lot of trial and error.

And then there is the CLI. The `lms` command gives you everything you need to control LM Studio from the terminal:

```bash
lms ls          # list downloaded models
lms ps          # see what is currently loaded
lms load <model> --gpu max   # load a model, maximising GPU usage
lms server start --port 1234 # start the OpenAI-compatible server
```

Ollama with a GUI and proper OpenAI compatibility is the best way I can describe it. It clicked.

---

## Installation

LM Studio ships as an AppImage on Linux. Download it from [lmstudio.ai](https://lmstudio.ai), make it executable, and run it:

```bash
chmod +x LM_Studio-*.AppImage
./LM_Studio-*.AppImage
```

The CLI companion installs separately:

```bash
npm install -g @lmstudio/lms
lms --version
```

Once LM Studio is running, you download models from the **Discover** tab. The interface shows estimated VRAM requirements and flags models your hardware can run well. For my RTX 5060 Ti, models in the 7B–20B range at Q4 quantization fit comfortably. Larger ones — like `qwen/qwen3.6-35b-a3b` at 22 GB — partially offload to CPU, which works but is noticeably slower.

My current stack:

| Model                                 | Params  | Size on disk |
| ------------------------------------- | ------- | ------------ |
| `google/gemma-4-26b-a4b`              | 26B MoE | 17.99 GB     |
| `google/gemma-4-e4b`                  | 7.5B    | 6.33 GB      |
| `mistralai/ministral-3-14b-reasoning` | 14B     | 9.12 GB      |
| `openai/gpt-oss-20b`                  | 20B     | 12.11 GB     |
| `qwen/qwen3.6-35b-a3b`                | 35B MoE | 22.07 GB     |

Which one I use depends on the task. There is no fixed default — I load the one that fits the job.

---

## Exposing the server on your local network

By default, LM Studio's server binds to `localhost`. That is fine if you only use it from the same machine — but I also want to reach it from my laptop on the same network.

To expose it on the local network, start the server bound to `0.0.0.0` instead:

```bash
lms server start --port 1234 --host 0.0.0.0
```

From any other machine on the same network, the endpoint is your workstation's local IP:

```bash
curl http://192.168.1.XX:1234/v1/models
```

One thing to keep in mind: binding to `0.0.0.0` means any device on your network can reach the server. If that concerns you, restrict access at the firewall level to specific IP addresses. For a home network it is generally fine as-is.

If you want the server to start automatically on boot, a simple systemd service works well:

```ini
[Unit]
Description=LM Studio server
After=network.target

[Service]
ExecStart=/usr/bin/lms server start --port 1234 --host 0.0.0.0
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

---

## Connecting to opencode

Since LM Studio speaks native OpenAI format, opencode connects to it through a standard provider config. The configuration lives in `~/.config/opencode/opencode.json` and registers LM Studio as a named provider alongside any other providers you already have — cloud or otherwise:

```json
{
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://192.168.1.XX:1234/v1",
        "apiKey": ""
      },
      "models": {
        "mistralai/ministral-3-14b-reasoning": {
          "name": "Ministral 3 14B Reasoning",
          "contextLength": 65536
        },
        "qwen/qwen3.6-35b-a3b": {
          "name": "Qwen3.6 35B A3B",
          "contextLength": 32768
        },
        "google/gemma-4-26b-a4b": {
          "name": "Gemma 4 26B A4B",
          "contextLength": 16384
        },
        "google/gemma-4-e4b": {
          "name": "Gemma 4 E4B",
          "contextLength": 131072
        },
        "openai/gpt-oss-20b": {
          "name": "GPT-OSS 20B",
          "contextLength": 65536
        }
      }
    }
  }
}
```

This is a global config, not per-project. opencode already has built-in connectors for other providers — Anthropic, OpenAI, and so on — and they coexist in the same file. The practical benefit is that during a session I can switch between a local model and a cloud model manually depending on what I am doing at any given moment. No environment variables, no restarting anything — just pick the model for the task at hand.

---

## What a session actually looks like

```text
Start of session
├── lms server start --port 1234 --host 0.0.0.0 (if not running)
├── lms load <model-for-this-task> --gpu max
└── check config.json points to the right model

opencode session
├── reads project structure
├── plans tasks
├── executes against local LLM via the configured endpoint
├── runs tests, checks output
└── proposes commit message

If the task is too complex for the local model
└── switch provider manually inside the session — cloud models are in the same config
```

The switching is manual and intentional. Since opencode has native connectors for multiple providers and they all live in the same global config, changing model mid-session is just a matter of selecting a different one. I do this based on what I am working on: local for routine edits and code generation, cloud when I need deeper reasoning or a wider context window.

---

## The honest tradeoffs

**Speed** — models that fit entirely in VRAM are fast. Models that offload to CPU are not. `qwen3.6-35b-a3b` at 22 GB on a 15.9 GB GPU means CPU layers, which adds real latency. I only load it when the task justifies it.

**Quality ceiling** — the local models are good. They are not `claude-opus-4-5`. For architecture decisions or tasks that need deep reasoning over a large context, cloud still has the edge. Locally I cover roughly 70-80% of my daily work well.

**Privacy** — nothing leaves the machine. For code with credentials, internal business logic, or anything I would not want sent to a third party, local is the only option I am comfortable with.

**Cost** — a few watts per hour. A full day of local inference costs less than a single heavy cloud API session.

---

## Next steps

Automatic model routing based on task type is the obvious next thing — letting the tooling decide which model to load rather than me doing it manually. That would make the local stack genuinely seamless rather than just functional.

Also: LM Studio also downloaded a `text-embedding-nomic-embed-text-v1.5` model that I use for memory retrieval in the agent setup. There is potential to use it for smarter context selection before prompting — pulling only the relevant codebase sections rather than passing everything. That is another post.

---

_Previous post in the series: [AI agents for real development: opencode, memory, and hybrid LLMs](/en/blog/2026-04-18-agent-era-hybrid-llms-memory)._
