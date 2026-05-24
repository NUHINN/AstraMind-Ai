# AstraMind AI

AstraMind AI is a frontend-only student productivity web application designed as a premium AI SaaS dashboard. It uses React, Tailwind CSS, Framer Motion, Recharts, Lucide React icons, React Router, and LocalStorage-backed simulated AI behavior.

## Run

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

On Windows, you can also double-click `launch-app.bat`.

Do not open `index.html` directly with a `file://` URL. This is a Vite React app and should be served through the Vite dev server locally or built by Vercel in production.

## Deploy

Vercel should use:

```text
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

These are also declared in `vercel.json`.

## Included Surfaces

- Login/register portal with LocalStorage credentials and protected dashboard routes
- Landing page with futuristic SaaS hero, animated stats, feature cards, demo, testimonials, and CTA
- Dashboard with dynamic greeting, AI insights, task CRUD, drag-and-drop task sorting, productivity score, exams, and charts
- AI Planner with mood-based planning and simulated schedule generation
- Focus Room with multiple study presets, Pomodoro timer, breathing animation, generated ambient audio, session tracking, and fullscreen mode
- Analytics with Recharts, subject progress, productivity trends, radar chart, and heatmap
- AI Assistant with fake chat logic, typing animation, suggestions, and toast feedback
- Goals with XP, levels, badges, streaks, and progress logging
- Settings with editable profile, login credentials, focus intervals, mood calibration, notifications, audio engine, and sidebar density

All user data is persisted in LocalStorage.

Demo login:

```text
Email: student@astramind.ai
Password: demo123
```
