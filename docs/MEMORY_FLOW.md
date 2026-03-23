# RECALLCODE - Hindsight Memory Flow

## Life of a User Interaction

### 1. The Request (Initial)
Student opens a problem: "Sum of an Array".
- **Hindsight Pull**: Backend fetches user memories (`category='mistake_pattern'`).
- **Context Injection**: "Student has a history of `off-by-one errors` in `Arrays`."
- **Action**: Mentor hints: *"Check your loop bounds carefully!"* **before** the student even submits.

### 2. The Submission (During)
Student submits code: `arr[len(arr)]`—which results in an `IndexError`.
- **Hindsight Check**: AI recognizes the pattern matches a previously stored memory.
- **Action**: AI provides an adaptive hint: *"I've seen this before—remember that array indices are 0 to len(arr)-1. Your access `arr[len(arr)]` is one index too high."*

### 3. The Reflection (Post)
Student corrects code and passes.
- **Reflection Engine Output**:
  - `correctness`: true
  - `mistake_pattern`: detected 'index-out-of-range' (matching existing memory)
  - `importance`: 0.9 (since it repeated)
- **Hindsight Storage**: Updated importance/timestamp for specific memory entries.
- **Action**: Summarizes session in a weekly trend dashboard.

## Multi-Session Evolution

1. **Session 1 (Unfairly Difficult)**: Student struggles with arrays.
2. **Hindsight Storage**: `struggled_heavily: arrays`.
3. **Session 2 (Adaptive Choice)**: Backend selects a *smaller* array problem next time.
4. **Hindsight storage**: `preferred_strategy: small_examples`.
5. **Session 3 (Adaptive Choice)**: Mentor provides hints *using small examples* instead of theory.

## Future Improvement: The "Growth Factor"
When a student **corrects** a repeating mistake 3 times in a row, the `Hindsight` layer marks it as `improving` and reduces the frequency of hints for that specific pattern, demonstrating real-world learning.
