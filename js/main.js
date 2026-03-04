(() => {
  "use strict";

  const qs = (sel) => document.querySelector(sel);
  const qsa = (sel) => Array.from(document.querySelectorAll(sel));
  const on = (el, evt, fn) => el && el.addEventListener(evt, fn);

  window.addEventListener("DOMContentLoaded", () => {
    const opening = qs("#videoOpening");
    const video = qs("#openingVideo");
    const page = qs("#page");

    const navLinks = qs("#navLinks");
    const navLangBtn = qs("#langBtn");
    const btnEN = qs("#langEN");
    const btnKR = qs("#langKR");
    const transEls = qsa("[data-en]");

    function stopVideoHard() {
      try {
        if (!video) return;
        video.pause();
        video.currentTime = 0;
        video.removeAttribute("src");
        const srcEl = video.querySelector("source");
        if (srcEl) srcEl.removeAttribute("src");
        video.load();
      } catch (e) {}
    }

    function endOpening() {
      if (page) page.style.opacity = "1";
      stopVideoHard();

      if (!opening) return;
      opening.classList.add("hidden");
      opening.addEventListener("transitionend", () => opening.remove(), { once: true });
    }

    on(video, "ended", endOpening);

    function toggleMenu() {
      if (!navLinks) return;
      navLinks.classList.toggle("show");
    }
    window.toggleMenu = toggleMenu;

    const contentSections = qsa("section.content");
    function revealOnScroll() {
      contentSections.forEach((sec) => {
        const rect = sec.getBoundingClientRect();
        if (rect.top < window.innerHeight - 120) sec.classList.add("visible");
      });
    }
    on(window, "scroll", revealOnScroll);
    on(window, "load", revealOnScroll);

    const navA = qsa(".nav-links a");
    function highlightNav() {
      navA.forEach((a) => {
        const id = a.getAttribute("href");
        if (!id) return;
        const sec = qs(id);
        if (!sec) return;
        const r = sec.getBoundingClientRect();
        if (r.top <= 110 && r.bottom >= 110) {
          navA.forEach((x) => x.classList.remove("active"));
          a.classList.add("active");
        }
      });
    }
    on(window, "scroll", highlightNav);
    on(window, "load", highlightNav);

    function setLang(lang) {
      transEls.forEach((el) => {
        el.innerHTML = lang === "kr" ? el.dataset.kr : el.dataset.en;
      });

      if (navLangBtn) navLangBtn.innerText = lang === "kr" ? "KR" : "EN";

      if (btnEN && btnKR) {
        if (lang === "kr") {
          btnKR.classList.add("is-active"); btnKR.setAttribute("aria-pressed", "true");
          btnEN.classList.remove("is-active"); btnEN.setAttribute("aria-pressed", "false");
        } else {
          btnEN.classList.add("is-active"); btnEN.setAttribute("aria-pressed", "true");
          btnKR.classList.remove("is-active"); btnKR.setAttribute("aria-pressed", "false");
        }
      }
    }

    function toggleLang() {
      if (!navLangBtn) return;
      const cur = navLangBtn.innerText.trim().toLowerCase();
      setLang(cur === "kr" ? "en" : "kr");
    }

    function chooseLangAndEnter(lang) {
      setLang(lang);
      endOpening();
    }

    on(btnEN, "click", () => chooseLangAndEnter("en"));
    on(btnKR, "click", () => chooseLangAndEnter("kr"));
    on(navLangBtn, "click", toggleLang);

    function flipCard(card) {
      if (!card) return;
      card.classList.toggle("flipped");
    }
    window.flipCard = flipCard;

    /* ── Card reveal (scroll stagger) ── */
    function initCardReveals() {
      const containers = document.querySelectorAll(".cards-row, .program-list, .prize-grid");
      if (!containers.length) return;

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".card-reveal").forEach((card, i) => {
            setTimeout(() => {
              card.classList.add("animating");
              setTimeout(() => card.classList.remove("card-reveal", "animating"), 750);
            }, i * 130);
          });
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.12 });

      containers.forEach((c) => obs.observe(c));
    }
    initCardReveals();

    /* ── Section title reveal (cinematic slide-up) ── */
    function initTitleReveals() {
      const titles = qsa(".section-title");
      if (!titles.length) return;

      titles.forEach((t) => t.classList.add("title-hidden"));

      const obs = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("title-hidden");
          entry.target.classList.add("title-revealed");
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.3 });

      titles.forEach((t) => obs.observe(t));
    }
    initTitleReveals();

    /* ── Custom cursor ── */
    function initCursor() {
      const dot  = qs(".cursor-dot");
      const ring = qs(".cursor-ring");
      if (!dot || !ring) return;

      // Only activate on non-touch devices
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      let rx = 0, ry = 0;
      let rafId;

      function moveDot(x, y) {
        dot.style.left  = x + "px";
        dot.style.top   = y + "px";
      }

      function animateRing(tx, ty) {
        rx += (tx - rx) * 0.12;
        ry += (ty - ry) * 0.12;
        ring.style.left = rx + "px";
        ring.style.top  = ry + "px";
        rafId = requestAnimationFrame(() => animateRing(tx, ty));
      }

      let targetX = 0, targetY = 0;

      document.addEventListener("mousemove", (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
        moveDot(targetX, targetY);
        cancelAnimationFrame(rafId);
        animateRing(targetX, targetY);
      });

      document.addEventListener("mouseleave", () => {
        dot.style.opacity  = "0";
        ring.style.opacity = "0";
      });
      document.addEventListener("mouseenter", () => {
        dot.style.opacity  = "1";
        ring.style.opacity = "1";
      });
    }
    initCursor();
  });
})();
