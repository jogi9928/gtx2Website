(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = form.querySelector('.submit-btn');
  var btnLabel = submitBtn.querySelector('.btn-label');
  var statusEl = form.querySelector('.form-status');

  var fields = ['name', 'company', 'role', 'email', 'message'];

  function clearErrors() {
    fields.forEach(function (name) {
      var errorEl = form.querySelector('[data-error-for="' + name + '"]');
      if (errorEl) errorEl.textContent = '';
    });
  }

  function validate() {
    clearErrors();
    var isValid = true;

    fields.forEach(function (name) {
      var input = form.elements[name];
      var errorEl = form.querySelector('[data-error-for="' + name + '"]');
      var value = input.value.trim();

      if (!value) {
        if (errorEl) errorEl.textContent = 'Required';
        isValid = false;
        return;
      }

      if (name === 'email') {
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
    statusEl.textContent = '';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          submitBtn.classList.add('is-sent');
          btnLabel.textContent = 'Sent';
          statusEl.textContent = 'Thanks. We will follow up within one business day.';
          form.reset();
        } else {
          throw new Error('Submission failed');
        }
      })
      .catch(function () {
        submitBtn.disabled = false;
        btnLabel.textContent = 'Send message';
        statusEl.style.color = '#B3261E';
        statusEl.textContent = 'Something went wrong. Please try again or email us directly.';
      });
  });
})();
