<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://latex.codecogs.com/svg.image?\dpi{200}\color{white}V^*(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P(s'|s,a)\,V^*(s')\right]">
    <img alt="Bellman optimality equation" src="https://latex.codecogs.com/svg.image?\dpi{200}V^*(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P(s'|s,a)\,V^*(s')\right]">
  </picture>
</p>

<h1 align="center">CS234 Learning Companion</h1>

<p align="center">
  <em>A beautifully typeset, open study guide for Stanford's graduate RL course.</em><br>
  <em>Because the Bellman equation is too elegant to learn from ugly notes.</em>
</p>

<p align="center">
  <a href="https://web.stanford.edu/class/cs234/"><img alt="Stanford CS234" src="https://img.shields.io/badge/Stanford-CS234-8C1515?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDEgMTJoM3Y5aDZWMTVoNHY2aDZWMTJoM0wxMiAyeiIvPjwvc3ZnPg=="></a>
  <a href="#"><img alt="Lectures" src="https://img.shields.io/badge/lectures-11-E8A87C?style=flat-square"></a>
  <a href="#"><img alt="Modules" src="https://img.shields.io/badge/modules-7-85CDCA?style=flat-square"></a>
  <a href="#"><img alt="Zero JS Frameworks" src="https://img.shields.io/badge/JS%20frameworks-0-D4A373?style=flat-square"></a>
  <a href="#"><img alt="Math rendered" src="https://img.shields.io/badge/KaTeX-equations%20everywhere-6C63FF?style=flat-square"></a>
</p>

<p align="center">
  <a href="https://maninae.github.io/cs234">
    <img src="preview.png" alt="Site preview" width="720">
  </a>
</p>

---

## What is this?

This is a **free, open-source study companion** for [Stanford CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/) (Winter 2026, taught by [Emma Brunskill](https://cs.stanford.edu/people/ebrun/)).

Every lecture from the course is distilled into clean, readable HTML pages with:

- Precise **KaTeX-rendered mathematics** (no blurry images of equations)
- Color-coded **definition**, **theorem**, **example**, and **insight** callouts
- **Algorithm pseudocode** blocks you can actually follow
- Collapsible **proofs** (click to expand when you're ready)
- A floating **table of contents** with scroll-tracking so you never get lost
- Direct links to the original **PDF slides**

<p align="center">
  <a href="https://maninae.github.io/cs234"><img alt="Start reading" src="https://img.shields.io/badge/%E2%96%B6_Start_reading-maninae.github.io%2Fcs234-6C63FF?style=for-the-badge&logoColor=white"></a>
</p>

## Topics covered

```
Module 1  Introduction to RL ............... what RL is, why it matters now
Module 2  Tabular MDP Planning ............. Bellman equations, value & policy iteration
Module 3  Model-Free Policy Evaluation ..... Monte Carlo, TD learning, bias-variance
Module 4  Q-Learning ....................... off-policy control, SARSA, function approx
Module 5  Policy Gradients ................. REINFORCE, actor-critic, trust regions
Module 6  Imitation Learning & RLHF ........ behavioral cloning, DAgger, DPO
Module 7  Exploration & Sample Efficiency .. bandits, UCB, PAC-MDP bounds
```

The course traces a beautiful arc from *"what if we just store a table?"* to *"how do we align a language model with human preferences?"* -- and this site follows every step.

## Why this exists

Reinforcement learning is having a moment. A big one.

RLHF is the technique that turned GPT into ChatGPT. DPO -- [invented at Stanford](https://arxiv.org/abs/2305.18290) by researchers who guest-lecture in this very course -- simplified that pipeline and is now used across the industry. AlphaGo, AlphaZero, plasma control at nuclear reactors, autonomous driving at Waymo, reasoning in frontier LLMs... all RL.

CS234 is one of the best places to learn it. But lecture slides are dense. Textbooks are long. This companion fills the gap: **structured, readable, pretty notes** that you can reference alongside lectures or use for independent study.

## Acknowledgments

- **Emma Brunskill** and the CS234 teaching team for an outstanding course
- **Sutton & Barto** for [the textbook](http://incompleteideas.net/book/the-book-2nd.html) that started it all
- **KaTeX** for making math on the web not terrible

## License

Educational use. Built with care for anyone trying to learn RL.

---

<p align="center">
  <em>"An agent interacts with an environment, receives a reward, and tries to maximize the total reward over time."</em><br>
  <em>So do we all.</em>
</p>
