import { queryAll } from "../core/dom";

type SearchWidgetApi = {
  open?: () => void;
};

declare global {
  interface Window {
    SearchWidget?: SearchWidgetApi;
  }
}

export const initializeSearchWidget = (): void => {
  const triggers = queryAll<HTMLButtonElement>("[data-hardy-search-trigger]");
  for (const trigger of triggers) {
    if (trigger.dataset.hardySearchInitialized === "true") {
      continue;
    }
    trigger.dataset.hardySearchInitialized = "true";
    trigger.addEventListener("click", () => {
      window.SearchWidget?.open?.();
    });
  }
};
