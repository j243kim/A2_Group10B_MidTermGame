# Fragmented - A TBI Awareness Game

## Group Number

Group 10B

## Description

Fragmented is a p5.js empathy game about Traumatic Brain Injury (TBI). Instead of explaining TBI only through text, the game translates cognitive and sensory strain into interaction so non-disabled players feel how ordinary tasks can become slower, louder, and more effortful [1].

The current build is structured as three stages that represent an ordinary day becoming progressively harder to manage:

1. **Stage 1 - Home**: a familiar morning routine with light memory strain and low overload pressure.
2. **Stage 2 - Outside / Store**: louder errands with stronger memory fade, denser stimulus zones, and more emotional pressure.
3. **Stage 3 - Workplace / Way Home**: cumulative fatigue, distractions, attention drift, and tighter navigation pressure at the end of the day.

Across the three stages, players complete 9 task markers while managing overload, fatigue, fading memory, distractions, and frustration. The goal is not to dramatize TBI as chaos or helplessness. The design is meant to respectfully communicate how much extra effort routine tasks can demand.

## Core Mechanics - Tied to Lived Experience

**Memory Fade**
Objective text gradually fades and must be recalled with the `M` key. Later stages shorten the recall window so even remembering the next step takes effort. This reflects short-term memory difficulty and the mental work required to hold onto task goals after TBI [2][4].

**Sensory Overload**
An overload meter rises continuously and increases much faster inside red "noise" zones. Green Calm Zones reduce overload and create small moments of recovery. This represents how environments that feel manageable to most people can become exhausting or physically overwhelming after TBI [5].

**Cognitive Fatigue**
Movement speed decreases as overload rises. The player can still move, but ordinary navigation takes longer and feels heavier. This mechanic represents mental fatigue affecting processing speed and effort [4].

**Intrusive Distractions**
At higher overload levels, brief flashes and visual interruptions appear. These are not enemies or hazards in an action-game sense; they stand in for the difficulty of filtering irrelevant stimuli when already overloaded [5].

**Attention Drift**
In the final stage, movement becomes slightly imprecise under high strain. This is meant to feel frustrating but still readable, representing how fatigue can affect concentration and control.

**Emotional Frustration Messages**
Short internal thoughts appear at high overload, such as "This should be simple." and "Why is this so hard?" These messages frame the emotional cost of routine activity without turning the experience into pity or spectacle.

**Fading Awareness**
In later stages, distant task markers become harder to notice when overload is high. The player knows the task still exists, but has to move closer and re-orient. This supports the feeling of fading awareness under cognitive strain.

**Low Sensory Mode**
Pressing `L` reduces motion, flashes, glow, particles, and several screen effects so the game remains more readable and accessible for players who need a calmer presentation [3].

**Title Screen Ambient Soundscape**
On the title screen, a subtle 3-layer audio soundscape plays to set the emotional tone before gameplay begins. It includes a low drone (persistent pressure), a faint high-frequency tone (tinnitus-like ringing), and a slow pulsing throb (uneasy tension). The soundscape fades out when the player presses ENTER to start and restarts when returning to the title screen.

**Solid Decorations as Obstacles**
Furniture and environmental objects such as beds, desks, counters, shelves, and hedges now block player movement where appropriate. Solid decorations are visually distinguished with deeper shadows and subtle outlines, and labelled decorations show faint text to support readability.

## Stage Progression

**Stage 1 - Home**
The player begins in a quieter domestic space. The layout is more open, overload rises slowly, and memory difficulty is introduced lightly. The intention is to show that even a simple routine can already require focus.

**Stage 2 - Outside / Store**
The environment becomes noisier and more crowded. Stimulus zones are more frequent, route planning matters more, and memory fade starts immediately. This stage increases pressure without becoming random.

**Stage 3 - Workplace / Way Home**
The final stage combines stronger overload growth, distractions, attention drift, fading awareness, and tighter navigation. Some fatigue carries over from the previous stage so the last stretch feels cumulative rather than artificially difficult.

## Accessibility and Respectful Framing

The game was designed with the expectation that people with TBI may be part of the audience. The presentation aims to remain:

- **Respectful**: The game focuses on effort, coping, and pacing rather than pity or tragedy.
- **Grounded**: Every core mechanic is tied to documented TBI-related experiences rather than stereotypes.
- **Readable**: Calm Zones, task markers, and the HUD remain legible even as difficulty increases.
- **Adjustable**: Low Sensory Mode reduces visual intensity, and the title screen includes a dedicated "How to Play" overlay rather than crowding the player with instructions all at once.

Low Sensory Mode changes include:

- Removing distraction flashes, particles, floor tiles, vignette, haze, and screen shake
- Simplifying task markers to circles
- Flattening walls and decorations
- Rendering stimulus zones as outlines instead of pulsing fills
- Displaying a persistent on-screen badge while the mode is active

## Setup and Interaction Instructions

1. Open the game through GitHub Pages, or open `index.html` locally in a modern browser such as Google Chrome.
2. On the title screen, press `ENTER` to start.
3. Click **How to Play** or press `H` on the title screen to open the controls overlay.
4. Use the **Arrow Keys** to move.
5. Press `M` to briefly recall the objective when it fades.
6. Press `L` at any time to toggle Low Sensory Mode.
7. Press `R` during play, win, or lose screens to return to the title screen.
8. Complete 3 task markers in each stage.
9. Avoid red noise zones when possible because they increase overload faster.
10. Use green Calm Zones to recover when pressure builds.
11. If overload reaches maximum, the player respawns at the current checkpoint while resets remain. If no resets remain, the game is lost.

## Iteration Notes

### Post-Playtest Changes

- Replaced the earlier continuous multi-room map with a true 3-stage structure so pacing and emotional escalation are easier to read.
- Added stage transition screens and carried some overload into later stages so fatigue feels cumulative across the day.
- Simplified the title screen into a cleaner menu with a separate How to Play overlay to reduce text density and improve first-use readability.
- Added `R` to return to the title screen during play and end states so players can reset cleanly without refreshing the page.
- Rebalanced stage layouts so Stage 1 is more spacious, Stage 2 increases sensory and navigation pressure, and Stage 3 combines the mechanics without becoming unreadable.

### Post-Showcase (Iteration Notes)

The following feedback was collected from peers and the instructor during the in-class Mid-Term Showcase. Each point is listed with a planned improvement for future iterations.

1. **"Use WASD keys instead of arrow keys":** Players found arrow keys less intuitive. A planned improvement is to add WASD as an alternative control scheme alongside the existing arrow keys so players can choose whichever feels more comfortable.
2. **"Add more visuals to the game and the player character":** The current procedural art style is minimal. A planned improvement is to add more detailed character animations (e.g., a walking cycle, visible fatigue posture changes) and richer environmental visuals such as background details and more varied decoration art to make the stages feel more alive.
3. **"Make the obstacles move and relate to real-world TBI obstacles instead of labelling as noise":** The static red "noise" zones feel abstract. A planned improvement is to replace generic noise labels with context-specific environmental stressors (e.g., crowds, traffic, flickering lights, loud conversations) and introduce moving obstacles that represent unpredictable real-world stimuli that TBI survivors must navigate.
4. **"Change the mechanic to show disconnected behaviour and movement of the player":** The current movement system stays mostly consistent. A planned improvement is to introduce moments of input delay or involuntary drift at high overload levels to represent the disconnection between intention and action that TBI survivors often experience.
5. **"Instead of displaying the entire map, use a zoomed-in camera for more challenge":** Showing the full stage reduces navigational difficulty. A planned improvement is to implement a camera system that follows the player and only reveals the nearby area, forcing players to rely on memory and spatial awareness rather than seeing all objectives at once — directly reinforcing the Memory Fade mechanic.

## Assets

All visuals and audio are generated procedurally at runtime. The current build does not rely on external image files, sprite sheets, or audio files.

### Images

All game art is drawn directly in p5.js using shapes such as `rect()`, `ellipse()`, `arc()`, `line()`, and custom star polygons. This includes:

- The player character and changing facial expressions
- Stage environments, walls, and decorative objects
- Task markers, Calm Zones, stimulus zones, and HUD panels
- Title screen panels, overlays, button treatments, and TBI-themed background visuals (neural pathways, thought fragments, head silhouette, fading awareness particles)
- Win and lose screen centered panels with ambient particle effects
- Particles, vignette, haze, and other visual feedback effects

### Sounds

All sound is generated procedurally with the Web Audio API using oscillators and gain nodes. This includes:

- Collection chimes
- Memory recall feedback
- Checkpoint and respawn sounds
- Overload warning tones
- Calm Zone recovery tone
- Stage-complete cue
- Win and lose melodies
- A dynamic ambient drone that changes pitch and volume with overload
- Title screen ambient soundscape (low drone, tinnitus tone, pulsing throb) with fade-in/fade-out transitions

### p5.js Library

`p5.min.js` (v1.9.0) is included locally in the `libraries/` folder.

## References

1. Bogost, I. 2007. _Persuasive Games: The Expressive Power of Videogames_. MIT Press, Cambridge, MA.
2. Centers for Disease Control and Prevention. 2024. Get the Facts About TBI. _Centers for Disease Control and Prevention_. Retrieved March 9, 2026 from https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/
3. Game Accessibility Guidelines. 2012. _Game Accessibility Guidelines_. Retrieved March 9, 2026 from https://gameaccessibilityguidelines.com/
4. Johansson, B., Berglund, P., and Ronnback, L. 2009. Mental fatigue and impaired information processing after mild and moderate traumatic brain injury. _Brain Injury_ 23, 13-14, 1027-1040.
5. Lew, H.L., Poole, J.H., Guillory, S.B., Salerno, R.M., Leskin, G., and Sigford, B. 2006. Persistent problems after traumatic brain injury: The need for long-term follow-up and coordinated care. _Journal of Rehabilitation Research and Development_ 43, 2, 199-212.
