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

      document.documentElement.lang = lang === "kr" ? "ko" : "en";
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

    // Initialize language on load based on active button (default: KR)
    const initLang = btnKR && btnKR.classList.contains("is-active") ? "kr" : "en";
    setLang(initLang);

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
  

  

  /* ── Program Carousel ── */
  function initProgramCarousel() {
    const track = document.getElementById('progTrack');
    const prevBtn = document.getElementById('progPrev');
    const nextBtn = document.getElementById('progNext');
    const progressBar = document.getElementById('progProgressBar');
    const autoBar = document.getElementById('progAutoBar');
    if (!track || !prevBtn || !nextBtn) return;

    const slides = Array.from(track.querySelectorAll('.prog-slide'));
    const total = slides.length;
    let current = 0;
    let autoTimer = null;
    const AUTO_DELAY = 10000; // 15 seconds

    function goTo(idx, resetAuto) {
      if (idx < 0 || idx >= total) return;
      current = idx;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      if (progressBar) {
        progressBar.style.width = ((current + 1) / total * 100) + '%';
      }
      prevBtn.disabled = current === 0;
      // Never disable next so auto can loop (or stop at end)
      nextBtn.disabled = false;

      // Auto-progress bar: reset & restart
      if (autoBar) {
        autoBar.classList.remove('running');
        // Force reflow so transition restarts
        void autoBar.offsetWidth;
        if (current < total - 1) {
          autoBar.classList.add('running');
        }
      }

      if (resetAuto !== false) startAutoTimer();
    }

    function startAutoTimer() {
      if (autoTimer) clearTimeout(autoTimer);
      if (current >= total - 1) return; // stop at last slide
      autoTimer = setTimeout(() => {
        goTo(current + 1, true);
      }, AUTO_DELAY);
    }

    on(prevBtn, 'click', () => { goTo(current - 1, true); });
    on(nextBtn, 'click', () => { goTo(current + 1, true); });

    // Swipe support
    let touchStartX = 0;
    const wrap = track.parentElement;
    wrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1), true);
    }, { passive: true });

    goTo(0, true);
  }
  initProgramCarousel();

  /* ── 주사기 커서 (#program 전용) ── */
  (function () {
    const programSection = qs('#program');
    if (!programSection) return;

    const cur = document.createElement('div');
    cur.id = 'syringe-cursor';
    // 주사기 SVG — 45° 기울기, 바늘 끝 + 배럴 하단 절반만 표시
    // rotate(225°) 적용 시 바늘 끝(20,0)이 좌하단 (~6,34)으로 이동
    cur.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <g transform="rotate(225,20,20)">
    <polygon points="19.2,4 20.8,4 20,0" fill="#2C5C7A"/>
    <rect x="19.3" y="4" width="1.4" height="9" fill="#3B8DB5"/>
    <rect x="17" y="13" width="6" height="15" rx="2"
          fill="#D4EEF7" stroke="#3B8DB5" stroke-width="1"/>
    <line x1="17" y1="18" x2="23" y2="18"
          stroke="#3B8DB5" stroke-width="0.8" opacity="0.55"/>
    <line x1="17" y1="22" x2="23" y2="22"
          stroke="#3B8DB5" stroke-width="0.8" opacity="0.55"/>
    <line x1="17" y1="26" x2="23" y2="26"
          stroke="#3B8DB5" stroke-width="0.8" opacity="0.55"/>
  </g>
</svg>`;
    document.body.appendChild(cur);

    const programList = programSection.querySelector('.program-list');

    on(programList, 'mouseenter', () => { cur.style.display = 'block'; });
    on(programList, 'mouseleave', () => { cur.style.display = 'none'; });
    document.addEventListener('mousemove', (e) => {
      cur.style.left = e.clientX + 'px';
      cur.style.top  = e.clientY + 'px';
    });
  })();

});
})();
