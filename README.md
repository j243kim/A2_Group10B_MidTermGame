# Fragmented - A TBI Awareness Game

## Group Number

Group 10B

## Description

Fragmented is a p5.js game designed to foster understanding of Traumatic Brain Injury (TBI) through engaging gameplay mechanics. Players navigate three connected rooms separated by walls, collecting stars while managing challenges that reflect real aspects of living with TBI.

The game translates TBI-related difficulties into interactive mechanics rather than relying on text-based explanation (Bogost, 2007). Players experience these challenges firsthand through gameplay, promoting empathy and awareness without resorting to stereotypes or pity.

**Memory Fade** is the first core mechanic. At the beginning of the level, the objective is clearly displayed, but after a short period the text fades from view. Players can press the M key to briefly recall the objective. This simulates the short-term memory difficulties commonly experienced by TBI survivors, where maintaining task instructions or remembering goals during an activity requires active effort (CDC, 2024; Johansson et al., 2009).

**Sensory Overload** is the second core mechanic. An overload meter gradually increases as the player moves through the level. Certain areas called "stimulus zones" cause the overload to rise faster, representing environments with excessive sensory input. If the overload reaches maximum, the player loses. A Calm Zone placed in the environment allows players to reduce overload by resting there. This reflects the sensory processing difficulties and overstimulation reported by TBI survivors (Lew et al., 2006).

Additional mechanics deepen the experience:
- **Cognitive Fatigue**: Player movement speed decreases as overload increases, representing how cognitive fatigue affects processing speed (Johansson et al., 2009).
- **Tunnel Vision**: At high overload levels, the edges of the screen darken with a vignette effect, simulating the narrowed focus that can accompany sensory overload (Lew et al., 2006).
- **Screen Shake**: At high overload, the screen shakes slightly to convey disorientation.
- **Player Expression**: The player character's facial expression changes across four stages (neutral, anxious, stressed, overloaded) as the overload meter rises, providing an emotional visual indicator of the character's internal state (Lew et al., 2006).
- **Dynamic Ambient Audio**: A background drone generated with the Web Audio API increases in pitch and volume as overload rises, creating auditory sensory pressure that mirrors the visual overload (Lew et al., 2006).

The game also includes a **Low Sensory Mode** (press L) that significantly reduces visual complexity following game accessibility guidelines (Game Accessibility Guidelines, 2012). In Low Sensory Mode, floor tiles and particles are hidden, decorations are simplified to flat rectangles, stars become simple circles without glow, stimulus zones use outlines instead of filled overlays, wall shadows and highlights are removed, and all screen effects (shake, vignette, haze) are disabled. A persistent on-screen badge indicates when the mode is active.

The level is divided into three progressive phases across three rooms separated by walls:
1. **Tutorial Phase** (Room 1): Players learn basic movement and star collection without any pressure from the overload mechanic.
2. **Memory Phase** (Room 2): The Memory Fade mechanic activates after collecting the first two stars, teaching players to use the M key to recall the objective.
3. **Combined Phase** (Room 3): Both mechanics are active simultaneously, with stimulus zones increasing overload faster and the Calm Zone providing recovery.

## Setup and Interaction Instructions

1. Open the game via the GitHub Pages link, or open `index.html` locally in Google Chrome.
2. Press **ENTER** to start the game.
3. Use the **Arrow Keys** to move the player character.
4. Press **M** to recall the objective if it fades from view.
5. Navigate through rooms by finding gaps in the walls.
6. Avoid **stimulus zones** (red-tinted areas labeled "noise") as they increase overload faster.
7. Move into the **Calm Zone** (teal area in Room 3) to reduce the overload meter.
8. Collect all 5 stars to complete the level.
9. If overload reaches maximum, you respawn at your last checkpoint (3 lives total).
10. Press **L** at any time to toggle Low Sensory Mode, which reduces visual effects for accessibility.

## Iteration Notes

### Post-Playtest

_[To be completed after the Week 6 playtesting session on March 5 -- list three concrete changes made based on playtesting feedback.]_

### Post-Showcase

_[To be completed after the Mid-Term Showcase on March 12 -- list at least two planned improvements based on feedback received.]_

## Assets

All visual and audio assets in this game are generated procedurally at runtime. No external image or audio files are used.

### Images

All sprites, environments, UI elements, and effects are drawn using p5.js shape functions (ellipse, rect, vertex, arc, line, beginShape/endShape). The player character is drawn with layered ellipses for the body and head, with facial expressions (eyes, mouth, eyebrows) that change dynamically based on overload level. Stars are drawn as 5-pointed polygons using vertex calculations. Walls, decorations, and zones are drawn with rectangles. Visual effects including particle bursts, floor tile grids, vignette shading, and screen shake are all rendered programmatically.

### Sounds

All sound effects and ambient audio are generated using the Web Audio API (OscillatorNode and GainNode). Sound types include:

- Collection chime (ascending C5-E5-G5 sine tones)
- Memory recall sound (A4-C#5 triangle wave)
- Checkpoint notification (G4-C5 sine tones)
- Respawn sound (E4-G4 sine tones)
- Overload warning (low sawtooth pulse at 180 Hz)
- Calm zone recovery tone (soft C4 sine wave)
- Win melody (ascending C5-E5-G5-C6 sine chord)
- Lose sound (descending 300-250-200 Hz sawtooth)
- Ambient drone (sine wave oscillator, pitch scales from 60 Hz to 175 Hz and volume scales from 0.006 to 0.055 based on overload meter level)

### p5.js Library

p5.min.js (v1.9.0) is included locally in the `libraries/` folder. Source: p5js.org.

## References

1. Bogost, I. 2007. *Persuasive Games: The Expressive Power of Videogames*. MIT Press, Cambridge, MA.
2. Centers for Disease Control and Prevention. 2024. Get the Facts About TBI. *Centers for Disease Control and Prevention*. Retrieved March 3, 2026 from https://www.cdc.gov/traumatic-brain-injury/data-research/facts-stats/
3. Game Accessibility Guidelines. 2012. *Game Accessibility Guidelines*. Retrieved March 3, 2026 from https://gameaccessibilityguidelines.com/
4. Johansson, B., Berglund, P., and Ronnback, L. 2009. Mental fatigue and impaired information processing after mild and moderate traumatic brain injury. *Brain Injury* 23, 13-14, 1027-1040.
5. Lew, H.L., Poole, J.H., Guillory, S.B., Salerno, R.M., Leskin, G., and Sigford, B. 2006. Persistent problems after traumatic brain injury: The need for long-term follow-up and coordinated care. *Journal of Rehabilitation Research and Development* 43, 2, 199-212.
