/* Hero particle system — lightweight DOM-based floating dots */
(function () {
  'use strict';

  var COLORS = [
    'rgba(59,141,181,VAL)',   /* blue  */
    'rgba(15,158,142,VAL)',   /* teal  */
    'rgba(248,213,194,VAL)',  /* peach */
    'rgba(184,220,217,VAL)',  /* sea   */
    'rgba(212,168,68,VAL)',   /* gold  */
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

    var count = window.innerWidth < 640 ? 14 : 26;

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'particle';

      var size    = (Math.random() * 4 + 2).toFixed(1);       /* 2–6 px  */
      var x       = (Math.random() * 96 + 2).toFixed(1);      /* 2–98 %  */
      var y       = (Math.random() * 88 + 6).toFixed(1);      /* 6–94 %  */
      var dur     = (Math.random() * 11 + 10).toFixed(1);     /* 10–21 s */
      var delay   = (Math.random() * -14).toFixed(1);         /* stagger via negative delay */
      var drift   = ((Math.random() - 0.5) * 90).toFixed(0);  /* ±45 px  */
      var opacity = (Math.random() * 0.40 + 0.20).toFixed(2); /* 0.20–0.60 */
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
