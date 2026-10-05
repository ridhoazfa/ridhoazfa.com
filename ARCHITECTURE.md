# Ridho Azfa — System Architecture & Technical Specification

> **Capsule**: `apps/custom-enterprise/ridhoazfa`  
> **Schema**: `client_ridhoazfa_db`  
> **Network Boundary**: Isolated tenant session & rate limit namespace  

---

## 1. System Topology

```
[ Client Traffic / Custom Domain ]
               │
               ▼
   [ Caddy Reverse Proxy (:443) ]
   Serving /srv/custom-enterprise/ridhoazfa
   Native TLS via Let's Encrypt On-Demand
               │
       ┌───────┴───────┐
       ▼               ▼
[ Web App / Static ]   [ Custom Services / API ]
(HTML5/TS/Next.js)     (Dedicated Container / Node.js)
       │               │
       └───────┬───────┘
               ▼
[ PostgreSQL: client_ridhoazfa_db ] (Schema Isolation)
[ Redis: rate_limit:wa:ridhoazfa: ] (Key Prefix Isolation)
[ WhatsApp Communication Engine: client_ridhoazfa_* ]
```

---

## 2. Directory Layout & Boundaries

```
apps/custom-enterprise/ridhoazfa/
├── .gitignore                # Private repository gitignore
├── REQUIREMENTS.md           # Business contract, briefing notes, and milestone tracker
├── ARCHITECTURE.md           # This document
├── CHANGELOG.md              # Milestone progression and audit log
├── client_config.json        # Tenant parameters and integration configuration
├── README.md                 # Project README and operator runbook
├── index.html                # Sovereign English web portfolio
├── index-id.html             # Sovereign Indonesian web portfolio
├── robots.txt                # Search engine crawler directives
├── sitemap.xml               # Canonical XML sitemap
├── icon.png                  # Monogram avatar & favicon
├── assets/                   # Compiled Spline 3D scene, CSS, JS, and optimized images
│   ├── scene.splinecode      # High-performance compiled 3D binary
│   ├── css/atelier-theme.css # Sovereign Obsidian Atelier design system
│   ├── js/                   # Choreography, 3D WebGL inertia, and navigation scripts
│   └── images/               # Portrait, 3D fallback still, and media assets
└── src/                      # Custom business logic, API integrations, and workers
    └── index.ts              # Service entrypoint
```

---

## 3. Data Isolation & Security Rules

1. **Schema Sandboxing**: Database entities MUST be created under PostgreSQL schema `client_ridhoazfa_db`. Cross-tenant schema joins are strictly forbidden.
2. **Session Key Salting**: WhatsApp and authentication session tokens use namespace prefix `session_client_ridhoazfa_`.
3. **Client Access Lock**: During production maintenance, the client workspace is subject to the platform `client_access_locked` rule. Local edits require toggling access in the Control Room.
4. **Zero Unicode Emojis**: All interfaces adhere to Codaxiom's Zero Unicode Emojis law. Vector iconography (Font Awesome / SVG) and pure CSS geometry only.
