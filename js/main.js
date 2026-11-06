/* Свадьба Ильи и Екатерины — 27 февраля 2027 */
(function () {
  'use strict';

  /* Класс .js — анимации появления только при включённом JS */
  document.documentElement.classList.add('js');

  /* ---------- Обратный отсчёт до 27.02.2027 09:30 ---------- */
  var target = new Date(2027, 1, 27, 9, 30, 0);

  function pad(n) { return n < 10 ? '0' + n : String(n); }

  function tick() {
    var diff = target - new Date();
    var days = document.getElementById('cd-days');
    if (!days) return;

    if (diff <= 0) {
      days.textContent = '00';
      document.getElementById('cd-hours').textContent = '00';
      document.getElementById('cd-mins').textContent = '00';
      document.getElementById('cd-secs').textContent = '00';
      return;
    }

    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;

    days.textContent = String(d);
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-mins').textContent = pad(m);
    document.getElementById('cd-secs').textContent = pad(sec);
  }

  if (document.getElementById('cd-days')) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Плавное появление секций ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Чек-лист шафера (сохранение в localStorage) ---------- */
  var boxes = document.querySelectorAll('.check input[type="checkbox"]');
  if (boxes.length) {
    var STORE_KEY = 'shafer-checklist-v1';
    var state = {};
    try { state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch (e) { state = {}; }

    var fill = document.getElementById('progress-fill');
    var value = document.getElementById('progress-value');

    function updateProgress() {
      var total = boxes.length, done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      var pct = Math.round((done / total) * 100);
      if (fill) fill.style.width = pct + '%';
      if (value) value.textContent = pct + '%';
    }

    boxes.forEach(function (box) {
      var key = box.getAttribute('data-key');
      if (state[key]) box.checked = true;
      box.addEventListener('change', function () {
        state[key] = box.checked;
        try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* приватный режим */ }
        updateProgress();
      });
    });

    updateProgress();
  }
})();
