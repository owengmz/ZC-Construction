const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // TODO: Reemplazar con EmailJS
  // emailjs.sendForm('service_id', 'template_id', form)

  feedback.textContent = document.documentElement.dataset.lang === 'es'
    ? '¡Mensaje recibido! Te contactaremos pronto.'
    : "Message received! We'll contact you soon.";
  feedback.className =
    'text-center py-3 font-body-md rounded-sm mt-4 bg-primary/10 text-primary border border-primary/20';

  form.reset();

  setTimeout(() => {
    feedback.className = 'hidden';
  }, 5000);
});
