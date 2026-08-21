import { queryAll } from "../core/dom";

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

export const initializeMoments = (): void => {
  for (const control of queryAll<HTMLButtonElement>("[data-hardy-moment-delete]")) {
    if (control.dataset.hardyMomentInitialized === "true") continue;
    control.dataset.hardyMomentInitialized = "true";
    control.addEventListener("click", async () => {
      const name = control.dataset.hardyMomentName;
      if (!name || !window.confirm("确定删除这条瞬间吗？")) return;
      control.disabled = true;
      try {
        const response = await fetch(
          `/apis/uc.api.moment.halo.run/v1alpha1/moments/${encodeURIComponent(name)}`,
          { method: "DELETE", credentials: "same-origin", headers: { Accept: "application/json" } },
        );
        if (!response.ok) {
          throw new Error(
            response.status === 401 || response.status === 403
              ? "当前账号没有删除权限。"
              : "删除失败，请稍后重试。",
          );
        }
        control.closest(".hardy-moment-card")?.remove();
      } catch (error) {
        control.disabled = false;
        window.alert(error instanceof Error ? error.message : "删除失败，请稍后重试。");
      }
    });
  }

  const composer = document.querySelector<HTMLDialogElement>("[data-hardy-moment-composer]");
  const form = composer?.querySelector<HTMLFormElement>("[data-hardy-moment-form]");
  const openButtons = queryAll<HTMLButtonElement>("[data-hardy-moment-open]");
  if (!composer || !form || openButtons.length === 0) {
    return;
  }

  const contentInput = form.querySelector<HTMLTextAreaElement>("[data-hardy-moment-content]");
  const mediaInput = form.querySelector<HTMLInputElement>("[data-hardy-moment-media]");
  const mediaFileInput = form.querySelector<HTMLInputElement>("[data-hardy-moment-file]");
  const mediaAdd = form.querySelector<HTMLElement>(".hardy-moment-composer__media-add");
  const mediaList = form.querySelector<HTMLElement>("[data-hardy-moment-media-list]");
  const tagsInput = form.querySelector<HTMLInputElement>("[data-hardy-moment-tags]");
  const tagsList = form.querySelector<HTMLElement>("[data-hardy-moment-tags-list]");
  const status = form.querySelector<HTMLElement>("[data-hardy-moment-status]");
  const submit = form.querySelector<HTMLButtonElement>("[data-hardy-moment-submit]");
  const maxMediaCount = 9;
  const mediaUrls: string[] = [];
  const tagValues: string[] = [];

  const setStatus = (message: string): void => {
    if (status) status.textContent = message;
  };

  const resizeContentInput = (): void => {
    if (!contentInput) return;
    contentInput.style.height = "auto";
    contentInput.style.height = `${contentInput.scrollHeight}px`;
  };

  const renderMedia = (): void => {
    if (!mediaList) return;
    const mediaItems = mediaUrls.map((url, index) => {
      const item = document.createElement("div");
      item.className = "hardy-moment-composer__media-item";
      item.setAttribute("role", "listitem");

      const image = document.createElement("img");
      image.src = url;
      image.alt = "";

      const remove = document.createElement("button");
      remove.className = "hardy-moment-composer__media-remove";
      remove.type = "button";
      remove.setAttribute("aria-label", `移除第 ${index + 1} 张图片`);
      remove.innerHTML =
        '<svg class="hardy-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>';
      remove.addEventListener("click", () => {
        mediaUrls.splice(index, 1);
        renderMedia();
      });

      item.append(image, remove);
      return item;
    });

    if (mediaAdd) {
      mediaAdd.hidden = mediaUrls.length >= maxMediaCount;
      mediaList.replaceChildren(...mediaItems, mediaAdd);
      return;
    }
    mediaList.replaceChildren(...mediaItems);
  };

  const addMedia = (url: string): boolean => {
    const value = url.trim();
    if (!value) return false;
    if (mediaUrls.length >= maxMediaCount) {
      setStatus("最多只能添加 9 张图片。");
      return false;
    }
    mediaUrls.push(value);
    renderMedia();
    return true;
  };

  const renderTags = (): void => {
    if (!tagsList) return;
    const tagItems = tagValues.map((tag, index) => {
      const item = document.createElement("span");
      item.className = "hardy-moment-composer__tag";
      item.setAttribute("role", "listitem");

      const label = document.createElement("span");
      label.className = "hardy-moment-composer__tag-label";
      label.textContent = tag;

      const remove = document.createElement("button");
      remove.className = "hardy-moment-composer__tag-remove";
      remove.type = "button";
      remove.setAttribute("aria-label", `移除标签 ${tag}`);
      remove.innerHTML =
        '<svg class="hardy-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>';
      remove.addEventListener("click", () => {
        tagValues.splice(index, 1);
        renderTags();
        tagsInput?.focus();
      });

      item.append(label, remove);
      return item;
    });
    tagsList.replaceChildren(...tagItems);
  };

  const addTags = (raw: string): boolean => {
    const values = raw
      .split(/[，,]/)
      .map((tag) => tag.trim())
      .filter(Boolean);
    let added = false;
    for (const value of values) {
      if (tagValues.includes(value)) continue;
      tagValues.push(value);
      added = true;
    }
    if (values.length > 0) renderTags();
    return added;
  };

  const commitTags = (): void => {
    const value = tagsInput?.value ?? "";
    if (!value.trim()) {
      if (tagsInput) tagsInput.value = "";
      return;
    }
    addTags(value);
    if (tagsInput) tagsInput.value = "";
  };

  const close = (): void => {
    composer.close();
    form.reset();
    if (contentInput) contentInput.style.height = "";
    mediaUrls.length = 0;
    tagValues.length = 0;
    renderMedia();
    renderTags();
    setStatus("");
  };

  for (const button of openButtons) {
    if (button.dataset.hardyMomentInitialized === "true") continue;
    button.dataset.hardyMomentInitialized = "true";
    button.addEventListener("click", () => {
      if (typeof composer.showModal === "function") composer.showModal();
      else composer.setAttribute("open", "");
      requestAnimationFrame(resizeContentInput);
      contentInput?.focus();
    });
  }

  for (const button of queryAll<HTMLButtonElement>("[data-hardy-moment-close]")) {
    button.addEventListener("click", close);
  }

  composer.addEventListener("click", (event) => {
    if (event.target === composer) close();
  });

  composer.addEventListener("cancel", (event) => {
    event.preventDefault();
    close();
  });

  contentInput?.addEventListener("input", resizeContentInput);

  mediaInput?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (addMedia(mediaInput.value)) {
      mediaInput.value = "";
      setStatus("图片已添加。");
    }
  });

  tagsInput?.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault();
      commitTags();
      return;
    }
    if (event.key === "Backspace" && !tagsInput.value && tagValues.length > 0) {
      tagValues.pop();
      renderTags();
    }
  });

  mediaFileInput?.addEventListener("change", async () => {
    const remaining = maxMediaCount - mediaUrls.length;
    const files = Array.from(mediaFileInput.files ?? []).slice(0, remaining);
    if (files.length === 0) {
      setStatus("最多只能添加 9 张图片。");
      mediaFileInput.value = "";
      return;
    }
    mediaFileInput.disabled = true;
    let uploaded = 0;
    try {
      for (const [index, file] of files.entries()) {
        setStatus(`正在上传图片 (${index + 1}/${files.length})...`);
        const uploadBody = new FormData();
        uploadBody.append("file", file);
        const response = await fetch(
          "/apis/uc.api.storage.halo.run/v1alpha1/attachments/-/upload",
          {
            method: "POST",
            credentials: "same-origin",
            body: uploadBody,
          },
        );
        if (!response.ok) {
          throw new Error(
            response.status === 401 || response.status === 403
              ? "请先登录并确认拥有附件上传权限。"
              : "图片上传失败，请稍后重试。",
          );
        }
        const attachment = (await response.json()) as { status?: { permalink?: string } };
        const permalink = attachment.status?.permalink;
        if (!permalink) throw new Error("图片上传成功，但未返回可访问地址。");
        if (addMedia(permalink)) uploaded += 1;
      }
      setStatus(uploaded === 1 ? "图片已添加。" : `已添加 ${uploaded} 张图片。`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "图片上传失败，请稍后重试。");
    } finally {
      mediaFileInput.disabled = false;
      mediaFileInput.value = "";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const raw = contentInput?.value.trim() ?? "";
    if (!raw && mediaUrls.length === 0) {
      setStatus("请输入内容或添加图片。");
      contentInput?.focus();
      return;
    }
    if (submit) submit.disabled = true;
    setStatus("正在发表...");
    commitTags();
    const tags = [...tagValues];
    const body = {
      apiVersion: "moment.halo.run/v1alpha1",
      kind: "Moment",
      metadata: { generateName: "moment-" },
      spec: {
        content: {
          raw,
          html: raw ? `<p>${escapeHtml(raw).replace(/\r?\n/g, "<br>")}</p>` : "",
          medium: mediaUrls.map((url) => ({ type: "PHOTO", url, originType: "image/*" })),
        },
        releaseTime: new Date().toISOString(),
        visible: "PUBLIC",
        tags,
      },
    };
    try {
      const response = await fetch("/apis/uc.api.moment.halo.run/v1alpha1/moments", {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("请先登录并确认拥有发表瞬间的权限。");
        }
        throw new Error("发表失败，请稍后重试。");
      }
      close();
      window.location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "发表失败，请稍后重试。");
      if (submit) submit.disabled = false;
    }
  });
};
