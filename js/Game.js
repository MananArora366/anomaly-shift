import { Visitor } from "./Visitor.js";
import { DeskStation } from "./DeskStation.js";
import { ShiftManager } from "./ShiftManager.js";

export class AnomalyGame {
  constructor() {
    this.deskStation = new DeskStation();
    this.shiftManager = new ShiftManager();

    this.currentShiftNum = 1;
    this.visitorIndex = 0;
    this.score = 0;
    this.strikes = 0;
    this.correctDecisions = 0;
    this.totalDecisions = 0;
    this.isProcessing = false;
    this.currentVisitor = null;
  }

  init() {
    this.connectControls();
    const activeOfficer =
      sessionStorage.getItem("loggedInOfficer") ||
      localStorage.getItem("loggedInOfficer");
    const lockoutElem = document.getElementById("terminal-lockout");
    const workstationElem = document.getElementById("game-workstation");
    const hudOfficer = document.getElementById("hud-officer");

    if (!activeOfficer) {
      if (lockoutElem) lockoutElem.style.display = "block";
      if (workstationElem) workstationElem.style.display = "none";
      return;
    }

    if (lockoutElem) lockoutElem.style.display = "none";
    if (workstationElem) workstationElem.style.display = "block";
    if (hudOfficer) hudOfficer.textContent = activeOfficer;

    window.addEventListener("keydown", (e) => {
      if (e.repeat) return;
      if (this.isProcessing || !this.currentVisitor) return;

      if (e.code === "KeyA") {
        e.preventDefault();
        this.authorizeVisitor();
      } else if (e.code === "Space") {
        e.preventDefault();
        this.soundAlarm();
      }
    });

    this.loadShift(1);
  }

  connectControls() {
    document.getElementById("btn-auth").addEventListener("click", () => this.authorizeVisitor());
    document.getElementById("btn-alarm").addEventListener("click", () => this.soundAlarm());
    document.getElementById("btn-restart").addEventListener("click", () => this.restartGame());
    const keys = document.querySelectorAll(".phone-numpad .num-btn");
    for (let i = 0; i < keys.length; i++) {
      keys[i].addEventListener("click", (event) => {
        const digit = event.currentTarget.getAttribute("data-digit");
        if (digit === null) this.clearPhone();
        else this.dialPhone(digit);
      });
    }
  }

  loadShift(shiftNum) {
    this.currentShiftNum = shiftNum;
    this.visitorIndex = 0;
    this.isProcessing = false;

    if (shiftNum === 1) {
      this.score = 0;
      this.strikes = 0;
      this.correctDecisions = 0;
      this.totalDecisions = 0;
    }

    const config = this.shiftManager.getShift(shiftNum);
    this.visitors = config.visitors.slice();
    for (let i = this.visitors.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const visitor = this.visitors[i];
      this.visitors[i] = this.visitors[randomIndex];
      this.visitors[randomIndex] = visitor;
    }
    this.shiftManager.applyTheme(shiftNum);
    this.deskStation.renderLogbook(config.logbook);

    this.renderCurrentVisitor();
  }

  renderCurrentVisitor() {
    const rawData = this.visitors[this.visitorIndex];
    this.currentVisitor = new Visitor(rawData);

    this.setDecisionButtonsState(false);
    this.currentVisitor.renderBadge();

    const dialogueElem = document.getElementById("visitor-dialogue");
    if (dialogueElem) {
      dialogueElem.innerHTML = this.currentVisitor.getDialogueHtml();
    }

    this.deskStation.setGateStatus("AWAITING CLEARANCE", "status-awaiting");

    const portrait = document.createElement("span");
    portrait.className = "visitor-sprite";
    portrait.style.backgroundImage = `url("assets/visitors/${this.currentVisitor.portrait}.svg")`;
    const portraitContainer = document.getElementById("visitor-portrait");
    if (portraitContainer) {
      portraitContainer.replaceChildren(portrait);
    }

    this.updateHUD();
  }

  updateHUD() {
    const clockElem = document.getElementById("hud-clock");
    const countElem = document.getElementById("hud-visitor-count");
    const scoreElem = document.getElementById("hud-score");
    const strikesContainer = document.getElementById("hud-strikes");

    const times = [
      ["23:00", "00:15", "01:00", "01:45"],
      ["02:15", "03:00", "03:45", "04:30"],
      ["05:15", "05:45", "06:15", "06:45"],
    ];

    if (clockElem) {
      const timeList = times[this.currentShiftNum - 1];
      clockElem.textContent =
        timeList[Math.min(this.visitorIndex, timeList.length - 1)];
    }

    if (countElem) {
      countElem.textContent = `${this.visitorIndex + 1} / 4`;
    }

    if (scoreElem) {
      scoreElem.textContent = `${Number(this.score).toLocaleString()} PTS`;
    }

    if (strikesContainer) {
      const boxes = strikesContainer.getElementsByClassName("strike-box");
      for (let i = 0; i < boxes.length; i++) {
        if (i < this.strikes) {
          boxes[i].textContent = "[ X ]";
          boxes[i].className = "strike-box text-danger";
        } else {
          boxes[i].textContent = "[   ]";
          boxes[i].className = "strike-box text-success";
        }
      }
    }
  }

  setDecisionButtonsState(disabled) {
    const btnAuth = document.getElementById("btn-auth");
    const btnAlarm = document.getElementById("btn-alarm");
    if (btnAuth) btnAuth.disabled = disabled;
    if (btnAlarm) btnAlarm.disabled = disabled;

    if (
      disabled &&
      document.activeElement &&
      typeof document.activeElement.blur === "function"
    ) {
      document.activeElement.blur();
    }
  }

  authorizeVisitor() {
    this.handleDecision(true);
  }

  soundAlarm() {
    this.handleDecision(false);
  }

  handleDecision(isAuthorizing) {
    if (this.isProcessing || !this.currentVisitor) return;

    this.isProcessing = true;
    this.setDecisionButtonsState(true);

    this.totalDecisions++;
    if (this.currentVisitor.isDecisionCorrect(isAuthorizing)) {
      this.correctDecisions++;
      this.score += 500;
      this.deskStation.setGateStatus("Correct decision (+500 points)", "text-success");
    } else {
      this.strikes++;
      this.deskStation.setGateStatus("Incorrect decision: one strike", "text-danger");
    }
    if (isAuthorizing) {
      this.deskStation.playSound("stamp");
    } else {
      this.deskStation.playSound("alarm");
    }
    const feedback = document.getElementById("visitor-dialogue");
    feedback.textContent = this.currentVisitor.reason;
    this.updateHUD();

    const shift = this.shiftManager.getShift(this.currentShiftNum);
    const lastVisitor = this.visitorIndex + 1 === shift.visitors.length;
    const lastShift = this.currentShiftNum === this.shiftManager.getTotalShifts();
    if (this.strikes === 3 || (lastVisitor && lastShift)) {
      if (this.strikes === 3) {
        feedback.textContent += " Facility lockdown.";
      } else {
        feedback.textContent += " All three shifts complete.";
      }
      this.saveHighScore();
      document.getElementById("btn-restart").hidden = false;
    } else {
      setTimeout(() => this.nextVisitor(), 5000);
    }
  }

  nextVisitor() {
    this.visitorIndex++;
    const shift = this.shiftManager.getShift(this.currentShiftNum);
    if (this.visitorIndex === shift.visitors.length) {
      this.loadShift(this.currentShiftNum + 1);
    } else {
      this.isProcessing = false;
      this.renderCurrentVisitor();
    }
  }

  restartGame() {
    document.getElementById("btn-restart").hidden = true;
    this.loadShift(1);
  }

  saveHighScore() {
    const activeOfficer =
      sessionStorage.getItem("loggedInOfficer") ||
      localStorage.getItem("loggedInOfficer") ||
      "Guest Officer";
    const isGuest =
      sessionStorage.getItem("loggedInOfficer") === "Guest Officer";

    const accuracyPercent =
      this.totalDecisions > 0
        ? Math.round((this.correctDecisions / this.totalDecisions) * 100)
        : 100;
    const accuracyRate = `${accuracyPercent}%`;

    if (isGuest) {
      const guestData = {
        officer: "Guest Officer",
        score: this.score,
        shiftReached: this.currentShiftNum,
        accuracy: accuracyRate,
      };
      sessionStorage.setItem("guestScore", JSON.stringify(guestData));
      return;
    }

    const stored = localStorage.getItem("highScores");
    const scores = stored ? JSON.parse(stored) : [];

    let existing = null;
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].officer === activeOfficer) {
        existing = scores[i];
        break;
      }
    }

    if (!existing) {
      scores.push({
        officer: activeOfficer,
        score: this.score,
        shiftReached: this.currentShiftNum,
        accuracy: accuracyRate,
      });
      localStorage.setItem("highScores", JSON.stringify(scores));
    } else if (this.score > existing.score) {
      existing.score = this.score;
      existing.shiftReached = this.currentShiftNum;
      existing.accuracy = accuracyRate;
      localStorage.setItem("highScores", JSON.stringify(scores));
    }
  }

  dialPhone(digit) {
    if (!this.isProcessing) this.deskStation.dialPhone(digit);
  }

  clearPhone() {
    this.deskStation.clearPhone();
  }
}
