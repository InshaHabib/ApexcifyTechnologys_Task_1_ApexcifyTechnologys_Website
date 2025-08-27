// Utility: on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  setupMobileNav();
  setupScrollReveal();
  setupPortfolioFilters();
  setupLightbox();
  setupTestimonialsCarousel();
});

function setupMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('primary-navigation');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(el => observer.observe(el));
}

function setupPortfolioFilters() {
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
  const items = Array.from(document.querySelectorAll('.gallery__item'));
  if (filterButtons.length === 0) return;

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const active = document.querySelector('.filter-btn.is-active');
      if (active && active !== btn) {
        active.classList.remove('is-active');
        active.setAttribute('aria-pressed', 'false');
      }
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter || 'all';
      items.forEach(item => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        item.classList.toggle('is-hidden', !shouldShow);
      });
    });
  });
}

function setupLightbox() {
  const gallery = document.getElementById('gallery');
  const dialog = document.querySelector('.lightbox');
  const imgEl = dialog?.querySelector('.lightbox__image');
  const captionEl = dialog?.querySelector('.lightbox__caption');
  const prevBtn = dialog?.querySelector('.lightbox__prev');
  const nextBtn = dialog?.querySelector('.lightbox__next');
  const closeBtn = dialog?.querySelector('.lightbox__close');
  if (!gallery || !dialog || !imgEl || !captionEl || !prevBtn || !nextBtn || !closeBtn) return;

  const figures = Array.from(gallery.querySelectorAll('.gallery__item'));
  let currentIndex = 0;

  function openAt(index) {
    currentIndex = (index + figures.length) % figures.length;
    const figure = figures[currentIndex];
    const img = figure.querySelector('img');
    const caption = figure.querySelector('.gallery__caption')?.textContent || '';
    imgEl.src = img?.src || '';
    captionEl.textContent = caption;
    dialog.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    dialog.hidden = true;
    document.body.style.overflow = '';
  }

  figures.forEach((figure, idx) => {
    figure.addEventListener('click', () => openAt(idx));
    figure.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') openAt(idx);
    });
    figure.tabIndex = 0;
  });

  prevBtn.addEventListener('click', () => openAt(currentIndex - 1));
  nextBtn.addEventListener('click', () => openAt(currentIndex + 1));
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  window.addEventListener('keydown', (e) => {
    if (dialog.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
    if (e.key === 'ArrowRight') openAt(currentIndex + 1);
  });
}

function setupTestimonialsCarousel() {
  const track = document.querySelector('.carousel__track');
  const slides = Array.from(track?.querySelectorAll('.slide') || []);
  const prev = document.querySelector('.carousel .prev');
  const next = document.querySelector('.carousel .next');
  if (!track || slides.length === 0 || !prev || !next) return;

  let activeIndex = slides.findIndex(s => s.classList.contains('is-active'));
  if (activeIndex < 0) activeIndex = 0;

  function update(index) {
    slides[activeIndex]?.classList.remove('is-active');
    activeIndex = (index + slides.length) % slides.length;
    slides[activeIndex]?.classList.add('is-active');
  }

  prev.addEventListener('click', () => update(activeIndex - 1));
  next.addEventListener('click', () => update(activeIndex + 1));

  // Auto-advance
  let auto = setInterval(() => update(activeIndex + 1), 5000);
  [prev, next].forEach(btn => btn.addEventListener('click', () => {
    clearInterval(auto);
    auto = setInterval(() => update(activeIndex + 1), 6000);
  }));
}


