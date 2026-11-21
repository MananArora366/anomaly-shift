export class Visitor {
  constructor(data) {
    this.name = data.name;
    this.portrait = data.portrait;
    this.id = data.id;
    this.dept = data.dept;
    this.expiry = data.expiry;
    this.isAnomaly = data.isAnomaly;
    this.dialogue = data.dialogue;
    this.reason = data.reason;
  }

  renderBadge() {
    const nameElem = document.getElementById("badge-name");
    const idElem = document.getElementById("badge-id");
    const deptElem = document.getElementById("badge-dept");
    const expElem = document.getElementById("badge-expiry");

    if (nameElem) nameElem.textContent = this.name;
    if (idElem) idElem.textContent = this.id;
    if (deptElem) deptElem.textContent = this.dept;
    if (expElem) expElem.textContent = this.expiry;
  }

  getDialogueHtml() {
    return `<p><strong>${this.name}:</strong> &ldquo;${this.dialogue}&rdquo;</p>`;
  }

  isDecisionCorrect(isAuthorizing) {
    return isAuthorizing ? !this.isAnomaly : this.isAnomaly;
  }
}
