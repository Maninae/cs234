/* ═══════════════════════════════════════════════════════════════
   CS234 Reinforcement Learning — Lecture Page JS
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Build Table of Contents from h2/h3 headings ──
  function buildToC() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    const article = document.querySelector('.lecture-article');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'section-' + i;

      if (h.tagName === 'H2') {
        var section = document.createElement('div');
        section.className = 'nav-section';
        section.innerHTML =
          '<a class="nav-item toc-link" href="#' + h.id + '" data-id="' + h.id + '">' +
          '<span>' + h.textContent + '</span></a>';
        nav.appendChild(section);
      } else {
        var link = document.createElement('a');
        link.className = 'nav-sub-item toc-link';
        link.href = '#' + h.id;
        link.dataset.id = h.id;
        link.textContent = h.textContent;
        // Append to last nav-section, or directly to nav
        var lastSection = nav.querySelector('.nav-section:last-child');
        if (lastSection) {
          lastSection.appendChild(link);
        } else {
          nav.appendChild(link);
        }
      }
    });
  }

  // ── Active section tracking ──
  function updateActiveSection() {
    var links = document.querySelectorAll('.toc-link');
    var headings = document.querySelectorAll('.lecture-article h2, .lecture-article h3');
    var current = '';

    headings.forEach(function (h) {
      var top = h.getBoundingClientRect().top;
      if (top < 120) current = h.id;
    });

    links.forEach(function (link) {
      link.classList.toggle('active', link.dataset.id === current);
    });
  }

  // ── Scroll progress bar ──
  function updateProgress() {
    var scrolled = window.scrollY;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    var pct = total > 0 ? (scrolled / total) * 100 : 0;
    var bar = document.querySelector('.progress-bar .bar');
    if (bar) bar.style.width = pct + '%';
  }

  // ── Mobile sidebar toggle ──
  window.toggleSidebar = function () {
    document.querySelector('.sidebar').classList.toggle('open');
    document.querySelector('.menu-overlay').classList.toggle('open');
  };

  // ── Initialize ──
  document.addEventListener('DOMContentLoaded', function () {
    buildToC();
    updateActiveSection();

    window.addEventListener('scroll', function () {
      updateActiveSection();
      updateProgress();
    }, { passive: true });

    // Close mobile sidebar on nav click
    document.querySelectorAll('.toc-link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          window.toggleSidebar();
        }
      });
    });
  });
})();
