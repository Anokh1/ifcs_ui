export function initHeader() {
  const homeBtn = document.getElementById("homeBtn");
  homeBtn.onclick = () => switchPage("dashboardPage");
}

/* Reusable page switch */
export function switchPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
