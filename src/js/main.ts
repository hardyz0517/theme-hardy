import "../css/main.css";
import { runFeatures } from "./core/dom";
import { initializeColorScheme } from "./features/color-scheme";
import { initializeImageLightbox } from "./features/image-lightbox";
import { initializeMediaFallback } from "./features/media-fallback";
import { initializeMobileMenu } from "./features/mobile-menu";
import { initializeMoments } from "./features/moments";
import { initializeScrollToTop } from "./features/scroll-to-top";
import { initializeShare } from "./features/share";
import { initializeSiteRuntime } from "./features/site-runtime";
import { initializeToc } from "./features/toc";
import { initializeSearchWidget } from "./integrations/search-widget";

runFeatures([
  ["color-scheme", initializeColorScheme],
  ["image-lightbox", initializeImageLightbox],
  ["media-fallback", initializeMediaFallback],
  ["mobile-menu", initializeMobileMenu],
  ["moments", initializeMoments],
  ["scroll-to-top", initializeScrollToTop],
  ["site-runtime", initializeSiteRuntime],
  ["toc", initializeToc],
  ["share", initializeShare],
  ["search-widget", initializeSearchWidget],
]);
