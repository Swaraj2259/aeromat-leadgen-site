# Aeromat Lead Generation Website

Single-page lead generation site for **Aeromat Creative Labs Pvt. Ltd.** (Pune, India).

Built with:
- React + Vite
- GSAP + ScrollTrigger
- Three.js (interactive drone)
- Light/Dark mode (CSS variables)

## Screenshots

![Hero](UI%20SS/01-hero-section.png)
![Drone Showcase](UI%20SS/02-drone-showcase.png)
![Industries](UI%20SS/03-industries-section.png)
![Testimonials](UI%20SS/04-testimonials-section.png)
![Footer](UI%20SS/05-footer-section.png)

## Run locally

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```

## Drone model (optional)

The site renders a drone via a procedural fallback. To use GLB models, add:

- `public/models/drone-hero.glb`
- `public/models/drone-showcase.glb`

If a model fails to load, it falls back automatically.

## Attribution

Drone model credit (displayed on the page):

“Drone For Agriculture (Low Poly)” by Bharat Nagar — Creative Commons Attribution (Sketchfab)

## Brand logo

Place your company logo image here to be used in the navbar + footer:

`public/brand-logo.png`
