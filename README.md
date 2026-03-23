# RECALLCODE — AI Coding Practice Mentor with Hindsight Memory

**RECALLCODE** is an adaptive AI-powered coding practice mentor for students that doesn't just explain code—it learns how they fail, remembers it, and adjusts its teaching strategy over time.

Built for the **AI Agents with Memory** hackathon, this project demonstrates a persistent **Hindsight memory layer** that stores, reflects, and recalls student behavior patterns to provide personalized guidance.
---
## demo
https://github.com/user-attachments/assets/cc99649a-313f-45d3-8f18-9400723946f5

---
## 🚀 The Core Idea: Why Memory Matters?

Generic AI coding assistants are great at giving answers, but they lack context. They don't remember that a student *always* forgets base cases in recursion or *repeatedly* makes off-by-one errors in array loops.

**RECALLCODE** solves this by:
1.  **LEARNING**: Extracting behavioral patterns from every code submission.
2.  **RECALLING**: Injecting user-specific "Hindsight" into every hint and problem generation.
3.  **REFLECTING**: Creating a structured session summary to improve future interactions.
4.  **ADAPTING**: Changing hint depth, tone, and focus based on past student struggles.

---

## 🛠️ The Tech Stack

-   **Frontend**: Next.js (Tailwind CSS, Monaco Editor, Lucide Icons)
-   **Backend**: FastAPI (Python)
-   **Memory Layer**: Hindsight (Structured JSON memory stored in SQLite)
-   **LLM Brain**: OpenAI / Groq (Configurable via environment variables)
-   **Database**: SQLite (Lightweight local persistence)

---

## ✨ Features

-   **Hindsight Dashboard**: A "What I Remember About You" panel showing stored patterns.
-   **Adaptive Hint System**: Hints that change based on your history (e.g., "I noticed you usually struggle with loop bounds—check them carefully here!").
-   **Automatic Reflection**: Post-session analysis that extracts new learnings into long-term memory.
-   **Seeded Demo User**: Comes with pre-loaded "History" for immediate demo impact.

---

## 🏗️ Architecture

RECALLCODE uses a modular architecture to separate memory from intelligence:

-   **Hindsight Memory Store**: Stores `mistake_patterns`, `weak_topics`, and `successful_strategies`.
-   **Reflection Engine**: Analyzes each session completion to distill high-level insights.
-   **Mentoring Engine**: Crafted prompt engineering that forces the LLM to use Hindsight context.

---

## 🚦 Getting Started

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Create `.env` with `OPENAI_API_KEY`
4. Run `python -m app.core.seed_demo` to seed the demo student.
5. `uvicorn app.main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

---

## 📽️ Demo Scenario

**The "Array Mistake" Pattern:**
1.  Log in as the **demo student**.
2.  The dashboard shows: "What I remember: Frequent off-by-one errors."
3.  Choose the **"Sum of an Array"** challenge.
4.  Submit code with a loop like `for i in range(len(arr) + 1):`.
5.  Click **"Get Hint"**.
6.  The AI responds: *"I've noticed a pattern in your earlier work—you often handle array boundaries with an extra index. Does `range(len(arr)+1)` look right to you?"*

This is **Hindsight in action.**
