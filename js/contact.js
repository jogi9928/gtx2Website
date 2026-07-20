(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = form.querySelector('.submit-btn');
  var btnLabel = submitBtn.querySelector('.btn-label');
  var statusEl = form.querySelector('.form-status');
  var submitFrame = document.querySelector('iframe[name="' + form.target + '"]');

  var fields = [
    { id: 'name', required: true },
    { id: 'company', required: false },
    { id: 'role', required: false },
    { id: 'email', required: true },
    { id: 'message', required: true }
  ];

  function clearErrors() {
    fields.forEach(function (field) {
      var errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
      if (errorEl) errorEl.textContent = '';
    });
  }

  function setStatus(message, color) {
    statusEl.style.color = color || '';
    statusEl.textContent = message;
  }

  function validate() {
    clearErrors();
    var isValid = true;

    fields.forEach(function (field) {
      var input = document.getElementById(field.id);
      var errorEl = form.querySelector('[data-error-for="' + field.id + '"]');
      var value = input.value.trim();

      if (field.required && !value) {
        if (errorEl) errorEl.textContent = 'Required';
        isValid = false;
        return;
      }

      if (field.id === 'email' && value) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
          if (errorEl) errorEl.textContent = 'Enter a valid email';
          isValid = false;
        }
      }
    });

    return isValid;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.remove('is-sent');
    btnLabel.textContent = 'Sending...';
    setStatus('');

    var didFinish = false;

    function finishSubmit() {
      if (didFinish) return;
      didFinish = true;
      submitBtn.classList.add('is-sent');
      btnLabel.textContent = 'Sent';
      setStatus('Thanks. Your message has been submitted.');
      form.reset();
    }

    if (submitFrame) {
      submitFrame.addEventListener('load', finishSubmit, { once: true });
    }

    window.setTimeout(finishSubmit, 1500);
    HTMLFormElement.prototype.submit.call(form);
  });
})();
