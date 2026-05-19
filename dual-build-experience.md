# Dual Build skill — experience report (v1.3.2 release)

Date: 2026-05-05
Branch: `sprint/v1.3.2`
Skill: `/dual-build`
Outcome: bailed at Stage 0; shipped via single-agent build instead.

## The task

Ship v1.3.2 with four bugs fixed and `manifest.json` bumped:

- (a) Remove ThreatCrowd (defunct service) from the platform list.
- (b) Dedupe Malware Bazaar — duplicate key was opening two tabs per hash lookup.
- (c) Tighten the indicator-detection domain regex (it was over-matching).
- (d) Wrap selected text with `encodeURIComponent` before interpolating into platform URLs (`#`, `&`, etc. were breaking lookups).

I invoked `/dual-build` and asked the skill to decompose into file-disjoint subtasks.

## What `/dual-build` actually did

Stage 0 only. The pipeline never ran. I read the four affected source files, evaluated the decomposition options, and declined to dispatch builders.

## Why I bailed

### 1. The decomposition produced a 90/10 split

The file footprint of the four bugs:

| Bug | File |
|---|---|
| (a) ThreatCrowd removal | `popup.html` |
| (b) Malware Bazaar dedupe | `background.js` |
| (c) Domain regex over-match | `background.js` |
| (d) `encodeURIComponent` on `selectedText` | `background.js` |
| Manifest version bump | `manifest.json` |
| Popup title bump | `popup.html` |

Three of the four bugs all live in `background.js`. The only file-disjoint split available was:

- **T1 (`background.js`)** — bugs (b), (c), (d) — all the substantive work
- **T2 (`popup.html` + `manifest.json`)** — bug (a) + version bumps — ~5 lines of trivial deletions

That split passes the skill's "file-disjoint" gate but defeats its purpose. The cross-review is the load-bearing piece of the workflow, and a 5-line trivial T2 gives the cross-reviewer almost nothing to validate. Meanwhile T1 — the part that actually benefits from a second pair of eyes (regex correctness, encoding-edge-cases) — gets reviewed in isolation, same as a single-agent run would produce. Running the full pipeline for that ratio is theater.

### 2. Pre-existing unstaged changes

The working tree already had ~30 LOC of in-flight security hardening across the same three files (`background.js`, `manifest.json`, `popup.html`) plus a `package-lock.json` update — none of it committed. Worktrees branch from `HEAD`, so any worktree-based build would have started from a baseline missing those edits, and the merges back would either silently overwrite the work or produce conflicts that shouldn't exist by the workflow's design.

That's not a bug in the skill — the skill correctly assumes a clean tree. But it's a precondition the orchestrator needs to check, and the skill's prerequisites section doesn't currently mention it.

## What I did instead

Two sequential commits on `sprint/v1.3.2`:

1. **`9c03705`** — `chore: harden CSP, IPv6 validation, and any.run URL handling`. Captured the in-flight hardening work as a self-contained commit before applying anything new on top.
2. **`c79a004`** — `fix: v1.3.2 release fixes`. The four sprint bugs + manifest bump + popup title bump.

Verification:

- `node --check background.js` — passed
- `python3 -c "json.load(...)"` on `manifest.json` — passed
- Inline regex test against 11 cases (good and bad) — passed; rejects `abc-def`, `a..b`, leading/trailing dots, leading/trailing hyphens; accepts normal multi-label and punycode domains.

## Observations on the skill itself

### What worked

- **Stage 0 "read code first" was the load-bearing instruction.** Without it I'd have fanned out builders, hit the imbalance only at Stage 3 consolidation, and burned ~8 model calls to learn what a 30-second file scan revealed. The skill's insistence on understanding module boundaries before splitting is correct.
- **The "bail" criteria are operational, not vibes.** "Single-file or <50 LOC", "tightly coupled work", "decomposition can't be made disjoint" — concrete enough to act on without second-guessing. I'd estimate this task ended up around 30 LOC of substantive change; well under the bail threshold.
- **Prerequisite checks (`git rev-parse`, `git worktree list`) caught nothing this time, but they're cheap and correctly placed.**

### Gaps worth flagging

- **"File-disjoint" is necessary but not sufficient.** A split can be perfectly disjoint and still be 90/10 imbalanced, which negates the cross-review value. Suggest adding an explicit balance check to the bail criteria — something like "if any subtask is <20% of the total LOC delta, prefer single-agent."
- **No "clean tree" precondition.** The pipeline silently assumes a clean working tree. When the user has uncommitted changes in files the workflow plans to touch, those changes will be invisible to the worktrees and clobbered on merge. Worth either gating on `git diff --quiet` or surfacing the situation to the user before Stage 0 completes.
- **Cost calibration.** Skill notes ~8 model calls for N=4. For a release with 4 small bugs across 3 files, the right move was 0 builder/reviewer calls. Choosing not to run the pipeline is itself a valid skill output, and the skill's framing already supports that — but it's worth reinforcing that "use this skill" is not the same as "run the pipeline." Sometimes the skill's job is to talk you out of running it.

## Net assessment

The skill behaved correctly: I invoked it, it forced me to decompose carefully, and the decomposition revealed that single-agent was the right tool. That's a good outcome — the bail saved tokens and time without giving up correctness. The cross-review value would have been near zero on this particular task because the work that actually needed cross-validation was concentrated in a single file that no split could break apart.

The friction points (no balance check, no clean-tree precondition) are minor and would each be a one-line addition to the skill's guardrails section.
