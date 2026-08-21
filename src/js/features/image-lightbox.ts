import { queryAll } from "../core/dom";

const imageSelector =
  ".hardy-prose img, .hardy-moment-media__link img, .hardy-photo-card__media img";

export const initializeImageLightbox = (): void => {
  const images = queryAll<HTMLImageElement>(imageSelector);
  if (images.length === 0 || document.querySelector("[data-hardy-image-lightbox]")) {
    return;
  }

  const lightbox = document.createElement("dialog");
  lightbox.className = "hardy-image-lightbox";
  lightbox.setAttribute("data-hardy-image-lightbox", "true");
  lightbox.setAttribute("aria-label", "图片预览");

  const preview = document.createElement("img");
  preview.className = "hardy-image-lightbox__image";
  preview.alt = "";
  preview.decoding = "async";
  lightbox.append(preview);
  document.body.append(lightbox);

  const close = (): void => {
    lightbox.close();
    preview.removeAttribute("src");
  };

  const open = (image: HTMLImageElement): void => {
    const link = image.closest<HTMLAnchorElement>("a");
    preview.src = link?.href || image.currentSrc || image.src;
    preview.alt = image.alt;
    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }
  };

  for (const image of images) {
    if (image.dataset.hardyLightboxInitialized === "true") continue;
    image.dataset.hardyLightboxInitialized = "true";
    image.classList.add("hardy-image-lightbox__trigger");
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", image.alt || "查看图片");

    image.addEventListener("click", (event) => {
      event.preventDefault();
      open(image);
    });
    image.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      open(image);
    });
  }

  lightbox.addEventListener("click", (event) => {
    if (event.target !== preview) close();
  });
  lightbox.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });
};
