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
| [Member 2] | [Role] | [Shadow role] | [Contributions] |
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

---

### Conversation Log

**User (Jimin):**
> Please read this document [A2 assignment PDF]. My role is to set up the project structure and core game loop (start/play/win/lose). The assigned disability for our group is Traumatic Brain Injury. Please set up the appropriate files into this directory.

**Claude Code:**
> Created the full project structure including: `index.html`, `sketch.js` (with 4-state game loop), `style.css`, `jsconfig.json`, `README.md`, `assets/` subdirectories (images, sounds, fonts), and `libraries/p5.min.js`.



---

*[Add additional GenAI usage entries for other tasks as the project develops. If no GenAI was used for a particular task, explicitly state so.]*
