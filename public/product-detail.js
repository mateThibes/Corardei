/* ===================================================
   product-detail.js — Gallery, Zoom & Product Rendering
   Corardei — 2026
   =================================================== */

(function () {
  'use strict';

  /* ----- 1. EXTRACT SLUG FROM URL ----- */
  const pathParts = window.location.pathname.split('/');
  const slug = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];

  if (typeof PRODUCTS === 'undefined' || !PRODUCTS[slug]) {
    document.querySelector('.product-detail-main').innerHTML =
      '<div style="text-align:center;padding:6rem 2rem;">' +
      '<h1>Producto no encontrado</h1>' +
      '<p style="margin:1rem 0 2rem;">El producto que buscás no existe.</p>' +
      '<a href="/productos" class="product-detail-back">← Volver a productos</a>' +
      '</div>';
    return;
  }

  const product = PRODUCTS[slug];

  /* ----- 2. POPULATE PAGE CONTENT ----- */
  document.title = `Corardei — ${product.name}`;

  // Breadcrumb
  document.getElementById('breadcrumb-category').textContent = product.category;
  document.getElementById('breadcrumb-name').textContent = product.name;

  // Product info
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = product.price;
  document.getElementById('product-price-note').textContent = product.priceNote || '';

  const priceAltEl = document.getElementById('product-price-alt');
  if (product.priceAlt) {
    priceAltEl.textContent = product.priceAlt;
  } else {
    priceAltEl.style.display = 'none';
  }

  const promoEl = document.getElementById('product-promo');
  if (product.promo) {
    document.getElementById('product-promo-text').textContent = product.promo;
  } else {
    promoEl.style.display = 'none';
  }

  document.getElementById('product-description').textContent = product.description;

  // Variants
  const variantsSection = document.getElementById('product-variants-section');
  const variantsList = document.getElementById('product-variants');
  if (product.variants && product.variants.length > 0) {
    product.variants.forEach((v, i) => {
      const btn = document.createElement('button');
      btn.className = 'variant-btn' + (i === 0 ? ' active' : '');
      btn.innerHTML = `<img src="${v.image}" alt="${v.name}" class="variant-thumb"><span>${v.name}</span>`;
      btn.addEventListener('click', () => {
        selectMainImage(v.image);
        document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Also highlight corresponding thumbnail
        highlightThumbnail(v.image);
      });
      variantsList.appendChild(btn);
    });
  } else {
    variantsSection.style.display = 'none';
  }

  // Details
  const detailsList = document.getElementById('product-details');
  product.details.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    detailsList.appendChild(li);
  });

  /* ----- 3. GALLERY ----- */
  const thumbnailsContainer = document.getElementById('gallery-thumbnails');
  const mainImg = document.getElementById('gallery-main-img');
  const mainContainer = document.getElementById('gallery-main');
  const zoomResult = document.getElementById('zoom-result');

  let currentImage = product.images[0];

  // Build thumbnails
  product.images.forEach((src, i) => {
    const thumb = document.createElement('button');
    thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
    thumb.dataset.src = src;
    thumb.innerHTML = `<img src="${src}" alt="Foto ${i + 1}">`;
    thumb.addEventListener('click', () => {
      selectMainImage(src);
      highlightThumbnail(src);
    });
    thumbnailsContainer.appendChild(thumb);
  });

  // Set initial image
  mainImg.src = currentImage;
  mainImg.alt = product.name;

  function selectMainImage(src) {
    currentImage = src;
    mainImg.src = src;
    // Preload for zoom
    zoomResult.style.backgroundImage = `url('${src}')`;
  }

  function highlightThumbnail(src) {
    document.querySelectorAll('.gallery-thumb').forEach(t => {
      t.classList.toggle('active', t.dataset.src === src);
    });
  }

  /* ----- 4. ZOOM ON HOVER (Desktop only) ----- */
  const ZOOM_FACTOR = 2.5;
  let isZooming = false;

  // Only enable zoom on non-touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    mainContainer.addEventListener('mouseenter', () => {
      isZooming = true;
      zoomResult.style.backgroundImage = `url('${currentImage}')`;
      zoomResult.style.backgroundSize = `${mainContainer.offsetWidth * ZOOM_FACTOR}px ${mainContainer.offsetHeight * ZOOM_FACTOR}px`;
      zoomResult.classList.add('active');
      mainContainer.classList.add('zooming');
    });

    mainContainer.addEventListener('mouseleave', () => {
      isZooming = false;
      zoomResult.classList.remove('active');
      mainContainer.classList.remove('zooming');
    });

    mainContainer.addEventListener('mousemove', (e) => {
      if (!isZooming) return;

      const rect = mainContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Percentage position
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;

      // Move zoom background
      zoomResult.style.backgroundPosition = `${xPercent}% ${yPercent}%`;

      // Lens indicator on main image
      mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    });
  }
})();
