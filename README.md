# TECHFEST 30.0 — Ignite The Future

> Asia's Largest Science & Technology Festival — Interactive 3D Website

## 🚀 Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source: `main` branch, `/ (root)`
4. Your site is live at `https://<username>.github.io/<repo>/`

No build step. No dependencies to install. Works out of the box.

---

## 📁 File Structure

```
techfest3/
├── index.html          # Main page — all 5 zones
├── css/
│   └── style.css       # Full stylesheet (tokens, zones, HUD, animations)
├── js/
│   ├── three-scene.js  # Three.js universe — 5 planets, scroll camera, neon bloom
│   └── main.js         # Cursor, HUD, scroll reveal, counters, tabs, form
└── README.md
```

## ✨ Features

### 3D Universe (Three.js r128)
- **5 Zone Planets** — AI Planet, Robotics Sphere, Space Hub, Startup City, Quantum Core
- **Scroll-driven camera journey** — camera flies through the universe as you scroll
- **Mouse parallax** — subtle X/Y camera drift following your cursor
- **Neon bloom effects** — proximity-based glow halos pulse as camera approaches each planet
- **Star field** — 5,000 particles with cyan tint, spanning the full journey
- **Orbiting rings & dots** — each planet has 3 orbital rings + 4 satellite dots
- **Nebula clouds** — soft particle clouds between zones
- **Path lines** — faint connecting lines between planet positions

### UI/UX
- **Live HUD** — zone name, coordinates, scroll %, heartbeat monitor
- **Zone nav dots** — right-side pills that light up per active zone
- **Cursor colour-shifts** per zone
- **Scroll progress bar** — glowing gradient at top of page
- **Staggered reveal animations** — elements animate in on scroll
- **Counter animations** — stats count up when visible
- **CSS 3D planet visuals** — tilt on mouseover in each section
- **Schedule tabs** — Day 1 / 2 / 3 switcher
- **Event filter buttons** — filter by category
- **Register form** — with success state animation
- **Mobile nav** — full-screen overlay

### Performance
- Single CDN dependency (Three.js r128 from cdnjs)
- Google Fonts only external stylesheet
- No build tools, no bundlers, no Node required

---

## 🎨 Zone Colour Palette

| Zone | Colour |
|------|--------|
| AI Planet | `#00f0ff` — Cyan |
| Robotics Sphere | `#ff4d6d` — Red |
| Space Hub | `#f59e0b` — Amber |
| Startup City | `#34d399` — Emerald |
| Quantum Core | `#a78bfa` — Violet |

## 📅 Event Details

**Dates:** November 14–16, 2025  
**Venue:** IIT Bombay  
**Edition:** 30th Anniversary  
**Prize Pool:** ₹2 Crore+  
**Participants:** 20,000+  
**Events:** 150+
