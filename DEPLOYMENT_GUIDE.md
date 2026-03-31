# AI Vityarthi: Deployment & Admin Guide

## 🚀 Live Production Links
- **Frontend (Vercel)**: [https://study-buddy-vityarthi.vercel.app](https://study-buddy-vityarthi.vercel.app)
- **Codebase (GitHub)**: [https://github.com/Amazingdude1525/Study_Buddy](https://github.com/Amazingdude1525/Study_Buddy)

---

This guide provides the necessary steps to manage the study environment and the backend kernel.

### 1. Prerequisites
Ensure the following are installed on the host machine:
- **Node.js 18+** (for the Vite frontend)
- **Python 3.10+** (for the FastAPI backend)
- **GCC / G++ Compiler** (Required for the C/C++ Code Terminal)

### 2. Physical Setup
1. **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python -m uvicorn main:app --host 0.0.0.0 --port 8000
   ```
2. **Frontend**:
   ```bash
   npm install
   npm run build
   # For local preview:
   npm run dev
   ```

### 3. Environment Variables
Ensure the `.env` files contain your specific API keys:
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth 2.0 Client ID.
- `DATABASE_URL`: Location for your SQLite/Postgres DB.

---

## 🌐 Running on Other Systems

### 1. Same Network (LAN) Access
To allow your friends or other devices on your Wi-Fi to access the site:
1. **Backend**: Start with `--host 0.0.0.0`:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
2. **Frontend**: Start with `--host`:
   ```bash
   npm run dev -- --host
   ```
3. **Access**: Others can use your computer's IP address (e.g., `http://192.168.1.10:5173`).

### 2. Internet Access (The "Easy" Way)
Use a tunnel like **Ngrok** to get a public URL for free:
1. Install Ngrok.
2. Run `ngrok http 5173` for the frontend.
3. Run `ngrok http 8000` for the backend.
*Note: You will need to update the `API_BASE` in `src/services/api.ts` to match the backend's Ngrok URL.*

### 3. Professional Deployment (Full Production)
- **Frontend**: Deploy the `dist` folder to **Vercel** or **Netlify**.
- **Backend (Recommended)**: Deploy your code to **[Railway.app](https://railway.app)**. 
  - Just click "New" -> "GitHub Repo" -> select `Study_Buddy`.
  - It will automatically detect the `backend/Procfile` and start the server!
- **Alternatively**: Use Render or a VPS.

---

## 🛡️ Admin Panel & Controls

The Admin Panel is a restricted zone for monitoring user activity, location data, and system logs.

### 1. Accessing the Panel
- **URL**: Navigate directly to `http://localhost:5173/admin`.
- **Authentication**: You must be logged in with an account that has `is_admin=true` in the database.

### 2. Key Features
- **User Monitoring**: View a list of all registered scholars and their study streaks.
- **Location Logs**: Access IP-based location data captured during login/focus sessions.
- **Webcam Snapshots**: If configured, view the periodic sentiment analysis snapshots used to verify focus.
- **System Logs**: Live feed of the "Kernel" activity (code compilation attempts and AI advisor calls).

---

## 🎨 Social Customization (Creator Tab)
To update your photo in the **Creator** (`/about`) page:
1. Save your headshot as `developer.jpg` in the `public/` directory.
2. Your LinkedIn and GitHub links are already hardcoded to your provided profiles.
