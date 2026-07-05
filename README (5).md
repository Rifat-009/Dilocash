# <p align="center"><img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80" alt="Dilocash Logo" width="60" style="border-radius: 12px; margin-bottom: 12px;"/><br>D I L O C A S H</p>

<p align="center">
  <strong>The Ultra-Premium, High-Fidelity Fintech Digital Banking Sandbox & Landing Interface</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-6474F2?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Netlify-00C4B6?style=for-the-badge&logo=netlify&logoColor=white" alt="Netlify" />
</p>

---

Dilocash is an elegant, responsive, and secure full-stack single-page application (SPA) designed to showcase the future of digital banking for global citizens. Merging high-fidelity design aesthetics with powerful real-time simulation mechanics, Dilocash provides modern nomads with tactile virtual cards, live currency exchange telemetry, and AI-driven market intelligence.

Developed with **React 18**, **Vite**, **TypeScript**, and **Tailwind CSS**, the platform incorporates **service worker caching** and an interactive client-side sync engine for a completely resilient **Offline-First Mode**.

---

## 💎 Design Philosophy & Aesthetic Identity

Dilocash is designed from the ground up to feel like an exclusive, institutional-grade luxury instrument. It rejects cookie-cutter UI patterns in favor of:
*   **The Slate Charcoal & Gold Palette:** Deep, high-contrast dark tones with soft, luminous gold and emerald accents representing solid capital value.
*   **Tactile Feedback:** Fluid, physics-based interactions driven by `motion/react` (formerly Framer Motion), including 3D card tilt and hover reflections.
*   **No Unnecessary Clutter:** Humble, human-readable labels and high-precision visual grids that maintain strict focus on telemetry and interactive widgets.

---

## 🚀 Key Architectural Modules

### 1. Interactive 3D Metal Card Customizer
An immersive, realistic simulation of luxury titanium and gold physical cards:
*   **Customization Parameters:** Instant tactile rendering of Cardholder names, spending thresholds, and locking states.
*   **Premium Material Encoders:** Choose between *Obsidian Black*, *Polished Gold*, *Carbon Fiber*, *Arctic Platinum*, and *Chrome Rose* with responsive metallic reflection overlays.
*   **Web Audio Engraving Simulator:** Triggers a synthesis of physical laser-etching frequencies using the native browser `AudioContext` API, complete with interactive countdown timelines.
*   **Front-to-Back Flip Mechanics:** Rotates on the 3D space with clean perspective angles to reveal security credentials and the signature magnetic strip.

### 2. Live Cross-Border FX Exchange Telemetry
A multi-interval foreign currency exchange monitor:
*   **Real-Time Calculations:** Conversions between `USD` and top sovereign currencies (`EUR`, `GBP`, `JPY`, `AUD`, `CAD`, `CHF`, `INR`).
*   **Dual-Resolution Sparklines:** High-performance currency rate history over a 9-day and a 24-hour interval mapped using customized, responsive `Recharts` SVG modules.
*   **Source Integrity Indicators:** Programmatically flags rate source telemetry (Live API Proxy vs. High-Fidelity Local Offline Cache) depending on network diagnostics.

### 3. Cryptocurrency Wealth Sandbox & AI Trend Scanner
A sandbox playground allowing users to simulate multi-asset crypto trading:
*   **Continuous Price Feed Ticker:** A smooth, CSS-accelerated marquee scrolling ticker representing dynamic changes for major cryptocurrencies.
*   **Wealth Ledger Sandbox:** Buy and sell major currencies using a $10,000 baseline cash account. Balances, holdings, and historic transaction logs are fully preserved locally.
*   **AI Technical Overlay:** Calculates and renders *Simple Moving Averages (SMA)* and *Exponential Moving Averages (EMA)* to flag bullish/bearish crossovers on dynamic technical charts.

### 4. Interactive Volatility Forex Heatmap
A dynamic, micro-interactive matrix detailing market volatility:
*   **Volatility Classifications:** Real-time indexing of spreads, prices, and volumes colored according to volatility thresholds (High, Medium, Low).
*   **Grid Filtering Controls:** Narrow active views down to specific market clusters with zero-latency visual rendering.

### 5. High-Fidelity Offline Mode & local Mesh Sync
A resilient client architecture that continues working when disconnected:
*   **Standard Service Worker Caching:** Registers `/sw.js` to pre-cache critical shell assets (`index.html`, scripts, CSS, and main assets) so that the application is fully reloadable without network access.
*   **Simulated Offline Mode:** A persistent, interactive switch inside the bottom connectivity control panel allowing developers and users to test the sandbox in full isolation.
*   **Local Action Queuing:** Interactive user actions (like minting cards, customizing limits, or trading assets) are successfully logged and queued locally inside `localStorage`.
*   **Visual Sync Handshakes:** Displays an animated synchronization ledger sequence when the physical or simulated connection is restored.

---

## 🛠️ Directory Structure

```bash
├── public/
│   └── sw.js                     # PWA Service Worker (Handles offline asset caching)
├── src/
│   ├── components/               # Specialized UI Modular Components
│   │   ├── Benefits.tsx          # Real-time yield calculator & FDIC Finder Hub
│   │   ├── CardCustomizer.tsx    # 3D interactive luxury metal card simulator
│   │   ├── CryptoPortfolio.tsx   # Wealth ledger sandbox with local storage persistence
│   │   ├── CryptoTrendScanner.tsx# Charting scanner with SMA/EMA overlays
│   │   ├── FXWidget.tsx          # Real-time currency exchange Sparkline widget
│   │   ├── MarketHeatmap.tsx     # Grid visualization of currency volatility
│   │   ├── Navbar.tsx            # Main application navigation
│   │   ├── OfflineIndicator.tsx  # Persistent connection control console & queue status
│   │   ├── Pricing.tsx           # Tiers and billing models
│   │   ├── Ticker.tsx            # Marquee scrolling cryptocurrency ticker
│   │   └── ...                   
│   ├── App.tsx                   # Core layout container & section coordinator
│   ├── index.css                 # Global styles, typography imports, and Tailwind settings
│   ├── main.tsx                  # Application bootstrap & SW registration
│   └── types.ts                  # Shared high-fidelity TypeScript enums & interfaces
├── server.ts                     # Express.js developer server & Live API proxies
├── netlify.toml                  # Netlify single-page routing redirect rules
├── package.json                  # Dependencies, builds, and standard task scripts
└── tsconfig.json                 # Strict TypeScript configuration parameters
```

---

## 💻 Local Installation & Setup

### Requirements
*   Node.js (v18.0.0 or higher)
*   npm (v9.0.0 or higher)

### Setup Instructions
1.  **Clone the workspace:**
    ```bash
    git clone <your-repository-url>
    cd dilocash
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Boot the development server:**
    ```bash
    npm run dev
    ```
    *This executes the Express server (using tsx) on port 3000, serving the frontend via Vite dev middleware, enabling proxy-safe API telemetry.*

4.  **Create a production compilation:**
    ```bash
    npm run build
    ```
    *Bundles the frontend assets into `dist/` and compiles the backend code into a single, optimized node bundle at `dist/server.cjs`.*

---

## ☁️ Deployment Guides

### Option A: Static Deployment (Netlify, Vercel, GH Pages)
Because the platform features robust client-side fallback engines and standard fallback data structures, the client can be deployed entirely as a **Static Single-Page Application (SPA)**.

The project includes a ready-to-use `netlify.toml` file that routes all deep-linked paths directly to `index.html` to prevent 404 errors during client-side navigation.

*   **Build Command:** `npm run build`
*   **Publish Directory:** `dist`

### Option B: Full-Stack Deployment (Cloud Run, Render, VPS)
To run the full Node/Express backend that proxies real-time exchange rates:
*   Configure your environment to run `npm run build` to compile both client assets and server bundle.
*   Execute `npm start` to run the optimized node bundle on host `0.0.0.0` and port `3000`.

---

## 🛡️ License

This project is open-source and available under the **MIT License**.
