import { queryAll } from "../core/dom";

export const initializeMoments = (): void => {
  for (const control of queryAll<HTMLButtonElement>("[data-hardy-moment-comment-toggle]")) {
    if (control.dataset.hardyMomentInitialized === "true") {
      continue;
    }
    control.dataset.hardyMomentInitialized = "true";
    const comments = control
      .closest(".hardy-moment-row")
      ?.querySelector<HTMLElement>(".hardy-moment-comments");
    if (!comments) {
      continue;
    }
    control.addEventListener("click", () => {
      const open = !comments.hidden;
      comments.hidden = open;
      control.setAttribute("aria-expanded", String(!open));
    });
  }
};
