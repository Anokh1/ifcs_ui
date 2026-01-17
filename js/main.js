import { initSidebar } from "./components/sidebar.js";
import { initHeader } from "./components/header.js";
import { initDashboard } from "./components/dashboard.js";
import { initPopovers } from "./components/popovers.js";

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initSidebar();
  initDashboard();
  initPopovers();
});
