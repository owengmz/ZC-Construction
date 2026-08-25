const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const bar1 = document.getElementById('bar-1');
const bar2 = document.getElementById('bar-2');
const bar3 = document.getElementById('bar-3');
let menuOpen = false;

function openMobileMenu() {
  menuOpen = true;
  mobileMenu.style.opacity = '1';
  mobileMenu.style.pointerEvents = 'auto';
  bar1.style.transform = 'translateY(8px) rotate(45deg)';
  bar2.style.opacity = '0';
  bar3.style.transform = 'translateY(-8px) rotate(-45deg)';
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  menuOpen = false;
  mobileMenu.style.opacity = '0';
  mobileMenu.style.pointerEvents = 'none';
  bar1.style.transform = '';
  bar2.style.opacity = '1';
  bar3.style.transform = '';
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', () => menuOpen ? closeMobileMenu() : openMobileMenu());

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});
