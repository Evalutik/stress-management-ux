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

> [!IMPORTANT]
> **For notifications to appear on the Phone**, the Watch, User app, and Dev dashboard must be connected to the same Room ID. The Watch is responsible for detecting threshold crossings and sending alerts. Without the Watch connected, stress levels will update but no notifications will trigger.

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

Follow these exact settings to host the prototype for free on Vercel.

### 1. Project Configuration
When importing your project in Vercel, ensure these settings are correct:

- **Framework Preset:** `Vite` (Should be auto-detected)
- **Root Directory:** `.` (Leave default / empty)
  > *Note: Only change this if your project is inside a subfolder of your repo.*
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### 2. Environment Variables (CRITICAL)
You **MUST** add your Firebase configuration here for the app to work.
Expand the **Environment Variables** section and add the following from your local `.env` file:

| Key | Value Source |
|-----|--------------|
| `VITE_FIREBASE_API_KEY` | Your `.env` file |
| `VITE_FIREBASE_AUTH_DOMAIN` | Your `.env` file |
| `VITE_FIREBASE_DATABASE_URL` | Your `.env` file |
| `VITE_FIREBASE_PROJECT_ID` | Your `.env` file |
| `VITE_FIREBASE_STORAGE_BUCKET` | Your `.env` file |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your `.env` file |
| `VITE_FIREBASE_APP_ID` | Your `.env` file |

### 3. Deploy
Click **Deploy**. Your app will be live in ~1 minute.

### Logic Behind Settings:
- **Root Directory:** Since your `package.json` is in the root of the repo, this should be left as default (`./`).
- **Build Command:** `npm run build` runs the `tsc -b && vite build` script defined in your `package.json`, which compiles TypeScript and builds for production.
- **Output Directory:** Vite defaults to `dist` for the production build.
- **Install Command:** We use `npm` in this project (as seen by `package-lock.json`), so `npm install` is the correct choice.

> [!NOTE]
> `vercel.json` file inthe project root automatically detected by Vercel and handles **SPA Rewrites**. It ensures that when you refresh a page like `/dev` or `/watch`, Vercel doesn't look for a specific html file but instead serves `index.html` so React Router can handle the destination. **You do not need to configure this manually.**
---

## 🔗 Live URLs

Once deployed, your routes will be:
-   **Main Dashboard:** `https://your-app.vercel.app/`
-   **Watch Sync:** `https://your-app.vercel.app/watch`
-   **Developer Panel:** `https://your-app.vercel.app/dev`

> [!TIP]
> Use the **Add to Home Screen** feature on your phone and watch browser to make the prototype feel like a native app!

