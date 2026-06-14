---
title: 'The era of agents: a reflection on AI that acts'
description: 'A reflection on how AI agents are changing software development, why the LLM is just the tip of the iceberg, and what challenges we face as we hand autonomy to systems that reason, plan, and execute.'
date: '2026-06-14'
tags: ['ai', 'agents', 'llm', 'development', 'autonomy', 'multi-agent', 'reflection']
author: 'Miguel Angel de Dios'
slug: 'the-era-of-agents'
featured: true
---

## From answering to acting

For years, artificial intelligence in software felt like a very capable assistant. You asked it something, it gave you an answer. You copied the answer, pasted it, adapted it. The loop ended there.

It was useful, but passive.

Today we are in a transition that is easy to underestimate: AI is moving from being a response generator to becoming a **system that pursues goals**. It no longer just tells you how to do something; if you give it trust, it does it. It navigates your codebase, runs commands, passes tests, iterates on errors, and makes local decisions without asking permission for every step.

That is what we call an agent.

And it is not just an incremental improvement. It changes the central question of development: from "how do I write this?" to "what goal do I want this system to achieve for me?"

---

## What distinguishes an agent from an assistant?

The difference is not in the underlying model. Both can use the same LLM. The difference is in the loop:

| Characteristic | Traditional assistant | Autonomous agent |
| --- | --- | --- |
| Input | One-shot prompt | High-level goal |
| Output | Text, code, explanation | Executed actions in the environment |
| Memory | Conversation context | Persistent state across sessions |
| Tools | None or very limited | Access to terminal, files, APIs, tests |
| Verification | User evaluates | Agent iterates and validates its own steps |
| Control | Human at every step | Human as supervisor, not operator |

An assistant helps you think. An agent thinks and acts.

This implies a transfer of responsibility that we should not take lightly. When an assistant is wrong, the error stays on the screen. When an agent is wrong, it might install the wrong dependency version, delete files, or introduce a silent bug in production.

---

## The LLM as a reasoning core

At the heart of almost every current agent is a language model. But its role is not just to "write nicely". In an agent architecture, the LLM functions as a practical reasoning engine:

- It **interprets the user's intent**, even when vaguely stated.
- It **decomposes goals** into concrete, orderable subtasks.
- It **selects tools**: decides whether it needs to read a file, run a test, search documentation, or launch a command.
- It **evaluates results** to know whether to continue, correct, or ask for help.
- It **maintains coherence** across multiple steps, going beyond the immediate context of a chat.

This is why frameworks like ReAct, Chain-of-Thought, or Tree-of-Thoughts have become relevant. They do not improve the model by themselves; they improve the way the model structures its reasoning to act upon the world.

However, the model is still imperfect. It hallucinates, has biases, and holds a shallow understanding of deep causes. That means the agent needs **checks and balances**: tests, linters, reviews, sandboxes, and, above all, a human who supervises the plan before execution.

---

## The strength of the multi-agent ecosystem

The next level of complexity arrives when there is not one agent, but several collaborating. Each with a defined role, a scope of responsibility, and a way to communicate with the others.

Imagine a real development flow:

- A **researcher agent** explores the codebase and summarizes which parts are relevant.
- A **planner agent** proposes an ordered plan of changes.
- An **editor agent** implements the changes file by file.
- A **testing agent** runs the suite, identifies failures, and feeds them back.
- A **reviewer agent** checks quality, style, and potential regressions.

None of them needs to be a giant model. In fact, one of the most interesting trends is **model routing**: simple tasks for fast, cheap local models; complex tasks for powerful cloud models. The system gains speed, cost-efficiency, and accuracy by assigning the right brain to each problem.

Coordination between agents is today one of the most open fields. Protocols like MCP (Model Context Protocol) are starting to standardize how agents connect to tools, memories, and other agents. There is no dominant architecture yet, but the direction is clear: build virtual teams of specialists, not AI monoliths.

---

## The challenges we cannot ignore

Let's be honest: agents introduce risks that we did not have with more passive tools.

### 1. Security and permissions

An agent with access to your terminal can do almost anything you can. If the model misinterprets an instruction, the consequences are not limited to an incorrect answer. Running commands in controlled environments, using containers, or requiring explicit approval for destructive operations should be the norm, not the exception.

### 2. Reliability and hallucinations

An agent may seem to advance confidently while building on a false premise. Worse: it can hide the error under several steps of correct reasoning built on an initial misunderstanding. That is why you need to be able to trace its decisions.

### 3. Dependency and skill atrophy

If we delegate too much, we risk forgetting how things work underneath. The agent becomes a black box, and we become supervisors unable to detect subtle errors.

### 4. Operational cost

Every step of an agent consumes tokens, time, and energy. A poorly designed agent loop can be much more expensive than doing the task manually. Flow efficiency matters as much as model quality.

### 5. Ethics and transparency

Who is responsible when an automated agent makes a bad decision? How do we audit its behavior? These are not abstract questions. They need answers soon.

---

## The new role of the developer

People often talk about agents as if they were the end of the human developer. Personally, I think that is a misunderstanding.

Agents do not come to replace us. They come to change where we invest our energy.

Before, much of the work consisted of typing out solutions step by step. Now, value shifts toward:

- **Defining objectives clearly**: a poorly defined goal produces a well-executed but wrong result.
- **Designing checks and balances**: tests, validations, sandboxes, and guardrails that limit the margin of error.
- **Configuring the agent ecosystem**: choosing models, tools, memory strategies, and communication protocols.
- **Reviewing with judgment**: the agent proposes, the human decides. Blind trust is the fastest way to get into trouble.
- **Maintaining deep understanding**: knowing enough to tell when the agent is inventing or oversimplifying.

In a way, the developer becomes an orchestra conductor. Not playing every instrument, but responsible for making the piece sound right.

---

## Where we are heading

The current generation of agents is still far from truly autonomous. They need supervision, make mistakes, and consume a lot. But the direction is unmistakable: every month the loops get a little longer, the memory a little more persistent, the tools a little richer, and coordination a little more sophisticated.

In the near future, we probably will not have a single omniscient agent. We will have flows of specialized agents collaborating under our direction. Some will be local to preserve privacy, others in the cloud for tasks requiring power. Some will act in seconds, others will plan over days.

What does seem clear is that the question is no longer whether agents will change software development. The question is what kind of developers we want to be in a world where AI does not just suggest, but acts.

And that question, at least for now, is still ours.
