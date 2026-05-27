/**
 * Navbar scroll effect
 * - Transparent on top
 * - Frosted glass (backdrop-blur) after first scroll
 */
export function initNavbarScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const SCROLLED_CLASSES = [
    'bg-background/80',
    'backdrop-blur-md',
    'border-surface-variant',
    'shadow-sm',
  ];

  function update() {
    if (window.scrollY > 10) {
      header.classList.add(...SCROLLED_CLASSES);
      header.classList.remove('border-transparent');
    } else {
      header.classList.remove(...SCROLLED_CLASSES);
      header.classList.add('border-transparent');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update(); // run once on load
}
