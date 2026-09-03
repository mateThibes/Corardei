/* ===================================================
   animations.js — Scroll Animations & Carousels
   Corardei — 2026
   =================================================== */

/* ----- 1. SCROLL-TRIGGERED ANIMATIONS (Intersection Observer) ----- */
(function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach((el) => observer.observe(el));
})();

/* ----- 2. CAROUSEL ENGINE ----- */
class Carousel {
  /**
   * @param {HTMLElement} container  — the .carousel wrapper
   * @param {Object} opts
   *   mode: 'slide' | 'fade'
   *   autoplay: boolean
   *   interval: ms
   */
  constructor(container, opts = {}) {
    this.container = container;
    this.mode = opts.mode || 'slide';
    this.autoplay = opts.autoplay ?? true;
    this.interval = opts.interval || 5000;

    this.track = container.querySelector('.carousel-track');
    this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    this.prevBtn = container.querySelector('.carousel-prev');
    this.nextBtn = container.querySelector('.carousel-next');
    this.dotsContainer = container.querySelector('.carousel-dots');

    this.current = 0;
    this.total = this.slides.length;
    this.timer = null;

    if (!this.track || this.total === 0) return;

    this.init();
  }

  init() {
    // Create dots
    if (this.dotsContainer) {
      this.slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        dot.setAttribute('aria-label', `Ir al slide ${i + 1}`);
        dot.addEventListener('click', () => this.goTo(i));
        this.dotsContainer.appendChild(dot);
      });
    }

    // Mode setup
    if (this.mode === 'fade') {
      this.track.classList.add('carousel-track--fade');
      this.slides.forEach((s, i) => {
        s.style.position = 'absolute';
        s.style.inset = '0';
        s.style.opacity = i === 0 ? '1' : '0';
        s.style.transition = 'opacity 0.6s ease';
      });
      this.track.style.position = 'relative';
      this.setFadeTrackHeight();
      window.addEventListener('resize', () => this.setFadeTrackHeight());
    }

    // Arrows
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    // Touch / swipe support
    this.initSwipe();

    this.render();
    if (this.autoplay) this.startAutoplay();
  }

  setFadeTrackHeight() {
    let maxH = 0;
    this.slides.forEach((s) => {
      s.style.position = 'relative';
      maxH = Math.max(maxH, s.offsetHeight);
      s.style.position = 'absolute';
    });
    this.track.style.minHeight = maxH + 'px';
  }

  goTo(index) {
    this.current = ((index % this.total) + this.total) % this.total;
    this.render();
    if (this.autoplay) this.resetAutoplay();
  }

  next() { this.goTo(this.current + 1); }
  prev() { this.goTo(this.current - 1); }

  render() {
    if (this.mode === 'slide') {
      this.track.style.transform = `translateX(-${this.current * 100}%)`;
    } else {
      // fade
      this.slides.forEach((s, i) => {
        s.style.opacity = i === this.current ? '1' : '0';
        s.style.pointerEvents = i === this.current ? 'auto' : 'none';
      });
    }

    // Dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === this.current));
    }
  }

  startAutoplay() {
    this.timer = setInterval(() => this.next(), this.interval);
  }

  resetAutoplay() {
    clearInterval(this.timer);
    this.startAutoplay();
  }

  initSwipe() {
    let startX = 0;
    let deltaX = 0;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    this.track.addEventListener('touchmove', (e) => {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });

    this.track.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > 50) {
        deltaX < 0 ? this.next() : this.prev();
      }
      deltaX = 0;
    });
  }
}

/* Auto-init carousels on DOMContentLoaded */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.carousel').forEach((el) => {
    const mode = el.dataset.carouselMode || 'slide';
    new Carousel(el, { mode });
  });
});
