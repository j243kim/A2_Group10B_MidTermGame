# Process and Decision Documentation

**Group:** 10B
**Assignment:** A2 — Mid-Term Game
**Disability Topic:** Traumatic Brain Injury (TBI)
**Date:** March 3, 2026

---

## 1. Role-Based Contributions

*[Update this section with all group members and their roles as defined in your GenAI Group Charter.]*

| Member | Primary Role | Shadow Role | Key Contributions |
|--------|-------------|-------------|-------------------|
| Jimin Kim | Project Setup / Core Game Loop | [Shadow role] | Set up project structure, initialized GitHub repository, implemented core game state machine (start/play/win/lose) |
| Kaiyang Sun | TBI Mechanics Design & Implementation | Gameplay Systems | Implemented Memory Fade and Sensory Overload mechanics, integrated them into the game loop, and added player movement and win/lose conditions. |
| Catarina Jin | Level Design | Gameplay Testing | Designed the playable level structure, positioned stars and the Calm Zone to guide player progression, added checkpoints and respawn logic, and conducted playtesting to identify areas where players became confused or stuck. |
| [Member 4] | [Role] | [Shadow role] | [Contributions] |
| [Member 3] | [Role] | [Shadow role] | [Contributions] |
| [Member 4] | [Role] | [Shadow role] | [Contributions] |

---

## 2. Key Design Decisions

### 2.1 Project Structure
The project was organized following the assignment's required folder structure:
- `index.html` — Main HTML file loading p5.js and the game sketch
- `sketch.js` — Primary JavaScript file with game logic
- `style.css` — Stylesheet for page styling
- `jsconfig.json` — VS Code configuration
- `libraries/` — Contains p5.min.js (v1.9.0) loaded locally
- `assets/images/`, `assets/sounds/`, `assets/fonts/` — Asset directories

### 2.2 Core Game Loop Architecture
The game uses a state machine pattern with four states: `STATE_START`, `STATE_PLAY`, `STATE_WIN`, and `STATE_LOSE`. The `draw()` function uses a `switch` statement to render the appropriate screen based on the current state. This was chosen for clarity and ease of extending with additional states later.

### 2.3 Technology Choices
- **Framework:** p5.js (v1.9.0) — required by the course
- **Canvas size:** 800 x 600 pixels
- **Hosting:** GitHub Pages, deployed from the `main` branch

### 2.4 Gameplay Mechanics Representing TBI

Two gameplay mechanics were implemented to represent aspects of living with Traumatic Brain Injury (TBI): **Memory Fade** and **Sensory Overload**.

The **Memory Fade** mechanic hides the level objective after a short period of time. Players can press the **M** key to briefly recall the objective. This mechanic was designed to simulate how players may have difficulty maintaining task instructions or remembering goals during an activity.

The **Sensory Overload** mechanic introduces an overload meter that gradually increases as the player moves through the level. If the meter reaches its maximum value, the player loses the game. A **Calm Zone** is placed in the environment where players can reduce overload by standing inside it.

These mechanics allow players to experience the challenge through gameplay interaction rather than explanation.

### 2.5 Player Feedback and Visual Clarity

During development, we prioritized making the mechanics visually understandable for players who had not seen the game before.

The Calm Zone is represented by a distinct colored area so that players can quickly recognize it as a recovery space. The overload meter is displayed on screen so players can monitor their sensory state while playing.

These visual indicators help players understand the mechanics without requiring additional instructions.

### 2.6 Difficulty and Balance Considerations

Balancing the mechanics was an important part of the design process.

If the overload meter increases too quickly, players may lose before understanding how the mechanic works. To prevent this, the overload value increases gradually and can be reduced when the player enters the Calm Zone.

Similarly, the Memory Fade mechanic allows players to recall the objective at any time by pressing a key. This ensures that the mechanic creates a temporary challenge without preventing progress entirely.


### 2.7 Level Design and Player Progression

The level was designed to gradually introduce the mechanics before combining them into a single challenge.

The layout intentionally guides the player from the left side of the screen toward the right side, where the Calm Zone is located. Early stars are placed near the starting position so players can easily understand the goal of collecting stars. This functions as a tutorial phase where players can learn the basic interaction without pressure from the overload mechanic.

After players collect the first few stars, the remaining stars are positioned farther across the map. This encourages players to explore the space while dealing with the Memory Fade mechanic, which hides the objective after a short time. Players can recall the objective using the **M key**, reinforcing the idea that remembering instructions requires active effort.

In the final part of the level, players must manage both mechanics simultaneously. The overload meter continues increasing while players search for the remaining stars. The Calm Zone near the end of the level acts as a recovery space that allows players to reduce overload and continue playing.

This level progression structure was chosen to help first-time players understand the mechanics step-by-step before facing the full challenge of managing memory and sensory overload at the same time.


### 2.8 Playtesting Observations

During informal playtesting sessions, several usability issues were identified.

First, some players did not immediately notice the Calm Zone or understand that it reduced the overload meter. To address this, the Calm Zone was visually emphasized with a distinct color and label so that players could more easily recognize it as a safe area.

Second, several players forgot the objective after the Memory Fade mechanic removed the text from the screen. Although the **M key** allowed players to recall the objective, some players did not notice the instruction at first. To improve clarity, a reminder message was added near the bottom of the screen.

Third, players occasionally lost the game quickly because the overload meter increased faster than they expected. To make the experience more fair for first-time players, a limited respawn system was added so that players could continue from a checkpoint instead of immediately restarting the game.

These playtesting observations helped refine the level design so that the mechanics remain challenging but understandable.


*[Add further design decisions as the game develops — e.g., mechanic choices, visual direction, how TBI is represented.]*

---

## 3. GenAI Use Documentation

### 3.1 Task: Project Structure Setup and Core Game Loop

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Opus 4.6) via VS Code extension |
| **Date** | March 3, 2026 |
| **Task Description** | Setting up the project folder structure, creating all required files (index.html, sketch.js, style.css, jsconfig.json, README.md), downloading the p5.js library, and implementing the core game state machine with start, play, win, and lose screens. |
| **How GenAI Was Used** | Claude Code was prompted with the assignment requirements (A2 PDF) and asked to scaffold the project. It created the directory structure, downloaded p5.min.js, wrote the boilerplate HTML/CSS/JS files, and built a game loop with four states and stub functions for game logic. |
| **What Was Modified After Generation** | The p5.js script source path in index.html was cleared (set to empty string) for manual configuration. |

### 3.2 Task: Git Repository Setup Assistance

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | Claude Code (Claude Opus 4.6) via VS Code extension |
| **Date** | March 3, 2026 |
| **Task Description** | Troubleshooting git push errors when pushing to GitHub. |
| **How GenAI Was Used** | Claude Code identified that the local branch was named "master" while the push target was "main", and recommended renaming the branch with `git branch -M main` before pushing. |
| **What Was Modified After Generation** | No modifications — commands were run as suggested. |

### 3.3 Task: Gameplay Mechanics Implementation

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | ChatGPT (OpenAI GPT-5) |
| **Date** | March 3, 2026 |
| **Task Description** | Designing and implementing gameplay mechanics representing aspects of Traumatic Brain Injury, including the Memory Fade mechanic and the Sensory Overload system with a Calm Zone recovery area. |
| **How GenAI Was Used** | ChatGPT was used to brainstorm simple ways to translate TBI-related experiences into gameplay mechanics using beginner-level p5.js code. It suggested using a timer to hide the objective text and creating an overload meter that increases over time. |
| **What Was Modified After Generation** | The code suggestions were simplified to match the level of programming expected in the course. Complex math functions were removed and the mechanics were integrated into the existing game loop structure. |

### 3.4 Task: Integrating Mechanics into the Existing Game Structure

| Field | Details |
|-------|---------|
| **GenAI Tool Used** | ChatGPT (OpenAI GPT-5) |
| **Date** | March 3, 2026 |
| **Task Description** | Integrating the gameplay mechanics into the existing game structure that uses start, play, win, and lose states. |
| **How GenAI Was Used** | ChatGPT helped identify where different parts of the mechanics should be placed in the code structure. Variables were placed in the `GAME VARIABLES` section, initialization logic in `resetGame()`, updates in `updateGame()`, and rendering in `drawPlayScreen()`. |
| **What Was Modified After Generation** | The structure was adapted slightly to fit the code that had already been created earlier in the project by another group member. |

### 3.5 Task: Level Design and Gameplay Balance

| Field | Details |
|------|---------|
| **GenAI Tool Used** | ChatGPT (OpenAI GPT-5) |
| **Date** | March 4, 2026 |
| **Task Description** | Designing the level structure and improving gameplay clarity. |
| **How GenAI Was Used** | ChatGPT was used to brainstorm ways to structure the level so that players learn the mechanics gradually before experiencing the full challenge. It also suggested adding checkpoints and clearer prompts to help first-time players complete the level. |
| **What Was Modified After Generation** | The level layout and star positions were adjusted manually to better match the game's mechanics and playtesting feedback. |

---

---

### Conversation Log

**User (Jimin):**
> Please read this document [A2 assignment PDF]. My role is to set up the project structure and core game loop (start/play/win/lose). The assigned disability for our group is Traumatic Brain Injury. Please set up the appropriate files into this directory.

**Claude Code:**
> Created the full project structure including: `index.html`, `sketch.js` (with 4-state game loop), `style.css`, `jsconfig.json`, `README.md`, `assets/` subdirectories (images, sounds, fonts), and `libraries/p5.min.js`.

**User (Kevin):**
> [A2 assignment PDF]I have a p5.js game skeleton with start, play, win, and lose states. I need to implement gameplay mechanics that represent aspects of Traumatic Brain Injury, but the code needs to remain simple because this is an introductory programming course.

**ChatGPT:**
> Suggested implementing a “Memory Fade” mechanic using a timer that hides the objective text after a short period of time, along with a key press that allows the player to recall the objective temporarily.

**User (Kevin):**
> I also want to represent sensory overload in the game without using complex visual effects.

**ChatGPT:**
> Recommended creating an overload meter that increases over time and placing a calm zone in the level where the overload value decreases when the player enters the area.

**User (Kevin):**
> The code should avoid advanced math functions.

**ChatGPT:**
> Provided simplified logic using basic variables, timers, conditional statements, and distance checks to implement the mechanics using beginner-level p5.js code.

**User (Catarina):**
> Our group already implemented the mechanics for a p5.js game about Traumatic Brain Injury. My role is the Level Designer. I need to design a level that teaches the mechanics first and then combines them so that first-time players can understand how the game works. What level structure would work for this?

**ChatGPT:**
> Suggested dividing the level into three phases.
Phase 1 introduces the objective and basic movement by placing a few stars close to the player so they can learn the goal without pressure.
Phase 2 introduces the Memory Fade mechanic, where the objective disappears after a short time and players can press a key to recall it.
Phase 3 combines both mechanics by placing the remaining stars farther away while the overload meter continues increasing.

**User (Catarina):**
> I also need to make sure players do not get stuck or lose too quickly during playtesting. What design changes could help make the level easier to understand?

**ChatGPT:**
> Recommended adding visual cues and recovery systems to help first-time players.

---

*[Add additional GenAI usage entries for other tasks as the project develops. If no GenAI was used for a particular task, explicitly state so.]*
