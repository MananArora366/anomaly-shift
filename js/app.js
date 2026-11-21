function showAccountPanel(formId, panelId, nameId, activeOfficer) {
  const form = document.getElementById(formId);
  const panel = document.getElementById(panelId);
  const name = document.getElementById(nameId);

  if (!form || !panel) return;
  if (activeOfficer) {
    form.style.display = "none";
    panel.style.display = "block";
    if (name) name.textContent = activeOfficer;
  } else {
    form.style.display = "block";
    panel.style.display = "none";
  }
}

function checkSession() {
  const activeOfficer = getActiveOfficer();
  const isRegistered = isRegisteredOfficer();
  const sessionPanel = document.getElementById("session-panel");
  const sessionUsername = document.getElementById("session-username");

  if (sessionPanel && sessionUsername) {
    if (activeOfficer !== null) {
      sessionUsername.textContent = activeOfficer;
      sessionPanel.style.display = "block";
    } else {
      sessionPanel.style.display = "none";
    }
  }

  const navRankings = document.getElementById("nav-rankings");
  const navLogin = document.getElementById("nav-login");
  const navRegister = document.getElementById("nav-register");
  const navLogout = document.getElementById("nav-logout");

  if (navRankings) navRankings.style.display = "inline-block";

  if (activeOfficer) {
    if (navLogin) navLogin.style.display = "none";
    if (navRegister) navRegister.style.display = "none";
    if (navLogout) navLogout.style.display = "inline-block";
  } else {
    if (navLogin) navLogin.style.display = "inline-block";
    if (navRegister) navRegister.style.display = "inline-block";
    if (navLogout) navLogout.style.display = "none";
  }

  const lockoutElem = document.getElementById("terminal-lockout");
  const workstationElem = document.getElementById("game-workstation");
  if (lockoutElem && workstationElem) {
    if (!activeOfficer) {
      lockoutElem.style.display = "block";
      workstationElem.style.display = "none";
    } else {
      lockoutElem.style.display = "none";
      workstationElem.style.display = "block";
    }
  }

  const rankingsContent = document.getElementById("rankings-content");
  if (lockoutElem && rankingsContent) {
    if (!isRegistered) {
      lockoutElem.style.display = "block";
      rankingsContent.style.display = "none";
    } else {
      lockoutElem.style.display = "none";
      rankingsContent.style.display = "block";
    }
  }

  const guestActions = document.getElementById("hero-actions-guest");
  const authActions = document.getElementById("hero-actions-auth");
  const welcomeGreeting = document.getElementById("hero-welcome-msg");

  if (guestActions && authActions) {
    if (activeOfficer) {
      guestActions.style.display = "none";
      authActions.style.display = "flex";
      if (welcomeGreeting) {
        const officerName = document.createElement("strong");
        officerName.textContent = "Welcome, Officer " + activeOfficer + "!";
        welcomeGreeting.replaceChildren(
          officerName,
          " Your terminal clearance is verified. You are authorized to begin your security shift.",
        );
      }
    } else {
      guestActions.style.display = "flex";
      authActions.style.display = "none";
      if (welcomeGreeting) {
        welcomeGreeting.textContent =
          "Work as a night security guard at a research facility booth from 23:00 to 07:00. Please log in or register below to access the terminal and start the game.";
      }
    }
  }

  showAccountPanel("login-auth-box", "already-logged-in-panel", "logged-in-name", activeOfficer);
  showAccountPanel("register-auth-box", "register-already-logged-in", "reg-logged-in-name", activeOfficer);

  const remembered = localStorage.getItem("rememberedUsername");
  const usernameInput = document.getElementById("login-username");
  const rememberBox = document.getElementById("login-remember");
  if (remembered && usernameInput && rememberBox) {
    usernameInput.value = remembered;
    rememberBox.checked = true;
  }
}

function renderRankings() {
  const isRegistered = isRegisteredOfficer();
  const isGuest = isGuestOfficer();
  const lockoutElem = document.getElementById("terminal-lockout");
  const rankingsContent = document.getElementById("rankings-content");
  const tbody = document.getElementById("rankings-tbody");

  if (!isRegistered && !isGuest) {
    if (lockoutElem) {
      lockoutElem.style.display = "block";
      const badgeElem = lockoutElem.querySelector(".lockout-badge");
      const titleElem = lockoutElem.querySelector(".lockout-title");
      const msgElem = lockoutElem.querySelector(".lockout-msg");
      if (badgeElem)
        badgeElem.textContent = "SECURITY PROTOCOL // TERMINAL 01 RESTRICTED";
      if (titleElem) titleElem.textContent = "OFFICER CLEARANCE REQUIRED";
      if (msgElem)
        msgElem.textContent =
          "Facility high score and shift clearance records are restricted. An active security officer session is required to view facility performance archives.";
    }
    if (rankingsContent) rankingsContent.style.display = "none";
    return;
  }

  if (isGuest) {
    if (lockoutElem) {
      lockoutElem.style.display = "block";
      const badgeElem = lockoutElem.querySelector(".lockout-badge");
      const titleElem = lockoutElem.querySelector(".lockout-title");
      const msgElem = lockoutElem.querySelector(".lockout-msg");
      if (badgeElem)
        badgeElem.textContent = "DATA PRIVACY PROTOCOL // GUEST RESTRICTION";
      if (titleElem)
        titleElem.textContent = "PERSONNEL DOSSIER ACCESS RESTRICTED";
      if (msgElem) {
        const guestScoreData = sessionStorage.getItem("guestScore");
        let scoreInfo = "";
        if (guestScoreData) {
          try {
            const parsed = JSON.parse(guestScoreData);
            const guestShift =
              parsed.shiftReached || parsed.shiftsSurvived || 1;
            scoreInfo =
              "<br><br><span class='text-success'>Your Current Temporary Session Score: <strong>" +
              Number(parsed.score).toLocaleString() +
              " PTS</strong> (Shift reached: " +
              guestShift +
              ")</span>";
          } catch (e) {}
        }
        msgElem.innerHTML =
          "Guest sessions are restricted from viewing registered facility officer records to prevent unauthorized personnel data access. Please register an official officer account to join the permanent leaderboard." +
          scoreInfo;
      }
    }
    if (rankingsContent) rankingsContent.style.display = "none";
    return;
  }

  if (lockoutElem) lockoutElem.style.display = "none";
  if (rankingsContent) rankingsContent.style.display = "block";
  if (!tbody) return;

  const storedScores = localStorage.getItem("highScores");
  const scores = storedScores ? JSON.parse(storedScores) : [];

  if (scores.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="rankings-empty">NO SHIFTS RECORDED YET. LOG IN AND PLAY THE GAME TO RECORD YOUR SCORE.</td></tr>';
    return;
  }

  scores.sort((a, b) => b.score - a.score);

  tbody.innerHTML = "";
  for (let i = 0; i < scores.length; i++) {
    const tr = document.createElement("tr");
    const rankNum = i + 1;
    const badgeClass = rankNum === 1 ? ' class="rank-badge"' : "";
    const shiftVal = scores[i].shiftReached || scores[i].shiftsSurvived || 1;
    const accuracyVal =
      scores[i].accuracy !== undefined && scores[i].accuracy !== null
        ? scores[i].accuracy
        : "Unavailable";
    tr.innerHTML =
      "<td><span" +
      badgeClass +
      ">#" +
      rankNum +
      "</span></td>" +
      "<td><strong></strong></td><td></td><td></td>" +
      '<td><span class="score-gold"></span></td>';
    tr.cells[1].firstElementChild.textContent = scores[i].officer;
    tr.cells[2].textContent = "Shift " + shiftVal;
    tr.cells[3].textContent = accuracyVal;
    tr.cells[4].firstElementChild.textContent =
      Number(scores[i].score).toLocaleString() + " PTS";
    tbody.appendChild(tr);
  }
}

function bindAccountSubmit(buttonId, inputSelector, submit) {
  const button = document.getElementById(buttonId);
  if (button) button.addEventListener("click", submit);

  const inputs = document.querySelectorAll(inputSelector);
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    });
  }
}

function bindAppEvents() {
  const logoutButtons = document.querySelectorAll(
    ".nav-logout-btn, .btn-logout",
  );
  for (let i = 0; i < logoutButtons.length; i++) {
    logoutButtons[i].addEventListener("click", logoutUser);
  }

  const guestTriggers = document.querySelectorAll(
    ".btn-guest, .btn-play-guest, #hero-play-guest, #lockout-guest-btn",
  );
  for (let i = 0; i < guestTriggers.length; i++) {
    guestTriggers[i].addEventListener("click", loginGuest);
  }

  bindAccountSubmit(
    "btn-register",
    "#reg-username, #reg-password, #reg-phone, #reg-address",
    registerUser,
  );
  bindAccountSubmit("btn-login", "#login-username, #login-password", loginUser);
}

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  bindAppEvents();
  if (document.getElementById("rankings-tbody")) {
    renderRankings();
  }
});
