# PRD: Muhammad Ridho Azfa Karani Portfolio — Sovereign 3D Web Experience

> **Domain**: `ridhoazfa.codaxiom.com`  
> **Client Subdomain**: `ridhoazfa`  
> **Status**: Authoritative Product Requirements Document (PRD) v1.0  
> **Mode**: `Experience` (Awwwards / FWA / Webby Gold Standard)  
> **Primary Design Authorities**: `ui-ux-pro-max-skill` (v2.5.0), `impeccable` (v4.5.0), `taste-skill`, `gsap-skills`

---

## 1. Executive Vision & Core Identity

### 1.1 Objective
To architect and deploy the definitive personal portfolio website for **Muhammad Ridho Azfa Karani**—Founder and Autonomous Systems Architect at **Codaxiom** (`codaxiom.com`).

The site serves as an ultra-luxury, high-craft demonstration of cutting-edge web engineering:
- Proves engineering authority across autonomous multi-tenant commerce, AI agents, and enterprise infrastructure.
- Features a live, interactive 3D **NEXBOT Humanoid Robot** hero character powered by Spline 3D & Three.js.
- Implements an authoritative **One Best Theme** ("Cinematic Obsidian Atelier & Titanium Monolith") with zero light/dark toggling.
- Houses a curated evolutionary project narrative that highlights the **2026 Sovereign Autonomous Era** (Codaxiom Platform & 24 Niche Web Architectures) while gracefully archiving older projects inside a collapsible terminal drawer.
- Concludes with the signature **Giant Clipped Editorial Wordmark (`RIDHO AZFA`)** echoing the acclaimed footer design of `codaxiom.com`.

### 1.2 Persona & Positioning
- **Name**: Muhammad Ridho Azfa Karani
- **Title**: Founder & Autonomous Systems Architect
- **Affiliation**: Codaxiom (`codaxiom.com`)
- **Tone**: Sovereign, intellectually rigorous, technically extraordinary, unpretentious, uncompromising craft.
- **Audience**: Global tech founders, enterprise executives, prospective private buyout clients, AI engineers, and high-value collaborators.

---

## 2. The "One Best Theme" Design System

The operator explicitly rejected generic light/dark mode toggling. The portfolio establishes **one authoritative, cohesive aesthetic**:

### 2.1 Aesthetic Archetype: Cinematic Obsidian Atelier & Titanium Monolith
A spatial luxury atmosphere fusing industrial precision with editorial warmth:
- **Base Surface**: Mineral Obsidian Void (`#08090B` / `oklch(0.12 0.01 250)`). Deep, volumetric, textured with a faint micro-grain layer (`noise.png` at 2.5% opacity) to eliminate digital banding.
- **Card & Component Plates**: Precision Brushed Titanium (`#121418` / `rgba(22, 24, 29, 0.72)`) with 1px hair-thin borders (`rgba(255, 255, 255, 0.08)`).
- **Primary Typography**: Warm Alabaster (`#F4F4F6` / `oklch(0.96 0.005 250)`) providing a stark 14:1 contrast ratio against the obsidian background.
- **Secondary Telemetry**: Muted Vapor Slate (`#8A909E` / `oklch(0.65 0.02 250)`) for labels, code snippets, and timestamps.
- **Signature Accents**:
  - **Sovereign Champagne / Gold** (`#E6AF5C` / `oklch(0.76 0.14 78)`): Reserved for the Founder badge, flagship achievements, and key CTA highlights.
  - **Pulse Cyan / Plasma** (`#00F2FE` / `oklch(0.85 0.16 200)`): For active telemetry beacons, sub-50ms bot latency indicators, and NEXBOT ocular tracking.

### 2.2 Sovereign Typography Law (Strict Enforcement)
- **Editorial Display & Footer Signature**: `Fraunces` (Weights 600, 700, 800) with optical sizing (`opsz: 144`). Used for section numbers, statement headlines, and the giant footer wordmark.
- **Interface & Prose**: `Inter` (Weights 300, 400, 500, 600) with `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'`.
- **System Telemetry & Specs**: `JetBrains Mono` (Weights 400, 500) for timestamps, version numbers, system status, and technical benchmarks.

---

## 3. Interactive 3D NEXBOT Character Architecture

### 3.1 3D Asset Specification
- **Model**: `NEXBOT - robot character concept` by `aximoris` (Spline 3D).
- **Public Scene URL**: `https://my.spline.design/nexbotrobotcharacterconcept-MXPfHaK9hX20wsWuL5G8U3Dp/`
- **Operator Workload**: **Zero Action Required in Spline**. The operator does not need to edit 3D meshes, bake lighting, or manually export scene binaries. The public scene is already compiled, textured, and hosted on Spline's global CDN.
- **Physical Characteristics**:
  - Jet-black obsidian gloss carapace with anisotropic specular reflections.
  - Articulated titanium hydraulic joints.
  - Visor with subtle cyan reflective sheen.
  - Bipedal humanoid athletic stance with built-in idle breathing and cursor tracking.
  - Embedded via hardware-accelerated CAD Viewport iframe (`https://my.spline.design/nexbotrobotcharacterconcept-MXPfHaK9hX20wsWuL5G8U3Dp/`).
  - Architectural CAD casing with interactive rotation, status telemetry, and watermark masking.

### 3.2 Dynamic Interactive Behaviors
1. **Mouse / Cursor Tracking**: In the hero section, NEXBOT's head and torso smoothly track the visitor's cursor using damped spherical coordinates.
2. **Scroll-Linked Stance Shift**: As the visitor scrolls down:
   - At Hero (0% scroll): Stance is scanning/idle.
   - At Architect Philosophy (25% scroll): Robot turns slightly toward the founder portrait.
   - At Codaxiom Ecosystem (50% scroll): Robot activates optical telemetry HUD.
   - Past 75% scroll: 3D canvas scales gracefully into a background architectural silhouette, avoiding GPU contention with interactive bento cards.
3. **Fail-Safe & Mobile Fallback**:
   - On low-power mobile or if WebGL context fails, a high-resolution, multi-layer depth-rendered 3D still of NEXBOT renders with subtle CSS parallax, guaranteeing instant 0ms FOUC.

---

## 4. Comprehensive Information Architecture (IA)

```
[01. GLOBAL HUD NAV]
    ├─ Logo / Monogram: "RA. / RIDHO AZFA"
    ├─ Live Status Pill: [ENTERPRISE ARCHITECTURE · ACTIVE ACROSS 49 NATIONS · ACCEPTING INQUIRIES]
    └─ Magnetic Navigation: Ecosystem · 24 Web Matrix · Vintage Vault · Telemetry · Contact

[02. CINEMATIC 3D HERO]
    ├─ Interactive 3D NEXBOT Robot (Spline WebGL Canvas)
    ├─ Headline: ARCHITECTING AUTONOMOUS COMMERCE & RESILIENT AI AGENTS
    ├─ Subtitle: Founder & Systems Architect at Codaxiom
    └─ Quick Telemetry: 24 Niche Blueprints · Sub-50ms Bot Routing · 99.9% Uptime

[03. THE SOVEREIGN BLUEPRINT (FOUNDER & PORTRAIT)]
    ├─ Left: The Architect Frame (Main Picture Slot with Biometric Telemetry Corners)
    └─ Right: Founder Philosophy, Core Engineering Values, and Technical Arsenal

[04. FLAGSHIP ECOSYSTEM: CODAXIOM]
    ├─ Pillar 1: Autonomous Commerce Engine (Codaxiom Core Foundation)
    ├─ Pillar 2: "The Closer" WhatsApp Sales Engine (Conversational Commerce)
    ├─ Pillar 3: Dual Client Cockpits (Universal AI Agent Hosted vs Standalone Buyout)

[05. THE 24 NICHE AUTONOMOUS WEB MATRIX]
    ├─ Interactive 4-Cluster Filter Tabs (Automotive · Luxury · Commercial · Services)
    ├─ Live Showcase Grid of All 24 Industry Blueprints
    └─ Dual-Variant Indicators (Variant A: Cinematic Video / Variant B: Motion)

[06. EVOLUTIONARY CHRONICLE (OLD VS NEW ERA)]
    ├─ Era 03: The Sovereign Autonomous Era (2026 – Present) [Hero Showcase]
    ├─ Era 02: Systems Automation & Ingestion (2024 – 2025) [Core Infrastructure]
    └─ Era 01: The Declassified Archive [Collapsible Vintage Terminal Drawer]

[07. LIVE SYSTEMS TELEMETRY & BENCHMARKS]
    ├─ Interactive ApexCharts Telemetry Sparklines
    └─ Performance Matrices: Concurrency, Latency, Storage, Anti-Ban Defense

[08. SOVEREIGN EDITORIAL FOOTER]
    ├─ Project Inquiry Action & Direct Communications
    ├─ Directory & Legal Registered Address
    ├─ Smooth Back-to-Top Glide
    └─ GIANT CLIPPED EDITORIAL SIGNATURE: "RIDHO AZFA"
```

---

## 5. Detailed Section Specifications

### Section 01: Global HUD Navigation
- Fixed floating header with backdrop blur (`backdrop-filter: blur(16px)`), background `rgba(8, 9, 11, 0.75)`.
- Left: Monogram `RA.` in `Fraunces 700` with `RIDHO AZFA` in `JetBrains Mono 500`.
- Center: Executive Status Pill: Live green LED beacon (`box-shadow: 0 0 10px rgba(0,242,254,0.5)`), reading `ENTERPRISE ARCHITECTURE · ACTIVE ACROSS 49 NATIONS · ACCEPTING INQUIRIES`.
- Right: Navigation links with magnetic hover effect (`useMagneticHover`), plus CTA button: `INITIALIZE DIALOGUE` (opens direct WhatsApp / email modal).
- **Mobile Responsive Layout (< 768px)**: Navigation links collapse into an accessible slide-out titanium command drawer with >= 48px touch targets, triggered by `<i class="fas fa-bars"></i>` with focus-trap and backdrop blur.

### Section 02: Cinematic 3D Hero
- **Desktop Layout (>= 1024px)**: Left 55% Viewport: The NEXBOT 3D interactive robot stage / Right 45% Viewport: Narrative and actions.
- **Mobile Adaptive Stacking (< 1024px)**:
  1. Eyebrow badge + H1 Display Headline (immediate founder identity).
  2. Scaled 3D Robot Character (clamped height: 360px–420px).
  3. Narrative prose, Dual CTAs, and 4-item Telemetry Strip.
- **WebGL Lifecycle & GPU Optimization (Ponytail Law)**: Native `IntersectionObserver` detects when `#hero` scrolls out of the viewport, pausing the WebGL render loop (`app.stop()`) to conserve 25% GPU/CPU overhead. Automatically resumes (`app.play()`) on scroll re-entry.
- **Interactive Character Behavior**:
  - Damped spherical mouse tracking & rotation: Interactive 3D WebGL runtime embedded in engineering CAD viewport.
  - Transparent WebGL background, seamlessly blending into the obsidian background (`#08090B`).
  - Native CAD framing with monospaced crosshairs and live telemetry footer.
- Eyebrow: `[ FOUNDER & AUTONOMOUS SYSTEMS ARCHITECT ]` (JetBrains Mono, tracking `0.12em`).
- H1 Display: `Architecting autonomous systems & commerce infrastructure.` (Fraunces $\times$ Inter, line-height `1.1`, `text-wrap: balance`).
- Narrative: Pioneering deterministic zero-employee commerce systems, instant WhatsApp AI closer engines, and sovereign enterprise capsules across 49 nations.
- CTAs: Primary `EXPLORE ECOSYSTEM` (magnetic gold pill), Secondary `INSPECT 24 WEB ARCHITECTURES` (outline titanium).
- Micro-telemetry bar with 4 live counter stats.

### Section 03: The Sovereign Blueprint (Founder Identity & Main Picture Slot)
- **The Architect Frame (Main Picture Slot)**:
  - Aspect ratio: `4:5` vertical portrait format.
  - Border geometry: 1px titanium hairline with corner alignment marks (`+--`, `--+`) in JetBrains Mono.
  - Visual treatment: Duotone obsidian color-grading overlay that illuminates subtly on hover, with interactive mouse-tilt effect (`perspective(1000px) rotateX(...) rotateY(...)`).
  - **Fallback State**: Biometric astronaut badge with animated laser scanline (`@keyframes scanline`) and exact geographical coordinates (`GEO: 6.25° S, 107.03° E · TAMBUN SELATAN, BEKASI`), maintaining high-craft aesthetics before photo upload.
  - Ready to receive the operator's high-res portrait file (`ridho.jpg`).
- **The Founder Philosophy & Arsenal**:
  - Tech Stack Badges: TypeScript, Next.js, Node.js, Prisma, PostgreSQL, Docker, Caddy, WhatsApp Business Engine, DeepSeek, Three.js, GSAP.
  - Academic Provenance:
    - Universitas Bakrie (2023 – Present · 7th Semester): S1 Bachelor of Information Systems. Focus: Enterprise Architecture, Relational Data Systems.
    - SMK Pembina Bangsa (2020 – 2023): Vocational High School in Computer & Network Engineering (TKJ). Focus: Linux Systems, Routing & Switching, TCP/IP.
  - Cloud & AI Accreditations (AWS Academy):
    - AWS Certified AI Practitioner Prep (AIF-C01 Alignment): GenAI, Amazon Bedrock, SageMaker, Amazon Q, RAG.
    - AWS Academy Cloud Foundations (CLF-C02 Alignment): Well-Architected Framework, IAM Security, VPC Networking, Pricing.
    - AWS Academy Learner Lab: Hands-on $100 Cloud Sandbox VPC, EC2, S3, and RDS provisioning.

### Section 04: Flagship Ecosystem — Codaxiom (`codaxiom.com`)
- Full interactive breakdown of the operator's core company:
  - Card 1: **Autonomous Commerce Engine**: The enterprise foundation powering zero-employee commerce systems across 49 nations. Orchestrates autonomous client storefronts, instant payment settlement, and sovereign multitenant infrastructure with 99.98% high-availability reliability.
  - Card 2: **"The Closer" WhatsApp Sales Engine**: Intelligent 24/7 sales agent that qualifies leads, handles reservations, calculates dynamic quotes, and closes transactions with sub-50ms latency.
  - Card 3: **Dual Client Cockpits**: Universal sandboxed AI Agent Hosted Cockpit (`/ai-agent/admin/demo`) vs. 1-Time Standalone Buyout Cockpit (`/standalone/admin/demo`) with 100% private code ownership.
- Interactive Live Link Pills: Direct 1-click preview triggers to `codaxiom.com`.

### Section 05: The 24 Autonomous Niche Web Architectures
- Showcases the 24 industry-specific website architectures built for the Codaxiom platform:
  - 4 Cluster Filter Tabs:
    1. *Automotive & Mobility* (Auto Detailing, Auto Rental, Auto Wash)
    2. *Personal Care & Luxury* (Barber, Salon, Spa, Dessert, Cafe, Restaurant, Florist)
    3. *Professional & Commercial* (Coworking, Creative Studio, Real Estate, Legal, Hotel)
    4. *Health & Field Services* (Dental, Medical, Gym, Cleaning, Home Service, Laundry, Pet Care, Education, Wedding)
  - Interactive Card Attributes:
    - Industry Name & Slug (e.g. `autodetailing`, `dental`, `creativestudio`)
    - Variant Badge: Variant A (Cinematic 10s Video Canvas) / Variant B (High-Craft Motion Canvas)
    - Schema.org Local SEO matrix badge
    - 1-Click Launch Button to preview live on `codaxiom.com/<niche>/build/?hero=motion`

### Section 06: Evolutionary Chronicle — Curating Old vs New Era
- Solves the operator's request: *"how do we make it so i have lesser or well old era projects, and i have codaxiom too..."*
- **Curated 3-Era Structure**:
  - **Era 03: The Sovereign Autonomous Era (2026 – Present)**: Full visual glory for Codaxiom platform, 24 web architectures, and dual dashboards.
  - **Era 02: Systems Automation & Ingestion (2024 – 2025)**:
    - *ScrapScrap Engine*: High-speed multi-threaded lead scraper and cold outreach ingestion engine.
    - *ReconForge Wrapper*: Security reconnaissance and automated payload evaluation toolkit.
  - **Era 01: The Declassified Archive (Curated Vintage Vault)**:
    - Housed inside an interactive **Collapsible Terminal Drawer** (`[ VIEW DECLASSIFIED ARCHIVE: 4 RETIRED SYSTEMS ]`).
    - Clicking the drawer smoothly expands a high-density, monospaced terminal listing:
      - 4 legacy engineering projects with historical role, architecture notes, and technology tags.
      - Keeps the primary page uncluttered while proving years of foundational systems programming.

### Section 07: Live Systems Telemetry & Benchmarks
- Interactive telemetry dashboards using ApexCharts SVG sparklines:
  - Chart 1: Bot Response Latency Distribution (< 50ms internal vs 2500ms LLM baseline).
  - Chart 2: Multi-Tenant Blast-Radius Isolation Matrix.
  - Chart 3: Zero-Bloat Code Health Score.

### Section 08: Sovereign Editorial Footer (The "Ridho Azfa" Signature Mark)
- Faithful recreation of the acclaimed `codaxiom.com` footer design:
  - Top: Call to Action: *"Ready to architect an autonomous enterprise system?"* + Calendar Booking & WhatsApp link.
  - Center: Three-column sitemap (Platform, Systems Architecture, Legal/Trust) and official registered office address.
  - Smooth Back-to-Top trigger: `↑ BACK TO APEX`.
  - **The Signature Wordmark**:
    ```html
    <div class="portfolio-footer-mark" aria-hidden="true">RIDHO AZFA</div>
    ```
    - Font Family: `Fraunces`, serif, weight 600.
    - Font Size: `clamp(4.5rem, 16vw, 15rem)`.
    - Line Height: `0.78`.
    - Letter Spacing: `-0.04em`.
    - Text Fill: `transparent` with `-webkit-background-clip: text`.
    - Gradient: `linear-gradient(180deg, rgba(247, 245, 240, 0.08), rgba(247, 245, 240, 0.008))`.
    - Translation: `transform: translateY(22%)`.

---

## 6. Motion & Scroll Animation Architecture

### 6.1 Bi-Directional Scroll Physics (Scroll Down & Scroll Up)
- Built on **Native Browser Scroll** (`scroll-behavior: smooth`) + `gsap` + `ScrollTrigger` (Lenis virtual scroll eliminated per `/ponytail-audit` to preserve native trackpad momentum).
- **Reduced Motion Support**: Strict adherence to `@media (prefers-reduced-motion: reduce)`. Animations resolve immediately to final layout states without camera displacement.
- **Scroll Down**:
  - Staggered entrance reveals on headers and cards (`y: 40, opacity: 0, duration: 0.9, ease: "power3.out"`).
  - Multi-layer parallax on background grids and floating telemetry badges (`data-speed="1.1"`).
- **Scroll Up**:
  - Velocity-sensitive deceleration (`ScrollTrigger.create({ onUpdate })`).
  - Seamless reverse transitions (`toggleActions: 'play none none reverse'`) preventing abrupt pop-in or unpinning jump.
- **Horizontal Scrubbing**:
  - Section 05 (24 Web Architectures) features a pinned horizontal scrub on desktop, gliding through the 4 industry categories with an active progress rail.

### 6.2 Micro-Interactions (Emil Kowalski Philosophy)
- Buttons: Spring-loaded press feedback (`transform: scale(0.97)` on active, `150ms`).
- Magnetic Pull: Nav items and primary CTAs gently pull toward the cursor when hovering within a 40px radius.
- Cards: 1px border highlight dynamically tracks cursor position via CSS custom properties (`--mouse-x`, `--mouse-y`).

---

## 7. Performance, Security & Compliance Floor

1. **Zero Emojis in UI**: Strict adherence to Codaxiom rule §1. All icons use Font Awesome 6 SVG / Lucide vector icons.
2. **Client Data Safety**: Capsule resides in `apps/custom-enterprise/ridhoazfa/` with dedicated Git, Caddy routing (`ridhoazfa.codaxiom.com`), and isolated dependencies.
3. **Core Web Vitals Budget**:
   - LCP (Largest Contentful Paint) < 1.2s.
   - CLS (Cumulative Layout Shift) = 0.00.
   - FID / INP < 50ms.
4. **Bundle Floor**: Vanilla HTML5/CSS3/ESM or isolated Next.js capsule. Zero bloated CSS frameworks; pure bespoke OKLCH tokens and hardware-accelerated GSAP timelines.
