// ===== 1. Mobile burger menu =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');

burger.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  burger.classList.toggle('is-open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

// Close the menu after tapping a link
nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ===== 2. "Choose" buttons in pricing pre-fill the form =====
const planSelect = document.getElementById('plan-select');

document.querySelectorAll('[data-plan]').forEach((btn) => {
  btn.addEventListener('click', () => {
    planSelect.value = btn.dataset.plan;
  });
});

// ===== 3. Date field: can't pick a date in the past =====
const dateInput = document.querySelector('input[name="date"]');
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset()); // local date, not UTC
dateInput.min = today.toISOString().split('T')[0];

// ===== 4. Form validation =====
const form = document.getElementById('booking-form');
const successMsg = document.getElementById('form-success');

// Each rule returns an error message, or '' if the value is OK
const rules = {
  name: (v) => (v.trim().length < 2 ? 'Please enter your name' : ''),
  phone: (v) => (v.replace(/\D/g, '').length < 10 ? 'Enter a valid 10-digit phone number' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email'),
  zip: (v) => (/^\d{5}$/.test(v) ? '' : 'ZIP must be 5 digits'),
  date: (v) => {
    if (!v) return 'Pick a date';
    if (v < dateInput.min) return 'Date cannot be in the past';
    return '';
  },
};

function validateField(input) {
  const rule = rules[input.name];
  if (!rule) return true;

  const error = rule(input.value);
  const field = input.closest('.field');
  field.classList.toggle('is-invalid', Boolean(error));
  field.querySelector('.field__error').textContent = error;
  return !error;
}

// Re-check a field as soon as the user fixes it
form.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    if (input.closest('.field').classList.contains('is-invalid')) validateField(input);
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault(); // stop the page from reloading

  const inputs = [...form.querySelectorAll('input')];
  const allValid = inputs.map(validateField).every(Boolean);

  if (!allValid) {
    form.querySelector('.is-invalid input').focus();
    return;
  }

  // Collect data from the form
  const data = Object.fromEntries(new FormData(form));
  console.log('Booking request:', data);

  // NOTE: this is a demo — the data is not sent anywhere yet.
  // For a real client, connect a form service (Formspree, Web3Forms)
  // or a backend that emails/texts the business owner.

  form.reset();
  dateInput.min = today.toISOString().split('T')[0];
  successMsg.hidden = false;
  setTimeout(() => (successMsg.hidden = true), 6000);
});
