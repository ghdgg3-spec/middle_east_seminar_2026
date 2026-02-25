window.addEventListener("DOMContentLoaded", () => {

  /* ========= Video ========= */
  const opening = document.getElementById("videoOpening");
  const video = document.getElementById("openingVideo");
  const page = document.getElementById("page");

  function stopVideoHard(){
    try{
      video.pause();
      video.currentTime = 0;
      video.removeAttribute("src");
      const srcEl = video.querySelector("source");
      if(srcEl) srcEl.removeAttribute("src");
      video.load();
    } catch(e){}
  }

  function endOpening(){
    page.style.opacity = "1";
    stopVideoHard();
    opening.classList.add("hidden");
    opening.addEventListener("transitionend", () => opening.remove(), { once:true });
  }

  video.addEventListener("ended", endOpening);

  /* ========= Hamburger ========= */
  function toggleMenu(){
    document.getElementById("navLinks").classList.toggle("show");
  }
  // ✅ HTML에서 onclick="toggleMenu()" 쓰고 있으니 전역으로 노출
  window.toggleMenu = toggleMenu;

  /* ========= Scroll reveal ========= */
  const contentSections = document.querySelectorAll("section.content");
  function revealOnScroll(){
    contentSections.forEach(sec => {
      if(sec.getBoundingClientRect().top < window.innerHeight - 120){
        sec.classList.add("visible");
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

  /* ========= Active nav highlight ========= */
  const navA = document.querySelectorAll(".nav-links a");
  function highlightNav(){
    navA.forEach(a => {
      const sec = document.querySelector(a.getAttribute("href"));
      if(!sec) return;
      const r = sec.getBoundingClientRect();
      if(r.top <= 110 && r.bottom >= 110){
        navA.forEach(x => x.classList.remove("active"));
        a.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", highlightNav);
  window.addEventListener("load", highlightNav);

  /* ========= Language ========= */
  const navLangBtn = document.getElementById("langBtn");
  const btnEN = document.getElementById("langEN");
  const btnKR = document.getElementById("langKR");
  const transEls = Array.from(document.querySelectorAll("[data-en]"));

  function setLang(lang){
    requestAnimationFrame(() => {
      transEls.forEach(el => {
        el.innerHTML = (lang === "kr") ? el.dataset.kr : el.dataset.en;
      });
      navLangBtn.innerText = (lang === "kr") ? "KR" : "EN";
      if(lang === "kr"){
        btnKR.classList.add("is-active"); btnKR.setAttribute("aria-pressed","true");
        btnEN.classList.remove("is-active"); btnEN.setAttribute("aria-pressed","false");
      } else {
        btnEN.classList.add("is-active"); btnEN.setAttribute("aria-pressed","true");
        btnKR.classList.remove("is-active"); btnKR.setAttribute("aria-pressed","false");
      }
    });
  }

  function toggleLang(){
    setLang(navLangBtn.innerText.trim().toLowerCase() === "kr" ? "en" : "kr");
  }

  function chooseLangAndEnter(lang){
    setLang(lang);
    endOpening();
  }

  btnEN.addEventListener("click", () => chooseLangAndEnter("en"));
  btnKR.addEventListener("click", () => chooseLangAndEnter("kr"));
  navLangBtn.addEventListener("click", toggleLang);

  /* ========= Lucky Draw ========= */
  function flipCard(card){
    card.classList.toggle("flipped");
  }
  // ✅ HTML에서 onclick="flipCard(this)" 쓰고 있으니 전역으로 노출
  window.flipCard = flipCard;

});
