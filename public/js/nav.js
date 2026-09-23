(function () {
  const config = window.AURA_CONFIG || {};
  const site = String(config.siteUrl || "").replace(/\/$/, "");
  if (site) {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = site + location.pathname;
    document.head.appendChild(link);
  }

  const button = document.getElementById("nav-menu-btn");
  const menu = document.getElementById("mobile-nav");
  const nav = document.querySelector(".nav-island");
  if (!button || !menu) return;

  function setOpen(open) {
    menu.hidden = !open;
    button.setAttribute("aria-expanded", String(open));
    if (nav) nav.classList.toggle("is-open", open);
  }

  button.addEventListener("click", function () {
    setOpen(menu.hidden);
  });

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setOpen(false);
    });
  });
})();
