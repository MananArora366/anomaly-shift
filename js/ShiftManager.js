
export class ShiftManager {
  constructor() {
    this.shifts = [
      {
        shiftNum: 1,
        timeLabel: "SHIFT 1 // 23:00 - 02:00",
        directive:
          "Verify badge expiration date against logbook year (2026). If expired, press [SPACE] Emergency Alarm. If valid, press [A] Authorize Entry.",
        themeClass: null,
        visitors: [
          {
            name: "Elias Voss",
            portrait: "elias-voss",
            id: "DLA-7719",
            dept: "Maintenance",
            expiry: "11/2027",
            isAnomaly: false,
            dialogue:
              "Night maintenance crew. Here to service the east ventilation unit.",
            reason: "Valid personnel",
          },
          {
            name: "Marcus Chen",
            portrait: "marcus-chen",
            id: "DLA-4022",
            dept: "Administration",
            expiry: "10/2025",
            isAnomaly: true,
            dialogue: "Courier delivering signed facility payroll records.",
            reason: "Expired badge: Expired 10/2025 (Current year: 2026)",
          },
          {
            name: "Sarah Jenkins",
            portrait: "sarah-jenkins",
            id: "DLA-8114",
            dept: "Medical",
            expiry: "09/2027",
            isAnomaly: false,
            dialogue: "Shift relief for biochemical isolation bay 3.",
            reason: "Valid personnel",
          },
          {
            name: "Raymond Cruz",
            portrait: "raymond-cruz",
            id: "DLA-3091",
            dept: "Security",
            expiry: "04/2024",
            isAnomaly: true,
            dialogue:
              "Perimeter patrol guard reporting for exterior fence inspection.",
            reason: "Expired badge: Expired 04/2024 (Current year: 2026)",
          },
        ],
        logbook: [
          { name: "M. Hargrove", time: "01:42", clearance: "MNT-1", status: "CLEARED" },
          { name: "S. Vega", time: "01:57", clearance: "M-2", status: "CLEARED" },
          { name: "M. Chen", time: "02:08", clearance: "A-3", status: "PENDING" },
          { name: "E. Voss", time: "23:00", clearance: "MNT-2", status: "PENDING" },
          { name: "S. Jenkins", time: "02:30", clearance: "M-1", status: "PENDING" },
          { name: "R. Cruz", time: "02:45", clearance: "S-1", status: "PENDING" },
        ],
      },
      {
        shiftNum: 2,
        timeLabel: "SHIFT 2 // 02:00 - 05:00 [ELEVATED ALERT]",
        directive:
          "Elevated Alert! Unlisted visitors require verification. Dial hotline on desk phone (Security: 100, Admin: 204, Medical: 311) before deciding.",
        themeClass: "shift-amber",
        visitors: [
          {
            name: "Dr. Aris Thorne",
            portrait: "dr-aris-thorne",
            id: "DLA-9041",
            dept: "Research",
            expiry: "12/2027",
            isAnomaly: false,
            dialogue:
              "Emergency laboratory call. Check with Research dept (Hotline 311).",
            reason: "Valid after hotline confirmation",
          },
          {
            name: "Officer Vance",
            portrait: "officer-vance",
            id: "DLA-1100",
            dept: "Security",
            expiry: "01/2027",
            isAnomaly: true,
            dialogue: "Perimeter guard relief. Open the gate immediately.",
            reason:
              "Impostor! Security hotline (100) confirms no relief dispatched",
          },
          {
            name: "Clara Oswald",
            portrait: "clara-oswald",
            id: "DLA-6204",
            dept: "Administration",
            expiry: "07/2028",
            isAnomaly: false,
            dialogue:
              "Facility payroll auditor on overnight audit schedule. Check Admin hotline (204).",
            reason: "Valid after hotline confirmation",
          },
          {
            name: "Elena Rostova",
            portrait: "elena-rostova",
            id: "DLA-5512",
            dept: "Maintenance",
            expiry: "04/2028",
            isAnomaly: false,
            dialogue: "Routine water filtration diagnostic run.",
            reason: "Valid personnel",
          },
        ],
        logbook: [
          { name: "E. Rostova", time: "03:15", clearance: "MNT-2", status: "PENDING" },
          { name: "ALERT:", time: "03:40", clearance: "NOTE", status: "DIAL PHONE FOR UNLISTED STAFF" },
        ],
      },
      {
        shiftNum: 3,
        timeLabel: "SHIFT 3 // 05:00 - 07:00 [RED ALERT]",
        directive:
          "Red Alert! Cross-check badge clearance codes against department logs, and watch for duplicate identity clones!",
        themeClass: "shift-red",
        visitors: [
          {
            name: "Viktor Haas",
            portrait: "viktor-haas",
            id: "DLA-6631",
            dept: "Research",
            expiry: "06/2027",
            isAnomaly: true,
            dialogue: "Containment specialist returning to office.",
            reason:
              "Mismatch anomaly: Badge says Research, but logbook code MNT-2 is Maintenance",
          },
          {
            name: "Maya Lin",
            portrait: "maya-lin",
            id: "DLA-3390",
            dept: "Medical",
            expiry: "08/2027",
            isAnomaly: false,
            dialogue: "Director of toxicology conducting early sample audit.",
            reason: "Valid personnel",
          },
          {
            name: "Elias Voss",
            portrait: "elias-voss",
            id: "DLA-7719",
            dept: "Maintenance",
            expiry: "11/2027",
            isAnomaly: true,
            dialogue:
              "I am Elias Voss... night maintenance crew... open the security door now...",
            reason:
              "Clone anomaly: Elias Voss was already cleared at 23:00 in Shift 1! Duplicate identity attempting re-entry.",
          },
          {
            name: "Dr. Isaac Sterling",
            portrait: "dr-isaac-sterling",
            id: "DLA-1001",
            dept: "Executive",
            expiry: "05/2029",
            isAnomaly: false,
            dialogue:
              "Facility Director arriving for morning handover briefing.",
            reason: "Valid personnel",
          },
        ],
        logbook: [
          { name: "E. Voss", time: "23:00", clearance: "MNT-2", status: "CLEARED" },
          { name: "V. Haas", time: "05:15", clearance: "MNT-2 (MAINT)", status: "PENDING" },
          { name: "M. Lin", time: "05:45", clearance: "M-1 (MED)", status: "PENDING" },
          { name: "I. Sterling", time: "06:35", clearance: "A-1 (EXEC)", status: "PENDING" },
        ],
      },
    ];
  }

  getShift(num) {
    return this.shifts[num - 1];
  }

  getTotalShifts() {
    return this.shifts.length;
  }

  applyTheme(shiftNum) {
    const config = this.getShift(shiftNum);
    const desk = document.querySelector(".guard-desk");
    const hudShift = document.getElementById("hud-shift");
    const directive = document.getElementById("shift-directive-text");

    if (desk) {
      desk.classList.remove("shift-amber", "shift-red");
      if (config.themeClass) desk.classList.add(config.themeClass);
    }
    if (hudShift) hudShift.textContent = config.timeLabel;
    if (directive) directive.textContent = config.directive;
  }
}
