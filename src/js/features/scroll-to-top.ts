import { query } from "../core/dom";

const visibleThreshold = 480;
const scrollbarIdleDelay = 900;

export const initializeScrollToTop = (): void => {
  const control = query<HTMLButtonElement>("[data-hardy-scroll-top]");
  if (!control) {
    return;
  }
  if (control.dataset.hardyScrollTopInitialized === "true") {
    return;
  }
  control.dataset.hardyScrollTopInitialized = "true";
  let scrollbarIdleTimer: number | undefined;
  const root = document.documentElement;

  const markRootScrolling = (): void => {
    root.dataset.hardyScrollbar = "scrolling";
    if (scrollbarIdleTimer) {
      window.clearTimeout(scrollbarIdleTimer);
    }
    scrollbarIdleTimer = window.setTimeout(() => {
      root.dataset.hardyScrollbar = "idle";
      scrollbarIdleTimer = undefined;
    }, scrollbarIdleDelay);
  };

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

  window.addEventListener(
    "scroll",
    () => {
      markRootScrolling();
      updateVisibility();
    },
    { passive: true },
  );
  root.dataset.hardyScrollbar = "idle";
  updateVisibility();
};
