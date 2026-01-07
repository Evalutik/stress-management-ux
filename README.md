# Stress Management UX Prototype 🧘‍♂️⌚

This project is a high-fidelity UX prototype designed to test a remote-controlled "LED Stress Bracelet" concept using a Galaxy Watch, a Smartphone, and a Developer Control Panel.

## 🚀 Concept Overview

The system consists of three parts communicating in real-time via the cloud:
1.  **Developer Page (The Master):** A web dashboard on your PC to manually set stress levels (0-100%).
2.  **Watch Interface (The LED):** A full-screen color display on the Galaxy Watch. It changes color based on the percentage and **sends alerts** when thresholds are hit.
3.  **Phone App (The Dashboard):** A mobile UI that displays simulated stress stats and receives live "High Stress" notifications from the watch.

---

## 🛠 Tech Stack

-   **Frontend:** React (Vite) + TypeScript
-   **Styling:** Vanilla CSS (Rich aesthetics)
-   **Communication:** **Firebase Realtime Database** — Ensures rock-solid 3-way sync even on older browsers (like Galaxy Watch Active 2).
-   **Hosting:** [Vercel](https://vercel.com/) (Free Tier)

---

## 📱 User Workflow (How to Test)

### Step 1: Deployment
-   The app is deployed to a public URL (e.g., `https://stress-prototype.vercel.app`).

### Step 2: Connection Setup
1.  **PC:** Open `https://stress-prototype.vercel.app/dev`. Create a Room ID (e.g., `LAB1`).
2.  **Watch:** Open `https://stress-prototype.vercel.app/watch` and enter `LAB1`.
3.  **Phone:** Open `https://stress-prototype.vercel.app/` and enter `LAB1`.

### Step 3: Simulation
1.  On the **PC (Dev Page)**, move the slider from 0% to 50%.
2.  The **Watch** instantly turns **Yellow**.
3.  When the Watch detects it passed 50%, it sends a signal.
4.  The **Phone** displays a notification: *"Warning: User stress detected at 50%!"*

---

## ✨ Interface Features

### 💻 Developer Page (`/dev`)
-   **Control Level:** Slider (0-100%).
-   **Event Log:** See exactly when the watch triggered a threshold signal.

### 🤳 Phone App (`/`)
-   **Live Sync:** View the same stress percentage set by the dev.
-   **Real-time Alerts:** Reactive UI changes when levels get high.
-   **UX Prototype:** High-fidelity cards for relaxing activities.

### ⌚ Watch "LED" Page (`/watch`)
-   **Zero UI:** Once connected, the screen is just a pure glowing color.
-   **Threshold Signals:** Auto-reports 25%, 50%, 75%, and 100% stress events to the Phone.
-   **Compatibility:** Optimized for Tizen browsers.

---

## 🧪 Technical Notes

**Q: Why not PeerJS?**
The Galaxy Watch Active 2 browser has limited support for WebRTC (PeerJS). Using **Firebase** provides a much more stable connection for user testing, working instantly across any network (WiFi, 4G, or corporate firewall).

**Q: Do I need to pay for Firebase?**
No. We use the **Free Spark Plan**, which is more than enough for thousands of prototype syncs.

---

## 🔥 Firebase Setup (Required for Remote Sync)

To enable real-time sync between devices, you need to create a free Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or use an existing one)
3. Name it something like `stress-prototype`
4. **Enable Realtime Database**:
   - Go to **Build → Realtime Database**
   - Click **Create Database**
   - Choose **"Start in test mode"** (allows read/write for 30 days)
   - Select a region close to you
5. **Get your config**:
   - Go to **Project Settings** (gear icon) → **Your apps**
   - Click the **</>** (Web) icon to add a web app
   - Copy the config values
6. **Create your `.env` file**:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

> **Note:** The `.env` file is gitignored, so your credentials stay safe when pushing to GitHub.


---

## 🚀 Deployment (Vercel)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com/)
3. Import your repository
4. Deploy! (Vite projects are auto-detected)

Your app will be live at `https://your-project.vercel.app`
