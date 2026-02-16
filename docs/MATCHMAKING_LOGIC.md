# DevCollab Matchmaking Logic (MVP)

## MVP Principle

Matchmaking in MVP is **deterministic and simplified**. It is intentionally not a multi-user balancing system.

## Current Behavior

When a user calls `POST /projects/start`:

1. The backend creates a new project instance from a predefined project template.
2. The same authenticated user is added to that instance.
3. A role is assigned using a simple deterministic rule defined by the implementation (no optimization/scoring engine).
4. Tasks for the assigned role are attached/initialized for that user.

## What MVP Matchmaking Does NOT Do

- No real-time group formation across multiple users.
- No skill-weighted pairing algorithm.
- No queue-based matching.
- No dynamic role balancing across team members.
- No reassignment workflow.

## Why This Is Acceptable for MVP

The MVP goal is to validate project lifecycle flow end-to-end:
register/login → profile setup → project start → task upload → completion/dashboard.

A deterministic assignment keeps behavior predictable, testable, and easy to operate before introducing complex matchmaking.

## Future Direction (Post-MVP)

Future phases may introduce:

- multi-user team assembly,
- skill-to-role scoring,
- queue and fairness rules,
- automatic role conflict resolution.
