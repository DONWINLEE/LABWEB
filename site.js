(function () {
  function setupPaginatedList(list) {
    const container = list.closest(".content") || list.parentElement;
    const controls = container ? container.querySelector("[data-pagination]") : null;
    if (!controls) return;

    const items = Array.from(list.children);
    const pageSize = Number(list.dataset.pageSize || 8);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    let page = 1;

    if (list.tagName === "OL") {
      items.forEach(function (item, index) {
        item.value = index + 1;
      });
    }

    const prev = controls.querySelector("[data-prev]");
    const next = controls.querySelector("[data-next]");
    const status = controls.querySelector("[data-status]");

    function render() {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      items.forEach(function (item, index) {
        item.hidden = index < start || index >= end;
      });

      if (status) status.textContent = "Page " + page + " / " + totalPages;
      if (prev) prev.disabled = page <= 1;
      if (next) next.disabled = page >= totalPages;
    }

    if (prev) {
      prev.addEventListener("click", function () {
        if (page > 1) {
          page -= 1;
          render();
        }
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        if (page < totalPages) {
          page += 1;
          render();
        }
      });
    }

    render();
  }

  document.querySelectorAll("[data-paginated-list]").forEach(setupPaginatedList);

  function setupPeoplePhotos() {
    const extensions = ["jpg", "jpeg", "png", "webp"];

    document.querySelectorAll("[data-photo-name]").forEach(function (card) {
      const baseName = card.dataset.photoName;
      const image = card.querySelector(".person-image");
      if (!baseName || !image) return;

      let index = 0;

      function tryNext() {
        if (index >= extensions.length) return;

        const candidate = "images/" + baseName + "." + extensions[index];
        index += 1;

        const probe = new Image();
        probe.onload = function () {
          image.src = candidate;
          card.classList.add("has-photo");
        };
        probe.onerror = tryNext;
        probe.src = candidate;
      }

      tryNext();
    });
  }

  setupPeoplePhotos();
}());
