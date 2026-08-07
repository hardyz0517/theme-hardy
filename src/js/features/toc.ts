import { query, queryAll } from "../core/dom";

const headingSelector = "h2[id], h3[id]";

export const initializeToc = (): void => {
  const prose = query<HTMLElement>("[data-hardy-prose]");
  const toc = query<HTMLElement>("[data-hardy-toc]");
  if (!prose || !toc) {
    return;
  }

  if (toc.dataset.hardyTocInitialized === "true") {
    return;
  }
  toc.dataset.hardyTocInitialized = "true";

  const headings = queryAll<HTMLHeadingElement>(headingSelector, prose);
  if (headings.length === 0) {
    toc.hidden = true;
    return;
  }

  const list = document.createElement("ol");
  list.className = "hardy-toc__list";

  const links = headings.map((heading) => {
    const item = document.createElement("li");
    item.className = `hardy-toc__item hardy-toc__item--${heading.tagName.toLowerCase()}`;

    const link = document.createElement("a");
    link.className = "hardy-toc__link";
    // Halo may already percent-encode non-ASCII heading IDs. Preserve the
    // server-provided fragment to avoid turning `%E7...` into `%25E7...`.
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() || heading.id;

    item.append(link);
    list.append(item);
    return link;
  });

  toc.append(list);
  toc.hidden = false;

  if (!("IntersectionObserver" in window)) {
    links[0]?.classList.add("is-active");
    links[0]?.setAttribute("aria-current", "location");
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (!visibleEntry) {
        return;
      }

      const activeIndex = headings.indexOf(visibleEntry.target as HTMLHeadingElement);
      for (const [index, link] of links.entries()) {
        link.classList.toggle("is-active", index === activeIndex);
        if (index === activeIndex) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "0px 0px -65% 0px", threshold: 0.1 },
  );

  for (const heading of headings) {
    observer.observe(heading);
  }
};
