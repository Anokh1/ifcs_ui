export function initSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.addEventListener("mouseenter", () =>
    sidebar.classList.add("expanded")
  );
  sidebar.addEventListener("mouseleave", () =>
    sidebar.classList.remove("expanded")
  );
}
