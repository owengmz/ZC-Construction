export function initLightbox() {
  const lightboxHTML = `
    <div id="lightbox" class="fixed inset-0 z-[200] hidden items-center justify-center">
      <div id="lightbox-overlay" class="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
      <button id="lightbox-close"
        class="absolute top-6 right-6 z-20 text-outline hover:text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
      <button id="lightbox-prev"
        class="absolute left-4 md:left-8 z-20 text-outline hover:text-white transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
        </svg>
      </button>
      <button id="lightbox-next"
        class="absolute right-4 md:right-8 z-20 text-outline hover:text-white transition-colors p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none"
          viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
        </svg>
      </button>
      <div class="relative z-10 max-w-5xl max-h-[85vh] mx-4">
        <img id="lightbox-img" src="" alt=""
          class="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl" />
        <p id="lightbox-caption"
          class="text-center text-outline font-label-caps text-label-caps mt-4 uppercase tracking-widest"></p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const triggers = document.querySelectorAll('.lightbox-trigger');
  if (triggers.length === 0) return;

  const images = Array.from(triggers).map(btn => ({
    src: btn.querySelector('img').src,
    alt: btn.querySelector('img').alt,
    caption: btn.querySelector('span')?.textContent || '',
  }));

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const overlay = document.getElementById('lightbox-overlay');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  let currentIndex = 0;

  function show(index) {
    currentIndex = index;
    lightboxImg.src = images[index].src;
    lightboxImg.alt = images[index].alt;
    lightboxCaption.textContent = images[index].caption;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    document.body.style.overflow = '';
  }

  function prev() {
    show((currentIndex - 1 + images.length) % images.length);
  }

  function next() {
    show((currentIndex + 1) % images.length);
  }

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = parseInt(btn.dataset.index, 10);
      show(index);
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  prevBtn.addEventListener('click', prev);
  nextBtn.addEventListener('click', next);

  document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}
