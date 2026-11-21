export class DeskStation {
  constructor() {
    this.phoneBuffer = "";
  }

  playSound(soundName) {
    if (localStorage.getItem("gameMuted") === "true") return;

    try {
      const audio = new Audio("assets/sounds/" + soundName + ".mp3");
      audio.play();
    } catch (e) {
      // audio autoplay policy catch
    }
  }

  renderLogbook(rows) {
    const tbody = document.getElementById("logbook-tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    for (let i = 0; i < rows.length; i++) {
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td>${rows[i].name}</td>` +
        `<td>${rows[i].time}</td>` +
        `<td>${rows[i].clearance}</td>` +
        `<td>${rows[i].status}</td>`;
      tbody.appendChild(tr);
    }
  }

  dialPhone(digit) {
    this.playSound("beep");

    if (this.phoneBuffer.length >= 3) {
      this.phoneBuffer = "";
    }
    this.phoneBuffer += digit;

    const display = document.getElementById("phone-display");
    if (display) {
      display.textContent = "DIALING: " + this.phoneBuffer;
    }

    if (this.phoneBuffer.length === 3) {
      const dialogue = document.getElementById("visitor-dialogue");

      if (this.phoneBuffer === "100") {
        if (display) display.textContent = "SEC_OPS: CONNECTED";
        if (dialogue) {
          dialogue.innerHTML =
            '<p class="text-warning"><strong>HOTLINE (Security Ops - Ext 100):</strong> &ldquo;Dispatch here. Check the patrol logs. No perimeter relief was authorized for Officer Vance tonight!&rdquo;</p>';
        }
      } else if (this.phoneBuffer === "204") {
        if (display) display.textContent = "ADMIN: CONNECTED";
        if (dialogue) {
          dialogue.innerHTML =
            '<p class="text-warning"><strong>HOTLINE (Administration - Ext 204):</strong> &ldquo;Admin desk. Yes, Clara Oswald was scheduled for an overnight payroll audit.&rdquo;</p>';
        }
      } else if (this.phoneBuffer === "311") {
        if (display) display.textContent = "LABS: CONNECTED";
        if (dialogue) {
          dialogue.innerHTML =
            '<p class="text-warning"><strong>HOTLINE (Biochem Lab - Ext 311):</strong> &ldquo;Isolation Bay. Dr. Aris Thorne called in for an emergency bio-sample analysis. Clear him.&rdquo;</p>';
        }
      } else {
        if (display) display.textContent = "ERR: UNASSIGNED";
      }
    }
  }

  clearPhone() {
    this.playSound("beep");
    this.phoneBuffer = "";
    const display = document.getElementById("phone-display");
    if (display) {
      display.textContent = "READY_";
    }
  }

  setGateStatus(text, colorClass) {
    const gate = document.getElementById("gate-status");
    if (!gate) return;
    gate.className = colorClass;
    gate.textContent = text;
  }
}
