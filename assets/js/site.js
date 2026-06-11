// Mobile nav toggle + tab shortcode behavior. Everything else is CSS-only.
(function () {
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll(".tabs").forEach(function (tabs) {
    var panels = tabs.querySelectorAll(".tabs__panel");
    if (panels.length < 2) return;
    var nav = document.createElement("div");
    nav.className = "tabs__nav";
    panels.forEach(function (panel, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tabs__btn" + (i === 0 ? " is-active" : "");
      btn.textContent = panel.dataset.tabTitle || "Tab " + (i + 1);
      panel.classList.toggle("is-active", i === 0);
      btn.addEventListener("click", function () {
        tabs.querySelectorAll(".tabs__btn").forEach(function (b) { b.classList.remove("is-active"); });
        panels.forEach(function (p) { p.classList.remove("is-active"); });
        btn.classList.add("is-active");
        panel.classList.add("is-active");
      });
      nav.appendChild(btn);
    });
    tabs.insertBefore(nav, tabs.firstChild);
  });
})();
