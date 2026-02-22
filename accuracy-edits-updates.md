# CS234 Learning Site: Accuracy Verification Report

Comprehensive cross-check of all 11 lecture HTML pages against the original PDF slides.

**All HIGH and MEDIUM priority fixes have been applied.** LOW priority items remain optional.

---

## Summary

| Lecture | Status | Critical Issues |
|---------|--------|----------------|
| 1  | Needs fixes | 1 HIGH, 2 MEDIUM |
| 2  | Good | No action needed (issues inherited from PDF) |
| 3  | Needs fixes | 1 HIGH (cascading sign error) |
| 4  | Clean | No issues found |
| 5  | Clean | No issues found |
| 6  | Minor | 1 LOW (looking-ahead text) |
| 7  | Needs fixes | 1 HIGH (double-counted importance weight) |
| 8  | Needs fix | 1 MEDIUM (DAgger missing detail) |
| 9  | Good | Minor notation differences only |
| 10 | Needs fixes | 1 HIGH (broken link), 2 MEDIUM |
| 11 | Good | Minor only |

---

## HIGH Priority Fixes

### 1. Lecture 3, line 145: Mars Rover reward sign is wrong

**File:** `lectures/lecture03.html`

The reward for state s1 is **+1** in the PDF (slides 14, 35-36) but **-1** in the HTML.
This single error cascades through every worked example in the lecture.

**Fix:** Change `R(s) = [-1, 0, 0, 0, 0, 0, +10]` to `R(s) = [+1, 0, 0, 0, 0, 0, +10]`

Then fix all downstream computations:
- **Line 147:** trajectory reward at s1 should be `+1`, not `-1`
- **Line 149:** MC return computations — all signs flip:
  - `G_2 = gamma^2` (not `-gamma^2`)
  - `G_3 = gamma` (not `-gamma`)
  - Every-visit estimate = `(gamma^2 + gamma) / 2`
- **Lines 240-243:** TD worked example — all signs flip:
  - `V(s_1) <- 0 + 1*[+1 + 1*0 - 0] = +1` (not `-1`)
  - `V(s_2) <- 0 + 1*[0 + 1*(+1) - 0] = +1` (not `-1`)

---

### 2. Lecture 1, line 75: DeepSeek-R1 vs DeepSeek-R1-Zero

**File:** `lectures/lecture01.html`

The HTML says "DeepSeek-R1" was trained without supervised fine-tuning. The PDF (slide 2)
specifically identifies this as **DeepSeek-R1-Zero**. The full DeepSeek-R1 model *does* use SFT.

**Fix:** Change "DeepSeek-R1" to "DeepSeek-R1-Zero" on line 75.

---

### 3. Lecture 7, line 96: Surrogate objective double-counts importance weight

**File:** `lectures/lecture07.html`

The surrogate objective formula has `a ~ pi'` in the expectation subscript while also
including the importance ratio `pi'(a|s) / pi(a|s)` inside. This double-counts.

The expectation should be over `a ~ pi` (old policy) with the importance ratio, OR
over `a ~ pi'` (new policy) without it. The PDF (slide 18) uses `a ~ pi` with the ratio.

**Fix:** Change the subscript from `a \sim \pi'` to `a \sim \pi` on line 96:
```
\mathbb{E}_{\substack{s \sim d^\pi \\ a \sim \pi}}
```

---

### 4. Lecture 10, line 40: Broken PDF link

**File:** `lectures/lecture10.html`

The link points to `../slides/lecture10post.pdf` but this file does not exist.
The slides directory contains `lecture1pre.pdf` through `lecture9pre.pdf` and `lecture11pre.pdf`
— there is no lecture 10 PDF at all.

**Fix:** Either:
- Obtain the lecture 10 PDF and add it to `slides/`
- Remove or update the link with a note that slides are unavailable
- Point to the correct filename if it was misnamed

---

## MEDIUM Priority Fixes

### 5. Lecture 1, line 158: MDP components conflated with RL algorithm components

**File:** `lectures/lecture01.html`

The HTML states: "An MDP is specified by three core components: a model, a policy, and a
value function." The PDF (slide 62) presents model/policy/value function as components of
an **RL algorithm**, not as the formal definition of an MDP. An MDP is defined by
(S, A, P, R, gamma).

**Fix:** Reword to something like: "An RL algorithm often includes one or more of three
components: a model, a policy, and a value function."

---

### 6. Lecture 1, line 93: "Reward is Enough" hypothesis weakened

**File:** `lectures/lecture01.html`

The HTML says "most abilities" but the PDF (slide 15) says "most **if not all** abilities."
This meaningfully weakens the original hypothesis.

**Fix:** Add "if not all" — change to: "...behavior exhibiting most, if not all, abilities
studied in natural and artificial intelligence."

---

### 7. Lecture 8, lines 169-183: DAgger missing mixing policy step

**File:** `lectures/lecture08.html`

The DAgger algorithm description omits the mixing policy step present in the PDF (slide 12):
`pi_i = beta_i * pi* + (1 - beta_i) * pi_hat_i`. In early iterations, the algorithm
mixes expert and learned policies rather than running the learned policy directly.

**Fix:** Add a step to the DAgger algorithm: after training `pi_hat_n`, define the
execution policy as `pi_n = beta_n * pi* + (1 - beta_n) * pi_hat_n` where `beta_n`
decreases over iterations (e.g., `beta_n -> 0`).

---

### 8. Lecture 10, lines 100 vs Lecture 9 line 344: UCB regret constant inconsistency

**Files:** `lectures/lecture09.html` and `lectures/lecture10.html`

Lecture 9 (line 344) states the UCB problem-dependent regret bound with constant **4**:
`L_T <= sum (4 log T) / Delta_a + sum Delta_a`

Lecture 10 (line 100) states it with constant **16**:
`Regret(n) <= sum (16 ln n) / Delta_i + 3*Delta_i`

Both are valid bounds but use different confidence level conventions (delta = 1/t vs
delta = 1/n^2) without explaining the discrepancy.

**Fix:** Add a brief note in lecture 10 explaining: "Note: the constant 16 here (vs. 4 in
the previous lecture) arises from using a tighter confidence level delta = 1/n^2 rather
than delta = 1/t."

---

### 9. Lecture 10, line 149: Proof intermediate formula

**File:** `lectures/lecture10.html`

The derivation states `u_i >= 2 ln(1/delta) / ((1-c)^2 * Delta_i^2)` but the direct
algebraic rearrangement of the stated constraint gives `c^2` in the denominator, not
`(1-c)^2`. At `c = 1/2` the final answer happens to be the same, but the intermediate
step is misleading.

**Fix:** Change `(1-c)^2` to `c^2` on line 149, or clarify the derivation to explain
why `(1-c)` is used (if the proof approach differs from the stated constraint).

---

## LOW Priority (Optional Fixes)

### 10. Lecture 3, lines 300-341: TD(lambda) / eligibility traces content not in PDF

The HTML contains a substantial section on n-step returns, TD(lambda), and eligibility
traces that is **not present in the lecture 3 PDF slides**. The PDF only briefly mentions
TD(0) can be generalized. This content may be from Sutton & Barto Ch. 7/12.

**Action:** Consider adding a note like "The following extends beyond the lecture slides,
drawing from Sutton & Barto Chapters 7 and 12." Or leave as-is if supplementary content
is intentional.

---

### 11. Lecture 7, line 375: MaxEnt IRL partition function missing state argument

The PDF defines `Z(w, s)` (conditioned on starting state), but the HTML writes `Z(w)`.

**Fix:** Change `Z(w)` to `Z(w, s)` and sum over trajectories starting from `s`.

---

### 12. Lecture 6, line 338: "Looking Ahead" text doesn't match PDF

The HTML says the next lecture covers "TRPO, natural policy gradients, and imitation
learning." The PDF says the next class continues PPO theory.

**Fix:** Update the looking-ahead text to match the actual content of lecture 7.

---

### 13. Lecture 10, line 336: UCBVI regret bound exponent

The HTML states `O(sqrt(|S||A| H^3 T))` but the tightest known UCBVI bound (Azar et al.,
2017) is `O(sqrt(H^2 SAT))`. The `H^3` is from an older/looser analysis.

**Fix:** Update to `H^2` or note which version of the bound is being cited.

---

### 14. Lecture 1, line 130: State function notation

The HTML introduces `s_t = f(h_t)` with an explicit function `f` not present in the PDF
slides (which just write `s_t = (h_t)` in notation).

**Action:** Minor — consider removing the `f` or noting it's editorial clarification.

---

### 15. Lecture 1, line 79: IMO result context

The HTML says "gold-medal score (35 out of 42 points)" matching PDF slide 2, but omits
that PDF slide 11 shows a separate earlier silver-medal result (28 points on IMO 2024).

**Action:** Consider adding context that these are two different results/years if both
slides are referenced.

---

## No Issues Found

- **Lecture 4 (Q-Learning):** All formulas correct. Ablation numbers verified. No errors.
- **Lecture 5 (Policy Gradient I):** All 15+ formulas match PDF exactly. No errors.
- **Lecture 9 (Exploration & Bandits):** All formulas correct. Minor notation differences only (K vs m for arms).
- **Lecture 11 (Bayesian Bandits):** All formulas correct. Thompson Sampling trace matches PDF exactly.

---

## PDF Link Status

| Lecture | Link Target | Status |
|---------|-------------|--------|
| 1  | `../slides/lecture1pre.pdf`  | Valid |
| 2  | `../slides/lecture2pre.pdf`  | Valid |
| 3  | `../slides/lecture3pre.pdf`  | Valid |
| 4  | `../slides/lecture4pre.pdf`  | Valid |
| 5  | `../slides/lecture5pre.pdf`  | Valid |
| 6  | `../slides/lecture6pre.pdf`  | Valid |
| 7  | `../slides/lecture7pre.pdf`  | Valid |
| 8  | `../slides/lecture8pre.pdf`  | Valid |
| 9  | `../slides/lecture9pre.pdf`  | Valid |
| 10 | `../slides/lecture10post.pdf` | **BROKEN - file does not exist** |
| 11 | `../slides/lecture11pre.pdf` | Valid |
