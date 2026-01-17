import { loadComponent } from "./componentsLoader.js";

import { initHeader } from "./components/header.js";
import { initSidebar } from "./components/sidebar.js";
import { initDashboard } from "./components/dashboard.js";
import { initPopovers } from "./components/popovers.js";

async function bootstrapApp() {
  // Load layout
  await loadComponent("header-container", "components/header.html");
  await loadComponent("sidebar-container", "components/sidebar.html");
  await loadComponent("content-container", "components/dashboardPage.html");

  // Init logic AFTER DOM exists
  initHeader();
  initSidebar();
  initDashboard();
  initPopovers();
}

document.addEventListener("DOMContentLoaded", bootstrapApp);
