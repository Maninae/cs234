# Lecture 13: Monte Carlo Tree Search

## Metadata

- **Title:** Monte Carlo Tree Search
- **Description:** From simulation-based search to AlphaZero — how Monte Carlo Tree Search combines model-based planning with bandit-style exploration to conquer Go and beyond.
- **Module:** 9 — MCTS & Conquering Go
- **Tags:** Monte Carlo Tree Search, UCT, AlphaZero, Simulation-Based Search, Game Playing, Self-Play
- **Prev:** Lecture 12 — Data-Efficient RL (Part 4)
- **Next:** Lecture 14 — MCTS & Go (Part 2)
- **PDF:** `slides/lecture13pre.pdf`

---

## Section 1: Local Computation for Better Decisions

**Anchor:** `#local-computation`

**Prose:** Open by contrasting the approach taken so far in the course — computing a policy over the *entire* state space — with a fundamentally different idea: **local, simulation-based planning**. Instead of solving the whole MDP, we invest additional computation at decision time to make a better choice *for the current state only*. This is the core philosophy behind MCTS and related forward-search methods. Motivate with the observation that in many domains (games, robotics, real-time planning), the state space is far too large for global policy computation, but we have access to a simulator (model) we can query cheaply.

**Callout — Insight:**
> **Planning locally, not globally.** Every algorithm we've studied so far — value iteration, policy gradient, Q-learning — computes a policy or value function over the entire state space. But in games like Go with $|\mathcal{S}| \approx 10^{170}$ states, this is hopeless. The key idea of simulation-based search: given a model $\mathcal{M}_\nu$, use it to simulate forward *from the current state* and choose the best action based on those simulations. We only solve the sub-MDP rooted at $s_t$.

---

## Section 2: Simple Monte Carlo Search

**Anchor:** `#simple-mc-search`

**Prose:** Introduce the simplest form of simulation-based search. Given a model $\mathcal{M}_\nu$ and a **simulation policy** $\pi$, we evaluate each action by running $K$ Monte Carlo rollouts from the current state, computing the mean return, and selecting the action with the highest estimated value. This is essentially one step of policy improvement: we use $\pi$ to estimate $Q(s_t, a)$ for each action, then act greedily.

**Equations:**

Simulate $K$ episodes from current state $s_t$ for each action $a \in \mathcal{A}$:

$$\{s_t, a, R_{t+1}^k, \ldots, S_T^k\}_{k=1}^K \sim \mathcal{M}_\nu, \pi$$

Evaluate actions by mean return (Monte Carlo evaluation):

$$Q(s_t, a) = \frac{1}{K} \sum_{k=1}^{K} G_k \xrightarrow{P} q_\pi(s_t, a)$$

Select the current (real) action with maximum value:

$$a_t = \arg\max_{a \in \mathcal{A}} Q(s_t, a)$$

**Callout — Definition:**
> **Simple Monte Carlo Search.** Given a model $\mathcal{M}_\nu$ and simulation policy $\pi$: (1) for each action $a$, simulate $K$ complete episodes from $(s_t, a)$ using $\pi$; (2) estimate $Q(s_t, a)$ as the mean return across simulations; (3) select the action with the highest estimated value. This performs one step of policy improvement over $\pi$.

**Callout — Insight:**
> **Why this works.** By the law of large numbers, as $K \to \infty$ the Monte Carlo estimate converges to the true action-value $q_\pi(s_t, a)$. Acting greedily with respect to $q_\pi$ is guaranteed to be at least as good as following $\pi$ — this is the policy improvement theorem. Simple MC search is a one-step improvement operator.

---

## Section 3: Forward Search and Expectimax Trees

**Anchor:** `#expectimax-trees`

**Prose:** Can we do better than one step of policy improvement? Yes — if we have an MDP model $\mathcal{M}_\nu$, we can build a full **expectimax tree** rooted at the current state $s_t$. Forward search algorithms select the best action by **lookahead**: they build a search tree with the current state at the root, using the model to look ahead. This computes optimal $Q(s, a)$ values for the current state without needing to solve the whole MDP — just the sub-MDP starting from now.

**Key limitation:** The size of the expectimax tree scales as $(|\mathcal{S}||\mathcal{A}|)^H$ where $H$ is the horizon. This is catastrophically expensive for large state/action spaces or long horizons. We need a way to *selectively* explore the tree.

**Callout — Definition:**
> **Expectimax Tree.** A search tree rooted at the current state $s_t$, where decision nodes (squares) represent states and chance nodes (circles) represent stochastic transitions. The tree alternates: at decision nodes, the agent selects an action; at chance nodes, the environment samples a next state. Computing optimal values requires exhaustive expansion — infeasible for large MDPs.

---

## Section 4: Monte Carlo Tree Search (MCTS)

**Anchor:** `#mcts`

**Prose:** This is the central algorithm of the lecture. MCTS addresses the intractability of full expectimax search by *selectively* growing the search tree through simulation. Instead of exhaustively expanding all nodes, MCTS iteratively builds a partial tree by running simulated episodes from the root, using the results to update value estimates and guide future simulations toward the most promising parts of the tree.

The MCTS loop has three phases per simulation:
1. **Select** — traverse the existing tree from root to a leaf, choosing actions according to a tree policy (e.g., UCT)
2. **Expand and Evaluate** — add one or more new nodes to the tree; evaluate the new leaf (via rollout or a learned value function)
3. **Backup** — propagate the evaluation result back up the tree, updating value estimates for all ancestors

After $K$ simulations, select the real action at the root with the highest visit count or highest value.

$$a_t = \arg\max_{a \in \mathcal{A}} Q(s_t, a)$$

**Callout — Definition:**
> **Monte Carlo Tree Search.** Given a model $\mathcal{M}_\nu$, build a **search tree** rooted at $s_t$ by iteratively running $K$ simulated episodes. Each simulation: (1) **Select** actions in the existing tree using a tree policy; (2) **Expand** the tree by adding a new node and **evaluate** it; (3) **Backup** the result to update ancestor statistics. After all simulations, select the real action with the best statistics at the root.

---

## Section 5: Upper Confidence Tree (UCT) Search

**Anchor:** `#uct`

**Prose:** The key question in MCTS is: how do we select actions during simulation? This is where the connection to bandits becomes crucial. **Upper Confidence Tree (UCT)** search treats each node in the search tree as a multi-armed bandit problem — each child action is an "arm," and we use an upper confidence bound to balance exploration (trying under-visited actions) and exploitation (focusing on actions that look promising).

At each node $i$ in the tree, UCT selects the action with the highest upper confidence bound:

$$Q(s, a, i) = \frac{1}{N(i, a)} \sum_{k=1}^{N(i,a)} G_k(i, a) + c\sqrt{\frac{\log N(i)}{N(i, a)}}$$

where:
- $N(i, a)$ is the number of times action $a$ was selected at node $i$
- $G_k(i, a)$ is the $k$-th return (discounted sum of rewards) from node $i$ following action $a$
- $N(i)$ is the total visit count at node $i$
- $c$ is an exploration constant

For each simulated episode $k$, select the action/arm with the highest upper bound:

$$a_{ik} = \arg\max_a Q(s, a, i)$$

**Callout — Insight:**
> **Why UCB in a tree?** At each tree node, we face a classic exploration-exploitation dilemma: should we explore an action we haven't tried often (it might lead to a great subtree) or exploit the action with the best estimated value so far? UCT resolves this by applying UCB1 at every node. Actions with few visits have a large exploration bonus $c\sqrt{\log N(i)/N(i,a)}$, so they get tried. As visit counts grow, the bonus shrinks and the algorithm concentrates on the most promising branches. This makes MCTS a **highly selective best-first search** — it automatically focuses computation where it matters most.

**Callout — Insight:**
> **The tree policy changes across simulations.** Because UCT updates $Q$ values after each simulation, the policy used to traverse the tree changes from one simulation to the next. Early simulations explore broadly; later simulations concentrate on the most promising lines of play. This adaptive behavior is what makes MCTS so effective — it allocates simulation budget where it has the most impact.

---

## Section 6: Advantages of Monte Carlo Tree Search

**Anchor:** `#mcts-advantages`

**Prose:** Summarize the key advantages of MCTS before moving to the AlphaZero case study:

- **Highly selective best-first search** — focuses computation on promising branches
- **Dynamic state evaluation** — evaluates states on-the-fly rather than precomputing a value function
- **Breaks the curse of dimensionality** — uses sampling to avoid exhaustive enumeration of the state space
- **Works for black-box models** — only requires the ability to sample (simulate), not explicit transition probabilities
- **Computationally efficient, anytime, parallelizable** — can be stopped at any time and returns the best action found so far; simulations are largely independent and can run in parallel

**Callout — Insight:**
> **When is MCTS a good choice?** MCTS excels for problems with large state spaces and long horizons where exact methods (value iteration, expectimax) are infeasible, *provided* we have a model (simulator) to query. It is particularly well-suited to games (Go, chess, shogi) and planning problems where the model is known. For problems with small state/action spaces and short horizons, exact methods may be preferable.

---

## Section 7: Case Study — The Game of Go

**Anchor:** `#game-of-go`

**Prose:** Transition to the marquee application of MCTS: the game of Go. Go is 2,500 years old, the hardest classic board game, and was identified by John McCarthy as a grand challenge for AI. Traditional game-tree search (minimax with alpha-beta pruning) had long failed in Go due to the enormous branching factor (~250 legal moves per position) and the difficulty of constructing a good evaluation function.

Key question for understanding: **Does playing Go involve learning to make decisions where dynamics and reward model are unknown?** In Go, the rules (dynamics) are known — it's a perfect-information, deterministic game. The challenge is purely computational: the game tree is astronomically large ($\sim 10^{170}$ positions). This makes Go a planning problem, not a learning problem in the traditional sense — yet RL techniques proved essential for building superhuman play.

**Callout — Definition:**
> **The Game of Go.** A two-player, perfect-information, zero-sum board game played on a $19 \times 19$ grid. Players alternate placing black and white stones. Groups of stones are captured when surrounded. The game ends when both players pass; the player controlling more territory wins. The branching factor (~250) and game length (~150 moves per player) make brute-force search infeasible — the game tree has roughly $250^{300} \approx 10^{720}$ nodes.

---

## Section 8: AlphaZero's MCTS — Select, Expand, Evaluate, Backup

**Anchor:** `#alphazero-mcts`

**Prose:** This is the heart of the lecture. Walk through AlphaZero's modified MCTS step by step, using the diagrams from Silver et al. (Nature, 2017). AlphaZero modifies standard UCT in several crucial ways:

### Step (a): Select
Starting from the root, traverse the tree by selecting the child with the highest combined score $Q + U$ at each node. Here $Q$ is the mean value estimate and $U$ is an exploration bonus derived from a **neural network's policy prior** (not just visit counts as in vanilla UCT). The selection criterion is:

$$a_t = \arg\max_a \left[ Q(s, a) + c \cdot P(s, a) \cdot \frac{\sqrt{N(s)}}{1 + N(s, a)} \right]$$

where $P(s, a)$ is the prior probability from the policy network. This is a key departure from standard UCT: the exploration bonus is guided by *learned* knowledge about which moves are likely to be good.

### Step (b): Expand and Evaluate
When a leaf node is reached, expand it by adding its children to the tree. Evaluate the leaf using a neural network $f_\theta$ that outputs both:
- A **policy vector** $\mathbf{p}$ (prior probabilities over actions)
- A **value estimate** $v$ (predicted outcome from this position)

$$(\ \mathbf{p},\, v\ ) = f_\theta(s)$$

This replaces the random rollout of classical MCTS with a learned evaluation — a crucial innovation. The policy head provides the prior $P(s, a)$ used in the selection step; the value head provides the leaf evaluation used in backup.

### Step (c): Backup
Propagate the value $v$ back up the tree along the path traversed during selection. At each ancestor node, update the visit count $N(s, a)$ and the mean action value $Q(s, a)$.

The whole process (select → expand & evaluate → backup) is repeated many times. At the end, the action at the root is selected proportionally to visit counts:

$$\pi(s) \propto N(s, a)^{1/\tau}$$

where $\tau$ is a temperature parameter controlling exploration vs. exploitation.

**Callout — Definition:**
> **AlphaZero MCTS.** A modified Monte Carlo Tree Search that uses a neural network $f_\theta(s) = (\mathbf{p}, v)$ in place of random rollouts. The network's policy output $\mathbf{p}$ guides the exploration bonus during tree traversal; the value output $v$ evaluates leaf nodes. After many simulations, the root action is chosen proportionally to $N(s,a)^{1/\tau}$.

**Callout — Insight:**
> **Neural network replaces rollouts.** Classical MCTS evaluates leaf nodes by running random rollouts to the end of the game — slow and noisy. AlphaZero replaces this with a single forward pass through a neural network, which provides both a value estimate *and* a policy prior to guide future search. This is faster, more accurate, and allows knowledge learned from millions of games to be injected into every tree search.

**Callout — Insight:**
> **Min-max structure emerges naturally.** In a two-player game, the tree alternates between the agent's moves and the opponent's moves. The opponent is also "maximizing" its own value — which is the negation of the agent's value. Therefore the tree naturally mimics a **min-max** tree: the agent maximizes $Q + U$, and at the opponent's turn the same formula is applied from the opponent's perspective, effectively minimizing the agent's value.

---

## Section 9: Self-Play Training

**Anchor:** `#self-play`

**Prose:** Explain how AlphaZero generates its own training data through **self-play**. The system plays complete games against itself: at each position $s_t$, it runs MCTS to produce a policy $\pi_t$, samples an action $a_t \sim \pi_t$, and continues. When the game ends, the outcome $z \in \{-1, +1\}$ (loss or win) provides a training signal for every position visited during the game.

The neural network $f_\theta$ is then trained to match:
- Its **policy output** $\mathbf{p}$ to the MCTS visit-count policy $\pi_t$ (cross-entropy loss)
- Its **value output** $v$ to the game outcome $z$ (mean-squared error loss)

This creates a virtuous cycle: better networks produce better MCTS policies, which generate better training data, which train better networks.

**Callout — Insight:**
> **Self-play as curriculum learning.** A key advantage of self-play is that the opponent is always well-matched — it's the same agent. This means rewards (wins/losses) are relatively dense: roughly 50% win rate against yourself. A weak agent playing against a grandmaster would almost always lose, providing little useful gradient signal. Self-play naturally provides a curriculum of increasing difficulty as the agent improves.

**Callout — Insight:**
> **No human data required.** AlphaGo (the original) was first trained on human expert games, then improved via self-play. AlphaZero skips human data entirely — starting from random play, it surpasses all previous versions through pure self-play. The bottleneck is computation, not data. This demonstrates that RL + search can discover strategies that humans never found.

---

## Section 10: Training the Neural Network

**Anchor:** `#training-network`

**Prose:** Detail the network architecture and training procedure. AlphaZero uses a single deep neural network with a shared **residual** backbone that branches into a **policy head** and a **value head**:

- **Input:** Raw board state $s$ (stone positions, whose turn, etc.)
- **Backbone:** Deep residual convolutional network (e.g., 40 residual blocks)
- **Policy head:** Outputs $\mathbf{p}_\theta(s)$, a probability distribution over all legal moves
- **Value head:** Outputs $v_\theta(s) \in [-1, 1]$, the predicted game outcome from position $s$

Training targets come from self-play games:
- Policy target: the MCTS search probabilities $\pi_t$
- Value target: the actual game outcome $z$

The combined loss:

$$\ell = (z - v_\theta(s))^2 - \pi^T \log \mathbf{p}_\theta(s) + c \|\theta\|^2$$

**Callout — Definition:**
> **AlphaZero Neural Network.** A deep residual network $f_\theta(s) = (\mathbf{p}, v)$ that takes a board state as input and outputs (1) a policy vector $\mathbf{p}$ giving prior probabilities over moves, and (2) a scalar value $v \in [-1, 1]$ predicting the game outcome. Trained end-to-end on self-play data to minimize a combined MSE + cross-entropy loss.

---

## Section 11: Evaluation and Ablations

**Anchor:** `#evaluation`

**Prose:** Present the empirical results from Silver et al. (Nature, 2017) that demonstrate AlphaZero's power:

### Impact of Architecture
Dual-residual network (shared backbone with two heads) achieves ~4,300 Elo, substantially outperforming:
- Separate residual networks (~3,800 Elo)
- Dual convolutional (~3,750 Elo)
- Separate convolutional (~3,100 Elo)

The residual architecture and dual-head design are both important — residual connections help train deeper networks, and sharing the backbone between policy and value heads provides useful inductive bias.

### Impact of MCTS
Even the raw network (no search) achieves ~3,000 Elo. Adding MCTS pushes AlphaGo Zero to ~5,000 Elo — a massive improvement. For comparison: AlphaGo Lee (~3,700 Elo, which beat Lee Sedol), AlphaGo Fan (~3,200), and the best traditional programs (Crazy Stone ~2,000, Pachi ~1,300, GnuGo ~500) are all far below.

### Overall Performance
AlphaGo Zero (40 blocks) surpasses AlphaGo Master (which beat Ke Jie) within ~30 days of self-play training. AlphaGo Lee's level is surpassed within ~3 days. The learning curve shows rapid initial improvement followed by slow continued gains.

### No Need for Human Data
AlphaGo Zero, trained purely from self-play, surpasses AlphaGo Master, which was pretrained on human games. This is a striking demonstration that self-play RL can exceed human knowledge.

**Callout — Insight:**
> **MCTS as a policy amplifier.** The raw neural network is strong (~3,000 Elo), but MCTS amplifies it to ~5,000 Elo — superhuman level. MCTS corrects the network's mistakes by looking ahead and averaging over many simulations. Conversely, the network makes MCTS efficient by providing good priors and evaluations. Neither component alone achieves top performance; the combination is greater than the sum of its parts.

---

## Section 12: Beyond Go

**Anchor:** `#beyond-go`

**Prose:** Conclude by emphasizing that the AlphaZero framework generalizes far beyond Go:

- **Other games:** Chess, shogi — AlphaZero achieved superhuman play in all three games with the same algorithm, differing only in the game rules fed to the simulator
- **AlphaTensor:** Discovering faster matrix multiplication algorithms by framing the search for efficient decompositions as a game
- **AlphaDev:** Discovering faster sorting algorithms at the assembly-instruction level
- **Beautiful insight:** Using RL to vastly speed up problems that can be represented as (extremely large) search problems

This connects back to the broader course theme: RL isn't just about robots and Atari — it's a general framework for sequential decision-making under uncertainty, and when combined with powerful search, it can tackle problems that were previously thought to require human ingenuity.

**Callout — Insight:**
> **RL as a meta-algorithm for search.** The deepest lesson of AlphaZero is not about Go specifically — it's that RL + tree search can be applied to any problem expressible as a sequential decision process with a simulator. By learning both a policy (where to look) and a value function (how good is this state), the agent can search astronomically large spaces efficiently. This paradigm has since been applied to scientific discovery (protein folding, algorithm design, mathematical conjecture) with remarkable success.

---

## Section 13: Summary

**Anchor:** `#summary`

**Prose:** Recap the key ideas:

- **Simulation-based search** uses a model to plan locally at the current state, avoiding the need to solve the full MDP
- **Simple Monte Carlo search** performs one step of policy improvement via Monte Carlo evaluation
- **Expectimax trees** compute optimal values but scale as $(|\mathcal{S}||\mathcal{A}|)^H$ — infeasible for large problems
- **MCTS** selectively grows a search tree through iterative simulation: select (tree policy) → expand & evaluate → backup
- **UCT** applies UCB at each tree node, treating action selection as a bandit problem — balancing exploration of under-visited branches with exploitation of promising ones
- **AlphaZero** enhances MCTS with a learned neural network $f_\theta(s) = (\mathbf{p}, v)$ that replaces rollouts (value head) and guides search (policy head)
- **Self-play** generates training data without human knowledge; the system bootstraps from random play to superhuman performance
- The framework generalizes beyond games to any problem with a simulator and sequential structure
