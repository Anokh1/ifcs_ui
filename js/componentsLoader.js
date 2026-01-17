export async function loadComponent(containerId, url) {
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to load ${url}`);
    return;
  }

  const html = await res.text();
  const container = document.getElementById(containerId);
  if (container) container.innerHTML = html;
}
