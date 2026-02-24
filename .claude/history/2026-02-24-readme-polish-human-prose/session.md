# Session: README polish and human prose cleanup

## Goal
Make the README more visually appealing and less AI-sounding. Specific complaints: the `maninae.github.io/cs234` link wasn't eye-catching, and several prose patterns read as obviously AI-generated.

## Approach
Iterative, user-directed edits. The user had strong opinions on tone and drove most decisions; my role was to propose options, execute quickly, and flag AI tells.

## Key decisions

1. **CTA badge for the site link**: Tried a shields.io `for-the-badge` style button. User initially rejected it ("what's a CTA button?"), then changed their mind. Final color: forest green `#228B22`.

2. **AI-tell identification**: User asked me to identify AI prose patterns from my own knowledge (no external lookup). I flagged several; user agreed with three specific ones:
   - "Reinforcement learning is having a moment. A big one." (dramatic fragment cadence)
   - "But lecture slides are dense. Textbooks are long." (staccato parallel fragments)
   - "the textbook that started it all" (grandiose framing)

   User explicitly noted other patterns I flagged were fine ("Some of those above are OK!").

3. **No em-dashes**: User preference. Use commas instead.

4. **Personal "Why this exists" section**: User provided raw draft about taking CS234 ten years ago, being a working parent, wanting a refresher. I tightened it while keeping the personal voice and the kids line.

5. **"all RL" reordering**: Moved the enumeration payoff ("all RL") to the start of the paragraph instead of the end, to avoid dramatic buildup cadence.

6. **Shadow on preview.png**: GitHub strips inline CSS `style` attributes, so baked rounded corners and drop shadow directly into the PNG using Pillow. Parameters: radius=16, shadow offset=(0,8), blur=40, opacity=60/255.

## Work performed (chronological)

1. Read existing README.md
2. Replaced plain bold site link with shields.io `for-the-badge` button (purple `#6C63FF`)
3. User rejected, explained CTA concept, proposed alternatives
4. User reversed decision, asked for forest green — changed to `#228B22`
5. Removed "No sign-ups. No paywalls. Just start reading." line
6. Identified AI-generated prose patterns, user selected three to fix
7. Deleted "Reinforcement learning is having a moment. A big one."
8. Merged staccato fragments into one sentence with em-dash
9. User said no em-dashes — changed to comma with "so"
10. Trimmed "that started it all" from Sutton & Barto acknowledgment
11. Moved "all RL" from end to start of the RL-is-everywhere paragraph
12. Added personal paragraph to "Why this exists" (Stanford 10 years ago, kids, working adult)
13. Refined user's draft paragraph, applied after approval
14. Bolded "I built this for curious learners..." and put on its own line
15. Removed "The course traces a beautiful arc..." sentence
16. Removed "JS frameworks: 0" badge
17. Attempted inline CSS shadow on screenshot — realized GitHub strips it
18. Baked shadow + rounded corners into preview.png via Pillow
19. Reverted inline CSS, kept clean `<img>` tag
20. Converted Topics code block into markdown table with links to each module's first lecture

## Artifacts created/modified

- **README.md** — major prose and structure overhaul
- **preview.png** — rounded corners + drop shadow baked in
- **~/.claude/skills/write-like-human/SKILL.md** — added three new AI-tell patterns to the CUT section:
  - Dramatic fragment cadence
  - Staccato parallel fragments
  - Grandiose framing

## Lessons / takeaways

- User has a strong ear for AI-generated prose. Specific patterns they reject: dramatic mic-drop fragments, symmetrical staccato sentences, grandiose historical framing.
- User prefers commas over em-dashes.
- User prefers direct, personal writing voice. The "working adult with kids" angle is genuine and they want it front and center.
- GitHub README rendering strips inline `style` attributes — always bake visual effects into the image itself.
- When proposing changes, give options and let the user pick rather than making unilateral rewrites to prose. They know what they want.
