(function () {
  var links = document.querySelectorAll('.nav-link');
  var path = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    var target = link.getAttribute('href');
    var isActive = target === path || (path === '' && target === 'index.html');
    link.classList.toggle('active', isActive);
  });

  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
    });
  }
})();
