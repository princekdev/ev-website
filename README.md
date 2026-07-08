# ARC — EV Landing Page

A single-page, production-quality electric vehicle site. No frameworks, no build step — open `index.html` in any browser.

## Structure

```
index.html               Markup only — every section, no inline CSS/JS
css/
  base.css                Design tokens (colors, type, spacing), resets, shared typography
  components.css          Nav bar, buttons, the signature "current-line" divider
  hero.css                Hero section
  vehicle-experience.css  Engineering storytelling timeline
  calculator.css          Range Intelligence calculator
  charging.css            Charging Ecosystem dashboard
  locator.css             Station Locator (map + list)
  savings.css             Cost Savings Simulator
  sustainability.css      Sustainability illustrations
  studio.css              Color Studio (live theme switching)
  gauges.css              Performance telemetry gauges
  ownership.css           Ownership interactive timeline
  testimonials.css        Testimonial feed
  footer.css              Footer + scroll progress bar + utility classes
js/
  main.js                 Nav scroll state, scroll progress, hero parallax,
                           magnetic buttons, scroll-reveal, timeline bar/pulse animation
  range-calculator.js      Range Intelligence math + live UI updates
  charging-dashboard.js    Charging ring/timeline simulation
  station-locator.js       Map rendering, search, filters, favorites
  cost-simulator.js        Cost savings math + animated counters
  sustainability.js        Procedural SVG illustrations
  gauges.js                Circular gauge rendering + scroll-triggered animation
  ownership.js             Expand/collapse timeline interaction
  color-studio.js          Swaps CSS custom properties site-wide
```

Each JS file is a self-contained IIFE — no shared globals, no load-order dependencies beyond being loaded after the DOM (all tagged `defer`).

## Notes

- Fonts load from Google Fonts (Space Grotesk / Inter / JetBrains Mono) — needs internet on first load, otherwise falls back to system sans-serif.
- All data (stations, savings math, range model) is client-side and deterministic — no backend.
- Tested at 375 / 768 / 1024 / 1440 / 1920px with zero horizontal overflow, and with Chromium console/page-error checks clean (aside from an expected font-fetch note in sandboxed environments without internet access).
