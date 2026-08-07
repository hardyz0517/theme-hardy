import "../css/main.css";
import { runFeatures } from "./core/dom";
import { initializeColorScheme } from "./features/color-scheme";
import { initializeMediaFallback } from "./features/media-fallback";
import { initializeMobileMenu } from "./features/mobile-menu";
import { initializeScrollToTop } from "./features/scroll-to-top";
import { initializeShare } from "./features/share";
import { initializeToc } from "./features/toc";
import { initializeSearchWidget } from "./integrations/search-widget";

runFeatures([
  ["color-scheme", initializeColorScheme],
  ["media-fallback", initializeMediaFallback],
  ["mobile-menu", initializeMobileMenu],
  ["scroll-to-top", initializeScrollToTop],
  ["toc", initializeToc],
  ["share", initializeShare],
  ["search-widget", initializeSearchWidget],
]);
