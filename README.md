# Anomaly Shift — The Night Inspector

A *Papers, Please*-inspired browser deduction game built with vanilla JavaScript (ES6+), HTML5, and CSS3.

Players act as a night security officer at Checkpoint Terminal 01 (23:00 to 07:00), inspecting visitor credentials against daily registry logbooks, verifying questionable clearances via an internal telephone hotline dialer, and making entry or containment decisions across three escalating shifts.

---

## 🌟 Key Features

* 🛂 **Credential Inspection Gameplay** — Cross-reference visitor ID badges (photo, name, ID number, department, and expiration date) against daily registry logbooks to spot expired credentials, department mismatches, and unlisted impostors.
* 📞 **Interactive Desk Phone & Hotline Clues** — Dial three-digit facility extensions on an authentic terminal keypad to obtain live verbal clearance checks:
  * **Ext 100** — Security Operations (perimeter relief verification)
  * **Ext 204** — Administration (overnight audit scheduling)
  * **Ext 311** — Biochemistry Labs (bio-sample clearance confirmation)
* 👤 **Animated Vector Sprite Sheets** — 11 bespoke character encounters illustrated in crisp SVG with three-frame stepped CSS keyframe animations simulating the physical action of presenting ID badges to the inspection booth.
* 🎲 **Dynamic Replayability** — Implements the **Fisher-Yates shuffle algorithm** on visitor queues to ensure arrival orders vary across playthroughs.
* 🔐 **Cryptographic Password Security** — Authentication in `js/auth.js` leverages the native **Web Crypto API** (`crypto.subtle`) using **PBKDF2 with SHA-256**, random salts, and 100,000 iterations. Includes reserved username collision protection and automatic credential migration.
* 🚨 **Escalating Threat Levels** — Three distinct shifts progressing from standard credential checks (Green Protocol) to amber alert and full bio-containment lockdown (Red Alert), governed by a 3-Strike breach protocol.
* 🏆 **Leaderboards & Guest Access** — Session-based guest trials and persistent officer profiles with accuracy ratings and high-score rankings stored via `localStorage` and `sessionStorage`.
* ⚡ **Zero Runtime Dependencies** — Pure web standards: no external frameworks, bundlers, or heavy game engines. Fast load times and accessible in any modern browser.

---

## 🎮 Controls

| Action | Control | Description |
| :--- | :--- | :--- |
| **Authorize Entry** | Press `[A]` or click button | Clear legitimate staff through the security gate |
| **Emergency Alarm** | Press `[SPACE]` or click button | Sound siren and detain fraudulent impostors |
| **Desk Telephone** | Click numpad keys (`0`-`9`) | Dial 3-digit extensions (`100`, `204`, `311`) |
| **Clear Phone** | Click `*` or `#` | Reset telephone display back to `READY_` |

---

## 📁 Project Structure

```
├── index.html                           # Terminal home & protocol briefing
├── game.html                            # Security inspection workstation HUD
├── login.html                           # Officer authentication & session management
├── register.html                        # New officer profile onboarding
├── rankings.html                        # Facility clearance leaderboard
├── css/
│   └── style.css                        # CSS Grid terminal layout & scanline styling
├── js/
│   ├── auth.js                          # Web Crypto PBKDF2 hashing & session security
│   ├── DeskStation.js                   # Workstation audio, telephone dialer, & logbook DOM
│   ├── ShiftManager.js                  # Shift levels, directives, & visitor roster schedules
│   ├── Visitor.js                       # OOP visitor model & discrepancy verification
│   ├── Game.js                          # Main game orchestrator & decision evaluation
│   ├── app.js                           # Unobtrusive event bindings & UI controllers
│   └── start.js                         # Application bootstrap entry point
├── assets/
│   ├── logo.svg                         # Vector brand emblem
│   ├── surveillance_bg.jpg              # Atmospheric surveillance backdrop
│   ├── sounds/                          # Audio effects (alarm, stamp, keypad beep)
│   └── visitors/                        # 11 animated character SVG sprite sheets
└── Anomaly Shift - Portfolio Demo.mp4   # Video demonstration of gameplay mechanics
```

---

## 🚀 Running Locally

No package managers or build steps required. Simply clone the repository and open `index.html` in any browser:

```bash
git clone https://github.com/MananArora366/anomaly-shift.git
cd anomaly-shift
```

To run with a lightweight local web server (recommended for module script loading):

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .
```

Then visit `http://localhost:8000` in your browser.

---

## 👨‍💻 Author

**Manan Arora**  
BSc (Hons) Artificial Intelligence & Data Science, Middlesex University Dubai  
* [LinkedIn](https://www.linkedin.com/in/manan-arora-301210424)
* [GitHub](https://github.com/MananArora366)
