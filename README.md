# FORGE — Elite Performance Gym Website

Premium gym website with Three.js double-helix particle system, scroll animations, and cinematic storytelling.

## Setup
```bash
npm install
npm run dev   # → http://localhost:3000
```

## Deploy to Vercel
```bash
git init
git add .
git commit -m "feat: Forge gym initial build"
git remote add origin https://github.com/YOURUSERNAME/forge-gym.git
git push -u origin main
```
Then import on vercel.com — auto-detects Next.js.

## Customise
- Colours: `app/globals.css` CSS variables at top
- Gym name/content: each component in `components/`
- Prices: `components/Programs.jsx`
- Contact: `components/Join.jsx` and `components/Footer.jsx`
