# Content Plan: World of World Modeling (Guest Lecture)

## Metadata

- **Lecture title:** World of World Modeling
- **Eyebrow:** Guest Lecture &mdash; Shane Gu (Google DeepMind)
- **Description:** A sweeping tour of world models in reinforcement learning — from Solomonoff induction and the philosophy of prediction, through forward and inverse dynamics models for planning, to video models as physical reasoners and the future of world modeling.
- **Tags:** World Models, Model-Based RL, Solomonoff Induction, Shooting & Collocation, Decision Transformers, Video Models
- **PDF link:** `../slides/ShaneGuCS234_2026.pdf`
- **Navigation:** Standalone guest lecture (no prev/next within the main lecture sequence). Footer link back to All Modules.

---

## Section 1: What Is a World Model?

**Anchor:** `#what-is-a-world-model`

### Prose summary

Open with the historical roots. Jürgen Schmidhuber (1990) introduced the idea of using a recurrent neural network as a learned model of the environment — a "model network" that sits alongside a "control network." The model network predicts future observations and rewards; the controller uses those predictions to plan. This is the original framing of a **world model**: a learned simulator of environment dynamics that an agent can use for planning, imagination, and decision-making.

Mention Ha & Schmidhuber (2018) "World Models" paper which popularized the term. Include Jitendra Malik's commentary: the term "world model" is essentially what control theorists have called a "dynamics model" since the 1960s. Shane Gu's own take: **"World model is the 'model' in model-based RL."**

Walk through the evolution of world models in deep RL:
- **2015:** Oh et al. — action-conditional video prediction in Atari games
- **2016:** Finn et al. — unsupervised learning for physical interaction through video prediction
- **2017:** Weber et al. (DeepMind) — Imagination-Augmented Agents (I2A)
- **2021:** Hafner et al. — DreamerV2, mastering Atari with discrete world models

### Callouts

**Definition — World Model:**
A world model is a learned approximation of environment dynamics — given the current state $s_t$ and action $a_t$, it predicts the next state $s_{t+1}$. In model-based RL, the agent uses the world model to simulate future trajectories ("imagine") without interacting with the real environment, enabling more sample-efficient learning and planning.

**Insight — Why "World Model" vs. "Dynamics Model":**
The term "world model" caught on through Ha & Schmidhuber (2018), but it can cause confusion. In the RL community, a world model is simply the model in model-based RL — it predicts how the world evolves in response to actions. Control theorists have used "dynamics model" for the same concept since the 1960s. The key idea is the same: learn a predictive model of the environment, then use it for planning or policy improvement.

---

## Section 2: What Is Prediction? — Solomonoff Induction

**Anchor:** `#solomonoff-induction`

### Prose summary

Before diving into how world models work, step back to ask a deeper question: what does it mean to predict well? Shane Gu frames this through **Solomonoff induction** — the theoretical gold standard for prediction.

The core idea: given observed data $D_{t-1}, D_t, D_{t+1}, \ldots$, the best world model is the one that infers the **shortest program** $P$ that reproduces the data. This is the "induction machine" — it takes data and infers rules, causes, programs. The reverse direction (program → data) is generation.

Formally, Solomonoff induction applies Bayes' theorem in the space of programs:

$$p(P \mid D) \propto p(D \mid P) \, p(P)$$

The prior $p(P)$ implements **Occam's razor**: shorter programs are exponentially more likely:

$$p(P) \propto 2^{-|P|}$$

where $|P|$ is the length of program $P$. This is deeply connected to **Kolmogorov complexity** and the **Minimum Description Length** principle.

Mention the downstream impact: Solomonoff induction inspired the **C-Test** (Hernandez-Orallo et al., 1998) for measuring intelligence via sequence prediction, and **Universal Intelligence** (Legg & Hutter, 2007), which defines intelligence as the ability to achieve goals across a Solomonoff-weighted distribution of environments:

$$\Upsilon(\pi) = \sum_{\mu \in E} 2^{-K(\mu)} V_\mu^\pi$$

### Key thesis: Prediction = Understanding

Ilya Sutskever's insight: "The best prediction is inferring the shortest program that reproduces the data." Therefore **prediction = understanding = inferring the causal program** of a phenomenon. Evidence:
- IQ tests and "aha!" moments are essentially compression/induction tasks
- Deep learning exhibits **grokking** — sudden generalization after memorization, a phase transition to understanding
- Text prediction yields emotional understanding (OpenAI Sentiment Neuron)
- Video/audio prediction yields physical and emotional understanding (Google Veo3)

### Callouts

**Definition — Solomonoff Induction:**
Given observed data $D$, Solomonoff induction computes the posterior over programs via $p(P \mid D) \propto p(D \mid P) \, p(P)$, with an Occam's razor prior $p(P) \propto 2^{-|P|}$ favoring shorter programs. It is the theoretically optimal (but incomputable) framework for inductive inference — the gold standard against which all learning algorithms can be measured.

**Insight — Prediction as the Path to Intelligence:**
If mastering prediction requires inferring compact causal programs, then a sufficiently powerful predictive model is, in a deep sense, an understanding machine. This is why next-token prediction in LLMs yields reasoning, why video prediction yields physics understanding, and why prediction and intelligence may be two sides of the same coin.

---

## Section 3: Causality and OOD Generalization

**Anchor:** `#causality-ood`

### Prose summary

If prediction = understanding, when does prediction *fail*? When the learned model relies on **spurious correlations** rather than causal structure. This is the problem of **out-of-distribution (OOD) generalization**.

Introduce **Invariant Risk Minimization** (Arjovsky et al., 2019): standard ML models pick up non-causal statistical patterns (e.g., classifying cows by green background, camels by sand). These spurious correlations break under distribution shift. True generalization requires learning features that are **invariant** across different interventions on the causal graph.

The practical implication: "Diversity is all you need." Training on data from many different interventions/environments (as GPT-3 does with internet-scale text) pushes the model toward causal features. This connects back to why large-scale prediction works — diverse data forces the model to learn the true causal program rather than shortcuts.

### Callouts

**Insight — Why Diversity Enables Generalization:**
Invariant Risk Minimization shows that spurious correlations are environment-specific — they break when the data distribution shifts. By training on maximally diverse data (many environments, many interventions), a model is forced to learn only the features that are invariant — i.e., the causal ones. This is why massive internet-scale pretraining (GPT-3, Veo) tends to produce models that generalize: diversity of training data approximates diversity of interventions on the true causal graph.

---

## Section 4: Empowerment and Three Levels of Prediction

**Anchor:** `#three-levels-of-prediction`

### Prose summary

Shane Gu introduces a striking taxonomy — three levels of how an agent can maximize prediction (or minimize surprise):

**Level 1: Passively fit your world model on world.** This is standard pre-training, supervised learning, self-supervised learning, and generative modeling. The data distribution is **stationary** during training — the agent passively observes and learns to predict. Reference Yann LeCun's "cake" analogy: self-supervised learning (millions of bits per sample) is the cake, supervised learning (10–10,000 bits) is the icing, and RL (a few bits) is the cherry.

**Level 2: Actively fit your world model on world.** Here the agent's actions influence what data it collects — the distribution is **non-stationary**. This encompasses post-training, DAgger, GAIL, active learning, and curiosity-driven exploration. Key examples:
- **ICM** (Pathak et al., 2017): curiosity-driven exploration via prediction error as intrinsic reward
- **VIME** (Houthoeft et al., 2017): information gain as intrinsic motivation, using KL divergence between prior and posterior of the dynamics model

The curiosity / information gain equations:

$$I(S_{t+1}; \Theta \mid \xi_t, a_t) = \mathbb{E}_{s_{t+1} \sim \mathcal{P}(\cdot \mid \xi_t, a_t)} \left[ D_{\text{KL}}\!\left[ p(\theta \mid \xi_t, a_t, s_{t+1}) \,\|\, p(\theta \mid \xi_t) \right] \right]$$

$$r'(s_t, a_t, s_{t+1}) = r(s_t, a_t) + \eta \, D_{\text{KL}}\!\left[ p(\theta \mid \xi_t, a_t, s_{t+1}) \,\|\, p(\theta \mid \xi_t) \right]$$

**Level 3: Actively fit world to your world model.** The most ambitious level — the agent takes actions in the world to make the world itself more predictable according to the agent's model. Examples: politicians shaping public opinion, financial firms manipulating markets, social media influencers. Shane Gu notes: "Difficult objective. Nobody has cracked this yet at scale."

This is connected to **empowerment** (Polani, 2005; Mohamed & Rezende, 2015): the mutual information between an agent's actions $z$ and the resulting future states $s$:

$$\mathcal{I}(s; z) \geq \mathbb{E}_{z \sim p(z), s \sim p(s|z)} \left[ \log q_\phi(s \mid z) - \log p(s) \right]$$

### Callouts

**Definition — Empowerment:**
Empowerment is the channel capacity (maximum mutual information) between an agent's actions and the resulting future states: $\mathcal{I}(s; z) = \max_{p(z)} I(S; Z)$. An empowered agent can reliably cause a wide range of distinct future outcomes. Maximizing empowerment drives unsupervised skill discovery — the agent learns diverse, controllable behaviors without any extrinsic reward.

**Insight — The Three Levels as a Hierarchy of Agency:**
Level 1 (passive prediction) is what LLMs do during pretraining. Level 2 (active data collection) is what RL agents do during exploration. Level 3 (reshaping the world) is what powerful real-world actors do — and what future AI agents may aspire to. Each level requires strictly more agency and has strictly more impact on the data distribution.

---

## Section 5: Forward and Inverse World Models

**Anchor:** `#forward-inverse-models`

### Prose summary

Now we move from philosophy to mechanics. A world model can take two fundamental forms:

**Forward model** (dynamics model): Given current state and action, predict the next state.

$$s_{t+1} = F(s_t, a_t)$$

**Inverse models** come in two flavors:

The **inverse dynamics model** (policy-like): Given current and next state, infer the action that connects them.

$$a_t = \Pi(s_t, s_{t+1})$$

The **inverse constraint model** (Q-function-like): A constraint that must be satisfied for a valid transition.

$$0 = Q(s_t, a_t, s_{t+1})$$

Note the deliberate symbol choices: $\Pi$ for the inverse dynamics because it is structurally a policy (maps states to actions), and $Q$ because the constraint function is structurally a Q-function.

The consistency conditions between forward and inverse models:
$$a = \Pi(s, F(s, a)) \quad \forall \; s, a$$
$$0 = Q(s, a, F(s, a)) \quad \forall \; s, a$$

### Callouts

**Definition — Forward vs. Inverse Models:**
A **forward model** $F$ predicts the next state given current state and action: $s_{t+1} = F(s_t, a_t)$. An **inverse dynamics model** $\Pi$ recovers the action given two consecutive states: $a_t = \Pi(s_t, s_{t+1})$. An **inverse constraint model** $Q$ verifies whether a transition is dynamically feasible: $Q(s_t, a_t, s_{t+1}) = 0$ iff the transition is valid. Forward models are used for shooting-based planning; inverse models enable collocation-based planning.

---

## Section 6: Shooting vs. Direct Collocation for Planning

**Anchor:** `#shooting-vs-collocation`

### Prose summary

Given a world model, how do we plan? Two classical approaches from optimal control:

**Shooting** optimizes over action sequences, using the forward model to roll out trajectories:

$$\arg\max_{a_{t:t+T}} \sum_{i=t}^{t+T} r(s_i) \quad \text{where} \quad s_{i+1} = F(s_i, a_i)$$

The forward model is "in the loop" — each candidate action sequence is simulated forward. This is the standard approach in model-based RL (MPC, CEM, etc.).

**Direct collocation** optimizes over both state and action sequences simultaneously, enforcing dynamics as constraints rather than simulating forward:

Using the inverse dynamics (policy) model:
$$\arg\max_{s_{t:t+T}} \sum_{i=t}^{t+T} r(s_i) \quad \text{s.t.} \quad -|A| \leq \Pi(s_i, s_{i+1}) \leq |A|$$

Using the inverse constraint (Q) model:
$$\arg\max_{s_{t:t+T}, a_{t:t+T}} \sum_{i=t}^{t+T} r(s_i) \quad \text{s.t.} \quad Q(s_i, a_i, s_{i+1}) = 0$$

### Contact Invariant Optimization (CIO)

Mordatch et al. (2012, SIGGRAPH) showed the power of direct collocation for contact-rich planning. The key insight: "First solve the task, then fix the physics." By relaxing (hacking) the dynamics constraints during optimization, the planner can discover solutions to contact-rich locomotion and manipulation tasks that shooting methods struggle with.

The physics loss and contact invariant loss:

$$\tau(\mathbf{q}, \dot{\mathbf{q}}, \ddot{\mathbf{q}}) = J(\mathbf{q})^T \mathbf{f} + B\mathbf{u}$$

$$L_{\text{Physics}}(\mathbf{s}) = \sum_t \left\| J_t(\mathbf{s})^T \mathbf{f}_t(\mathbf{s}) + B\mathbf{u}_t(\mathbf{s}) - \tau_t(\mathbf{s}) \right\|^2$$

$$L_{\text{CI}}(\mathbf{s}) = \sum_t c_{i,\phi(t)}(\mathbf{s}) \left( \|\mathbf{e}_{i,t}(\mathbf{s})\|^2 + \|\dot{\mathbf{e}}_{i,t}(\mathbf{s})\|^2 \right)$$

**Analogy:** Shooting is like autoregressive generation (each step depends on the previous); collocation is like bidirectional diffusion (all timesteps are optimized jointly). Collocation solves contact-rich tasks with minimal reward shaping because dynamics relaxation acts as implicit "reward shaping."

Mention that dexterity with shooting methods is hard — even with large-scale structured RL (Ghasemipour et al., 2022), tasks like block assembly remain extremely challenging with forward simulation alone.

### Callouts

**Definition — Shooting vs. Collocation:**
**Shooting** optimizes actions and simulates forward through the dynamics: $\arg\max_{a_{t:T}} \sum r(s_i)$ where $s_{i+1} = F(s_i, a_i)$. **Direct collocation** optimizes states (and optionally actions) jointly, enforcing dynamics as constraints. Shooting is simpler but suffers from long-horizon credit assignment; collocation handles contact-rich tasks by temporarily relaxing physics constraints.

**Insight — "First Solve Task, Then Fix Physics":**
Contact Invariant Optimization (Mordatch et al., 2012) demonstrates a powerful principle: by relaxing dynamics constraints during planning, the optimizer can first find a task solution in an "easy" unconstrained space, then gradually tighten the constraints to recover physical plausibility. This is analogous to how bidirectional diffusion models can generate globally coherent sequences, while autoregressive models must commit sequentially.

---

## Section 7: Goal-Conditioned Value Functions and Decision Transformers

**Anchor:** `#goal-conditioned-value-functions`

### Prose summary

The inverse model notation ($\Pi$ as policy, $Q$ as constraint) was chosen deliberately — because inverse models **are** goal-conditioned policies and value functions.

**Temporal Difference Models (TDMs)** (Pong et al., 2018, ICLR): reinterpret a goal-conditioned Q-function as an implicit world model. The key idea: a Q-function $Q(s_t, a_t, s_g, \tau)$ that predicts whether taking action $a_t$ in state $s_t$ will reach goal $s_g$ in $\tau$ steps is, implicitly, a temporally-extended dynamics model. The reward is sparse:

$$r_d(s_t, a_t, s_{t+1}, s_g, \tau) = -D(s_{t+1}, s_g) \mathbb{1}[\tau = 0]$$

The Q-function satisfies a Bellman-like recursion:

$$Q(s_t, a_t, s_g, \tau) = \mathbb{E}_{p(s_{t+1}|s_t, a_t)}\!\left[ -D(s_{t+1}, s_g) \mathbb{1}[\tau = 0] + \max_a Q(s_{t+1}, a, s_g, \tau - 1) \mathbb{1}[\tau \neq 0] \right]$$

This uses hindsight relabeling — any trajectory can be relabeled as a "successful" attempt to reach the state it actually reached.

**Key insight:** Value functions are world models with different time scales and representations. At $\tau = 1$, the Q-function is a one-step dynamics model; at $\tau = T$, it's a long-horizon reachability predictor.

**Direct Collocation with TDMs:** Hierarchical RL using the goal-conditioned Q-function as the dynamics constraint in a collocation framework:

$$a_t = \underset{a_{t:K:t+T}, s_{t+K:K:t+T}}{\arg\max} \sum_{i=t, t+K, \ldots, t+T} r_c(s_i, a_i)$$
$$\text{such that } Q(s_i, a_i, s_{i+K}, K-1) = 0 \;\; \forall \; i \in \{t, t+K, \ldots, t+T-K\}$$

### Generalized Decision Transformers (GDTs)

Furuta, Matsuo, Gu (ICLR 2022 Spotlight): A unifying framework that views many offline RL methods through the lens of **hindsight information matching**:
- **Training:** behavioral cloning conditioned on "any future statistics" $\phi_T$ (return-to-go, final state, trajectory statistics, etc.)
- **Test-time:** provide an unseen future statistic and ask the model to "generalize" — producing behavior that achieves it

The architecture uses a **causal transformer** (forward in time) and an **anti-causal aggregator** (backward in time to compute hindsight statistics). This unifies Decision Transformer (Chen et al., 2021), various goal-conditioned methods, and offline RL approaches under a single framework.

**Connection to collocation:** A world model is a *causal* predictor (forward in time). A Decision Transformer is an *anti-causal* predictor (conditioned on future outcomes). **Hindsight Experience Replay is the "Jedi mind trick" to flip the causality** — turning any trajectory into training signal for the anti-causal predictor.

Direct collocation with GDTs (untested idea from Shane Gu): search for a "reachable future" using the policy function of a GDT, analogous to how TDMs use Q-function constraints.

### Callouts

**Definition — Temporal Difference Models:**
TDMs reinterpret goal-conditioned Q-functions as implicit world models. The Q-function $Q(s_t, a_t, s_g, \tau)$ predicts whether action $a_t$ in state $s_t$ reaches goal $s_g$ in exactly $\tau$ steps. At short horizons, this is a dynamics model; at long horizons, a reachability predictor. Training uses hindsight relabeling: any trajectory provides a positive example for the goal it actually reached.

**Insight — Value Functions Are World Models:**
A standard value function $V(s)$ compresses the long-run dynamics of the environment into a single scalar. A goal-conditioned value function $Q(s, a, s_g, \tau)$ retains much more structure — it encodes which states are reachable from which others and in how many steps. In this sense, value functions are world models operating at a coarser temporal resolution, trading spatial precision for temporal abstraction.

**Insight — Causal vs. Anti-Causal Prediction:**
Forward world models are *causal* predictors: given the past, predict the future. Decision Transformers are *anti-causal* predictors: given desired future outcomes, predict the actions that achieve them. Hindsight experience replay bridges these perspectives by retroactively conditioning on observed outcomes, turning every trajectory into training data for the anti-causal direction.

---

## Section 8: Physical and Symbolic World Models — Video Models as Reasoners

**Anchor:** `#video-models-as-reasoners`

### Prose summary

The lecture's final major section looks forward: what does the future of world modeling look like?

**2022 — "AGI Year 0":** Two breakthroughs converged:
1. "LLMs can reason" — Zero-shot chain-of-thought (Kojima, Gu et al., 2022): adding "Let's think step by step" to LLM prompts enables multi-step reasoning. This suggests symbolic AGI is achievable through language models.
2. "ImagenVideo / DreamFusion" — high-quality video generation suggests physical AGI is achievable through video models.

Together: LLMs handle symbolic reasoning (Chain-of-Thought), video models handle spatiotemporal reasoning (Chain-of-Frames). The world consists of symbols, space, and time — and we may need both types of models.

**2025 — Video models as the missing foundation model:** Wiedemer, Li, Vicol, Gu et al. (Google DeepMind, 2025): "Video models are zero-shot learners and reasoners." The argument: just as LLMs went from task-specific NLP to general-purpose language understanding by scaling up generative pretraining, video models may follow the same trajectory for vision and physical understanding. Video models can solve maze navigation, pattern completion, and physical reasoning tasks zero-shot.

**Mind's Eye (Liu et al., 2022):** Chain-of-thought + world model (MuJoCo physics simulator) as a tool = grounded experimenting scientist. LLMs alone make physical reasoning errors (e.g., heavier objects fall faster), but augmenting them with a physics engine for "mental simulation" yields correct answers.

**Older specialized approaches** (likely to be superseded): particle-based simulation via graph neural networks (Sanchez-Gonzalez et al., 2020) — message passing on graphs can simulate complex fluid dynamics. But Shane Gu's provocative claim: "We unlikely won't need graph nets / NeRF etc. Just video models." The question mark: AlphaFold — will protein structure prediction also eventually be subsumed by video models?

### Callouts

**Insight — Chain of Frames vs. Chain of Thoughts:**
LLMs reason through *symbolic* chains of thought — step-by-step logical deductions in language. Video models reason through *physical* chains of frames — step-by-step spatiotemporal simulations. The world contains both symbolic structure (logic, mathematics, language) and physical structure (space, time, causality). A complete world model may need both modalities: symbolic reasoning for abstract planning, visual reasoning for physical grounding.

**Insight — Will Video Models Subsume Everything?**
Graph neural networks, NeRFs, and physics engines are specialized world models for specific domains. Shane Gu's conjecture: sufficiently powerful video models — trained on internet-scale visual data — may learn to simulate physics, chemistry, and biology without any domain-specific inductive bias, just as LLMs learned grammar, reasoning, and world knowledge from raw text. The open question is whether structured domains like protein folding (AlphaFold) will also succumb to this trend.

---

## Section 9: The Future of World Modeling

**Anchor:** `#future-of-world-modeling`

### Prose summary

The lecture closes with two speculative frontiers:

**Modeling humanity (2026+):** Simile — modeling 8 billion people. Reference to Joon Sung Park's work on generative agents / simulating social systems. The idea: world models that can predict not just physical dynamics but human behavior at scale — social simulation, political dynamics, economic systems.

**Modeling financial markets (2026+):** AIA Forecaster (Alur, Stadie et al., Bridgewater AIA Labs, 2025) — an agentic system for financial forecasting. Multiple agents search for information, make initial forecasts, calibrate, reconcile disagreements through adaptive search, and produce calibrated final predictions. This is world modeling applied to one of the most complex, high-stakes, non-stationary environments.

Close with Shane Gu's parting message: "Remember Level 3" — the most ambitious form of world modeling is not just predicting the world, but shaping it to be predictable. This connects back to empowerment and the three levels of prediction from earlier in the lecture.

### Callouts

**Insight — The Ultimate World Model:**
Shane Gu's three levels of prediction form a progression of ambition: passively predict the world (Level 1), actively explore to improve predictions (Level 2), and reshape the world to match your model (Level 3). Most AI research operates at Level 1. The frontier of world modeling — and perhaps of artificial general intelligence — lies at Level 3: agents that don't just model the world but actively shape it.

---

## Section 10: Summary

**Anchor:** `#summary`

### Prose summary

Summarize the key themes of the guest lecture:

- **World models are the "model" in model-based RL** — learned approximations of environment dynamics used for planning, imagination, and decision-making.
- **Prediction = Understanding:** Solomonoff induction tells us that optimal prediction requires inferring the shortest causal program behind the data. Mastering prediction is mastering understanding.
- **Causality matters for generalization:** Spurious correlations break under distribution shift. Diverse training data pushes models toward invariant (causal) features.
- **Three levels of prediction:** Passive fitting (pretraining), active data collection (exploration/curiosity), and world-shaping (empowerment at scale).
- **Forward models enable shooting; inverse models enable collocation.** Collocation can solve contact-rich planning problems that defeat shooting methods.
- **Value functions are world models** at coarser temporal resolution. Goal-conditioned Q-functions and Decision Transformers are inverse/anti-causal world models.
- **Video models may be the missing foundation model** for physical reasoning, just as LLMs became the foundation for symbolic reasoning.
- **The frontier is Level 3:** not just modeling the world, but shaping it.
