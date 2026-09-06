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

/**
 * Wire up the homepage photo gallery: prev/next buttons, dot navigation, and
 * autoplay. A no-op on every other page, since none of them have [data-gallery].
 */
function setupGallery(): void {
  const root = document.querySelector<HTMLElement>("[data-gallery]");
  const track = root?.querySelector<HTMLElement>("[data-gallery-track]");
  if (!root || !track) return;

  const slideCount = track.children.length;
  const dots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-gallery-dot]"),
  );
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-gallery-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-gallery-next]");

  const AUTOPLAY_MS = 10000;
  // Respect the same reduced-motion signal the rest of the site defers to;
  // manual prev/next/dot navigation still works either way.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  let index = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  function show(next: number): void {
    index = (next + slideCount) % slideCount;
    track!.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  }

  function restartAutoplay(): void {
    if (prefersReducedMotion) return;
    if (timer) clearInterval(timer);
    timer = setInterval(() => show(index + 1), AUTOPLAY_MS);
  }

  prevBtn?.addEventListener("click", () => {
    show(index - 1);
    restartAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    show(index + 1);
    restartAutoplay();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      show(dotIndex);
      restartAutoplay();
    });
  });

  show(0);
  restartAutoplay();
}

document.addEventListener("DOMContentLoaded", () => {
  setupMobileNav();
  markCurrentNavLink();
  setCurrentYear();
  setupGallery();
});
