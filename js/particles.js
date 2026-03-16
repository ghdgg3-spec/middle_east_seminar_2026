/* Hero particle system — lightweight DOM-based floating dots */
(function () {
  'use strict';

  var COLORS = [
    'rgba(196,152,40,VAL)',   /* amber gold — warm light */
    'rgba(93,168,158,VAL)',   /* teal scrub — cool accent */
    'rgba(210,175,100,VAL)',  /* warm sand */
    'rgba(184,214,210,VAL)',  /* pale mint */
    'rgba(230,190,130,VAL)',  /* warm parchment dust */
  ];

  function init() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    var container = document.createElement('div');
    container.className = 'particles';
    container.setAttribute('aria-hidden', 'true');

    /* Insert right after .hero-orb so it sits below .hero-content (z-index 1) */
    var orb = hero.querySelector('.hero-orb');
    if (orb) {
      orb.after(container);
    } else {
      hero.insertBefore(container, hero.firstChild);
    }

    var count = window.innerWidth < 640 ? 8 : 14;

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'particle';

      var size    = (Math.random() * 4 + 2).toFixed(1);       /* 2–6 px  */
      var x       = (Math.random() * 96 + 2).toFixed(1);      /* 2–98 %  */
      var y       = (Math.random() * 88 + 6).toFixed(1);      /* 6–94 %  */
      var dur     = (Math.random() * 18 + 16).toFixed(1);     /* 16–34 s — slow & contemplative */
      var delay   = (Math.random() * -20).toFixed(1);         /* stagger via negative delay */
      var drift   = ((Math.random() - 0.5) * 50).toFixed(0);  /* ±25 px — gentle drift */
      var opacity = (Math.random() * 0.25 + 0.10).toFixed(2); /* 0.10–0.35 — subtle */
      var blur    = size > 4 ? 1.5 : 0.5;
      var color   = COLORS[Math.floor(Math.random() * COLORS.length)].replace('VAL', opacity);

      el.style.cssText = [
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + x + '%',
        'top:'    + y + '%',
        'background:' + color,
        'filter:blur(' + blur + 'px)',
        '--dur:'    + dur  + 's',
        '--delay:'  + delay + 's',
        '--drift:'  + drift + 'px',
        '--opacity:' + opacity,
      ].join(';');

      container.appendChild(el);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
