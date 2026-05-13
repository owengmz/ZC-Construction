const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;

  try {
    const res = await fetch('https://formspree.io/f/mwvyzlgd', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      feedback.textContent = document.documentElement.dataset.lang === 'es'
        ? '¡Mensaje enviado! Nos pondremos en contacto pronto.'
        : "Message sent! We'll be in touch soon.";
      feedback.className =
        'text-center py-3 font-body-md rounded-sm mt-4 bg-primary/10 text-primary border border-primary/20';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    feedback.textContent = document.documentElement.dataset.lang === 'es'
      ? 'Algo salió mal. Inténtalo de nuevo.'
      : 'Something went wrong. Please try again.';
    feedback.className =
      'text-center py-3 font-body-md rounded-sm mt-4 bg-error/10 text-error border border-error/20';
  } finally {
    btn.disabled = false;
    setTimeout(() => {
      feedback.className = 'hidden';
    }, 5000);
  }
});
