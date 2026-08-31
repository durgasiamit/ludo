# Context.md — Simple Ludo Game

## Background
This project is a lightweight, browser-based version of Ludo. The goal is to
capture the fun of the dice-race gameplay without the complexity of the full
classic rules (four tokens per player, capturing, home-column entry rules,
"roll a 6 to start", etc).

## Why a Simplified Version?
The classic Ludo game has a lot of rules that add strategic depth but also add
implementation and cognitive complexity:
- 4 tokens per player, each with independent state
- Capturing opponent tokens
- Safe zones
- Separate home-stretch paths per color
- Special rules around rolling 6s

For this project we intentionally strip these down so that:
- The game is easy to build and maintain (single HTML/CSS/JS file, no backend)
- The game is easy to learn and play in under a minute
- The core loop (roll → move → pass turn → win) stays intact

## Target Audience
- Casual players who want a quick 2-player pass-and-play game
- Anyone who wants to see a clean example of simple game-state management
  in JavaScript

## Scope
- Local 2-player, same-device, pass-and-play
- No accounts, no backend, no persistence beyond the current browser session
- No multiplayer networking (out of scope for v1)

## Non-Goals (v1)
- Full classic 4-token Ludo rules
- Capturing / sending opponents home
- Online multiplayer
- Mobile app packaging

## Guiding Principle
**When in doubt, cut the rule, not the fun.** Every mechanic must justify its
own implementation cost. If a rule doesn't meaningfully add to the experience
for a simple 2-player race game, it's left out of v1 and noted as a possible
future enhancement.
