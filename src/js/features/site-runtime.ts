import { query } from "../core/dom";

const second = 1_000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

const formatRuntime = (elapsed: number): string => {
  const days = Math.floor(elapsed / day);
  const hours = Math.floor((elapsed % day) / hour);
  const minutes = Math.floor((elapsed % hour) / minute);
  const seconds = Math.floor((elapsed % minute) / second);
  const clock = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");

  return `${days} 天 ${clock}`;
};

export const initializeSiteRuntime = (): void => {
  const output = query<HTMLElement>("[data-hardy-site-runtime]");
  if (!output || output.dataset.hardySiteRuntimeInitialized === "true") {
    return;
  }

  const startTime = Date.parse(output.dataset.hardySiteStart ?? "");
  if (!Number.isFinite(startTime)) {
    return;
  }

  output.dataset.hardySiteRuntimeInitialized = "true";
  const item = output.closest<HTMLElement>("[data-hardy-site-runtime-item]");
  let intervalId: number | undefined;

  const update = (): void => {
    output.textContent = formatRuntime(Math.max(0, Date.now() - startTime));
  };

  const start = (): void => {
    update();
    if (!intervalId) {
      intervalId = window.setInterval(update, second);
    }
  };

  const stop = (): void => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = undefined;
    }
  };

  item?.removeAttribute("hidden");
  start();
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });
};
