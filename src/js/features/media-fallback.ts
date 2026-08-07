import { queryAll } from "../core/dom";

export const initializeMediaFallback = (): void => {
  for (const image of queryAll<HTMLImageElement>("[data-hardy-media-image]")) {
    if (image.dataset.hardyMediaInitialized === "true") {
      continue;
    }
    image.dataset.hardyMediaInitialized = "true";

    const fallback = image.parentElement?.querySelector<HTMLElement>("[data-hardy-media-fallback]");
    if (!fallback) {
      continue;
    }

    const showFallback = (): void => {
      image.hidden = true;
      fallback.hidden = false;
    };

    image.addEventListener("error", showFallback, { once: true });
    if (image.complete && image.naturalWidth === 0) {
      showFallback();
    }
  }
};
