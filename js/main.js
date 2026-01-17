/* PAGE SWITCH */
function switchPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* SIDEBAR HOVER EXPAND */
const sidebar = document.getElementById("sidebar");
sidebar.addEventListener("mouseenter", () => sidebar.classList.add("expanded"));
sidebar.addEventListener("mouseleave", () =>
  sidebar.classList.remove("expanded")
);

/* TIMELINE */
["normal", "normal", "warning", "critical", "critical"].forEach((t) => {
  const d = document.createElement("div");
  d.className = `slot ${t}`;
  document.getElementById("timelineBar").appendChild(d);
});

/* CHARTS */
new Chart(document.getElementById("defectsChart"), {
  type: "bar",
  data: {
    labels: ["A", "B", "C", "D"],
    datasets: [
      {
        data: [12, 7, 5, 9],
        backgroundColor: ["#ff4d4f", "#fadb14", "#52c41a", "#2b5cff"],
        barThickness: 6,
      },
    ],
  },
  options: { plugins: { legend: { display: false } } },
});

new Chart(document.getElementById("yieldChart"), {
  type: "line",
  data: {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      { data: [92, 95, 90, 93], borderColor: "#52c41a", tension: 0.4 },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { max: 100 } },
  },
});

new Chart(document.getElementById("oeeChart"), {
  type: "line",
  data: {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      { data: [85, 88, 82, 87], borderColor: "#9aa4ff", tension: 0.4 },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: { y: { max: 100 } },
  },
});

new Chart(document.getElementById("scrapChart"), {
  type: "bar",
  data: {
    labels: ["W1", "W2", "W3", "W4"],
    datasets: [
      { data: [5, 4, 6, 3], backgroundColor: "#9bf6ff", barThickness: 6 },
    ],
  },
  options: { plugins: { legend: { display: false } } },
});

/* HEADER CLICK */
document.getElementById("homeBtn").onclick = () => switchPage("dashboardPage");

/* ================= POPOVER TOGGLE ================= */
/* ================= POPOVER TOGGLE ================= */
function togglePopover(tab, popover) {
  // Hide any other open popovers
  document.querySelectorAll(".popover").forEach((p) => {
    if (p !== popover) p.style.display = "none";
  });
  document.querySelectorAll(".tab").forEach((t) => {
    if (t !== tab) t.classList.remove("active");
  });

  const isOpen = popover.style.display === "block";
  tab.classList.toggle("active", !isOpen);
  if (isOpen) {
    popover.style.display = "none";
    return;
  }

  // Position popover directly under the tab
  const rect = tab.getBoundingClientRect();
  const parentRect = tab.parentElement.getBoundingClientRect(); // tab-bar
  popover.style.top = rect.bottom - parentRect.top + 6 + "px"; // directly under tab
  popover.style.left = rect.left - parentRect.left + "px";

  // Reset previous content
  popover.innerHTML = `
    <div class="ai-loading">
      <div class="spinner"></div>
      AI Loading...
    </div>
    <div class="popover-content" style="display:none;"></div>
  `;
  const spinner = popover.querySelector(".ai-loading");
  const contentDiv = popover.querySelector(".popover-content");

  popover.style.display = "block";
  popover.classList.add("glow");

  // Simulate fetching/analyzing raw data
  setTimeout(() => {
    spinner.style.display = "none";

    if (tab.id === "anomalyTab") {
      // Example: convert raw anomaly data to readable language
      const rawData = [
        { module: "X", type: "vibration", severity: "high" },
        { module: "Y", type: "temperature", severity: "medium" },
      ];
      contentDiv.innerHTML = rawData
        .map(
          (d) =>
            `Anomaly detected in Module ${d.module}: ${d.type} level is ${d.severity}.`
        )
        .join("<br>");
    } else if (tab.id === "maintenanceTab") {
      // Example: convert maintenance suggestions to readable language
      const suggestions = [
        { module: "X", action: "lubrication", due: "next shift" },
        { module: "Y", action: "calibration", due: "tomorrow" },
      ];
      contentDiv.innerHTML = suggestions
        .map(
          (s) =>
            `Module ${s.module} requires ${s.action} scheduled for ${s.due}.`
        )
        .join("<br>");
    }

    contentDiv.style.display = "block";
    popover.classList.remove("glow");
  }, 3000);
}

anomalyTab.onclick = () => togglePopover(anomalyTab, anomalyPopover);
maintenanceTab.onclick = () =>
  togglePopover(maintenanceTab, maintenancePopover);
