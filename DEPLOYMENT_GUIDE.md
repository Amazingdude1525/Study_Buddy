# NeuroFlow: Production Full-Stack Guide 🚀🏔️

This guide covers the deployment and management of the NeuroFlow ecosystem using a high-fidelity **FastAPI + PostgreSQL + React** stack.

## 🐘 Data & Database Management (Neon)
Since we have migrated to **Neon PostgreSQL**, your data is now persistent and globally accessible.
1. **Accessing the Data**: 
   - Log in to your [Neon Console](https://console.neon.tech).
   - Select your **NeuroFlow** project.
   - Click **Tables** or **SQL Editor** in the left sidebar to see all user study data, streaks, and focus logs live.
2. **Environment Key**: Your `DATABASE_URL` in `.env` is the "Neural Link." Never share this publicly.

---

## 🌐 Production Deployment Flow (The CI/CD Master Plan)

To make your project live for the world, follow this **3-step workflow**:

### 1. Synchronize to GitHub (Mandatory)
Both Vercel and Railway deploy directly from your GitHub repository.
```bash
git add .
git commit -m "feat: upgrade to NeuroFlow 2.0 Full-Stack"
git push origin main
```

### 2. Frontend Deployment (Vercel)
- **Repo**: [https://study-buddy-vityarthi.vercel.app](https://study-buddy-vityarthi.vercel.app)
- Vercel will automatically detect your push and rebuild the site.
- **IMPORTANT**: Go to Vercel -> Project Settings -> Environment Variables and add:
  - `VITE_API_BASE`: (Your backend URL from Railway/Ngrok)

### 3. Backend Deployment (Railway.app — Recommended)
1. Go to [Railway.app](https://railway.app) and create a "New Project" from your GitHub repo.
2. **Variables**: In the Railway dashboard, add these keys from your `.env`:
   - `DATABASE_URL`: (Your Neon connection string)
   - `GEMINI_API_KEY`: (Your Google AI key)
   - `JWT_SECRET`: (Your security key)
3. **Detection**: Railway will see the `backend/Procfile` and start the NeuroFlow kernel automatically.

---

## 🛡️ Admin & Security Infrastructure
The Admin Dashboard (`/admin`) is your central command center.
- **Grant Admin**: Run `python make_admin.py` in the backend folder to upgrade your account.
- **Live Monitoring**: View IP-based location logs and webcam sentiment snapshots directly from the panel.

---

## 🎨 Creator Customization
To personalize the **Creator** tab:
1. Replace `public/developer.jpg` with your own photo.
2. The UI will automatically pull your profile data from the `is_admin` user account in the database.

**Full-Stack Status: Operational 🧠✨**
