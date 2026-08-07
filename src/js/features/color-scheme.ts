import { queryAll } from "../core/dom";

const storageKey = "hardy:color-scheme";
const validModes = ["auto", "light", "dark"] as const;

type ColorSchemeMode = (typeof validModes)[number];

const modeLabels: Record<ColorSchemeMode, string> = {
  auto: "自动",
  light: "浅色",
  dark: "深色",
};

const isColorSchemeMode = (value: string | null): value is ColorSchemeMode =>
  value === "auto" || value === "light" || value === "dark";

const getConfiguredMode = (): ColorSchemeMode => {
  const configuredMode = document.documentElement.dataset.hardyConfiguredColorScheme ?? null;
  return isColorSchemeMode(configuredMode) ? configuredMode : "auto";
};

const getStoredMode = (): ColorSchemeMode | null => {
  try {
    const storedMode = window.localStorage.getItem(storageKey);
    return isColorSchemeMode(storedMode) ? storedMode : null;
  } catch {
    return null;
  }
};

const storeMode = (mode: ColorSchemeMode): void => {
  try {
    window.localStorage.setItem(storageKey, mode);
  } catch {
    return;
  }
};

const getNextMode = (mode: ColorSchemeMode): ColorSchemeMode => {
  const currentIndex = validModes.indexOf(mode);
  return validModes[(currentIndex + 1) % validModes.length];
};

const applyMode = (mode: ColorSchemeMode): void => {
  document.documentElement.dataset.colorScheme = mode;
  document.documentElement.dataset.hardyColorScheme = mode;
  for (const control of queryAll<HTMLButtonElement>("[data-hardy-color-scheme-toggle]")) {
    control.dataset.hardyColorSchemeValue = mode;
    control.setAttribute("aria-label", `当前为${modeLabels[mode]}模式，点击切换。`);
    const label = control.querySelector<HTMLElement>("[data-hardy-color-scheme-label]");
    if (label) {
      label.textContent = modeLabels[mode];
    }
  }
};

export const initializeColorScheme = (): void => {
  const root = document.documentElement;
  if (root.dataset.hardyColorSchemeInitialized === "true") {
    return;
  }

  const controls = queryAll<HTMLButtonElement>("[data-hardy-color-scheme-toggle]");
  if (controls.length === 0) {
    return;
  }

  root.dataset.hardyColorSchemeInitialized = "true";
  let activeMode = getStoredMode() ?? getConfiguredMode();
  applyMode(activeMode);

  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
  const handleSystemPreferenceChange = (): void => {
    if (activeMode === "auto") {
      applyMode(activeMode);
    }
  };

  if (typeof systemPreference.addEventListener === "function") {
    systemPreference.addEventListener("change", handleSystemPreferenceChange);
  } else {
    systemPreference.addListener(handleSystemPreferenceChange);
  }

  for (const control of controls) {
    control.addEventListener("click", () => {
      activeMode = getNextMode(activeMode);
      storeMode(activeMode);
      applyMode(activeMode);
    });
  }
};
