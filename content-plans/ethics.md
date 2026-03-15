# Content Plan: Ethics, Society & Value Alignment (Part II)

## Metadata

- **Lecture eyebrow:** Guest Lecture
- **Title:** Ethics, Society & Value Alignment
- **Description:** From aligning AI to individual users toward aligning with society at large — exploring top-down moral principles, bottom-up learning from examples, and the participatory middle ground.
- **Guest speaker:** Wanheng Hu, Ph.D.
- **PDF link:** `../slides/ethics_society_234_2.pdf`
- **Tags:** Value Alignment, AI Ethics, Moral Philosophy, Multi-Agent Society, Participatory AI, Reward Hacking
- **Navigation:** Standalone guest lecture (Module 8). No prev/next lecture links.

---

## Section 1: Recap — What Is Value Alignment?

**Anchor ID:** `#recap`

**Prose summary:**
Open by recapping the core question from Part I: value alignment is the problem of designing AI agents that do what we *really* want them to do. Explain the three interpretations introduced previously — aligning to the user's **intent** (what they mean to ask for), their **preferences** (what they would choose upon reflection), or their **best interest** (what would actually be good for them). Note that Part I explored sycophancy in AI and agentic AI as case studies where these three targets can pull in different directions. This sets the stage for Part II's central question: the previous discussion focused entirely on aligning to a *single user*, but what about everyone else?

**Callout — Definition:**
> **Definition — Value Alignment**
>
> Value alignment is the problem of designing AI agents that do what we *really* want them to do. Three interpretations: aligning to the user's **intent**, their **preferences**, or their **best interest**. These can conflict — a sycophantic chatbot satisfies stated preferences but may undermine the user's genuine interests.

**Callout — Insight:**
> **Insight — The Missing Piece**
>
> Part I's entire framework was user-centric. But AI systems operate in a social context — actions that are perfectly aligned with one user's goals can harm others. A ticket-buying agent optimized for you may drive up prices for everyone else. Value alignment must account for *people other than the user*.

---

## Section 2: Aligning to Social Value or Morality

**Anchor ID:** `#social-value`

**Prose summary:**
Introduce a **fourth interpretation** of value alignment: an AI agent is value-aligned if it does what is *morally right*. This shifts the emphasis from "what *I* want" to "what *we* want" — the collective "we." Use the paperclip AI thought experiment: a paperclip maximizer is misaligned not just because it ignores the user, but because destroying the world is bad *for everyone*. Even if an AI perfectly satisfies the user's intent, preferences, and best interest, the user's desires might be bad for others. Therefore moral alignment goes beyond individual alignment.

Crucially, this doesn't mean Part I was a waste of time. Even when we want to align to morality, we *also* want to respect the user's wishes whenever those wishes are morally acceptable. So the user-centric framework still matters — it just operates within a larger ethical context.

**Callout — Example:**
> **Example — The Concert Ticket Agent**
>
> Imagine a personal AI agent that buys concert tickets at the best price — monitoring markets, negotiating, and purchasing automatically. This agent is perfectly aligned to your preferences. But what happens when *everyone* has such an agent? Individually aligned actions can produce collectively harmful outcomes: faster competition between agents, price spikes, and unequal advantages across users. Individual alignment ≠ social alignment.

---

## Section 3: Top-Down Moral Alignment

**Anchor ID:** `#top-down`

**Prose summary:**
The **top-down approach** attempts to explicitly formulate moral principles and encode them into the AI system — via the reward function, hard constraints, post-processing filters, or constitutional rules. Walk through the philosophical challenge: *which* moral principles? This is an open problem in moral theory itself.

Cover the two main philosophical frameworks and their limitations:

1. **Utilitarianism** — maximize total net happiness over all people. Problems: ignores the *distribution* of happiness (is it okay to make one person extremely miserable if it slightly increases happiness for a billion others?) and ignores *rights* (could justify violating individuals for the "greater good").

2. **Common-sense pluralism** — maintain many different moral rules ("Don't lie," "Don't steal," "Don't hurt people," "Keep promises"). Problems: rules can conflict with each other, and they require highly nuanced exceptions that are difficult to enumerate.

Introduce the concept of **moral reward hacking**: even well-intentioned moral principles, when incorrectly specified, can produce surprising and harmful behavior. A utilitarian AI agent might find perverse ways to "maximize total happiness" — just as RL agents find unexpected exploits in misspecified reward functions. The same reward hacking problem from the technical RL literature applies directly to moral specifications.

**Callout — Definition:**
> **Definition — Top-Down Moral Alignment**
>
> Explicitly formulate moral principle(s) and encode them into the AI system via reward functions, hard constraints, or post-processing. The agent follows rules designed by its creators rather than learning values from data.

**Callout — Insight:**
> **Insight — Moral Reward Hacking**
>
> Just as RL agents exploit misspecified reward functions, moral principles that are "almost right" can produce wildly unethical behavior when optimized. A utilitarian objective to "maximize total happiness" might be satisfied by an agent that manipulates people's beliefs rather than actually improving their lives — the moral analog of reward hacking.

---

## Section 4: Case Study — Top-Down Agentic AI

**Anchor ID:** `#top-down-agentic`

**Prose summary:**
Apply the top-down approach to the concert ticket agent. Discuss two concrete design strategies: (1) **hard constraints** such as "do not manipulate or mislead other agents," and (2) **global objectives** such as minimizing price inflation or promoting fairness across all users.

Then lay out the challenges: Which principles should we enforce — fairness, efficiency, profit? How should conflicts between users be resolved? And the persistent risk of reward hacking applies here too — a constraint like "don't raise prices" might cause agents to find other exploitative strategies.

Summarize the **top-down limitations** broadly:
- Difficult to create a rule set that covers all possible situations
- Hard to handle edge cases and exceptions
- Moral rules often conflict with one another
- Risk of oversimplification
- Hard to capture individual nuance and cultural variation

**Callout — Example:**
> **Example — Top-Down Ticket Agent**
>
> A top-down ticket agent might be constrained with: "Never bid more than 2× face value" and "Do not impersonate human buyers." These rules are sensible but incomplete — the agent might still corner the market by making thousands of simultaneous purchases, or collude implicitly with other agents. No finite rule set can anticipate every harmful strategy.

---

## Section 5: Real-World Ethical AI Guidelines

**Anchor ID:** `#real-world-guidelines`

**Prose summary:**
Ground the theoretical discussion with real-world data. Reference the Jobin et al. (2019) survey of 84 published AI ethics guidelines worldwide (from *Nature Machine Intelligence*). Present the key finding: there is *convergence* on broad themes but significant divergence on specifics. The most commonly cited principles across the 84 documents are:

| Principle | Prevalence |
|---|---|
| Transparency | 73/84 |
| Justice & Fairness | 68/84 |
| Non-maleficence | 60/84 |
| Responsibility | 60/84 |
| Privacy | 47/84 |
| Beneficence | 41/84 |
| Freedom & Autonomy | 34/84 |
| Trust | 28/84 |
| Sustainability | 14/84 |
| Dignity | 13/84 |
| Solidarity | 6/84 |

Note the geographic concentration: most guidelines were issued in the US (21), EU (19), UK (13), and Japan (4). This raises representation concerns — whose values are being encoded into these top-down frameworks?

**Callout — Insight:**
> **Insight — Convergence Without Consensus**
>
> Across 84 published AI ethics guidelines worldwide, principles like transparency (87%), justice (81%), and non-maleficence (71%) appear almost universally. But "transparency" can mean very different things in different documents — from full algorithmic explainability to simple disclosure of AI use. Agreement on *words* masks disagreement on *meaning*.

---

## Section 6: Bottom-Up Moral Alignment

**Anchor ID:** `#bottom-up`

**Prose summary:**
The **bottom-up approach** doesn't try to formulate moral principles explicitly. Instead, it learns moral behavior from examples — through inverse RL, imitation learning, or RLHF. The agent observes human behavior and feedback, then generalizes.

Discuss two major challenges:

1. **Philosophical problem — moral disagreement:** Whose examples should the AI learn from? Different people, cultures, and communities have genuinely different moral views. Should ChatGPT produce depictions of the prophet Muhammad? Should it offer tips for evading law enforcement? The answer depends on who you ask. Some disagreements arise because the cases are genuinely *hard* — not because one side is wrong.

2. **Technical problem — rare and unforeseen cases:** A self-driving car trained on real-world human driving data might never see examples of how to respond to a deadly brake failure. Bottom-up approaches can only generalize from their training distribution, and moral edge cases are by definition rare. If the agent extrapolates incorrectly, there's a gap in moral "understanding."

3. **Normative challenge — representation:** Feedback data is often unevenly distributed. Majority groups are more likely to be represented; minority or marginalized groups may be underrepresented. The learned values may therefore reflect existing social biases rather than a fair moral consensus.

**Callout — Definition:**
> **Definition — Bottom-Up Moral Alignment**
>
> Learn moral behavior from data, feedback, or human examples rather than encoding explicit rules. Techniques include inverse RL (infer reward from demonstrations), imitation learning (clone expert behavior), and RLHF (optimize a policy using human preference judgments).

**Callout — Example:**
> **Example — Bottom-Up Ticket Agent**
>
> A bottom-up ticket agent learns purchasing norms from user feedback on past transactions and historical market data. It adapts by observing agent-to-agent interactions. But which norms get learned — speed? profit-maximization? fairness? Majority user behavior dominates the signal, and minority users' preferences may be drowned out.

---

## Section 7: Participatory AI — A Middle Path

**Anchor ID:** `#participatory-ai`

**Prose summary:**
Introduce **participatory AI** as a framework that goes beyond both top-down rule-writing and bottom-up data-learning. The key idea: expand "learning from humans" to include *multiple stakeholders*, especially *affected non-users*, with *ongoing input* rather than one-time training.

In participatory AI, values are treated as:
- **Contextual** — what's right depends on the situation and community
- **Contestable** — stakeholders can challenge and debate value choices
- **Revisable** — the system can and should be updated over time as understanding evolves

Concrete examples in practice:
- Community advisory boards for AI systems
- Ongoing user feedback channels
- Public consultations before deployment

Key ethical considerations: recognition that values *can and will* conflict, and a willingness to revise systems over time rather than treating alignment as a one-time problem.

**Callout — Insight:**
> **Insight — Alignment Is Not a One-Shot Problem**
>
> Participatory AI treats value alignment as an ongoing process, not a design-time decision. Values are contextual, contestable, and revisable. This mirrors how human institutions work — laws, norms, and policies evolve through ongoing democratic deliberation rather than being fixed once and for all.

---

## Section 8: Takeaways for Moral Value Alignment

**Anchor ID:** `#takeaways`

**Prose summary:**
Close with the lecture's pragmatic conclusions. There is **no silver bullet** to guarantee perfectly moral AI behavior — moral philosophy itself hasn't solved this problem, so we shouldn't expect AI alignment to solve it either. But alignment can be *better or worse*, and the lecture offers a practical roadmap:

1. **Start with the easy stuff** that (almost) everyone agrees on: your AI should avoid killing people, it (usually) shouldn't lie, and so on. These near-universal moral intuitions form a solid baseline.

2. **But do your best to capture the complexities too:**
   - *Top-down:* Think hard about principles, conflicts, and exceptions. Don't just encode naive utilitarianism.
   - *Bottom-up:* Get creative with training data. Cover as many rare and edge cases as you can imagine. Actively seek diverse perspectives.
   - *Participatory:* Build ongoing feedback mechanisms. Include affected non-users. Treat alignment as iterative.

The RL connection: the reward function in RL is a formalization of "what we want the agent to do." Value alignment is the problem of making sure that formalization captures not just one user's preferences, but society's values. Every technique studied in this course — from reward shaping to RLHF to inverse RL — is a tool in the alignment toolkit. The hard part isn't the optimization; it's specifying *what* to optimize.

**Callout — Insight:**
> **Insight — The RL Connection**
>
> Every RL system implicitly takes a stance on value alignment: the reward function *is* the specification of what the agent should value. Reward hacking, specification gaming, and misalignment are not just technical curiosities — they're previews of what can go wrong when AI systems optimize objectives that don't fully capture human (and societal) values. The alignment problem is, at its core, the reward design problem writ large.

---

## Equations

This is a philosophical/conceptual lecture — **no equations**. No KaTeX needed.

---

## Callout Summary

| Section | Callout Type | Label |
|---|---|---|
| Recap | Definition | Value Alignment |
| Recap | Insight | The Missing Piece |
| Social Value | Example | The Concert Ticket Agent |
| Top-Down | Definition | Top-Down Moral Alignment |
| Top-Down | Insight | Moral Reward Hacking |
| Top-Down Agentic | Example | Top-Down Ticket Agent |
| Real-World Guidelines | Insight | Convergence Without Consensus |
| Bottom-Up | Definition | Bottom-Up Moral Alignment |
| Bottom-Up | Example | Bottom-Up Ticket Agent |
| Participatory AI | Insight | Alignment Is Not a One-Shot Problem |
| Takeaways | Insight | The RL Connection |
