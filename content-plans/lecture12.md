# Lecture 12: Fast RL Continued — Data-Efficient RL for MDPs

**Title:** Fast RL Continued
**Description:** Extending data-efficient exploration from bandits to MDPs: PAC learning frameworks, model-based interval estimation (MBIE-EB), Bayesian model-based RL with posterior sampling (PSRL), generalization with function approximation, exploration bonuses for deep RL, and meta-learning for exploration.
**Tags:** `PAC-MDP` `MBIE-EB` `Bayesian MDPs` `PSRL` `Exploration Bonuses` `Contextual Bandits`
**Prev:** Lecture 11 — Bayesian Bandits (`lecture11.html`)
**Next:** Lecture 13 — Monte Carlo Tree Search (`lecture13.html`)
**PDF:** `../slides/lecture12pre.pdf`

---

## Section 1: Probably Approximately Correct (PAC) Learning

**Anchor ID:** `#pac-framework`
**Heading:** Probably Approximately Correct (PAC) Learning

### Prose summary

Begin by motivating why regret alone may not capture everything we care about. Regret bounds tell us how total suboptimality grows with $T$, but they don't distinguish between making many small errors versus a few catastrophic ones. In safety-critical settings (medical treatment, autonomous driving), we may specifically want to bound the *number of time steps* on which the agent takes a significantly suboptimal action.

This leads to the PAC (Probably Approximately Correct) framework for RL. The intuition is: after a polynomial amount of learning, the agent should behave near-optimally on *almost all* future time steps. The "probably" captures a failure probability $\delta$, and "approximately" captures a tolerance $\epsilon$.

Connect this to what students already know: they've seen empirical evaluation, asymptotic convergence, and regret. PAC is a fourth evaluation criterion — arguably the most practically relevant for safety-sensitive applications because it gives an explicit bound on the number of non-negligible mistakes.

### Callouts

**Definition — PAC RL Algorithm:**
> For given $\epsilon$ and $\delta$, a RL algorithm $\mathcal{A}$ is **PAC** if on all but $N$ time steps, the action selected by $\mathcal{A}$ at time $t$, $a_t$, is $\epsilon$-optimal:
> $$Q(a_t) \geq Q(a^*) - \epsilon$$
> with probability at least $1 - \delta$, where $N$ is a **polynomial** function of the problem parameters ($|\mathcal{S}|$, $|\mathcal{A}|$, $\frac{1}{1-\gamma}$, $\frac{1}{\epsilon}$, $\frac{1}{\delta}$).

**Insight — PAC vs. Regret:**
> Regret bounds allow an algorithm to make a few very large errors as long as the total is bounded. PAC bounds instead guarantee that the *number* of non-trivially-suboptimal steps is bounded polynomially. Neither criterion strictly dominates the other: an algorithm can have low regret but not be PAC (by concentrating errors into rare catastrophic steps), or be PAC but have moderate regret (by taking many steps that are only slightly suboptimal during the learning phase). Most PAC algorithms are based on optimism or Thompson sampling, and some simply initialize all values high to encourage exploration — a form of optimistic initialization.

---

## Section 2: PAC RL in Markov Decision Processes

**Anchor ID:** `#pac-mdps`
**Heading:** Fast RL in MDPs

### Prose summary

Transition from bandits to the full MDP setting. Emphasize that the same frameworks (regret, Bayesian regret, PAC) and the same approaches (optimism under uncertainty, probability matching / Thompson sampling) carry over, but with crucial additional complexity: the agent must now explore across *states and actions jointly*, and the dynamics model matters, not just reward estimates.

Introduce the PAC-MDP formulation explicitly: for a given $\epsilon$ and $\delta$, an algorithm is PAC if on all but $N$ steps, the value of the agent's policy at the current state satisfies $V_M^{A_t}(s_t) \geq V_M^*(s_t) - \epsilon$ with probability at least $1-\delta$, where $N$ is polynomial in $(|\mathcal{S}|, |\mathcal{A}|, \frac{1}{1-\gamma}, \frac{1}{\epsilon}, \frac{1}{\delta})$.

### Callouts

**Definition — PAC for MDPs:**
> For a given $\epsilon$ and $\delta$, a RL algorithm $\mathcal{A}$ is PAC if on all but $N$ steps, the action $a_t$ selected by $\mathcal{A}$ at time $t$ satisfies:
> $$V_M^{A_t}(s_t) \geq V_M^*(s_t) - \epsilon$$
> with probability at least $1 - \delta$, where $N$ is polynomial in $(|\mathcal{S}|, |\mathcal{A}|, \frac{1}{1-\gamma}, \frac{1}{\epsilon}, \frac{1}{\delta})$.

---

## Section 3: MBIE-EB Algorithm

**Anchor ID:** `#mbie-eb`
**Heading:** Model-Based Interval Estimation with Exploration Bonus (MBIE-EB)

### Prose summary

Present MBIE-EB (Strehl and Littman, 2008) as the canonical PAC-MDP algorithm. The key idea is model-based RL with optimism: maintain empirical estimates of the transition and reward models, but add an *exploration bonus* to the reward that inflates the value of under-visited state-action pairs. This is the MDP analogue of UCB for bandits.

Walk through the algorithm step by step: (1) maintain visit counts $n_{sa}$ and transition counts $n_{sas'}$; (2) form empirical reward $\hat{R}(s,a)$ and transition $\hat{T}(s'|s,a)$ estimates; (3) add a bonus $\frac{\beta}{\sqrt{n_{sa}}}$ to the reward; (4) solve the augmented MDP via value iteration to get $\tilde{Q}(s,a)$; (5) act greedily with respect to $\tilde{Q}$.

The exploration bonus shrinks as $1/\sqrt{n}$ — states visited many times get small bonuses (exploit), while rarely-visited states get large bonuses (explore). This is directly analogous to UCB's confidence width, but now embedded in the full Bellman backup.

### Algorithm

**Algorithm — MBIE-EB (Strehl and Littman, 2008):**
```
1: Given ε, δ, m
2: β = (1/(1-γ)) * sqrt(0.5 * ln(2|S||A|m/δ))
3: n_{sas'} = 0, ∀s ∈ S, a ∈ A, s' ∈ S
4: rc(s,a) = 0, n_{sa}(s,a) = 0, Q̃(s,a) = 1/(1-γ), ∀s ∈ S, a ∈ A
5: t = 0, s_t = s_init
6: loop
7:    a_t = argmax_{a∈A} Q̃(s_t, a)
8:    Observe reward r_t and state s_{t+1}
9:    n_{sa}(s_t, a_t) = n_{sa}(s_t, a_t) + 1,  n_{sas}(s_t, a_t, s_{t+1}) = n_{sas}(s_t, a_t, s_{t+1}) + 1
10:   rc(s_t, a_t) = rc(s_t, a_t)(n_{sa}(s_t, a_t) - 1) + r_t) / n_{sa}(s_t, a_t)
11:   R̂(s_t, a_t) = rc(s_t, a_t)  and  T̂(s'|s_t, a_t) = n_{sas}(s_t, a_t, s') / n_{sa}(s_t, a_t),  ∀s' ∈ S
12:   while not converged do
13:     Q̃(s,a) = R̂(s,a) + γ Σ_{s'} T̂(s'|s,a) max_{a'} Q̃(s',a') + β/√(n_{sa}(s,a)),  ∀s ∈ S, a ∈ A
14:   end while
15: end loop
```

### Equations

The exploration bonus term:

$$\tilde{Q}(s,a) = \hat{R}(s,a) + \gamma \sum_{s'} \hat{T}(s'|s,a) \max_{a'} \tilde{Q}(s', a') + \frac{\beta}{\sqrt{n_{sa}(s,a)}}$$

where:

$$\beta = \frac{1}{1-\gamma}\sqrt{0.5 \ln\!\left(\frac{2|\mathcal{S}||\mathcal{A}|m}{\delta}\right)}$$

### Callouts

**Insight — Exploration Bonus as Optimistic Bellman Backup:**
> MBIE-EB augments the standard Bellman optimality equation with an additive bonus $\frac{\beta}{\sqrt{n_{sa}}}$. This is the MDP generalization of UCB: just as UCB adds $\sqrt{\frac{\ln t}{n_a}}$ to the mean reward for each arm, MBIE-EB adds a bonus that decreases with the number of visits to each state-action pair. The bonus propagates through the Bellman backup, so even distant under-explored states can attract the agent through their effect on upstream Q-values.

---

## Section 4: Simulation Lemma

**Anchor ID:** `#simulation-lemma`
**Heading:** The Simulation Lemma

### Prose summary

The Simulation Lemma is one of the key theoretical tools underlying PAC-MDP proofs. It bounds the error in value functions due to errors in the dynamics and reward models. If two MDPs have similar transition and reward functions, then the value of any fixed policy cannot differ by much between them.

This is the bridge between "our model is accurate" (concentration of empirical estimates) and "our policy is good" (near-optimal value). MBIE-EB's PAC guarantee ultimately relies on the Simulation Lemma: once we've visited each state-action pair enough times, our empirical model is close to the true model, and by the Simulation Lemma, the value of our policy in the estimated model is close to its value in the true model.

### Equations

**Theorem — Simulation Lemma (Value Error Bound):**

Assume for a fixed policy $\pi$:

$$\|R_1(s,a) - R_2(s,a)\|_\infty \leq \alpha$$

$$\|T_1(\cdot \mid s,a) - T_2(\cdot \mid s,a)\|_1 \leq \beta$$

Then for any $(s,a)$:

$$|Q_1^\pi(s,a) - Q_2^\pi(s,a)| = \left|R_1(s,a) - R_2(s,a) + \gamma \sum_{s'} \left(T_1(s'|s,a) V_1^\pi(s') - T_2(s'|s,a) V_2^\pi(s')\right)\right|$$

$$\leq \alpha + \gamma \left|\sum_{s'} T_1(s'|s,a)(V_1^\pi(s') - V_2^\pi(s')) + \sum_{s'} (T_1(s'|s,a) - T_2(s'|s,a)) V_2^\pi(s')\right|$$

$$\leq \alpha + \gamma \Delta + \gamma V_{\max} \beta$$

where $\Delta := \max_s |V_1^\pi(s) - V_2^\pi(s)|$. Therefore:

$$\Delta \leq \alpha + \gamma \Delta + \gamma V_{\max} \beta$$

$$(1 - \gamma)\Delta \leq \alpha + \gamma V_{\max} \beta$$

$$\boxed{\Delta \leq \frac{\alpha + \gamma V_{\max} \beta}{1 - \gamma}}$$

### Callouts

**Theorem — Simulation Lemma:**
> If two MDPs differ by at most $\alpha$ in rewards and $\beta$ in transition probabilities (L1 norm), then for any fixed policy $\pi$, the value functions differ by at most:
> $$\max_s |V_1^\pi(s) - V_2^\pi(s)| \leq \frac{\alpha + \gamma V_{\max} \beta}{1 - \gamma}$$
> This bounds how much model error translates into value error.

### Proof

**Collapsible proof — Simulation Lemma derivation:**
> Start from the Bellman equation for $Q^\pi$ in both MDPs. Take the absolute difference, apply triangle inequality, separate the reward error ($\alpha$), the value-function error ($\gamma\Delta$), and the transition error ($\gamma V_{\max}\beta$). Define $\Delta = \max_s |V_1^\pi(s) - V_2^\pi(s)|$, solve the resulting inequality $(1-\gamma)\Delta \leq \alpha + \gamma V_{\max}\beta$ to get $\Delta \leq \frac{\alpha + \gamma V_{\max}\beta}{1-\gamma}$.

---

## Section 5: MBIE-EB PAC Guarantee

**Anchor ID:** `#mbie-eb-pac`
**Heading:** MBIE-EB is PAC

### Prose summary

State the main theoretical result: MBIE-EB is a PAC RL algorithm. This means there exists a polynomial bound on the number of time steps where the agent's policy is more than $\epsilon$-suboptimal.

The proof sketch combines: (1) concentration inequalities showing that after enough visits, $\hat{R}$ and $\hat{T}$ are close to $R$ and $T$; (2) the Simulation Lemma connecting model accuracy to value accuracy; (3) a counting argument bounding how many times the agent can visit a state-action pair fewer than $m$ times. The final sample complexity is polynomial in all problem parameters.

### Callouts

**Theorem — MBIE-EB PAC Guarantee (Strehl and Littman, 2008):**
> Suppose $\epsilon$ and $\delta$ are two real numbers between 0 and 1, and $M = (\mathcal{S}, \mathcal{A}, T, R, \gamma)$ is any MDP. There exists an input $m = m(\frac{1}{\epsilon}, \frac{1}{\delta})$ satisfying $m(\frac{1}{\epsilon}, \frac{1}{\delta}) = O\!\left(\frac{|\mathcal{S}|}{\epsilon^2(1-\gamma)^2} + \frac{1}{\epsilon^2(1-\gamma)^4} \ln \frac{|\mathcal{S}||\mathcal{A}|}{\delta}\right)$, and $\beta = (1/(1-\gamma))\sqrt{\ln(2|\mathcal{S}||\mathcal{A}|m/\delta)/2}$, such that if MBIE-EB is executed on MDP $M$, then with probability at least $1 - \delta$:
> $$V_M^{A_t}(s_t) \geq V_M^*(s_t) - \epsilon$$
> is true for all but $O\!\left(\frac{|\mathcal{S}||\mathcal{A}|}{\epsilon^2(1-\gamma)^4}\left(|\mathcal{S}| + \ln\frac{|\mathcal{S}||\mathcal{A}|}{\delta}\right) \ln \frac{1}{\epsilon(1-\gamma)}\right)$ time steps $t$.

---

## Section 6: Bayesian Model-Based RL

**Anchor ID:** `#bayesian-mdps`
**Heading:** Bayesian Model-Based RL

### Prose summary

Transition from the frequentist PAC framework to the Bayesian approach for MDPs. Recall from Lecture 11 how Bayesian bandits maintain a posterior over reward parameters and use it for exploration. Now extend this to full MDPs: maintain a posterior distribution over the entire MDP model — both transition dynamics $\mathcal{P}$ and rewards $\mathcal{R}$.

The posterior is $p(\mathcal{P}, \mathcal{R} \mid h_t)$, where the history $h_t = (s_1, a_1, r_1, \ldots, s_t)$ includes states, actions, and rewards. Just as in the bandit case, we can use this posterior for exploration via:
- **Bayesian UCB:** Construct confidence bounds from posterior quantiles
- **Thompson Sampling (Probability Matching):** Sample from the posterior and act optimally under the sample

The key advantage: if the prior is well-calibrated, Bayesian methods can be significantly more data-efficient than frequentist approaches.

### Callouts

**Insight — From Bayesian Bandits to Bayesian MDPs:**
> The conceptual leap from Bayesian bandits to Bayesian MDPs is straightforward: instead of maintaining a posterior over reward parameters for each arm, we maintain a posterior over the full MDP model (transitions and rewards) for each state-action pair. The same exploration strategies apply — Bayesian UCB and Thompson Sampling — but now the posterior is much higher-dimensional, and "acting optimally under a sample" requires solving an entire MDP, not just picking the arm with the highest sampled mean.

---

## Section 7: Posterior Sampling for RL (PSRL)

**Anchor ID:** `#psrl`
**Heading:** Posterior Sampling for Reinforcement Learning (PSRL)

### Prose summary

Present PSRL (Osband, Russo, Van Roy, NeurIPS 2013) as the Thompson Sampling analogue for MDPs. The algorithm is elegantly simple: at the start of each episode, sample a complete MDP from the posterior, solve it exactly to get the optimal policy, then follow that policy for the entire episode. At the end of the episode, update the posterior with all observed transitions and rewards.

This is a direct generalization of Thompson Sampling for bandits: instead of sampling a reward parameter and acting greedily, we sample an entire dynamics-and-reward model and plan optimally. The probability matching property carries over: the probability of selecting a particular policy equals the posterior probability that it is optimal.

Key implementation detail: within each episode, the agent commits to a single sampled MDP. It does not re-sample at every step. This episode-level commitment is important for coherent exploration — it ensures the agent follows through on plans to reach informative states rather than switching strategies mid-episode.

### Algorithm

**Algorithm — Posterior Sampling for RL (PSRL) (Osband, Russo, Van Roy, 2013):**
```
1: Initialize prior over dynamics and reward models for each (s,a):
   p(R_{sa}), p(T(s'|s,a))
2: Initialize state s_0
3: for k ∈ 1:K (number of episodes) do
4:    Sample a MDP M:
5:      for each (s,a) pair do
6:        Sample a dynamics model T(s'|s,a)
7:        Sample a reward model R(s,a)
8:      end for
9:    Compute Q*_M, optimal value for MDP M
10:   for t ∈ 1:H do
11:     a_t = argmax_{a∈A} Q*_M(s_t, a)
12:     Observe r_t and next state s_{t+1}
13:   end for
14:   Update posterior p(R_{a,s_t} | r_t), p(T(s'|s_t, a_t) | s_{t+1}) using Bayes rule
15: end for
```

### Equations

Thompson sampling implements probability matching for MDPs:

$$\pi(s, a \mid h_t) = \mathbb{P}[Q(s,a) \geq Q(s,a'), \forall a' \neq a \mid h_t]$$

$$= \mathbb{E}_{\mathcal{P}, \mathcal{R} | h_t}\!\left[\mathbf{1}(a = \arg\max_{a \in \mathcal{A}} Q(s,a))\right]$$

### Callouts

**Insight — Episode-Level Commitment:**
> PSRL samples a new MDP only at the start of each episode, not at every time step. This is crucial for *deep exploration*: if the posterior says a distant state might be highly rewarding, PSRL commits to a policy that navigates there, rather than randomly switching strategies partway. This episode-level commitment distinguishes PSRL from naive dithering strategies like $\epsilon$-greedy, which explore locally but cannot execute multi-step plans to reach informative states.

**Example — Seed Sampling and Concurrent PSRL (Dimakopoulou, Van Roy, ICML 2018):**
> An extension of PSRL handles concurrent (parallel) exploration. When multiple agents are deployed simultaneously (e.g., multiple users on a website), each agent samples from the same posterior but with different random seeds, ensuring diverse exploration across agents. This is the MDP analogue of Thompson Sampling's advantage in delayed-feedback bandit settings.

---

## Section 8: Generalization and Strategic Exploration

**Anchor ID:** `#generalization-exploration`
**Heading:** Generalization and Strategic Exploration

### Prose summary

Shift from tabular settings to large or continuous state/action spaces where we can never visit every state-action pair. The core challenge: the tabular counting approach (visit counts $n_{sa}$) breaks down when we expect to visit most states only once. We need *generalization* — using experience from similar states to inform behavior at novel states.

Introduce contextual bandits as the bridge between tabular bandits and large-scale RL. A contextual bandit observes a context (feature vector) $s \in \mathcal{S}$ before choosing an action $a \in \mathcal{A}$, and the reward depends on both: $\mathcal{R}^{a,s}(r) = \mathbb{P}[r \mid a, s]$. When the state and action spaces are large, use a function to model the relationship between inputs and rewards — commonly a linear model.

Show the benefits of generalization via the LinUCB vs. UCB comparison: as the number of arms $K$ grows, UCB's regret scales linearly with $K$, while LinUCB (which leverages linear structure) remains nearly flat. This is a dramatic practical improvement.

### Equations

Linear contextual bandit reward model:

$$r = \theta \phi(s, a) + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)$$

Disjoint linear model (each arm has its own parameter):

$$r(s, a) = \theta_a \phi(s) + \epsilon$$

### Callouts

**Definition — Contextual Multi-Armed Bandit:**
> A contextual bandit is a tuple $(\mathcal{A}, \mathcal{S}, \mathcal{R})$ where $\mathcal{A}$ is the action space, $\mathcal{S}$ is the context/state space, and $\mathcal{R}^{a,s}(r) = \mathbb{P}[r \mid a, s]$ is the reward distribution conditioned on both action and context. When the state/action space is large, we model $r = \theta\phi(s,a) + \epsilon$ using a feature function $\phi$ and learn the parameter vector $\theta$.

**Insight — Why Tabular Counts Fail at Scale:**
> MBIE-EB's exploration bonus $\beta/\sqrt{n_{sa}}$ requires visiting each state-action pair multiple times. In continuous or large discrete state spaces, most states are visited at most once, making the count-based bonus useless. Generalization-based approaches replace raw counts with *uncertainty estimates* from the model (e.g., confidence ellipsoids in linear regression), enabling exploration bonuses even for never-before-seen states.

---

## Section 9: Exploration Bonuses for Deep RL

**Anchor ID:** `#exploration-bonuses-deep-rl`
**Heading:** Exploration Bonuses for Deep RL

### Prose summary

Extend the optimism principle to deep RL. The idea: modify the Q-learning update to include an exploration bonus $r_{\text{bonus}}(s,a)$ that approximates the count-based bonus in the function approximation regime.

The standard Q-learning weight update is:

$$\Delta \mathbf{w} = \alpha(r(s) + \gamma \max_{a'} \hat{Q}(s', a'; \mathbf{w}) - \hat{Q}(s, a; \mathbf{w})) \nabla_\mathbf{w} \hat{Q}(s, a; \mathbf{w})$$

With an exploration bonus, this becomes:

$$\Delta \mathbf{w} = \alpha(r(s) + r_{\text{bonus}}(s,a) + \gamma \max_{a'} \hat{Q}(s', a'; \mathbf{w}) - \hat{Q}(s, a; \mathbf{w})) \nabla_\mathbf{w} \hat{Q}(s, a; \mathbf{w})$$

The bonus $r_{\text{bonus}}(s,a)$ should reflect uncertainty about future reward from $(s,a)$. Approaches for estimating visit density in deep RL include:
- **Count-based exploration** (Bellemare et al., NIPS 2016): Use density models to compute pseudo-counts
- **Hash-based counts** (Tang et al., NIPS 2017): Hash high-dimensional states to count visits
- **Prediction error** (Ostrovski et al., ICML 2017): Use prediction error as a proxy for novelty

Showcase the Montezuma's Revenge result: a DQN with count-based exploration bonuses explores dramatically more of the game than standard DQN with $\epsilon$-greedy exploration (trained for 50 million frames). This is a compelling demonstration that strategic exploration fundamentally changes what deep RL agents can learn.

Important caveat: bonus terms are computed at the time of visit. During episodic replay, these bonuses can become outdated — a state that was novel when first visited may have been visited many times by the time the experience is replayed.

### Equations

Standard Q-learning update:

$$\Delta \mathbf{w} = \alpha\!\left(r(s) + \gamma \max_{a'} \hat{Q}(s', a'; \mathbf{w}) - \hat{Q}(s, a; \mathbf{w})\right) \nabla_\mathbf{w} \hat{Q}(s, a; \mathbf{w})$$

With exploration bonus:

$$\Delta \mathbf{w} = \alpha\!\left(r(s) + r_{\text{bonus}}(s,a) + \gamma \max_{a'} \hat{Q}(s', a'; \mathbf{w}) - \hat{Q}(s, a; \mathbf{w})\right) \nabla_\mathbf{w} \hat{Q}(s, a; \mathbf{w})$$

### Callouts

**Insight — Exploration Bonuses as Intrinsic Motivation:**
> Exploration bonuses can be viewed as a form of *intrinsic motivation*: the agent receives an internal reward for visiting novel states, independent of the environment's extrinsic reward. This idea connects RL exploration theory to cognitive science concepts of curiosity-driven learning. The Montezuma's Revenge results demonstrate that intrinsic motivation can transform an agent that learns almost nothing (standard DQN explores only the first room) into one that discovers dozens of rooms and game mechanics.

---

## Section 10: Thompson Sampling with Function Approximation

**Anchor ID:** `#ts-function-approximation`
**Heading:** Thompson Sampling with Function Approximation

### Prose summary

Explore how Thompson Sampling / Bayesian ideas scale to large domains with function approximation. Several approaches:

1. **Thompson sampling over representations and parameters** (Mandel, Liu, Brunskill, Popovic, IJCAI 2016): Sample both the feature representation and the parameters, enabling exploration over model structure.

2. **Bootstrapped DQN** (Osband et al., NIPS 2016): Train $C$ DQN agents using bootstrapped samples of the replay buffer. At each step, pick the action with the highest Q-value among the $C$ heads. This approximates Thompson Sampling without explicit Bayesian inference. Some performance gain, but not as effective as reward bonus approaches.

3. **Bayesian Deep Q-Networks** (Azizzadenesheli, Anandkumar, NeurIPS workshop 2017): Use a deep neural network with Bayesian linear regression on the last layer. Be optimistic with respect to the resulting posterior. Empirically much better than simple bootstrapping, approaches reward-bonus performance in some cases.

The challenge: maintaining a true posterior over neural network weights is intractable. All these methods are approximations, and the theoretical guarantees of tabular PSRL do not directly apply.

### Callouts

**Insight — The Posterior Approximation Challenge:**
> In tabular MDPs, PSRL maintains exact posteriors using conjugate priors (e.g., Dirichlet for transitions). With function approximation, exact posteriors over neural network weights are intractable. Bootstrapped DQN, Bayesian last-layer approaches, and ensemble methods are all pragmatic approximations. The gap between theory (exact posteriors → optimal exploration) and practice (approximate posteriors → heuristic exploration) remains an active research area.

---

## Section 11: Meta-Learning for RL Exploration

**Anchor ID:** `#meta-learning-exploration`
**Heading:** Meta-Learning for RL Exploration

### Prose summary

Introduce the frontier idea: can agents *learn to explore*? Rather than hand-designing exploration strategies, train agents across many tasks so they internalize an effective exploration policy.

Present two key approaches:
- **DREAM** (Liu et al., NeurIPS 2022): Meta-learning approach to exploration
- **Decision-Pretrained Transformer (DPT)** (Lee, Xie, Pacchiano, Chandak, Finn, Nachum, Brunskill, NeurIPS 2023): Train a transformer on trajectories $\tau_1, \ldots, \tau_N$ consisting of $(s, a, r, s')$ tuples. Given a query state $s_{\text{query}}$, the transformer predicts $a^*$ — the optimal action. The key insight: training to predict $a^*$ mimics Thompson Sampling but can capture a much richer set of priors, because the transformer can learn task structure from data rather than requiring it to be specified analytically.

Show the DPT result on online linear bandits: DPT outperforms both Thompson Sampling (with a source prior) and LinUCB, demonstrating that learned exploration can surpass hand-designed algorithms when task structure is available.

### Callouts

**Insight — Learning to Explore:**
> Thompson Sampling is optimal when the prior is correct, but specifying the right prior is hard in complex domains. DPT sidesteps this by *learning* an implicit prior from data across many tasks. The transformer architecture processes a dataset $D$ of past trajectories and a query state, outputting an action distribution $M_\theta(a^* | s_{\text{query}}, D)$. This is trained to mimic the Bayes-optimal policy but can represent far more complex task distributions than any analytically tractable prior. The result is an agent that explores intelligently from the very first step on a new task.

---

## Section 12: Theoretical Frontiers

**Anchor ID:** `#theoretical-frontiers`
**Heading:** Theoretical Results and Open Problems

### Prose summary

Survey the state of theoretical results for data-efficient RL:

**Tabular MDPs:** Tight (in the dominant term) minimax results now exist for both regret and PAC:
- Regret: Azar, Gheshlaghi, Osband, Munos. "Minimax regret bounds for reinforcement learning." ICML 2017.
- PAC: Dann, Li, Wei, Brunskill. "Policy certificates: Towards accountable reinforcement learning." ICML 2019.
- Instance-dependent bounds: Zanette and Brunskill (ICML 2019), Simchowitz and Jamieson (NeurIPS 2019).

**Function approximation:** Active research area. Key question: do strong theoretical bounds exist for RL with function approximation?
- Jin, Yang, Wang, Jordan. "Provably efficient reinforcement learning with linear function approximation." COLT 2020.
- Quantifying hardness: Eluder dimension (Russo and Van Roy), Bellman rank (Jiang et al.), and related complexity measures.

The big open question: characterizing what structural features of the domain determine the hardness of exploration with function approximation.

### Callouts

**Insight — From Tabular to Function Approximation Theory:**
> For tabular MDPs, the theory of data-efficient RL is essentially complete: we have tight regret and PAC bounds. The frontier has shifted to function approximation, where the fundamental question is: *what makes exploration hard?* Concepts like eluder dimension and Bellman rank attempt to capture this, but a unified, tight characterization remains elusive. This is one of the most active areas in RL theory.

---

## Section 13: Summary

**Anchor ID:** `#summary`
**Heading:** Summary

### Prose summary

Synthesize the entire data-efficient RL arc (Lectures 10–12). Students should understand:

1. **Exploration-exploitation tension** in RL and why it doesn't arise in supervised/unsupervised learning
2. **Evaluation criteria** for exploration algorithms: empirical, convergence, asymptotic, regret, PAC — and the tradeoffs between them
3. **PAC framework**: bounds the number of non-trivially-suboptimal steps polynomially in problem parameters
4. **MBIE-EB**: model-based optimism for MDPs — exploration bonuses in the Bellman backup, with PAC guarantees via the Simulation Lemma
5. **Bayesian MDPs / PSRL**: posterior sampling extended to full MDPs, with episode-level commitment for deep exploration
6. **Generalization**: contextual bandits, linear models, LinUCB — essential when state/action spaces are too large for tabular methods
7. **Deep RL exploration**: exploration bonuses (intrinsic motivation), bootstrapped DQN, Bayesian last-layer approaches
8. **Meta-learning for exploration**: DPT and learned exploration strategies that can outperform hand-designed algorithms

The key algorithms mapped to their evaluation criteria:
- UCB → frequentist regret bounds, PAC (bandits)
- Thompson Sampling → Bayesian regret bounds (bandits and MDPs)
- MBIE-EB → PAC (tabular MDPs)
- PSRL → Bayesian regret (tabular MDPs)
- LinUCB → regret (linear contextual bandits)
- Count-based bonuses / DPT → empirical (deep RL)
