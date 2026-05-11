---
title: 'OpenClaw: my personal AI agent with Mac Mini M4, Ollama Cloud and Telegram'
description: 'One week with OpenClaw: how a personal AI assistant runs on Mac Mini M4 with Ollama Cloud (Qwen 397B), Telegram as interface, and Obsidian for personal notes. First impressions and real use cases.'
date: '2026-05-12'
tags: ['ai', 'openclaw', 'agents', 'mac-mini', 'ollama', 'telegram', 'obsidian', 'personal-assistant']
author: 'Miguel Angel de Dios'
slug: 'openclaw-personal-agent-mac-mini-ollama-cloud-telegram'
featured: true
---

## One week ago I installed OpenClaw

I didn't have high expectations. I had a Mac Mini M4 running 24/7, an Ollama Cloud subscription, and curiosity about what would happen if I built my own assistant instead of using ChatGPT or Claude directly.

After one week, here's the experience.

OpenClaw is a gateway that lives on your machine. It acts as a bridge between messaging channels (Telegram, WhatsApp, Discord...) and AI agents. The idea is simple: you write in Telegram, the agent processes, responds. No special app, no web interface, no terms of service that change every quarter.

---

## Hardware: Mac Mini M4 as a 24/7 server

The machine is the simplest part of the setup. I needed something always on, consuming minimal energy, and powerful enough to orchestrate the agent effortlessly.

Mac Mini M4 with 16 GB RAM checks all boxes:

- **Power consumption**: ~7W idle, ~35W under load. Acceptable to leave running permanently.
- **Performance**: The M4 base is capable. The agent, Telegram services, integrations—everything runs without competing for resources.
- **Noise**: Absolute silence. It's in the living room, next to the router, and you can't hear it.
- **Setup**: I configured the Mac to auto-restart after a power loss and never enter sleep. It's been running like this for a week without issues.

The LLM runs on Ollama Cloud, so the Mac doesn't need a dedicated GPU. It's an orchestration server, not an inference server.

---

## Ollama Cloud: Qwen 3.5 with 397 billion parameters

I moved from running local models to Ollama Cloud with a 397B model. The scale difference is evident.

Ollama Cloud is a subscription (~$20/month) providing access to large models via an OpenAI-compatible API. I'm running `Qwen 3.5` with 397 billion parameters. With my hardware, I can't run something of that caliber locally.

Why the switch? Because a conversational agent needs to understand subtle intentions and maintain complex context. A 397B model has reasoning capacity that smaller models simply don't have. It's a difference in scale, not absolute quality—local models excel at what they're designed for.

Configuration is trivial. OpenClaw supports any OpenAI-compatible provider:

```json
{
  "auth": {
    "profiles": {
      "ollama:cloud": { "provider": "ollama", "mode": "api_key" }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "ollama/qwen3.5-397b-cloud"
      }
    }
  }
}
```

Latency: 2–5 seconds per response, including network time. Acceptable for chat, not for real-time.

---

## Telegram as interface

OpenClaw supports multiple channels (WhatsApp, Discord, Slack, Signal, iMessage...), but I chose Telegram as primary. Practical reasons:

1. It's on mobile, tablet, and laptop.
2. The bot connects outbound—I don't need to open ports.
3. Simple to configure—just a bot token.
4. Fast to respond if the model isn't saturated.

The bot acts as input/output. I write, OpenClaw processes, responds in the same chat. Everything in natural language, no special commands.

---

## Obsidian: personal note-taking space

Obsidian is where I store notes, shopping lists, ideas, plans. OpenClaw can write to it if I ask it to note something, but it's not required.

Important to clarify: OpenClaw has its own memory system (Memory Core, using semantic embeddings). Obsidian is your personal space. Two different things.

In practice:

```text
Me:         Note milk, eggs, flour
OpenClaw:   Where should I save it? Your Obsidian or my context?
Me:         Obsidian
OpenClaw:   ✅ Added to shopping-list.md
```

Or for date reminders:

```text
Me:         Ana's birthday is June 25, remind me
OpenClaw:   ✅ I'll remind you on June 25
```

---

## What OpenClaw does in my daily life

One week turned out to be enough time to set up more than I expected.

### Scheduled automations

**7:30 AM — Global news digest**

```text
OpenClaw:   📰 Today's news (7:30 AM)
            
            🇲🇽 Mexico — Judicial reform advances in congress
            Event: Political tension between executive and judiciary
            Evolution: Decisive vote expected in coming days
            
            🇧🇷 Brazil — Amazon drought reaches historic highs
            Event: Millions affected by water shortages
            Evolution: Expected to worsen through October
            
            🇮🇳 India — Local elections: opposition victory
            Event: Significant political shift in key region
            Evolution: Possible realignments before next general elections
```

It picks three different countries daily, summarizes what's happening, its impact on people, and how it might evolve. I configure it with countries I'm interested in.

**8:00 AM — Weather forecast**

```text
OpenClaw:   🌤️ Weather today and tomorrow
            
            Today (May 12): 18°C–25°C, clear skies
            Tomorrow (May 13): 16°C–23°C, possible afternoon rain
```

For today and tomorrow, with precipitation and alerts if relevant.

**10:00 AM — Development & AI news**

```text
OpenClaw:   💻 Frontend & AI (10:00 AM)
            
            1. React 19.2 launches async Server Actions support
            2. Gemini now supports tool calling with complex JSON schemas
            3. New Astro 5.0 beta optimizes core vitals
```

Finds recent frontend and AI news, filters the relevant bits.

### Conversational queries

```text
Me:         How do I control the living room light?
OpenClaw:   Living room light is in Homey Pro. Currently at 80% brightness.
            Want me to turn it off, on, or adjust brightness?

Me:         Turn it on to 100%
OpenClaw:   ✅ Living room light at 100%. Done.
```

Controls home automation directly through Homey Pro.

### Notes, reminders, and memory

```text
Me:         Note that tomorrow I need to call Mar about project X
OpenClaw:   ✅ Noted: "Call Mar about project X" for tomorrow

Me:         What pending tasks do I have?
OpenClaw:   From my notes:
            - Review develop branch code
            - Call Mar about project X (tomorrow)
            - Buy bread and milk

Me:         Check your memory about project X
OpenClaw:   [retrieves previous context about the project]
            I remembered that Mar needs feedback by Friday
```

Despite volatile context between sessions, the agent recovers memory well when asked. If something's inaccurate, it corrects it.

### Home control

```text
Me:         Set temperature to 22 degrees
OpenClaw:   ✅ Thermostat set to 22°C. ETA: 15 minutes.

Me:         Are all windows closed?
OpenClaw:   According to Homey Pro:
            - Living room: closed
            - Kitchen: closed
            - Bedroom: open
```

Direct integration with Homey Pro for lights, temperature, sensors, etc.

### Voice: STT and TTS

```text
[You send an audio message on Telegram]

OpenClaw:   [Automatically transcribes audio to text]
            "Note that I have a meeting with Carlos tomorrow"
            
            ✅ Added to calendar

[OpenClaw responds with generated audio]
```

STT (speech-to-text) transcribes your voice. TTS (text-to-speech) responds with audio. Configured in Telegram, so you can interact completely by voice if you prefer.

---

## First impressions

### What works really well

**The model is genuinely good.** Qwen 397B understands subtle context, rarely hallucinates, and when it makes mistakes they're intelligent mistakes from missing information, not confabulations.

**Telegram is the right interface.** Everything in one chat. Queries, automations, home control, notes—all in one place without switching apps.

**Scheduled automations are robust.** Every day at scheduled times, I receive filtered news, weather forecast, and alerts. No failures so far.

**Agent memory improves with use.** Despite volatile context between sessions, when I ask it to check its memory about a topic, it recovers context correctly. It learns about you as you interact.

**Homey Pro integrates seamlessly.** The agent can control lights, adjust temperature, query sensors—all like an additional command in the chat.

### Real limitations

**Context between sessions isn't automatic.** If I close a session and open a new one later, it doesn't remember the previous conversation. I have to explicitly ask it to review its memory. Acceptable, but requires that extra step.

**Latency is noticeable.** 2–5 seconds to respond is enough to shift your mental context. For real-time home control, it's not ideal. For everything else, it works.

**Automations need manual configuration.** No visual interface to schedule tasks. You edit the config and restart OpenClaw. Technical, but stable once set up.

### The mindset shift

After one week, OpenClaw became the central point for my interaction with information and controls:

- First I check Telegram (7:30 news, weather, AI alerts)
- From there I control my house without opening Homey
- I note everything (tasks, lists, reminders) in one place
- I ask things I'd normally search on Google

It's not revolutionary. It's efficient. It's a genuine habit change after one week.

---

## What's next

With what's already working, I have in mind:

- **Calendar**: Google Calendar integration so when I ask "when's my meeting with X" it actually knows.
- **Email**: automatic digest of important emails, not everything.
- **Document analysis**: pass PDFs or images and extract information.
- **Automatic context between sessions**: improve Memory Core to retrieve old history without asking explicitly.
- **Voice notifications**: in addition to Telegram, receive important alerts via audio.

The bottleneck is my energy to configure and test. OpenClaw has the tools; it's a matter of dedication.

---

## Week 1 stack

| Component | What I use |
|-----------|-----------|
| **Hardware** | Mac Mini M4 (16 GB)—24/7 server |
| **Agent** | OpenClaw—gateway + orchestration |
| **LLM** | Ollama Cloud (Qwen 3.5 397B)—$20/month |
| **Interface** | Telegram—bot with STT/TTS |
| **Memory** | OpenClaw Memory Core (semantic embeddings) |
| **Notes** | Obsidian—personal Markdown vault |
| **Home automation** | Homey Pro—lights, temperature, sensors |
| **Voice** | STT (transcription) + TTS (synthesis) in Telegram |
| **Automations** | News (7:30), Weather (8:00), Development (10:00) |
| **Status** | Running, actively in use |

---

## Reflection

A week ago this didn't exist. Today it's where I ask something before searching Google. Not because it's faster, but because it's more natural—like having someone intelligent in the chat always available.

What's interesting isn't that it's perfect. It's that it's mine. I don't switch providers because they get bored of me. They don't limit my context because it's profitable. The agent lives on my machine, responds as I decide, does what I configure.

This is just the beginning. But something changed in how I work.

---

*Related post: [Local LLMs without excuses: LM Studio and opencode](/en/blog/2026-04-19-local-llms-lm-studio-opencode-llmfit).*
