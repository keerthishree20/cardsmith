# Cardsmith — Complete Project Guide

## Table of Contents
1. [What is Cardsmith?](#what-is-cardsmith)
2. [Quick Start](#quick-start)
3. [Core Concepts](#core-concepts)
4. [How the File is Organised](#how-the-file-is-organised)
5. [The Scheduler](#the-scheduler)
6. [Data and Storage](#data-and-storage)
7. [Feature Walkthrough](#feature-walkthrough)
8. [Search Syntax](#search-syntax)
9. [Build and Deployment](#build-and-deployment)
10. [Troubleshooting](#troubleshooting)

---

## What is Cardsmith?

A spaced repetition flashcard app that runs entirely in the browser. Write cards or generate them
from notes, review them on a schedule timed to just before you would forget, and track progress.

There is no account, no server and no sync. Decks and review history live in the browser's
`localStorage`, and a full backup is one JSON file.

Live at https://keerthishree20.github.io/cardsmith/.

---

## Quick Start

Open https://keerthishree20.github.io/cardsmith/, or build and open the local copy:

```bash
node build.js
python3 -m http.server 8000 --directory docs
# open http://localhost:8000
```

---

## Core Concepts

### Spaced repetition
Each card is shown again after an interval that grows every time you remember it and shrinks when you
forget. Reviews land when you are close to forgetting, which is when reviewing helps most.

### Grades
After revealing the answer, you grade yourself: **Again**, **Hard**, **Good** or **Easy**. Each
button shows the exact interval it will set before you press it.

### Cloze deletions
Write `The capital of France is {{c1::Paris}}.` and the app hides the marked part. Each index, `c1`,
`c2` and so on, becomes its own card.

### Leeches
Cards you keep failing. They show up with `is:leech` so you can rewrite or suspend them.

### Cram
A run through a set of cards that changes neither their schedule nor your statistics. Useful before
an exam.

---

## How the File is Organised

`cardsmith.html` is the only source file, about 80 KB, holding markup, styles and script. Its main
groups of functions:

| area | functions |
|---|---|
| cards and cloze | `mkCard`, `hasCloze`, `clozeIndexes`, `expandCloze`, `isLeech` |
| state | `seedState`, `normalize`, `load`, `save` |
| scheduling | `project`, `applyGrade`, `stepsOf`, `startSession`, `grade`, `undoGrade`, `skipCurrent`, `startCram` |
| decks in and out | `encodeDeck`, `decodeDeck`, `parseDelimited`, `deckFromDelimited`, `exportDeck`, `saveFile` |
| statistics | `forecast`, `streak`, `recall`, `maturity`, `forecastChart`, `activityChart`, `mixChart` |
| search | `matchCards`, `termMatches`, `allTags`, `bulkBar` |
| views | `render`, `go`, `viewHome`, `viewDeck`, `viewReview`, `viewSearch`, `viewStats` |
| generating cards | `makerPanel`, `doGenerate`, `doManual` |

`h()` builds DOM elements, and `render()` redraws the current view after each change.

---

## The Scheduler

SM-2, the algorithm behind SuperMemo and the basis of Anki's scheduler:

- New cards pass through two learning steps by default before becoming review cards.
- Each card has an **ease**, starting at 2.50 and never below 1.30. A successful review multiplies
  the interval by the ease.
- **Again** on a review card counts a lapse, lowers the ease, and sends the card back through the
  learning steps. Lapses shorten every future interval.
- **Hard** and **Easy** adjust the ease down and up.

`project(card, grade, steps)` computes the result without changing anything, which is how each
button can show its interval in advance. `applyGrade()` then applies it and records the review in
the daily log, counting failures separately so the recall rate means something.

**Undo** with `ctrl+z` restores the card's previous schedule and removes the log entry.

---

## Data and Storage

Everything is saved under one `localStorage` key, `cardsmith.v1`: decks, cards with their schedule,
per-deck settings and the review log.

Storage belongs to one browser and one site address. The GitHub Pages site and a copy opened
elsewhere keep separate data. Move between them with a JSON backup or a deck code.

### Getting data in and out
| format | direction |
|---|---|
| JSON backup | everything, in and out |
| `CSMITH1.` deck code | one deck, as text you can paste into a message |
| CSV or TSV | import cards |
| CSV | export a deck in a form Anki can import |

---

## Feature Walkthrough

1. **Create a deck** on the home screen.
2. **Add cards** by hand, including cloze cards, or import CSV.
3. **Review.** `space` shows the answer, and `1` to `4` grade it. Due cards and new cards per session
   follow the deck's settings.
4. **Search** across every deck and act on the results in bulk: tag, suspend, move, delete or cram.
5. **Watch progress** on the stats page: a 14-day workload forecast, a 12-week activity heatmap,
   card maturity, recall rate, streak and per-deck ease.
6. **Back up** regularly with the JSON export.

### Per-deck settings
New cards per session, learning steps, and review order.

### Generating cards from notes
Pasting notes and generating a deck works only when the page is opened inside the Claude artifact
viewer, which provides the model. On the plain website that panel is unavailable and cards are
written by hand or imported.

---

## Search Syntax

| query | finds |
|---|---|
| `tag:os` | cards with a tag starting with `os` |
| `deck:bio` | cards in decks whose name contains `bio` |
| `is:new`, `is:due`, `is:learning`, `is:mature` | cards in that state. Mature means an interval of 21 days or more |
| `is:leech`, `is:suspended`, `is:cloze`, `is:tagged` | leeches, suspended, cloze and tagged cards |
| `ease<2.0`, `lapses>3`, `ivl>=30`, `reps<=2` | numeric comparisons with `<`, `>`, `<=` or `>=` |
| plain words | text in the question, answer, hint or tags |

---

## Build and Deployment

`cardsmith.html` is written as page body content, without a doctype or head. `build.js` wraps it
into a complete page with the doctype, meta tags, description and an inline SVG favicon, and writes
`docs/index.html`.

```bash
node build.js
git add cardsmith.html docs/index.html
git commit -m "..."
git push
```

GitHub Pages serves the `docs/` folder on the default branch. `docs/.nojekyll` stops Pages from
processing the files, and `docs/robots.txt` is served as is.

Always edit `cardsmith.html` and rebuild. Never edit `docs/index.html` by hand, because the next
build overwrites it.

---

## Troubleshooting

### My decks disappeared
They live in this browser's storage for this address. Clearing site data, a private window, another
browser or another device all start empty. Restore from a JSON backup.

### Changes to `cardsmith.html` do not show on the live site
Run `node build.js` and commit `docs/index.html` too.

### The generate panel is missing
Card generation needs the artifact viewer. Write cards by hand or import CSV on the website.

### Anki import puts everything in one field
Choose comma as the separator in Anki's import dialog and map the first two columns to front and
back.
