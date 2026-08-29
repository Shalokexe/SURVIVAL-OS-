# Contributing to SurvivalOS 🛡️

Thank you for your interest in contributing to **SurvivalOS**! In emergency preparedness and survival scenarios, software reliability, performance, clarity, and determinism can make a tangible difference.

---

## 🎯 Contribution Principles

1. **Offline-First Above All**: No feature may introduce a mandatory cloud dependency or external network requirement.
2. **Deterministic Fallbacks**: Every AI-driven feature must have a deterministic mathematical or rule-based fallback that functions without a GPU or active model.
3. **High-Stress UX**: Interfaces must prioritize clarity, high contrast, low eye fatigue, and unambiguous step-by-step guidance.
4. **Privacy & Security**: Zero remote analytics or telemetry. All user data stays on the local device.
5. **Medical & Scientific Accuracy**: Handbook content and survival formulas (water dosage, caloric calculations) must be grounded in verified emergency protocols (WHO, Red Cross, FEMA, CDC).

---

## 🛠️ Development Setup

### 1. Fork & Clone
```bash
git clone https://github.com/YOUR_USERNAME/SURVIVAL-OS-.git
cd SURVIVAL-OS-
```

### 2. Set Up Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Set Up Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 4. Running Both with Dev Launcher
```bash
# From repository root:
python run_dev.py
```

---

## 🧪 Testing & Verification

- **Backend Smoke Tests**: Run `python scratch/test_backend.py` or execute automated unit tests.
- **Frontend Typechecks & Linting**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 📬 Pull Request Workflow

1. Create a descriptive topic branch: `git checkout -b feature/your-feature-name` or `git checkout -b fix/issue-description`.
2. Ensure code is formatted, typed, and tested.
3. Commit with concise semantic commit messages:
   - `feat: Add rainwater filtration calculator`
   - `fix: Resolve marker confidence decay timing`
   - `docs: Update emergency triage protocols`
4. Open a Pull Request against the `main` branch with a clear summary of changes.

---

## 📜 Code of Conduct

Please maintain a collaborative, respectful, and constructive environment for all contributors.
