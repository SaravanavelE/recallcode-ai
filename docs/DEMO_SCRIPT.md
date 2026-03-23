# RECALLCODE - Demo Script

## 🎬 Introduction (0:00 - 0:45)
- "Hi, we're building **RECALLCODE**—an AI coding mentor that uses Hindsight memory."
- "Generic chat bots forget who you are. RECALLCODE remembers how you fail and changes its teaching strategy over time."

## 🚀 The Setup (0:45 - 1:30)
- "Let's log in as our demo student."
- **Dashboard View**: Show the "What I Remember" sidebar. 
- Highlight: "Frequent off-by-one errors" and "Prefers examples." 
- "The AI already knows this student struggles with array bounds."

## 🧠 The Adaptive Interaction (1:30 - 3:00)
- "Let's open the 'Sum of an Array' problem."
- **Code Editor**: Write a loop like `for i in range(len(arr) + 1): sum += arr[i]`.
- Click **"Submit Solution"**.
- **Mentor Response**: Show the reflective hint. 
- AI: *"I see that familiar off-by-one pattern again. Look at `range(len(arr) + 1)`—is that reaching past the last index?"*
- **Explain**: "Notice how the AI didn't just say 'index error'. It specifically referenced the student's *historical pattern*."

## 📈 The Reflection Loop (3:00 - 4:00)
- Fix the bug: `range(len(arr))`.
- Click **"Submit"** again. Correct!
- **Reflection View**: Show the "Session Reflection" panel.
- AI: *"Great catch! You improved your handling of array boundaries this time."*
- **Dashboard Refresh**: Show how the importance scores for "off-by-one" might change or that a "Success" was logged.

## 🏁 Conclusion (4:00 - 5:00)
- "RECALLCODE isn't just a coding bot. It's a persistent mentor that learns with you."
- "By using Hindsight, we create a more human, effective, and encouraging learning path for every student."
- "Thanks for watching!"
