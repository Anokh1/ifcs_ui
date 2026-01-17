export function initDashboard() {
  initTimeline();
  initCharts();
}

function initTimeline() {
  ["normal", "normal", "warning", "critical", "critical"].forEach((t) => {
    const d = document.createElement("div");
    d.className = `slot ${t}`;
    document.getElementById("timelineBar").appendChild(d);
  });
}

function initCharts() {
  // Defects Chart
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

  // Yield Chart
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

  // OEE Chart
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

  // Scrap Chart
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
}
