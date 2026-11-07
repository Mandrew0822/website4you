/* website4you — interactions */
(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const EMAIL = "customwebsiteforyou@gmail.com";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Header state --------------------------------------------------------- */

  const header = $("#header");
  const updateHeader = () => header && header.classList.toggle("scrolled", window.scrollY > 8);

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* Mobile menu ---------------------------------------------------------- */

  const menuBtn = $(".menu-btn");
  const mobileMenu = $("#mobile-menu");

  const setMenu = (open) => {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
  };

  menuBtn?.addEventListener("click", () => setMenu(!menuBtn.classList.contains("open")));

  $$("#mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setMenu(false);
  });

  /* Mailto links --------------------------------------------------------- */

  const template = [
    "Hi website4you,",
    "",
    "I'd like a website made.",
    "",
    "Name / business:",
    "What I do:",
    "Type of site:",
    "Style I like:",
    "Timeline:",
    "Budget:",
    "Anything else:",
    "",
    "Thanks!",
  ].join("\n");

  const genericMailto =
    `mailto:${EMAIL}?subject=${encodeURIComponent("Website request — website4you")}` +
    `&body=${encodeURIComponent(template)}`;

  $$("[data-mail]").forEach((link) => {
    link.setAttribute("href", genericMailto);
  });

  /* Scroll reveal -------------------------------------------------------- */

  const revealItems = $$(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  /* Pointer glow --------------------------------------------------------- */

  const glow = $(".glow");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (!glow || reduceMotion || !finePointer) {
    if (glow) glow.style.display = "none";
  } else {
    let frame = null;

    window.addEventListener(
      "pointermove",
      (event) => {
        if (frame !== null) return;
        frame = window.requestAnimationFrame(() => {
          glow.style.setProperty("--mx", `${event.clientX}px`);
          glow.style.setProperty("--my", `${event.clientY}px`);
          frame = null;
        });
      },
      { passive: true }
    );
  }

  /* Brief form → mailto -------------------------------------------------- */

  const form = $("#brief");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const read = (key) => String(data.get(key) || "").trim();

    const name = read("name");
    const email = read("email");
    const business = read("business");
    const type = read("type");
    const message = read("message");

    const subject = `Website request — ${business || name || "new project"}`;

    const body = [
      "Hi website4you,",
      "",
      "I'd like a website made.",
      "",
      "Name: " + name,
      email ? "Email: " + email : null,
      business ? "Business / project: " + business : null,
      type ? "Type of site: " + type : null,
      "",
      "About the project:",
      message,
      "",
      "Thanks!",
    ]
      .filter((line) => line !== null)
      .join("\n");

    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;
  });
})();
