(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var preloader = document.getElementById('preloader');
  var nav = document.getElementById('navbar');
  var stickyCta = document.getElementById('stickyCta');
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuOpen = false;

  function setBodyScrollLocked(locked) {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  function closeMobile() {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    setBodyScrollLocked(false);
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }

  window.addEventListener('load', function () {
    var delay = reduceMotion ? 0 : 1200;
    setTimeout(function () {
      if (preloader) preloader.classList.add('hidden');
    }, delay);
  });

  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
    if (stickyCta) {
      stickyCta.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) {
      closeMobile();
      hamburger.focus();
    }
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      menuOpen = !menuOpen;
      mobileMenu.classList.toggle('open', menuOpen);
      mobileMenu.setAttribute('aria-hidden', menuOpen ? 'false' : 'true');
      hamburger.setAttribute('aria-expanded', menuOpen ? 'true' : 'false');
      setBodyScrollLocked(menuOpen);
      var s = hamburger.querySelectorAll('span');
      if (menuOpen) {
        s[0].style.transform = 'rotate(45deg) translate(4px,4px)';
        s[1].style.opacity = '0';
        s[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
      } else {
        s[0].style.transform = '';
        s[1].style.opacity = '1';
        s[2].style.transform = '';
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobile);
    });
  }

  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  function setFormStatus(el, text) {
    if (el) el.textContent = text;
  }

  function handleSubmit(e) {
    e.preventDefault();
    var form = e.target;
    if (!form.reportValidity()) return;

    var btn = form.querySelector('.form-submit');
    var statusEl = document.getElementById('form-status');
    var action = form.getAttribute('action') || '';
    var netlify = form.getAttribute('data-netlify') === 'true';
    var formspree = action.indexOf('formspree.io') !== -1;
    var originalText = btn.textContent;
    var originalBg = btn.style.background;

    btn.disabled = true;
    btn.textContent = 'Envoi en cours...';
    btn.style.opacity = '0.85';
    setFormStatus(statusEl, 'Envoi du formulaire en cours.');

    function success() {
      btn.textContent = '\u2713 Merci ! Nous vous recontactons très vite';
      btn.style.background = '#A8B5A0';
      btn.style.opacity = '1';
      setFormStatus(statusEl, 'Message envoyé. Merci.');
      form.reset();
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.style.opacity = '';
        setFormStatus(statusEl, '');
      }, 5000);
    }

    function fail() {
      btn.textContent = 'Erreur — appelez le 06 27 34 03 31';
      btn.style.background = '#6B5B4F';
      btn.style.opacity = '1';
      setFormStatus(statusEl, "Erreur d'envoi. Merci de nous appeler au 06 27 34 03 31.");
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = originalBg;
        btn.style.opacity = '';
        setFormStatus(statusEl, '');
      }, 6000);
    }

    function finish() {
      btn.disabled = false;
    }

    if (formspree) {
      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('bad');
          success();
        })
        .catch(fail)
        .finally(finish);
      return;
    }

    if (netlify) {
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('bad');
          success();
        })
        .catch(fail)
        .finally(finish);
      return;
    }

    btn.textContent = 'Configurer Netlify ou Formspree';
    btn.style.background = '';
    btn.style.opacity = '1';
    setFormStatus(statusEl, 'Voir DEPLOY.md pour activer l’envoi du formulaire.');
    setTimeout(function () {
      btn.textContent = originalText;
      btn.style.opacity = '';
      setFormStatus(statusEl, '');
      btn.disabled = false;
    }, 5000);
  }

  var leadForm = document.getElementById('leadForm');
  if (leadForm) leadForm.addEventListener('submit', handleSubmit);

  var scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }
      var t = document.querySelector(href);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
      }
    });
  });
})();
