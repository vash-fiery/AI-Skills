---
name: debug
description: Find the root cause of a bug, failing test, or error and fix it. Use when something fails, throws, or behaves differently from what is expected.
---

# Debug

Find the cause before changing code.

1. **Reproduce.** Get the exact command, input, or steps that show the failure, and run them. Copy the full error and stack trace. If you cannot reproduce it, say so and gather more information instead of guessing.
2. **Narrow it down.** Read the code on the failing path. Shrink the input, comment out parts, or use `git bisect` to find the commit that broke it.
3. **Form hypotheses.** List two or three possible causes, each with a check that would prove or rule it out. Run the cheapest check first.
4. **Confirm the cause.** You should be able to explain why the bug happens, not just where. Add logging or a breakpoint if needed, and remove it afterwards.
5. **Write a failing test** that reproduces the bug, when the project has tests.
6. **Fix the cause,** not the symptom. Do not silence errors, skip tests, or loosen checks to make the failure go away.
7. **Verify.** Run the failing test and the related test suite. Confirm the original reproduction now passes.
8. **Report** the cause, the fix, and how you verified it, in a few sentences.
