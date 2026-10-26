/* ===========================================================
   Swap's Doodles — gallery logic
   =========================================================== */
(function () {
  "use strict";

  const ALL = (window.GALLERY || []).slice();
  const grid = document.getElementById("grid");
  const sub = document.getElementById("gallerySub");
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbTitle = document.getElementById("lbTitle");
  const lbTag = document.getElementById("lbTag");
  const lbCount = document.getElementById("lbCount");
  const lbPalette = document.getElementById("lbPalette");
  const lbNote = document.getElementById("lbNote");

  const NOTES = {
    characters: "Flat 2D vector · solid fills · soft ground shadow",
    creatures: "Flat 2D vector · solid fills · soft ground shadow",
    moments: "Flat 2D vector · solid fills · soft ground shadow",
    cosplay: "Needle-felted wool puppet · hand-stitched · macro studio shot",
    swap: "Comic ink portrait · bold outlines · cross-hatch shading",
    _default: "Flat 2D vector · solid fills · soft ground shadow",
  };
  const lbDl = document.getElementById("lbDl");

  let filter = "all";
  let order = ALL.map((_, i) => i); // indices into ALL
  let visible = [];

  /* ---------------- render ---------------- */
  function currentList() {
    const base = filter === "all" ? order : order.filter((i) => ALL[i].collection === filter);
    return base.map((i) => ALL[i]);
  }

  function render() {
    visible = currentList();
    grid.innerHTML = "";

    if (!visible.length) {
      grid.innerHTML =
        '<p class="grid__empty">Nothing here yet — the ink is still drying on this shelf.</p>';
      return;
    }

    const frag = document.createDocumentFragment();
    visible.forEach((item, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.style.animationDelay = Math.min(i, 24) * 26 + "ms";
      card.dataset.id = item.id;
      card.setAttribute("aria-label", "Open " + item.title);

      const dots = item.palette
        .slice(0, 4)
        .map((c) => '<i style="background:' + c + '"></i>')
        .join("");

      card.innerHTML =
        '<span class="card__img">' +
        '<img src="' + item.thumb + '" alt="' + item.title + ' — flat 2D vector cartoon" loading="lazy" width="560" height="560" />' +
        '<span class="card__view">View ↑</span>' +
        "</span>" +
        '<span class="card__meta">' +
        "<span>" +
        '<span class="card__title">' + item.title + "</span>" +
        '<span class="card__dots">' + dots + "</span>" +
        "</span>" +
        '<span class="card__idx">№ ' + String(item.n).padStart(2, "0") + "</span>" +
        "</span>";

      card.addEventListener("click", () => open(i));
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    sub.textContent =
      visible.length +
      (visible.length === 1 ? " doodle" : " doodles") +
      (filter === "all" ? " on the wall. Click one to blow it up." : " · " + filter + ". Click one to blow it up.");
  }

  /* ---------------- filters ---------------- */
  document.querySelectorAll(".chip[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip[data-filter]").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      filter = chip.dataset.filter;
      render();
    });
  });

  /* ---------------- shuffle ---------------- */
  function shuffle() {
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    filter = "all";
    document.querySelectorAll(".chip[data-filter]").forEach((c) =>
      c.classList.toggle("is-active", c.dataset.filter === "all")
    );
    render();
    document.getElementById("gallery").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  document.getElementById("shuffleBtn").addEventListener("click", shuffle);
  document.getElementById("heroShuffle").addEventListener("click", shuffle);

  /* ---------------- lightbox ---------------- */
  let index = 0;
  let lastFocus = null;

  function paint() {
    const item = visible[index];
    if (!item) return;

    lbImg.src = item.src;
    lbImg.alt = item.title + " — flat 2D vector cartoon illustration";
    lbTitle.textContent = item.title;
    lbTag.textContent = item.collection;
    lbNote.textContent = NOTES[item.collection] || NOTES._default;
    lbCount.textContent = String(index + 1).padStart(2, "0") + " / " + String(visible.length).padStart(2, "0");
    lbPalette.innerHTML = item.palette.map((c) => '<i style="background:' + c + '"></i>').join("");

    const related = document.getElementById("lbRelated");
    const pool = ALL.filter((a) => a.id !== item.id && a.collection === item.collection);
    const others = ALL.filter((a) => a.id !== item.id && a.collection !== item.collection);
    const picks = pool.concat(others, pool).slice(0, 3);
    related.innerHTML = "";
    picks.forEach((rel) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "lb__rel";
      b.innerHTML = '<img src="' + rel.thumb + '" alt="' + rel.title + '" />';
      b.addEventListener("click", () => {
        const target = visible.findIndex((v) => v.id === rel.id);
        if (target > -1) { index = target; paint(); }
      });
      related.appendChild(b);
    });
    lbDl.href = item.src;
    lbDl.setAttribute("download", "swaps-doodles-" + String(item.n).padStart(2, "0") + ".png");
  }

  function open(i) {
    index = i;
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.classList.add("lb-open");
    paint();
    document.getElementById("lbClose").focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.classList.remove("lb-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function step(dir) {
    if (!visible.length) return;
    index = (index + dir + visible.length) % visible.length;
    paint();
  }

  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", () => step(-1));
  document.getElementById("lbNext").addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  /* swipe on touch */
  let tx = 0;
  lightbox.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 55) step(dx > 0 ? -1 : 1);
  });

  /* ---------------- hero collage uses newest art ---------------- */
  const heroImgs = document.querySelectorAll(".hero__art .sticker img");
  const picks = ["21", "30", "71"];
  heroImgs.forEach((img, i) => {
    const found = ALL.find((a) => a.id === picks[i]) || ALL[ALL.length - 1 - i] || ALL[0];
    if (found) img.src = found.thumb;
  });

  /* ---------------- stats ---------------- */
  const count = document.getElementById("statCount");
  if (count && ALL.length) count.textContent = ALL.length;

  render();
})();
