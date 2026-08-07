import { query } from "../core/dom";

const visibleThreshold = 480;

export const initializeScrollToTop = (): void => {
  const control = query<HTMLButtonElement>("[data-hardy-scroll-top]");
  if (!control) {
    return;
  }
  if (control.dataset.hardyScrollTopInitialized === "true") {
    return;
  }
  control.dataset.hardyScrollTopInitialized = "true";

  const updateVisibility = (): void => {
    const isVisible = window.scrollY > visibleThreshold;
    control.classList.toggle("is-visible", isVisible);
    control.hidden = false;
    control.setAttribute("aria-hidden", String(!isVisible));
    control.tabIndex = isVisible ? 0 : -1;
  };

  control.addEventListener("click", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  window.addEventListener("scroll", updateVisibility, { passive: true });
  updateVisibility();
};
