# Anomaly Shift — Complete Coursework 1 Code Guide
**Module:** CST 2120 Web Applications and Databases (Coursework 1)  
**Student:** Manan Arora (ID: M01100121)  
**Tutor:** Dr. Sumitra Kotipalli | **Lecturer:** David Gamez  
**Folder:** `anomaly-shift/` (Final Submission Version)

---

## 1. Project & Architecture Overview

*Anomaly Shift: The Night Inspector* is a 5-page *Papers, Please*-inspired browser application where the user plays a night security guard inspecting visitor credentials between 23:00 and 07:00 across three progressive shift levels.

| File | Type | Lines | Purpose & Features |
| :--- | :--- | :--- | :--- |
| `index.html` | HTML | ~70 | Home landing page introducing the game story, security directives, and feature cards. |
| `game.html` | HTML | ~160 | Security workstation: Authentication lockout gate, HUD stats, shift directive banner, observation window, 3-column desk (Badge, Logbook table, Phone keypad), and action dock. |
| `rankings.html` | HTML | ~65 | Dynamic leaderboard displaying registered officers, accuracy, and top scores loaded from `localStorage`. |
| `login.html` | HTML | ~90 | Officer login terminal with "Remember Me" checkbox, active session banner, and logout button. |
| `register.html` | HTML | ~90 | Officer registration capturing basic credentials and additional contact data (Phone & Address). |
| `css/style.css` | CSS | ~200 | Single shared stylesheet with retro surveillance booth theme, 3-column desk grid, and zero inline styles. |
| `js/Visitor.js` | JS Class | ~30 | Class representing arriving checkpoint visitors (credentials, dialogue, anomaly status, defect reason). |
| `js/AudioManager.js` | JS Class | ~40 | Class managing sound effects (`alarm.mp3`, `stamp.mp3`, `beep.mp3`). |
| `js/SurveillanceEngine.js` | JS Class | ~190 | Third-party Phaser 3 Game Engine controller managing viewport canvas, visitor animations, radar sweep, and visual effects. (5 Marks) |
| `js/Game.js` | JS Class | ~360 | Main game controller module managing 3 shift levels, 4 visitors per shift, scoring, strikes, telephone dialer, and high score storage. |
| `js/app.js` | JS Module | ~175 | Authentication controller (`registerUser`, `loginUser`, `logoutUser`, `checkSession`, `renderRankings`). |
| `js/phaser.min.js` | Library | — | Third-party Phaser 3 game engine library loaded locally for 100% offline reliability. |
| `assets/sounds/` | Audio | — | Lightweight sound effects (`alarm.mp3`, `stamp.mp3`, `beep.mp3`). |
| `assets/surveillance_bg.jpg` | Image | — | Retro dark security monitoring room wallpaper. |

---

## 2. Master Function & Event Call Map (Where Everything is Called)

| Function / Method | Defined In | Line Numbers | Called From (HTML / JS File) | Trigger / HTML Element | Exact Calling Line |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`new Game()`** | `js/Game.js` | Lines 70–105 | `game.html` | `<script type="module">` on page load | Line 163 |
| **`game.authorize()`** | `js/Game.js` | Line 234 | `game.html`<br>`js/Game.js` | `<button onclick="game.authorize()">`<br>Keyboard shortcut `KeyA` | Line 147 (HTML)<br>Line 100 (JS) |
| **`game.soundAlarm()`** | `js/Game.js` | Line 235 | `game.html`<br>`js/Game.js` | `<button onclick="game.soundAlarm()">`<br>Keyboard shortcut `Space` | Line 146 (HTML)<br>Line 101 (JS) |
| **`game.dial(digit)`** | `js/Game.js` | Lines 238–264 | `game.html` | `<button onclick="game.dial('1')">` (Keypad 0-9) | Lines 120–130 |
| **`game.clearPhone()`** | `js/Game.js` | Lines 266–271 | `game.html` | `<button onclick="game.clearPhone()">` (`*` and `#`) | Lines 129, 131 |
| **`game.restartGame()`**| `js/Game.js` | Lines 107–109 | `js/Game.js` | Lockdown message restart button | Line 336 |
| **`registerUser()`** | `js/app.js` | Lines 8–53 | `register.html`| `<button onclick="registerUser()">` | Line 87 |
| **`loginUser()`** | `js/app.js` | Lines 56–94 | `login.html` | `<button onclick="loginUser()">` | Line 88 |
| **`checkSession()`** | `js/app.js` | Lines 108–199 | All HTML pages | `<body onload="checkSession()">` | Line 10 (across pages) |
| **`logoutUser()`** | `js/app.js` | Lines 97–105 | All HTML pages | `<button onclick="logoutUser()">` | Line 36 (login/index) & navbar |
| **`toggleMute()`** | `js/app.js` | Lines 202–206 | `index.html` | `<button onclick="toggleMute()">` | Line 32 |
| **`renderRankings()`** | `js/app.js` | Lines 224–251 | `rankings.html`| `<body onload="renderRankings(); checkSession();">` | Line 10 |

---

## 3. Advanced JavaScript: Classes & Modules (Week 7 Curriculum — 10 Marks)

The game architecture adheres strictly to David Gamez's Advanced JavaScript lecture specifications, earning the full 10 marks allocated for Classes and Modules:

### A. Modular ES6 Separation (`import` / `export`)
* In `game.html`, the entire game is started using a concise 4-line module script:
  ```html
  <script type="module">
    import { Game } from './js/Game.js';
    const game = new Game();
    window.game = game;
  </script>
  ```
* This fulfills the rubric requirement: *"Award full marks if all game code is in separate modules that are imported into the game page. The script on the game page should import and run the main game module."*

### B. Class Organization
* **`Visitor` Class (`js/Visitor.js`):** Encapsulates visitor attributes: `name`, `id`, `dept`, `expiry`, `status`, `isAnomaly`, `dialogue`, and `anomalyReason`.
* **`AudioManager` Class (`js/AudioManager.js`):** Encapsulates HTML5 Audio playback methods: `playAlarm()`, `playStamp()`, and `playBeep()`.
* **`SurveillanceEngine` Class (`js/SurveillanceEngine.js`):** Encapsulates the third-party Phaser 3 game engine scene, camera grid, visitor sprite tweens, laser scanner, and decision visual effects.
* **`Game` Class (`js/Game.js`):** Encapsulates the core game loop, progressive shift levels, scoring, strikes HUD, telephone hotline evaluation, and storage persistence.

---

## 4. Third-Party Game Engine Integration: Phaser 3 (5 Marks)

Per the rubric requirement (*"5 marks. Game Engine. Game is implemented with third-party game engine, such as Babylon or Phaser. To get full marks all game graphics must be implemented with the game engine. A game engine written by the student does not count"*):
* **Engine Used:** **Phaser 3** (loaded from `js/phaser.min.js` for 100% offline grading reliability).
* **Class Controller:** `SurveillanceEngine` (`js/SurveillanceEngine.js`) instantiates `new Phaser.Game()`.
* **What Phaser Renders:**
  1. **Surveillance Camera Grid & Scanner Beam:** Draws animated radar grid lines and an animated vertical laser scan beam sweeping across the visitor.
  2. **Visitor Humanoid Sprite & Animations:** Renders the approaching visitor figure with an entrance walk-in tween (`Power2` ease) and continuous idle breathing animation (`Sine.easeInOut`).
  3. **Visual Decision FX:**
     * **Authorized:** Displays an animated holographic green `[ CLEARANCE GRANTED ]` stamp and animates the visitor walking through the security gate to the right.
     * **Alarm:** Flashes a red emergency alert overlay across the camera feed with `[ ! ANOMALY CONTAINED ! ]`.
  4. **Dynamic Shift Theming:** Updates camera feed HUD labels and color palettes across Shift 1 (Normal Green), Shift 2 (Amber Alert), and Shift 3 (Red Alert Containment).

---

## 4. Multiple Levels & Progressive Difficulty (5 Marks)

Per the rubric requirement (*"Only give full marks if the levels are significantly different from each other. Higher marks can be awarded if the environment changes with each level"*), the game features three distinct, progressive shifts with **4 visitors per shift (12 visitors total)**:

### Shift 1: Standard Protocol (23:00 – 02:00)
* **Environment:** Baseline dark surveillance terminal.
* **Security Directive:** Verify ID badge expiration dates against the facility logbook year (**1987**).
* **Roster (4 Visitors):**
  1. `Elias Voss` (Maintenance) &mdash; Expiry `11/1988`: Legitimate staff &rarr; **Authorize [A]** (+500 PTS).
  2. `Marcus Chen` (Administration) &mdash; Expiry `10/1986`: Expired by 1 year &rarr; **Alarm [SPACE]** (+500 PTS).
  3. `Sarah Jenkins` (Medical) &mdash; Expiry `09/1988`: Legitimate staff &rarr; **Authorize [A]** (+500 PTS).
  4. `Raymond Cruz` (Security) &mdash; Expiry `04/1985`: Expired badge &rarr; **Alarm [SPACE]** (+500 PTS).

### Shift 2: Elevated Alert (02:00 – 05:00)
* **Environment:** Amber alert lighting overlay (`.guard-desk.shift-amber`).
* **Security Directive:** Unlisted visitors require verbal phone clearance. Use the **desk telephone dialer** to call department hotlines before making a gate decision.
* **Hotline Directory:** `100` Security | `204` Admin | `311` Medical/Research.
* **Roster (4 Visitors):**
  1. `Dr. Aris Thorne` (Research, unlisted) &mdash; Dial `311` &rarr; *"Dr. Thorne authorized"* &rarr; **Authorize [A]**.
  2. `Officer Vance` (Security, unlisted) &mdash; Dial `100` &rarr; *"No relief dispatched. Impostor!"* &rarr; **Alarm [SPACE]**.
  3. `Clara Oswald` (Admin, unlisted) &mdash; Dial `204` &rarr; *"Clara Oswald cleared for audit"* &rarr; **Authorize [A]**.
  4. `Elena Rostova` (Maintenance) &mdash; Listed on daily logbook &rarr; **Authorize [A]**.

### Shift 3: Red Alert (05:00 – 07:00)
* **Environment:** Red alert flashing emergency lighting overlay (`.guard-desk.shift-red`).
* **Security Directive:** Cross-reference badge clearance codes against department logs, and watch for duplicate identity clones!
* **Roster (4 Visitors):**
  1. `Viktor Haas` (Research) &mdash; Badge says Research, but logbook code is `MNT-2 (MAINT)` &rarr; **Alarm [SPACE]**.
  2. `Maya Lin` (Medical) &mdash; Director of toxicology matching `M-1 (MED)` &rarr; **Authorize [A]**.
  3. `Subject 09` (Maintenance) &mdash; Posing as Elias Voss (who already entered in Shift 1) &rarr; **Alarm [SPACE]**.
  4. `Dr. Isaac Sterling` (Executive) &mdash; Facility Director matching `A-1 (EXEC)` &rarr; **Authorize [A]**.

---

## 5. Security Protocols, Feedback & UX

1. **Authentication Gate (`#terminal-lockout`):**
   * If a user tries to access `game.html` without logging in, the game workstation is completely hidden, and a locked terminal message prompts them to log in or register.
2. **On-Screen Security Directive Banner (`#shift-directive`):**
   * A dynamic banner sits right above the guard desk instructing the player what specific rule applies to the active shift.
3. **Instant Feedback with Defect Reasons:**
   * When a decision is made, the gate status and dialogue box clearly explain *why* points were awarded or why a strike was issued (e.g. `"BREACH: ANOMALY ADMITTED! (STRIKE 1/3) - Marcus Chen's badge expired in 10/1986 (Current year: 1987)"`).
4. **Clean Restart Guarantee (`restartGame()`):**
   * When Shift 1 is started or restarted after game over, `strikes` and `score` are reliably reset to `0`, clearing all HUD strike boxes back to `[   ] [   ] [   ]`.

---

## 6. Sensory Sound Effects (2.5 Marks)

Lightweight sound effects execute in direct response to user interactions:
* **Emergency Alarm (`assets/sounds/alarm.mp3`):** Warning siren tone playing upon pressing `[SPACE]` or clicking **EMERGENCY ALARM**.
* **Clearance Stamp (`assets/sounds/stamp.mp3`):** Mechanical stamp click playing upon pressing `[A]` or clicking **AUTHORIZE ENTRY**.
* **Keypad Beep (`assets/sounds/beep.mp3`):** DTMF telephone tone playing upon pressing buttons on the 3x4 telephone numpad.

---

## 7. Dynamic Rankings & High-Score Preservation Rule (10 Marks)

The rankings subsystem fulfills all criteria under the Rankings rubric:
1. **Dynamic Generation:** When `rankings.html` loads, `renderRankings()` queries `localStorage.getItem("highScores")`, sorts entries descending by score, and injects `<tr>` and `<td>` elements into `#rankings-tbody`.
2. **The High-Score Preservation Check (Crucial Rubric Rule):**
   ```javascript
   if (!existingUserRecord) {
       scoresArray.push(newScoreRecord);
       localStorage.setItem("highScores", JSON.stringify(scoresArray));
   } else if (this.score > existingUserRecord.score) {
       existingUserRecord.score = this.score;
       localStorage.setItem("highScores", JSON.stringify(scoresArray));
   }
   ```
   If a returning officer achieves a lower score on a subsequent shift, their existing top score is safely preserved.

---

## 8. User Accounts, Validation & Session Management (20 Marks)

* **Basic Credentials (5 Marks):** Username and password.
* **Additional Profile Data (5 Marks):** Contact Phone Number (+2.5) and Workstation Address (+2.5).
* **Zero Alerts Rule:** All authentication and validation feedback is rendered on-page via `#login-msg` and `#reg-msg`.
* **Zero Forms Rule:** All inputs are contained within `<div>` containers to avoid default HTTP form submission page reloads.
* **Session Persistence:** Active session state tracking (`"loggedInOfficer"`) with a dedicated **LOGOUT OFFICER** button, plus a persistent **Remember Me** preference.
* **Zero Inline Styles Rule:** All HTML files have zero inline `style="..."` attributes, adhering to the coursework design specifications.

---

## 9. Viva Q&A Script (Questions & Answers)

### Q1: "How is your game code organized?"
> **Answer:**  
> *"Our game code is organized using ES6 modules and classes. In `game.html`, a lightweight module script imports the main `Game` class from `js/Game.js`. The `Game` class manages the shift progression, scoring, and UI, while collaborating with a `Visitor` class (in `Visitor.js`) and an `AudioManager` class (in `AudioManager.js`)."*

### Q2: "How do your multiple levels differ from each other?"
> **Answer:**  
> *"The game features three distinct shifts with 4 visitors each. In Shift 1, the user does basic credential and expiration date verification. In Shift 2, the booth shifts to amber lighting and introduces unlisted visitors requiring hotline telephone dialing (Security 100, Admin 204, Medical 311). In Shift 3, the booth shifts to red alert and features subtle department code mismatches and clone impersonators."*

### Q3: "What prevents someone from playing the game without logging in?"
> **Answer:**  
> *"In `Game.js`, the constructor verifies `localStorage.getItem('loggedInOfficer')`. If no officer session exists, it displays the `#terminal-lockout` container, hides the game workstation, and halts execution until the officer logs in or registers."*

### Q4: "How does the rankings system update high scores?"
> **Answer:**  
> *"When a shift concludes, `saveHighScore()` checks `localStorage` for the officer's existing high score. It only updates the stored record if `newScore > storedHighScore`. On `rankings.html`, `renderRankings()` dynamically creates table rows from `localStorage` data."*

### Q5: "Where are sound effects triggered?"
> **Answer:**  
> *"Sound effects are triggered by user actions via `AudioManager`: pressing Authorize plays a mechanical stamp sound, sounding the alarm plays an emergency siren, and dialing telephone buttons plays keypad tones."*

### Q6: "Why are there no `<form>` tags or `alert()` popups in authentication?"
> **Answer:**  
> *"Per the marking guidelines, `alert()` popups result in zero marks for validation, so we output on-page feedback via `#login-msg` and `#reg-msg`. Similarly, `<form>` tags cause default HTTP page reloads, so we wrap inputs in `<div>` containers to let JavaScript read `.value` smoothly."*
