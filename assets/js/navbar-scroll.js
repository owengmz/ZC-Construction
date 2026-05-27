/**
 * Navbar scroll effect
 * - Transparent on top
 * - Frosted glass (backdrop-blur) after first scroll
 */
(function () {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLLED_CLASSES = [
    'bg-background/80',
    'backdrop-blur-md',
    'border-b',
    'border-surface-variant',
    'shadow-sm',
  ];

  function update() {
    if (window.scrollY > 10) {
      header.classList.add(...SCROLLED_CLASSES);
    } else {
      header.classList.remove(...SCROLLED_CLASSES);
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run once on load
})();
