import { query, queryAll } from "../core/dom";

const headingSelector = "h2[id], h3[id], h4[id]";

type TocLevel = {
  item: HTMLLIElement;
  level: number;
};

const prefersReducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createList = (nested = false): HTMLOListElement => {
  const list = document.createElement("ol");
  list.className = nested ? "hardy-toc__list hardy-toc__list--nested" : "hardy-toc__list";
  return list;
};

export const initializeToc = (): void => {
  const prose = query<HTMLElement>("[data-hardy-post-detail] [data-hardy-prose]");
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

  const list = createList();
  const levels: TocLevel[] = [];
  const childLists = new WeakMap<HTMLLIElement, HTMLOListElement>();

  const links = headings.map((heading) => {
    const level = Number.parseInt(heading.tagName.slice(1), 10);
    const item = document.createElement("li");
    item.className = "hardy-toc__item";

    const link = document.createElement("a");
    link.className = "hardy-toc__link";
    // Halo may already percent-encode non-ASCII heading IDs. Preserve the
    // server-provided fragment to avoid turning `%E7...` into `%25E7...`.
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() || heading.id;

    item.append(link);

    while (levels.length > 0 && levels[levels.length - 1].level >= level) {
      levels.pop();
    }

    const parent = levels[levels.length - 1];
    if (parent) {
      let childList = childLists.get(parent.item);
      if (!childList) {
        childList = createList(true);
        childLists.set(parent.item, childList);
        parent.item.append(childList);
      }
      childList.append(item);
    } else {
      list.append(item);
    }

    levels.push({ item, level });
    return link;
  });

  toc.append(list);
  toc.hidden = false;

  let activeIndex = -1;
  const setActive = (nextIndex: number): void => {
    if (nextIndex === activeIndex || nextIndex < 0 || nextIndex >= links.length) {
      return;
    }

    for (const [index, link] of links.entries()) {
      const active = index === nextIndex;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }

    activeIndex = nextIndex;
    const activeLink = links[nextIndex];
    const scrollContainer = toc.closest<HTMLElement>(".hardy-sidebar");
    if (
      !activeLink ||
      !scrollContainer ||
      scrollContainer.scrollHeight <= scrollContainer.clientHeight
    ) {
      return;
    }

    const linkRect = activeLink.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const inset = 12;
    if (linkRect.top < containerRect.top + inset) {
      scrollContainer.scrollBy({
        top: linkRect.top - containerRect.top - inset,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    } else if (linkRect.bottom > containerRect.bottom - inset) {
      scrollContainer.scrollBy({
        top: linkRect.bottom - containerRect.bottom + inset,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }
  };

  for (const [index, link] of links.entries()) {
    link.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      event.preventDefault();
      setActive(index);
      headings[index].scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });

      const url = new URL(window.location.href);
      url.hash = headings[index].id;
      window.history.pushState(null, "", url);
    });
  }

  if (!("IntersectionObserver" in window)) {
    setActive(0);
    return;
  }

  const findActiveIndex = (): number => {
    const marker = Math.min(window.innerHeight * 0.25, 180);
    let nextIndex = 0;

    for (const [index, heading] of headings.entries()) {
      if (heading.getBoundingClientRect().top > marker) {
        break;
      }
      nextIndex = index;
    }

    const documentEnd = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= documentEnd - 2) {
      return headings.length - 1;
    }
    return nextIndex;
  };

  const observer = new IntersectionObserver(
    () => {
      setActive(findActiveIndex());
    },
    { rootMargin: "-10% 0px -65% 0px", threshold: [0, 1] },
  );

  setActive(findActiveIndex());
  for (const heading of headings) {
    observer.observe(heading);
  }

  let scrollFrame = 0;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame !== 0) {
        return;
      }
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        setActive(findActiveIndex());
      });
    },
    { passive: true },
  );
};
