---
name: content-review
description: Review and revise lecture content for tone, style, and pedagogy — matching the CS234 site's conversational teaching voice
---

# Content Review Skill

Use this skill when reviewing or writing lecture content for the CS234 learning companion site. The gold standard is `lectures/lecture01.html`.

## Voice & Tone

- **Conversational teacher** — write like you're explaining to a student sitting across from you, not writing documentation
- **"We" voice** — "We begin with...", "Let's think about...", "Notice that..."
- **Motivate before formalize** — always explain *why* before *what*. Intuition first, then the math
- **Real-world analogies** — ground abstract concepts in concrete examples (Mars Rover, bicycle riding, retirement savings)
- **No robotic language** — avoid "This section describes...", "The following defines...", "It should be noted that..."

## Visual Structure

- **Breathing room** — short paragraphs (2-4 sentences max), generous use of headers
- **One idea per paragraph** — don't pack multiple concepts into one block
- **Lists for enumeration** — when comparing or listing properties, use bullet/numbered lists with `<strong>bold labels</strong>` followed by em-dash and explanation
- **Tables for comparison** — when comparing algorithms, methods, or properties side-by-side
- **Headers to separate** — use `<h2>` for major sections, `<h3>` for subsections. Each should be scannable.

## Callout Usage

- `definition` (blue) — formal definitions only. Keep them crisp.
- `theorem` (purple) — key results with equations. Use `$$` display math.
- `example` (amber) — concrete worked examples. Make them vivid.
- `insight` (green) — "Key Insight" takeaways. These should be the "aha!" moments.
- Don't overuse callouts — they lose impact if every paragraph is in a box.

## Math

- Inline `$...$` for variables and short expressions in prose
- Display `$$...$$` for important standalone equations
- `\underbrace{}` annotations for pedagogical emphasis on equation parts
- Don't drop equations without explanation — always say what the symbols mean

## Algorithms

- Use `<div class="algorithm">` with `<div class="algorithm-title">`
- Ordered list for steps
- Brief prose explaining the algorithm's purpose before the block

## Section Flow Pattern

Each section should follow this arc:
1. **Hook** — why should the reader care? What problem are we solving?
2. **Intuition** — informal explanation, analogy, or example
3. **Formalization** — definition, equation, or algorithm
4. **Implications** — what does this mean? Why does it matter?
5. **Bridge** — connect to the next section or forward-reference future lectures

## Anti-patterns to Fix

- Walls of text with no visual breaks
- Jumping straight to equations without motivation
- Bullet-point dumps that read like slide notes, not prose
- Overly formal academic language ("heretofore", "it is worth noting", "one can observe")
- Missing transitions between sections
- Callouts used for everything (dilutes their impact)
- Paragraphs longer than 4-5 sentences

## Review Checklist

When reviewing a lecture page:

1. Read it as a student would — is it engaging or does your attention wander?
2. Check every section follows the Hook → Intuition → Formalize → Implications arc
3. Break up any paragraph longer than 4 sentences
4. Ensure every equation is preceded by motivation and followed by interpretation
5. Verify callout types match content (definitions are crisp, insights are "aha!" moments)
6. Check for visual monotony — vary between prose, lists, callouts, equations
7. Ensure transitions between sections are smooth, not abrupt
8. Compare tone against lecture01.html — does it sound like the same teacher?
