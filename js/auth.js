const RESERVED_USERNAMES = [
  "users",
  "highscores",
  "loggedinofficer",
  "rememberedusername",
  "guestscore",
  "gamemuted",
  "loglevel",
  "guest officer",
];

function getActiveOfficer() {
  return (
    sessionStorage.getItem("loggedInOfficer") ||
    localStorage.getItem("loggedInOfficer")
  );
}

function isRegisteredOfficer() {
  return localStorage.getItem("loggedInOfficer") !== null;
}

function isGuestOfficer() {
  return (
    sessionStorage.getItem("loggedInOfficer") === "Guest Officer" &&
    !isRegisteredOfficer()
  );
}

function readOfficers() {
  const stored = localStorage.getItem("users");
  if (stored === null) return [];
  return JSON.parse(stored);
}

function getStoredOfficer(username) {
  const officers = readOfficers();
  for (let i = 0; i < officers.length; i++) {
    if (officers[i].username === username) return officers[i];
  }
  return null;
}

const PASSWORD_ITERATIONS = 600000;
let registrationInProgress = false;
let loginInProgress = false;

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"],
  );
  const hash = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    hash: "SHA-256",
    salt: Uint8Array.from(atob(salt), (character) => character.charCodeAt(0)),
    iterations: PASSWORD_ITERATIONS,
  }, key, 256);
  return btoa(String.fromCharCode(...new Uint8Array(hash)));
}

async function createPasswordRecord(password) {
  const salt = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(16))));
  return { passwordSalt: salt, passwordHash: await hashPassword(password, salt) };
}

async function upgradeStoredPasswords() {
  for (const officer of readOfficers()) {
    if (typeof officer.password !== "string") continue;

    const credentials = await createPasswordRecord(officer.password);
    const officers = readOfficers();
    const stored = officers.find((entry) => entry.username === officer.username);
    if (!stored || stored.password !== officer.password) continue;
    if (typeof stored.passwordHash !== "string") Object.assign(stored, credentials);
    delete stored.password;
    localStorage.setItem("users", JSON.stringify(officers));
  }
}

const passwordUpgrade = upgradeStoredPasswords().catch(() => {
  console.warn("Saved password upgrade failed. Reload on localhost or HTTPS to retry.");
});

async function registerUser() {
  if (registrationInProgress) return;
  const userField = document.getElementById("reg-username");
  const passField = document.getElementById("reg-password");
  const phoneField = document.getElementById("reg-phone");
  const addrField = document.getElementById("reg-address");
  const msgBox = document.getElementById("reg-msg");

  if (!userField || !passField || !phoneField || !addrField || !msgBox) return;

  const username = userField.value.trim();
  const password = passField.value;
  const phone = phoneField.value.trim();
  const address = addrField.value.trim();

  if (username === "" || password === "" || phone === "" || address === "") {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: All fields are required.";
    return;
  }

  if (password.length < 4) {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Password must be at least 4 characters long.";
    return;
  }

  const digitsOnly = phone.replace(/\D/g, "");
  const phoneFormatValid = /^\+?[\d\s\-()]+$/.test(phone);

  if (!phoneFormatValid || digitsOnly.length < 9) {
    msgBox.className = "text-danger";
    msgBox.textContent =
      "Error: Please enter a valid contact phone number (at least 9 digits).";
    return;
  }

  if (RESERVED_USERNAMES.includes(username.toLowerCase())) {
    msgBox.className = "text-danger";
    msgBox.textContent =
      "Error: This username is reserved by the system. Please choose another.";
    return;
  }

  if (getStoredOfficer(username) !== null) {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Officer username already exists.";
    return;
  }

  registrationInProgress = true;
  try {
    const credentials = await createPasswordRecord(password);
    const officers = readOfficers();
    if (officers.some((officer) => officer.username === username)) {
      msgBox.className = "text-danger";
      msgBox.textContent = "Error: Officer username already exists.";
      return;
    }
    officers.push({ username, phone, address, ...credentials });
    localStorage.setItem("users", JSON.stringify(officers));
  } catch {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Could not save your password. Open the site on localhost or HTTPS and try again.";
    return;
  } finally {
    registrationInProgress = false;
  }

  msgBox.className = "text-success";
  msgBox.textContent = "Success: Account created! You can now log in.";

  userField.value = "";
  passField.value = "";
  phoneField.value = "";
  addrField.value = "";
}

async function loginUser() {
  if (loginInProgress) return;
  const userField = document.getElementById("login-username");
  const passField = document.getElementById("login-password");
  const msgBox = document.getElementById("login-msg");

  if (!userField || !passField || !msgBox) return;

  const username = userField.value.trim();
  const password = passField.value;

  if (username === "" || password === "") {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Please enter both username and password.";
    return;
  }

  let passwordMatches;
  loginInProgress = true;
  try {
    await passwordUpgrade;
    const officer = getStoredOfficer(username);
    if (officer === null) {
      msgBox.className = "text-danger";
      msgBox.textContent = "Error: Officer record not found. Please register.";
      return;
    }
    if (typeof officer.passwordHash !== "string") {
      throw new Error("Saved password upgrade is required.");
    }
    passwordMatches = await hashPassword(password, officer.passwordSalt) === officer.passwordHash;
  } catch {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Could not verify your password. Reload the site on localhost or HTTPS and try again.";
    return;
  } finally {
    loginInProgress = false;
  }

  if (!passwordMatches) {
    msgBox.className = "text-danger";
    msgBox.textContent = "Error: Incorrect password.";
  } else {
    sessionStorage.removeItem("loggedInOfficer");
    localStorage.setItem("loggedInOfficer", username);

    const rememberBox = document.getElementById("login-remember");
    if (rememberBox && rememberBox.checked) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    msgBox.className = "text-success";
    msgBox.textContent =
      "Access Granted: Welcome, Officer " +
      username +
      "! Redirecting to Terminal Home...";
    checkSession();
    setTimeout(function () {
      window.location.href = "index.html";
    }, 1200);
  }
}

function loginGuest(e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  sessionStorage.setItem("loggedInOfficer", "Guest Officer");
  localStorage.removeItem("loggedInOfficer");

  window.location.href = "game.html";
  return false;
}

function logoutUser() {
  sessionStorage.removeItem("loggedInOfficer");
  localStorage.removeItem("loggedInOfficer");
  const loginMsg = document.getElementById("login-msg");
  if (loginMsg) {
    loginMsg.className = "text-warning";
    loginMsg.textContent = "Session Terminated: Logged out successfully.";
  }
  checkSession();
}
