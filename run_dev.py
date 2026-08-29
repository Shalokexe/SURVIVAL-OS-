import subprocess
import sys
import os
import time

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("=" * 60)
    print("      APOCALYPSE AI AGENT // UNIFIED LAUNCHER")
    print("      'INTERNET WHEN AVAILABLE. INTELLIGENCE WHEN UNAVAILABLE.'")
    print("=" * 60)

    # Start FastAPI Backend
    print("[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=backend_dir)

    time.sleep(2)

    # Start Vite Frontend
    print("[2/2] Starting Vite Frontend on http://localhost:5173 ...")
    frontend_cmd = ["npx.cmd" if os.name == 'nt' else "npx", "vite", "--port", "5173", "--host"]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=frontend_dir)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down APOCALYPSE AI...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    main()
