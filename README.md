# College Comparison — Founding Engineer Assignment

A mini college comparison platform built as part of the Founding Engineer selection challenge. Students can browse colleges, filter by location, fees, and rating, select up to 3 colleges, and compare them side by side.

## Tech Stack

- **React 19** — UI framework
- **Vite** — build tool
- **Tailwind CSS v4** — styling
- **Framer Motion** — animations
- **Lucide React** — icons

## Features

### Core
- **College listing** — 8 colleges displayed as cards, each showing Name, Location, Annual Fees, and Rating
- **Compare feature** — select 2–3 colleges and open a side-by-side comparison table
- **Filters** — filter by Location (select), Max Fees (range slider), and Min Rating (buttons); all filters combine in real time

### UX Details
- Floating draggable **Compare Ribbon** — shows selected colleges, Clear and Compare actions; draggable on both desktop (mouse) and mobile (touch)
- Compare button is disabled until at least 2 colleges are selected
- **Comparison modal** — bottom sheet with spring animation, shows Name, Fees, Location, Rating, Acceptance Rate, Student-Faculty Ratio, and About section; highlights the "Best" value per metric
- **Mobile filter drawer** — slide-in from left with spring animation
- No layout shift when modal opens (scroll lock on `<html>` with scrollbar width compensation)
- Card stagger animation on mount only (not on re-renders)
- Fully responsive: 3-col grid on desktop, 2-col on tablet, 1-col on mobile

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── CollegeCard.jsx      # Individual college card with Add/Remove button
│   ├── Filters.jsx          # Sidebar filters (desktop + mobile drawer)
│   ├── CompareRibbon.jsx    # Floating draggable ribbon
│   └── CompareModal.jsx     # Side-by-side comparison bottom sheet
├── data/
│   └── colleges.js          # College data + location options
├── App.jsx                  # Root component, state management
├── main.jsx                 # Entry point
└── index.css                # Global styles + Tailwind
```
