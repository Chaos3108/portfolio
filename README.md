# yuva.dev — portfolio

A one-page portfolio with a Three.js hero, built with Vite. No framework; plain HTML, CSS and JS.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # outputs static files to dist/
```

## Deploy

### Vercel (recommended)
1. Push this folder to a GitHub repo:
   ```bash
   git init && git add . && git commit -m "Portfolio"
   git branch -M main
   git remote add origin https://github.com/chaos3108/portfolio.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New… → Project** → import the repo.
3. Vercel detects Vite automatically (build: `npm run build`, output: `dist`). Click **Deploy**.

Or from the terminal: `npm i -g vercel && vercel --prod`.

### Netlify
Import the repo, build command `npm run build`, publish directory `dist`.

### GitHub Pages
Run `npm run build` and publish the `dist/` folder (for a project page, set `base: '/<repo-name>/'` in `vite.config.js`).

## Edit

- **Content:** everything is in `index.html`.
- **Colors / fonts:** CSS variables at the top of `src/style.css`.
- **3D scene:** `src/scene.js` — `ACCENT`, `SPIN`, `PARTICLES` at the top.
- **Résumé link:** drop your PDF in `public/resume.pdf`.
