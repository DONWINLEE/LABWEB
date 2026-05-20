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

  function setupNewsCarousel() {
    const carousel = document.querySelector("[data-news-carousel]");
    if (!carousel) return;

    const previous = document.querySelector("[data-news-prev]");
    const next = document.querySelector("[data-news-next]");

    function scrollByPage(direction) {
      carousel.scrollBy({
        left: direction * carousel.clientWidth,
        behavior: "smooth"
      });
    }

    if (previous) {
      previous.addEventListener("click", function () {
        scrollByPage(-1);
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        scrollByPage(1);
      });
    }
  }

  setupNewsCarousel();

  function setupNewsArchive() {
    const list = document.querySelector("[data-news-archive]");
    const pagination = document.querySelector("[data-news-archive-pagination]");
    if (!list || !pagination) return;

    const items = Array.from(list.querySelectorAll(".news-list-item"));
    const pageSize = Number(list.dataset.pageSize || 8);
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
    let page = 1;

    function makeButton(label, targetPage, isActive) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      if (isActive) button.classList.add("active");
      button.addEventListener("click", function () {
        page = targetPage;
        render();
        window.scrollTo({ top: list.offsetTop - 30, behavior: "smooth" });
      });
      return button;
    }

    function render() {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      items.forEach(function (item, index) {
        item.hidden = index < start || index >= end;
      });

      pagination.innerHTML = "";
      for (let i = 1; i <= totalPages; i += 1) {
        pagination.appendChild(makeButton(String(i), i, i === page));
      }
      if (page < totalPages) {
        pagination.appendChild(makeButton("Next", page + 1, false));
      }
    }

    render();
  }

  setupNewsArchive();

  function setupPeoplePhotos() {
    const extensions = ["jpg", "jpeg", "png", "webp"];

    document.querySelectorAll("[data-photo-name]").forEach(function (card) {
      const baseName = card.dataset.photoName;
      const image = card.querySelector(".person-image");
      if (!baseName || !image) return;

      const candidates = [];
      extensions.forEach(function (extension) {
        candidates.push("images/members/" + baseName + "." + extension);
        candidates.push("images/members/" + baseName.toLowerCase() + "." + extension);
        candidates.push("images/" + baseName + "." + extension);
        candidates.push("images/" + baseName.toLowerCase() + "." + extension);
      });

      let index = 0;

      function tryNext() {
        if (index >= candidates.length) return;

        const candidate = candidates[index];
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
