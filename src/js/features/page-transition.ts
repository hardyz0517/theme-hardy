import { query } from "../core/dom";

const transitionDuration = 220;

const isModifiedClick = (event: MouseEvent): boolean =>
  event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

const shouldSkipLink = (event: MouseEvent, link: HTMLAnchorElement): boolean => {
  if (
    event.defaultPrevented ||
    isModifiedClick(event) ||
    (link.target && link.target !== "_self") ||
    link.hasAttribute("download") ||
    link.dataset.noTransition !== undefined
  ) {
    return true;
  }

  const destination = new URL(link.href, window.location.href);
  if (destination.origin !== window.location.origin) {
    return true;
  }

  return (
    destination.pathname === window.location.pathname &&
    destination.search === window.location.search
  );
};

export const initializePageTransition = (): void => {
  const page = query<HTMLElement>("[data-hardy-page]");
  if (!page || document.documentElement.dataset.hardyPageTransitionInitialized === "true") {
    return;
  }

  document.documentElement.dataset.hardyPageTransitionInitialized = "true";

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) {
      return;
    }

    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || shouldSkipLink(event, link)) {
      return;
    }

    event.preventDefault();
    if (document.documentElement.classList.contains("is-page-leaving")) {
      return;
    }

    document.documentElement.classList.add("is-page-leaving");
    document.documentElement.setAttribute("aria-busy", "true");
    window.setTimeout(() => {
      window.location.assign(link.href);
    }, transitionDuration);
  });
};
