(function () {
  const catalog = document.getElementById("catalog");
  if (!catalog || !window.AURA_CATALOG) return;

  const cards = Array.prototype.slice.call(document.querySelectorAll("[data-product]"));
  const empty = document.getElementById("catalog-empty");
  const params = new URLSearchParams(location.search);
  const state = {
    platform: ["all", "max", "tg"].indexOf(params.get("platform")) !== -1 ? params.get("platform") : "all",
    country: ["rf", "kz", "uz", "eu"].indexOf(params.get("country")) !== -1 ? params.get("country") : "",
    age: ["30d", "1y", "3y"].indexOf(params.get("age")) !== -1 ? params.get("age") : ""
  };

  const groups = {
    platform: {
      all: document.getElementById("filter-all"),
      max: document.getElementById("filter-max"),
      tg: document.getElementById("filter-tg")
    },
    country: {
      rf: document.getElementById("filter-country-rf"),
      kz: document.getElementById("filter-country-kz"),
      uz: document.getElementById("filter-country-uz"),
      eu: document.getElementById("filter-country-eu")
    },
    age: {
      "30d": document.getElementById("filter-age-30d"),
      "1y": document.getElementById("filter-age-1y"),
      "3y": document.getElementById("filter-age-3y")
    }
  };

  function paintChips(map, current) {
    Object.keys(map).forEach(function (key) {
      const el = map[key];
      if (!el) return;
      const on = current === key;
      el.classList.toggle("chip-active", on);
      el.setAttribute("aria-pressed", String(on));
    });
  }

  function paint() {
    let shown = 0;
    cards.forEach(function (card) {
      const product = {
        platform: card.dataset.platform,
        country: card.dataset.country,
        ageDays: Number(card.dataset.ageDays)
      };
      const visible = window.AURA_CATALOG.matches(product, state);
      card.hidden = !visible;
      if (visible) shown += 1;
    });
    if (empty) empty.hidden = shown !== 0;
    paintChips(groups.platform, state.platform);
    paintChips(groups.country, state.country);
    paintChips(groups.age, state.age);
  }

  function syncUrl() {
    const next = new URLSearchParams();
    if (state.platform !== "all") next.set("platform", state.platform);
    if (state.country) next.set("country", state.country);
    if (state.age) next.set("age", state.age);
    const qs = next.toString();
    history.replaceState(null, "", (qs ? "?" + qs : location.pathname) + "#catalog");
  }

  Object.keys(groups.platform).forEach(function (key) {
    const el = groups.platform[key];
    if (!el) return;
    el.addEventListener("click", function () {
      state.platform = key;
      paint();
      syncUrl();
    });
  });

  Object.keys(groups.country).forEach(function (key) {
    const el = groups.country[key];
    if (!el) return;
    el.addEventListener("click", function () {
      state.country = state.country === key ? "" : key;
      paint();
      syncUrl();
    });
  });

  Object.keys(groups.age).forEach(function (key) {
    const el = groups.age[key];
    if (!el) return;
    el.addEventListener("click", function () {
      state.age = state.age === key ? "" : key;
      paint();
      syncUrl();
    });
  });

  const reset = document.getElementById("filter-reset");
  if (reset) {
    reset.addEventListener("click", function () {
      state.platform = "all";
      state.country = "";
      state.age = "";
      paint();
      syncUrl();
    });
  }

  paint();
})();
