/**
 * Site interactivity.
 *
 * Kept intentionally small: a mobile nav toggle with an animated open/close,
 * marking the current nav link as active, and filling the footer year.
 *
 * This file is compiled by `tsc` (see tsconfig.json) into public/js/main.js
 * and loaded by every page via <script type="module" src="/js/main.js">.
 * If you split this into multiple files later, remember that without a bundler
 * the browser needs explicit ".js" extensions on local imports, e.g.
 *   import { thing } from "./util.js";
 */

/** Wire up the hamburger button to open/close the primary nav on small screens. */
function setupMobileNav(): void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-nav-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link, so navigation feels clean on mobile.
  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

/** Add aria-current="page" to whichever nav link matches the current path. */
function markCurrentNavLink(): void {
  const here = window.location.pathname.replace(/index\.html$/, "");
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-menu] a");
  links.forEach((link) => {
    const target = new URL(link.href).pathname;
    if (target === here) link.setAttribute("aria-current", "page");
  });
}

/** Fill any [data-year] element with the current year (footer copyright). */
function setCurrentYear(): void {
  const el = document.querySelector<HTMLElement>("[data-year]");
  if (el) el.textContent = String(new Date().getFullYear());
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  markCurrentNavLink();
  setCurrentYear();
});
