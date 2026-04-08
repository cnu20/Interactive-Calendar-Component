# Wall Calendar — Interactive React Component

A polished, interactive wall calendar component built with React. Inspired by the physical wall calendar aesthetic, featuring a hero image panel, date range selection, integrated notes, and full responsive design.

---

## Features

- **Wall Calendar Aesthetic** — Hero gradient panel per month with a wave-cut divider, mimicking a wall calendar with a photo
- **Day Range Selector** — Click a start date, then an end date; live hover preview highlights the range; START/END badge labels on endpoints
- **Integrated Notes** — Two tabs: Monthly memo (saved per month) and Range notes (saved per selected range)
- **Dark / Light Theme** — Toggle between themes with smooth transitions
- **Holiday Markers** — Amber dot indicators on US holidays with a sidebar listing
- **Month Navigation** — Animated transitions between months with a "Today" jump button
- **localStorage Persistence** — Notes are auto-saved to the browser; no backend needed
- **Fully Responsive** — Stacks vertically on mobile; side-by-side layout on desktop

---

## Tech Stack

- React (hooks: `useState`, `useEffect`, `useRef`)
- Pure CSS-in-JS (no external styling library)
- `localStorage` for client-side persistence

---

## Getting Started

### Option A — Create React App

**1. Scaffold the project**
```bash
npx create-react-app wall-calendar
cd wall-calendar
```

**2. Add the component**

Copy `WallCalendar.jsx` into the `src/` folder.

**3. Update `src/App.js`**
```jsx
import WallCalendar from './WallCalendar';

export default function App() {
  return <WallCalendar />;
}
```

**4. Run the dev server**
```bash
npm start
```

Opens at: `http://localhost:3000`

---

### Option B — Next.js

**1. Scaffold the project**
```bash
npx create-next-app@latest wall-calendar
cd wall-calendar
```

**2. Add the component**

Add `"use client";` as the very first line of `WallCalendar.jsx`, then place it in the `components/` folder.

**3. Update `app/page.jsx`**
```jsx
import WallCalendar from '../components/WallCalendar';

export default function Page() {
  return <WallCalendar />;
}
```

**4. Run the dev server**
```bash
npm run dev
```

Opens at: `http://localhost:3000`

---

## Usage

| Action | How |
|--------|-----|
| Navigate months | Click `‹` / `›` arrows in the hero panel |
| Jump to today | Click the **Today** button in the footer |
| Select a date range | Click a start date, then click an end date |
| Add a monthly note | Switch to the **Month** tab in the notes panel |
| Add a range note | Select a range — the **Range** tab opens automatically |
| Clear selection | Click **Clear selection** in the Range tab |
| Toggle theme | Click **◑ Dark** / **☀ Light** in the top bar |

---

## Design Decisions

- **No external dependencies** beyond React itself — keeps the bundle lean and the component portable
- **localStorage** is used for notes persistence as instructed (no backend or database)
- **CSS-in-JS inline styles** for full encapsulation — drop the file into any project without style conflicts
- **12 unique monthly gradients** give each month its own identity, replacing the physical photo from the reference image
- **SVG geometric shapes** in the hero panel replicate the angular design of the reference calendar
- **Hover preview** during range selection gives users immediate visual feedback before committing

---

## Project Structure

```
src/
├── WallCalendar.jsx   # Single self-contained component
└── App.js             # Entry point (imports WallCalendar)
```

---

## Notes on Persistence

All notes are saved to `localStorage` automatically on every keystroke. Keys used:

- `wallcal_monthnotes` — monthly memos, keyed by `year-month`
- `wallcal_notes` — range notes, keyed by `startDate_endDate`

No backend, server, or database is required.
