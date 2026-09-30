# Build 11 — observation and pacing checks

Build 11 changes the viewer, not the chemical model. `engine.js` remains byte-for-byte identical to build 10: Git blob `2e3639afe97ea32a1f6f72281845121c4dd3cf6f`.

## Why the viewer changed

With the default seed 717171, the A-only and B-only controls lose their high-density outlines within five solver steps after isolation. At build 10's 22 steps/second, that was about 0.23 seconds. The large paired sample barely changes, so the most relevant event was easy to miss.

The original memory view also made a substantial chemical difference look like a very small outline change. Build 11 provides a signed concentration-difference view and separate Body and Trace views. The difference map has a fixed scale of -1 to +1 concentration unit; values outside the scale saturate. It does not feed back into the model.

## New observation protocol

- Default playback is 0.5 times the labelled demonstration pace.
- The initial intervention is held until Continue when checkpoints are enabled.
- Intermediate checkpoints and final results remain held. Optional auto-continue/loop waits six visible seconds; it is off by default.
- Holobiont's first five steps now take 6.25 seconds at the default pace. The same five solver steps are computed; the equations and integration step are unchanged.
- Slow early repair, exchange, and collapse are separated from labelled accelerated late relaxation stages.
- Before and intervention states are preserved. Recorded-state review pauses the live model and never rewrites it.
- Small step advances a short stage-dependent batch of real solver steps. It is not reverse physics.
- The seven experiment identities and numerical protocols are retained. No additional universes are added.

## Checks actually executed

The revised HTML, JavaScript and CSS were loaded inline into headless Chromium with a 390 by 844 phone-sized viewport and a 1440 by 1000 desktop viewport. Inline loading was used because this execution environment blocked browser navigation to the local HTTP server. These were local browser tests, not a physical iPhone or Safari test, and not a live-host network test.

1. All seven protocols completed with no JavaScript page errors or failed material-conservation checks.
2. An actual click on Holobiont's start button applied the intervention and froze it before any decay step ran.
3. Driving the elapsed-time playback with 60 Hz time increments produced zero steps during the first second at the default Holobiont pace, then exactly five steps and an inspection stop after the first stage.
4. Early and prolonged-interruption restoration branches were tested separately. Early recovery remained possible; the prolonged branch did not recover a high-density body.
5. Replay after a prolonged restoration test reset the intervention sequence correctly.
6. Dragging the recorded-state slider left the live model time, material total and a sampled concentration unchanged.
7. The phone-width page had no horizontal overflow. Holobiont, wound, memory and turnover states were rendered and visually inspected.
8. The deployed viewer source was compared to the tested source using its Git blob hash.

## Default-seed numerical observations

These are results of this deliberately constructed model, not general biological findings. Body area means the count of sites where A+B exceeds 1.

| Protocol | Solver steps after starting condition | Observed result |
|---|---:|---|
| Assembly | 20,000 | One connected region; 857 active sites; uncoupled control 0 sites |
| Turnover | 8,500 | Original active-material fraction 0.0000947514; experiment and control each 868 sites |
| Puncture repair | 6,500 | All punctured sites active again; experiment 890 sites, control 866; not exact shape restoration |
| Memory | 700 pulse + 4,500 relaxation | Relative concentration difference 13.43%; experiment 887 sites, no-trace control 865 |
| Coupling loss | 100 | Experiment 0 active sites; control 857; total material retained |
| Early restoration | 30 interrupted + 5,500 restored | Experiment 862 sites; control 866 |
| Late restoration | 30 interrupted + 150 extra interrupted + 5,500 restored | Experiment 0 active sites |
| Paired / isolated | 150 | Paired 857 sites; A-only 0; B-only 0 |

The material total was approximately 4754.02814004124 across the default-seed tests; floating-point differences were far below the viewer's 0.0001 conservation tolerance.

## Manual reproduction in a browser

Open the site with `?v=11&seed=717171`. Keep checkpoints enabled and loop disabled. Choose a panel, apply the intervention, inspect the held state, then Continue. Use Small step or 0.25x to inspect rapid changes. In Memory, compare Difference, Body and Trace. In Restoration, test both Restore only the rule and Let it decay longer. At any point, use recorded-state review; then return to the latest state before resuming. Export data records model time and measured history rather than wall-clock playback time.

These tests establish implementation behavior for the tested protocols and seed. They do not establish that every seed produces one body or that the philosophical interpretation is scientifically proven.
