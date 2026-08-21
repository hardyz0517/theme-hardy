import { isHTMLElement, query, queryAll } from "../core/dom";

const desktopQuery = "(min-width: 900px)";
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export const initializeMobileMenu = (): void => {
  const menu = query<HTMLElement>("[data-hardy-menu]");
  const mask = query<HTMLElement>("[data-hardy-menu-mask]");
  const page = query<HTMLElement>("[data-hardy-page]");
  const mobileHeader = query<HTMLElement>("[data-hardy-mobile-header]");
  const triggers = queryAll<HTMLButtonElement>("[data-hardy-menu-trigger]");
  const closeControls = queryAll<HTMLButtonElement>("[data-hardy-menu-close]");

  if (!menu || !mask || !page || triggers.length === 0) {
    return;
  }
  if (menu.dataset.hardyMenuInitialized === "true") {
    return;
  }
  menu.dataset.hardyMenuInitialized = "true";

  const mediaQuery = window.matchMedia(desktopQuery);
  let lastFocusedElement: HTMLElement | null = null;

  const getFocusableElements = (): HTMLElement[] =>
    queryAll<HTMLElement>(focusableSelector, menu).filter(
      (element) => !element.hasAttribute("disabled") && element.tabIndex !== -1,
    );

  const setOpenState = (isOpen: boolean, restoreFocus = false): void => {
    document.body.classList.toggle("is-menu-open", isOpen);
    page.inert = isOpen;
    page.setAttribute("aria-hidden", String(isOpen));
    if (mobileHeader) {
      mobileHeader.inert = isOpen;
      mobileHeader.setAttribute("aria-hidden", String(isOpen));
    }
    menu.classList.toggle("is-open", isOpen);
    mask.classList.toggle("is-open", isOpen);
    menu.hidden = false;
    mask.hidden = false;
    menu.setAttribute("aria-hidden", String(!isOpen));
    mask.setAttribute("aria-hidden", String(!isOpen));
    for (const trigger of triggers) {
      trigger.setAttribute("aria-expanded", String(isOpen));
    }

    if (!isOpen) {
      menu.hidden = true;
      mask.hidden = true;
      page.inert = false;
      if (mobileHeader) {
        mobileHeader.inert = false;
      }
      if (restoreFocus && lastFocusedElement?.isConnected) {
        lastFocusedElement.focus();
      }
      lastFocusedElement = null;
    }
  };

  const openMenu = (trigger: HTMLButtonElement): void => {
    if (mediaQuery.matches) {
      return;
    }

    lastFocusedElement = trigger;
    setOpenState(true);
    const firstFocusable = getFocusableElements()[0];
    (firstFocusable ?? menu).focus();
  };

  const closeMenu = (): void => {
    if (!document.body.classList.contains("is-menu-open")) {
      return;
    }
    setOpenState(false, true);
  };

  const trapFocus = (event: KeyboardEvent): void => {
    if (!document.body.classList.contains("is-menu-open") || event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) {
      event.preventDefault();
      menu.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (!menu.contains(activeElement)) {
      event.preventDefault();
      firstElement.focus();
    } else if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  for (const trigger of triggers) {
    trigger.addEventListener("click", () => openMenu(trigger));
  }

  for (const control of closeControls) {
    control.addEventListener("click", closeMenu);
  }

  mask.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-menu-open")) {
      closeMenu();
      return;
    }

    trapFocus(event);
  });

  const handleBreakpointChange = (event: MediaQueryListEvent): void => {
    if (event.matches) {
      closeMenu();
    }
  };
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleBreakpointChange);
  } else {
    mediaQuery.addListener(handleBreakpointChange);
  }

  if (isHTMLElement(document.activeElement)) {
    lastFocusedElement = document.activeElement;
  }

  setOpenState(false);
};
