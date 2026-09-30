# Build 12 — visible material replacement

Only the Turnover panel is replaced. `engine.js`, `viewer11.js`, `viewer11.css`, and the other six experiment definitions and protocols remain unchanged.

## What the viewer can now follow

1. Follow an initially active, original material sample near the measured boundary.
2. Watch its real A/B-to-Q transition: solid becomes hollow, but the original identity remains.
3. Watch it exchange with the reservoir. Its identity ends; a new, gold identity enters as dissolved Q.
4. Watch the incoming sample become active through a local Q-to-A/B reaction. The walkthrough holds at the events; the original is not recoloured or assigned a replacement slot.
5. Run the full-supply exchange. The material provenance changes while the untreated, matched-control concentration evolution is compared throughout. The result remains held once original active material is below 0.1%.

White circles mean original samples; gold diamonds mean incoming samples. Solid marks are active; hollow marks are dissolved. A magnified tracked-sample view and an outgoing-identity record make the microscopic exchange inspectable. The frozen BEFORE outline is a comparison only. Controls sit above the canvas; playback pauses when the canvas is off-screen or the tab is hidden. Review holds the live calculation rather than rewinding it.

## Model and interpretation

800 passive samples follow the same local nine-point diffusion and reaction operator as the concentration solver. One exclusive event is sampled per fixed integration step. A/B decays to Q at rate 1; Q converts to A and B at rates J/Q each. Only Q exchanges with the reservoir. The selected sample is chosen from the initial state, without inspecting its future trajectory. Some incoming samples can wash out without incorporation; such outcomes are reported rather than redirected.

The wash rate is 1 per model-time unit, rather than build 11's 0.12. This alters neutral material exchange only, not the A/B/Q concentration equations. Reservoir exchange occurs throughout the dissolved bath, not through a simulated bloodstream. Incoming material is chemically identical by assumption. The concentration fields generate the body; the tracked particles do not influence it. Counts from the finite sample can differ from the continuum percentages. No claim of exact zero original material or proof of human identity is made.

## Checks actually executed

Run `node test-parcels12.js` with no dependencies.

For seed 717171, the selected original sample (display ID #502) becomes dissolved at solver step 20 and exits at step 38. The new sample (display ID #1538) becomes active at step 51. These times arise from seeded local stochastic events, not prescribed animation timestamps. At the default single-sample pace, the three transitions take approximately 3.3, 3.0 and 2.2 running seconds, with inspection holds in between.

After 1,060 steps of exchange, original active material is 0.0970036053%. Body area is 859 active grid sites in both the experiment and its control (initial area was 857). The maximum active-concentration difference from the matched control is exactly zero in the numerical test. Bath material differs from its initial total by approximately -7.28e-12, floating-point roundoff.

All A/B/Q arrays were checked against their control after every solver step. Every observed identity retained its original/incoming provenance; replacements received new IDs. The passive sample count remained 800. An independent 20,000-sample test after 100 steps measured an original active fraction of 0.52636, versus the continuum value 0.52228, consistent within the stated 0.02 tolerance.

The full site was loaded with inline local assets in headless Chromium at 390×844 and 1440×1000 viewports. The three single-parcel checkpoints, full replacement, reset and recorded-state review were exercised. No JavaScript page errors or horizontal overflow were observed. Review left the live model time unchanged. The six other panels remained unstarted and unmodified during the turnover test. These are local browser and numerical checks, not a physical iPhone/Safari test.

## Tested source fingerprints

- `engine.js`: Git blob `2e3639afe97ea32a1f6f72281845121c4dd3cf6f` (unchanged).
- `viewer11.js`: Git blob `a96c28c69585b518e058bbefdb11efa5daa78c81` (unchanged).
- `parcels12.js`: Git blob `a44f71eabad86b550dfb3433e0aa5435a5456255`.
- `turnover12.js`: Git blob `655dc82ba25855d75a28cc011851e8204840c685`.
