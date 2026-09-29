# Continuity build 10 — verification

These are measured outcomes of the supplied **synthetic chemical-body model**, not biological findings or proof of personal identity. The same engine runs in the browser and in the numerical test. No rendered outline or outcome measurement feeds back into its dynamics.

## Reproduce

Run `node test.js` in a checkout. No packages are required. The script asserts its checks and writes `test-results.json`. Default seed: 717171. Grid: 64 × 64. Step: 0.04. Eight-neighbour, nine-point diffusion. The common body is grown for 20,000 steps from a noisy chemical patch.

## Measured default-seed outcomes

| Check | Result |
| --- | --- |
| Assembly | One connected high-density body; 857 active grid sites. The no-coupling control does not maintain a body. |
| Material conservation | Initial total 4754.028140041417; post-assembly total 4754.028140041252. Absolute floating-point error below 2 × 10^-10. |
| Nonnegative concentrations | Minimum post-assembly concentration 9.22 × 10^-25. |
| Puncture | A radius-8 patch converts active material into precursor. Active area falls from 857 to 664 sites. |
| Local repair | After 6,500 unchanged-rule steps, all initially active puncture sites again exceed the activity threshold. Total body area is 890 sites, not an exact return to its original shape; mean concentration within the puncture is about 91.2% of its pre-injury value. |
| Turnover | After 8,500 steps of isotopic precursor exchange, original active material fraction is 0.0000947514 (about 0.0095%). The maximum concentration difference from the identically evolved unlabeled control is exactly zero. |
| Relations lost | Coupling disabled for 100 steps: zero sites above the body threshold, while total material remains conserved. Some dilute active molecules remain; loss of an outline is not deletion of every molecule. |
| Early restoration | Coupling disabled for 30 steps, then restored for 5,500: the high-density body returns, with 862 active sites in one component. No snapshot is loaded. |
| Late restoration control | Coupling disabled for 180 steps, then restored for 5,500: no high-density body recovers in this protocol. The failure remains visible. |
| Local memory | Both samples receive the same 700-step stimulus, followed by 4,500 stimulus-free steps. The trace-enabled sample retains 217.6 dimensionless trace units and differs by about 13.4% in relative L1 active concentration from the no-trace control. |
| Designed mutual dependence | A-only and B-only controls lose their high-density bodies; paired A+B remains at 857 active sites after 100 steps. Isolating a partner converts it to precursor, so the controls have equal total matter. |

The default seed and five additional seeds (7, 71, 717, 42, 12345) each formed one connected body. That finite sample is not a guarantee for every seed or intervention.

## Browser checks

Tested the same files in installed Chromium, including a 390 × 844 mobile viewport: seven cards; all seven intervention paths; early and late restoration; direct pointer puncture; JSON export; no horizontal overflow; no page errors. Desktop screenshots were also inspected. **Mobile emulation is not a physical iPhone or Safari test.**

## Interpretation limits

This model is tuned to make the questions inspectable. It has a noisy spatial seed and chosen reaction coefficients; it does not demonstrate spontaneous life from nothing. Its boundary is an A+B > 1 measurement, not a separately modelled membrane. Turnover assumes the tracer is chemically neutral. Injury is local chemical deactivation, not excision of flesh. Memory is a local coefficient trace, not cognition. The two populations are chemical surrogates with explicitly designed mutual catalysis, not simulated microorganisms. No physiological energy budget is modelled.

The different experiments use different display rates, but all use the same fixed numerical time step. Results pause for inspection. Replay/Reset is explicitly a new trial; recovery itself never restores the earlier state.
