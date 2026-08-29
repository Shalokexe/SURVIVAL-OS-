# ☁️ Cloudflare Live Demo & Deployment Guide

This guide covers two distinct ways to showcase and deploy **SurvivalOS** using Cloudflare:
1. **Instant Live Demo (Cloudflare Tunnel)** — Stream your live local frontend + FastAPI backend + local AI to a public HTTPS URL (zero port forwarding required).
2. **Permanent Edge Deployment (Cloudflare Pages)** — Host the static React/Vite PWA on Cloudflare's global edge network.

---

## ⚡ Method 1: Instant Live Demo via Cloudflare Quick Tunnel (Recommended for Demos)

With a Cloudflare Quick Tunnel, you can run the full SurvivalOS application on your local machine and immediately share a public HTTPS link (e.g. `https://random-name.trycloudflare.com`) with evaluators, investors, or open it on your smartphone.

### Step 1: Download `cloudflared` (One-Time Setup)
- **Windows**: Download `cloudflared-windows-amd64.exe` from [Cloudflare Releases](https://github.com/cloudflare/cloudflared/releases/latest), rename it to `cloudflared.exe`, and place it in your `PATH` (e.g., `C:\Windows\System32` or your project folder).
- **macOS**: `brew install cloudflare/cloudflare/cloudflared`
- **Linux**: `sudo apt install cloudflared`

### Step 2: Run the Unified Cloudflare Launcher
From your repository root:

```bash
python run_cloudflare_demo.py
```

Or manually in a separate terminal:
```bash
cloudflared tunnel --url http://localhost:5173
```

Cloudflare will output a public HTTPS link like:
```text
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
|  https://emergency-command-demo.trycloudflare.com                                          |
+--------------------------------------------------------------------------------------------+
```

Open this link on any mobile phone or browser to test the full live application!

---

## 🌐 Method 2: Deploy Static Frontend to Cloudflare Pages

Cloudflare Pages provides zero-config, blazing-fast hosting on Cloudflare's global edge network.

### Option A: Via GitHub Integration (Automatic CI/CD)
1. Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Compute (Workers & Pages)** → **Pages** → **Connect to Git**.
2. Select your repository: `https://github.com/Shalokexe/SURVIVAL-OS-`.
3. Configure the build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `frontend/dist`
   - **Root directory**: `frontend`
4. Click **Save and Deploy**. Cloudflare Pages will automatically rebuild and deploy on every push!

### Option B: Deploy via Wrangler CLI
From the `frontend/` directory:

```bash
cd frontend
npm run build
npx wrangler pages deploy dist --project-name=survival-os
```

---

## 🔒 Configuration Files Included

- **`frontend/wrangler.toml`**: Cloudflare project definition.
- **`frontend/public/_headers`**: Security headers (`X-Frame-Options`, `X-Content-Type-Options`) and PWA caching rules.
- **`frontend/public/_redirects`**: Single Page Application (SPA) fallback routing (`/*  /index.html  200`).
