const modalBtn = document.getElementById('warranty-modal-btn');
const modal = document.getElementById('warranty-modal');
const overlay = document.getElementById('warranty-overlay');
const closeBtn = document.getElementById('warranty-modal-close');

function openModal() {
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

modalBtn.addEventListener('click', openModal);
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
