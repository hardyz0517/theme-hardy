import { queryAll } from "../core/dom";

const getShareUrl = (control: HTMLElement): string => {
  const url = control.dataset.hardyShareUrl;
  try {
    return new URL(url || window.location.href, window.location.href).href;
  } catch {
    return window.location.href;
  }
};

const setStatus = (control: HTMLElement, message: string): void => {
  const statusId = control.getAttribute("aria-describedby");
  const status = statusId ? document.getElementById(statusId) : null;
  if (status) {
    status.textContent = message;
  }
};

export const initializeShare = (): void => {
  const controls = queryAll<HTMLButtonElement>("[data-hardy-share]");
  for (const control of controls) {
    if (control.dataset.hardyShareInitialized === "true") {
      continue;
    }
    control.dataset.hardyShareInitialized = "true";
    control.addEventListener("click", async () => {
      const url = getShareUrl(control);
      const title = control.dataset.hardyShareTitle || document.title;

      try {
        if (navigator.share) {
          await navigator.share({ title, url });
          setStatus(control, "已分享。");
          return;
        }

        await navigator.clipboard.writeText(url);
        setStatus(control, "链接已复制。");
      } catch {
        setStatus(control, "暂时无法分享，请从浏览器地址栏复制链接。");
      }
    });
  }
};
