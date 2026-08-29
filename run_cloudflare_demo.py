import subprocess
import sys
import os
import time
import shutil

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("=" * 65)
    print("      ⚡ SURVIVAL-OS // CLOUDFLARE LIVE DEMO LAUNCHER")
    print("      'INTERNET WHEN AVAILABLE. INTELLIGENCE WHEN UNAVAILABLE.'")
    print("=" * 65)

    # 1. Start FastAPI Backend
    print("\n[1/3] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    # 2. Start Vite Frontend
    print("[2/3] Starting Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = ["npx.cmd" if os.name == 'nt' else "npx", "vite", "--port", "5173", "--host"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    time.sleep(2)

    # 3. Cloudflare Tunnel
    print("\n[3/3] Initiating Cloudflare Quick Tunnel (Free & Instant HTTPS Demo)...")
    cloudflared_path = shutil.which("cloudflared")
    tunnel_proc = None

    if cloudflared_path:
        print(">> Found cloudflared binary! Starting tunnel...")
        tunnel_cmd = [cloudflared_path, "tunnel", "--url", "http://localhost:5173"]
        tunnel_proc = subprocess.Popen(tunnel_cmd)
    else:
        print("\n" + "-" * 65)
        print("💡 CLOUDFLARE TUNNEL INSTRUCTIONS:")
        print("   To share your live demo over the internet with an instant HTTPS link:")
        print("   1. Download 'cloudflared' for Windows from:")
        print("      https://github.com/cloudflare/cloudflared/releases/latest")
        print("   2. Open a new terminal and run:")
        print("      cloudflared tunnel --url http://localhost:5173")
        print("   3. Cloudflare will give you a public URL (e.g. https://xyz.trycloudflare.com)")
        print("      that anyone can open on their phone/browser!")
        print("-" * 65 + "\n")

    print("🟢 Local Frontend : http://localhost:5173")
    print("🟢 Local Backend  : http://127.0.0.1:8000")
    print("🟢 API Docs (Swagger): http://127.0.0.1:8000/docs\n")
    print("Press Ctrl+C to shut down all demo processes.")

    try:
        backend_proc.wait()
        frontend_proc.wait()
        if tunnel_proc:
            tunnel_proc.wait()
    except KeyboardInterrupt:
        print("\n\nShutting down SurvivalOS Live Demo...")
        backend_proc.terminate()
        frontend_proc.terminate()
        if tunnel_proc:
            tunnel_proc.terminate()

if __name__ == "__main__":
    main()
