# Lecture 14: Monte Carlo Tree Search — AlphaGo, AlphaGo Zero, and AlphaZero

## Metadata

- **Title:** Monte Carlo Tree Search: AlphaGo and AlphaZero
- **Description:** From the game of Go to general game-playing: how AlphaGo combined deep neural networks with MCTS, how AlphaGo Zero eliminated human data through pure self-play, and how AlphaZero generalized across chess, shogi, and Go.
- **Tags:** MCTS, AlphaGo, AlphaZero, Self-Play, PUCT, Deep RL
- **Module:** 9 — MCTS & Conquering Go
- **PDF:** `../slides/lecture14pre.pdf`
- **Prev:** Lecture 13 — Monte Carlo Tree Search
- **Next:** *(none — final lecture)*

---

## Section 1: Why Go?

**Anchor ID:** `#why-go`

**Prose:** Open with Go as a grand challenge for AI. Go is 2500 years old, the hardest classic board game, and was identified by John McCarthy as a grand challenge task. Traditional game-tree search (minimax + alpha-beta pruning) succeeded in chess (Deep Blue, 1997) but failed catastrophically in Go. Explain why: the branching factor is ~250 (vs ~35 in chess), making exhaustive search impossible. The board has 19×19 = 361 intersections, and positions are difficult to evaluate with handcrafted heuristics because Go strategy is more positional and intuitive than tactical.

Pose the RL framing: Go involves learning to make decisions in a world where the dynamics model (opponent's play) and the reward model (who wins) are unknown. This connects MCTS to the broader RL framework studied all quarter.

**Callouts:**
- **Insight — Why Traditional Search Failed in Go:** The branching factor of Go (~250 legal moves per position) dwarfs chess (~35). A game lasts ~150 moves, yielding a game tree of roughly $250^{150}$ nodes — far beyond any brute-force search. Additionally, Go positions are extremely difficult to evaluate statically: expert-level evaluation requires holistic pattern recognition that resisted decades of handcrafted heuristic engineering. This is precisely the kind of problem where learned value functions and policy networks can shine.

---

## Section 2: MCTS Advantages (Recap)

**Anchor ID:** `#mcts-advantages`

**Prose:** Briefly recap the key advantages of Monte Carlo Tree Search from the previous lecture, setting up why MCTS is the right framework for Go:

- **Highly selective best-first search** — focuses computation on the most promising branches
- **Dynamic state evaluation** — evaluates positions through simulation rather than static heuristics
- **Breaks the curse of dimensionality** — uses sampling instead of exhaustive enumeration
- **Black-box compatible** — only requires the ability to simulate (sample) from the environment
- **Anytime algorithm** — can return a move at any point; more computation = better decisions
- **Parallelizable** — multiple simulations can run concurrently

This section is a bridge from Lecture 13. Keep it concise — the details were covered there.

---

## Section 3: AlphaGo Zero's MCTS with Neural Networks (PUCT)

**Anchor ID:** `#alphago-mcts`

**Prose:** This is the core technical section. Explain how AlphaGo Zero (Silver et al., Nature 2017) modifies standard MCTS by integrating a deep neural network $f_\theta$ that outputs both a policy (move probabilities) and a value (win probability) from a board position.

The neural network $f_\theta(s) = (\mathbf{p}, v)$ takes a board state $s$ and outputs:
- $\mathbf{p}$: a probability vector over legal moves (prior policy)
- $v$: a scalar estimate of the value (probability of winning from state $s$)

The MCTS procedure has four phases, repeated many times (typically 1600 simulations per move):

### Phase 1: Select

Starting from the root, traverse the tree by selecting at each node the action that maximizes a variant of the PUCT (Predictor + Upper Confidence Bound for Trees) formula:

$$a_t = \arg\max_a \left[ Q(s, a) + c_{\text{puct}} \cdot P(s, a) \cdot \frac{\sqrt{\sum_b N(s, b)}}{1 + N(s, a)} \right]$$

where:
- $Q(s, a)$ is the mean value of all simulations that passed through action $a$ from state $s$
- $P(s, a)$ is the prior probability from the neural network's policy head
- $N(s, a)$ is the visit count for action $a$ from state $s$
- $c_{\text{puct}}$ is an exploration constant

The tree alternates between the agent's moves (maximizing) and the opponent's moves (also maximizing from their perspective), mimicking a minimax tree.

### Phase 2: Expand and Evaluate

When a leaf node $s_L$ is reached, expand it by querying the neural network: $(\mathbf{p}, v) = f_\theta(s_L)$. Store the prior probabilities $P(s_L, a) = p_a$ for all legal actions. The value $v$ replaces the need for a random rollout — this is a key difference from vanilla MCTS.

### Phase 3: Backup

Propagate the value $v$ back up the tree, updating $Q(s, a)$ and $N(s, a)$ for every edge traversed during the selection phase:

$$N(s, a) \leftarrow N(s, a) + 1$$
$$W(s, a) \leftarrow W(s, a) + v$$
$$Q(s, a) \leftarrow \frac{W(s, a)}{N(s, a)}$$

where $W(s, a)$ is the total value accumulated through that edge.

### Phase 4: Play

After all simulations complete, select the move at the root proportional to visit counts:

$$\pi(s, a) \propto N(s, a)^{1/\tau}$$

where $\tau$ is a temperature parameter. With $\tau \to 0$, this becomes greedy (pick the most-visited action). During training, $\tau = 1$ for the first 30 moves (exploration) and $\tau \to 0$ thereafter.

**Callouts:**

- **Definition — PUCT Selection Rule:** At each internal node during tree traversal, select the action maximizing:
  $$a_t = \arg\max_a \left[ Q(s, a) + c_{\text{puct}} \cdot P(s, a) \cdot \frac{\sqrt{\sum_b N(s, b)}}{1 + N(s, a)} \right]$$
  The first term exploits (prefer actions with high estimated value). The second term explores (prefer actions with high prior probability that have been visited relatively few times). As $N(s,a)$ grows, the exploration bonus shrinks and the algorithm focuses on the empirically best action.

- **Insight — Neural Network Replaces Rollouts:** In vanilla MCTS, leaf nodes are evaluated by running random rollout simulations to a terminal state. AlphaGo Zero replaces this with a single forward pass of the neural network, which is both faster and more accurate. The network provides a learned value estimate $v$ that captures strategic understanding far beyond what random play could reveal. This is the key architectural insight that made AlphaGo Zero dramatically stronger than the original AlphaGo.

- **Insight — PUCT and Bandits:** The PUCT formula is inspired by UCB from the bandit literature (Lectures 10-11). Each node in the tree is treated as a multi-armed bandit problem where the arms are the legal moves. The exploration bonus $\frac{\sqrt{\sum_b N(s,b)}}{1+N(s,a)}$ plays the same role as the confidence interval in UCB: it encourages trying under-explored actions. But unlike standard UCB, PUCT incorporates the neural network's prior $P(s,a)$ to bias exploration toward moves the network considers promising — a form of informed exploration.

**Algorithm pseudocode:**

```
Algorithm: AlphaGo Zero MCTS (Single Move Selection)
1. Initialize root node s_root with neural network evaluation f_θ(s_root) = (p, v).
2. For simulation = 1, 2, ..., num_simulations do:
   a. [Select] Starting from s_root, traverse tree by selecting a = argmax[Q(s,a) + U(s,a)]
      where U(s,a) = c_puct · P(s,a) · √(Σ_b N(s,b)) / (1 + N(s,a))
   b. [Expand & Evaluate] At leaf node s_L, compute (p, v) = f_θ(s_L).
      Store P(s_L, a) = p_a for all legal actions a.
   c. [Backup] For each edge (s, a) on the path from s_L to s_root:
      N(s, a) ← N(s, a) + 1
      W(s, a) ← W(s, a) + v
      Q(s, a) ← W(s, a) / N(s, a)
3. Return π(s_root, a) ∝ N(s_root, a)^(1/τ)
```

---

## Section 4: Self-Play Training

**Anchor ID:** `#self-play`

**Prose:** Explain how AlphaGo Zero uses self-play to generate training data, creating a virtuous cycle between the neural network and MCTS.

The self-play loop:
1. **Play a game:** At each position $s_t$, run MCTS to produce a policy $\pi_t$. Sample an action $a_t \sim \pi_t$. Advance to the next state. Repeat until game end, yielding outcome $z \in \{-1, +1\}$.
2. **Store training data:** Each position generates a training example $(s_t, \pi_t, z)$ — the board state, the MCTS-improved policy, and the eventual game outcome.
3. **Train the network:** Update $f_\theta$ to minimize:

$$\ell = (z - v)^2 - \boldsymbol{\pi}^\top \log \mathbf{p} + c \|\theta\|^2$$

The first term is a mean-squared error loss pushing the value head $v$ toward the actual game outcome $z$. The second term is a cross-entropy loss pushing the policy head $\mathbf{p}$ toward the MCTS-improved policy $\boldsymbol{\pi}$. The third term is L2 regularization.

4. **Repeat:** Use the updated network for the next round of self-play.

**Callouts:**

- **Definition — AlphaGo Zero Loss Function:**
  $$\ell(\theta) = (z - v_\theta(s))^2 - \boldsymbol{\pi}^\top \log \mathbf{p}_\theta(s) + c \|\theta\|^2$$
  where $z$ is the game outcome, $v_\theta(s)$ is the predicted value, $\boldsymbol{\pi}$ is the MCTS search policy, $\mathbf{p}_\theta(s)$ is the network's prior policy, and $c$ is a regularization coefficient. The value loss teaches the network to predict who wins; the policy loss teaches it to match the refined MCTS policy.

- **Insight — MCTS as a Policy Improvement Operator:** The relationship between the neural network and MCTS is a form of generalized policy iteration. The neural network provides the current policy $\mathbf{p}_\theta$ and value estimate $v_\theta$ (policy evaluation). MCTS uses these to compute an improved policy $\boldsymbol{\pi}$ by looking ahead (policy improvement). Training the network on $\boldsymbol{\pi}$ closes the loop. Each iteration produces a strictly stronger player, creating a bootstrapping effect where the system improves without any external signal beyond the rules of the game.

- **Insight — Advantages of Self-Play for Go:** Self-play provides two crucial benefits. First, the only bottleneck is computation — no human expert data is needed. Second, self-play provides a well-matched opponent at every stage of training, which means reward signals are dense (roughly 50% win rate). If the agent played against a fixed strong opponent, it would lose almost every game early in training, providing sparse and uninformative feedback. Self-play acts as a form of automatic curriculum learning.

---

## Section 5: From AlphaGo to AlphaGo Zero to AlphaZero

**Anchor ID:** `#evolution`

**Prose:** Trace the evolution across three systems to highlight what was learned at each stage.

**AlphaGo (2016):** The original system that defeated Lee Sedol. Used:
- A supervised learning policy network trained on human expert games
- A reinforcement learning policy network fine-tuned via self-play
- A separate value network trained to predict game outcomes
- MCTS combining both networks with random rollouts

**AlphaGo Zero (2017):** Eliminated all human data. Key simplifications:
- Single neural network with dual heads (policy + value) instead of separate networks
- No human expert games — trained entirely from self-play starting from random play
- No handcrafted features — raw board position as input
- No random rollouts — neural network value estimate replaces rollout evaluation
- Simpler architecture (residual network)

**AlphaZero (2018):** Generalized beyond Go to chess and shogi with minimal game-specific modifications. Demonstrated that the same algorithm and architecture work across fundamentally different games, achieving superhuman play in all three within hours of training.

**Callouts:**

- **Insight — The Power of Eliminating Human Data:** AlphaGo Zero surpassed the original AlphaGo (which used human expert data) within 36 hours of training, ultimately achieving a 100-0 record against AlphaGo Lee. This demonstrates that human expert data can actually be a liability: it constrains the system to human-like play rather than allowing it to discover potentially superior strategies. AlphaGo Zero discovered novel joseki (standard patterns) and strategies that human experts found revelatory.

---

## Section 6: Evaluation and Ablations

**Anchor ID:** `#evaluation`

**Prose:** Present the empirical evaluation from Silver et al. (2017), covering three key ablation studies:

### Impact of Architecture
Compare four architectures by Elo rating:
- **dual-res** (dual-head residual network): ~4300 Elo — the best architecture
- **sep-res** (separate policy/value residual networks): ~3800 Elo
- **dual-conv** (dual-head convolutional network): ~3750 Elo
- **sep-conv** (separate policy/value convolutional networks): ~3100 Elo

Key takeaway: Residual connections and the dual-head architecture both contribute significantly. The dual head forces shared representations between policy and value, acting as a regularizer.

### Impact of MCTS
Compare Elo ratings with and without MCTS:
- Raw network (no search): ~3000 Elo
- AlphaGo Zero (with MCTS): ~5000 Elo
- Previous versions: AlphaGo Master ~4800, AlphaGo Lee ~3700, AlphaGo Fan ~3100
- Traditional programs: Crazy Stone ~2000, Pachi ~1200, GnuGo ~400

The ~2000 Elo gap between the raw network and AlphaGo Zero demonstrates the enormous value of search even with a strong learned policy. MCTS isn't just a small improvement — it roughly doubles the effective playing strength.

### Overall Performance Over Time
AlphaGo Zero with 40 residual blocks surpasses AlphaGo Lee within ~3 days of training and AlphaGo Master within ~21 days, reaching ~5000 Elo by 40 days.

**Callouts:**

- **Insight — Search Still Matters:** Even with a neural network strong enough to play at ~3000 Elo from raw policy outputs, MCTS adds ~2000 Elo points of playing strength. This underscores a fundamental lesson: combining learned intuition (the network) with deliberate planning (tree search) produces results far beyond either alone. This mirrors the human cognitive process of using intuition to guide search rather than replacing it.

---

## Section 7: Beyond Games — AlphaZero's Legacy

**Anchor ID:** `#beyond-games`

**Prose:** Discuss how the core ideas of AlphaZero extend far beyond board games:

- **AlphaTensor** (2022): Discovered faster matrix multiplication algorithms by framing the problem as a single-player game where moves correspond to tensor decomposition steps. Found algorithms faster than any known human-designed method for certain matrix sizes.

- **AlphaDev** (2023): Discovered faster sorting algorithms by treating assembly instruction selection as a game. The resulting algorithms were incorporated into standard C++ libraries used by millions of developers.

- **General principle:** Many optimization and discovery problems can be reframed as search problems over (extremely large) combinatorial spaces. The MCTS + neural network framework provides a general-purpose engine for tackling such problems — the key insight being that RL can transform optimization problems into sequential decision-making problems amenable to learned search.

**Callouts:**

- **Insight — RL as Search:** The beautiful insight connecting AlphaGo to AlphaTensor and AlphaDev is that using RL to vastly speed up problems can be achieved by representing them as (extremely large) search problems. The neural network learns a heuristic that guides the search, while MCTS ensures systematic exploration. This paradigm shift — from hand-engineering solutions to learning to search for them — may be one of the most impactful legacies of the AlphaGo line of work.

---

## Section 8: UCT and the Bandit Connection (Optional Depth)

**Anchor ID:** `#uct-bandit-connection`

**Prose:** Provide optional deeper treatment of the connection between MCTS and the bandit/RL theory from earlier in the course. Upper Confidence Tree (UCT) search borrows from the bandit literature: each tree node is treated as a multi-armed bandit (MAB) problem where each legal action is an arm.

The standard UCT formula selects actions by:

$$a_t = \arg\max_a \left[ Q(s, a) + c \sqrt{\frac{\ln N(s)}{N(s, a)}} \right]$$

This is directly the UCB1 formula from Lecture 10, applied at each node. The exploration bonus $\sqrt{\frac{\ln N(s)}{N(s,a)}}$ ensures that infrequently visited actions are tried, while $Q(s,a)$ exploits the empirically best actions.

Why is there an exploration/exploitation problem during simulated episodes? Because computation is limited — we can only run a finite number of simulations. We want to allocate those simulations efficiently: spending most time evaluating the most promising moves while still occasionally checking alternatives. This is exactly the bandit problem, just applied to computational resource allocation rather than real-world actions.

MCTS is a good choice for problems where:
- The state space is large (breaks curse of dimensionality via sampling)
- The action space may be large (neural network prior focuses search)
- We want an anytime algorithm (more compute = better moves)

It may struggle when horizons are very long and action spaces are huge simultaneously, since the tree may not grow deep enough to capture long-term consequences.

**Callouts:**

- **Definition — Upper Confidence Tree (UCT):** UCT applies UCB1 at every node in the search tree:
  $$a = \arg\max_a \left[ Q(s, a) + c \sqrt{\frac{\ln N(s)}{N(s, a)}} \right]$$
  where $N(s) = \sum_a N(s, a)$ is the total visit count at state $s$. This treats action selection at each node as a bandit problem, balancing exploitation of promising moves with exploration of under-sampled ones. PUCT (used in AlphaGo Zero) modifies this by incorporating a learned prior $P(s,a)$.

- **Insight — UCB Minimizes Regret, UCT Minimizes Simulation Regret:** UCB minimizes regret in the standard bandit setting. UCT applies the same principle within the MCTS tree: it minimizes "regret" in the allocation of simulations. Actions that lead to later good rewards (deeper in the tree) get prioritized. This connection — using bandit algorithms to guide planning — is a powerful bridge between the exploration theory from Lectures 10-11 and the planning methods studied here.

---

## Section 9: Summary

**Anchor ID:** `#summary`

**Prose:** Synthesize the key principles that made AlphaGo/AlphaZero successful, connecting back to course themes:

- **Self-play** eliminates the need for human data and provides automatic curriculum learning through well-matched opponents
- **Strategic computation** via MCTS allocates thinking time to the most promising moves
- **Highly selective best-first search** using PUCT focuses on a tiny fraction of the game tree
- **Power of averaging** — aggregating many simulations produces reliable value estimates
- **Local computation** — each MCTS simulation is lightweight; global quality emerges from many local updates
- **Learned heuristics** — the neural network provides both intuition (policy prior) and evaluation (value estimate), replacing handcrafted features
- **Generalized policy iteration** — the network-MCTS loop implements the same evaluate-improve cycle seen throughout the course, from dynamic programming to policy gradient methods

---

## Navigation

- **Previous:** [Lecture 13 — Monte Carlo Tree Search](lecture13.html)
- **Next:** *(none)*
