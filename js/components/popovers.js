export function initPopovers() {
  const anomalyTab = document.getElementById("anomalyTab");
  const maintenanceTab = document.getElementById("maintenanceTab");
  const anomalyPopover = document.getElementById("anomalyPopover");
  const maintenancePopover = document.getElementById("maintenancePopover");

  anomalyTab.onclick = () => togglePopover(anomalyTab, anomalyPopover);
  maintenanceTab.onclick = () =>
    togglePopover(maintenanceTab, maintenancePopover);
}

function togglePopover(tab, popover) {
  // Hide any other popovers
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

  // Position under tab
  const rect = tab.getBoundingClientRect();
  const parentRect = tab.parentElement.getBoundingClientRect();
  popover.style.top = rect.bottom - parentRect.top + 6 + "px";
  popover.style.left = rect.left - parentRect.left + "px";

  // Reset content
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

  setTimeout(() => {
    spinner.style.display = "none";

    if (tab.id === "anomalyTab") {
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
