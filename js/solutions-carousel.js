(function () {
  var carousel = document.querySelector('[data-solutions-carousel]');

  if (!carousel) {
    return;
  }

  var viewport = carousel.querySelector('[data-solutions-viewport]');
  var track = carousel.querySelector('[data-solutions-track]');
  var prevButton = carousel.querySelector('[data-solutions-prev]');
  var nextButton = carousel.querySelector('[data-solutions-next]');
  var pagination = carousel.querySelector('[data-solutions-pagination]');
  var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-solutions-slide]'));
  var currentIndex = 0;
  var pointerStartX = null;
  var swipeThreshold = 48;

  if (!viewport || !track || !prevButton || !nextButton || !pagination || !slides.length) {
    return;
  }

  var dots = slides.map(function (_, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'solutions-carousel-dot';
    dot.setAttribute('aria-label', 'Go to solution ' + (index + 1));
    dot.addEventListener('click', function () {
      goTo(index);
    });
    pagination.appendChild(dot);
    return dot;
  });

  function clampIndex(index) {
    return Math.max(0, Math.min(index, slides.length - 1));
  }

  function render() {
    track.style.transform = 'translateX(-' + currentIndex * 100 + '%)';
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === slides.length - 1;

    slides.forEach(function (slide, index) {
      var isActive = index === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      slide.setAttribute('aria-label', 'Solution ' + (index + 1) + ' of ' + slides.length);
    });

    dots.forEach(function (dot, index) {
      var isActive = index === currentIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function goTo(index) {
    currentIndex = clampIndex(index);
    render();
  }

  prevButton.addEventListener('click', function () {
    goTo(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    goTo(currentIndex + 1);
  });

  viewport.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    pointerStartX = event.clientX;
  });

  viewport.addEventListener('pointerup', function (event) {
    if (pointerStartX === null) {
      return;
    }

    var deltaX = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }

    if (deltaX < 0) {
      goTo(currentIndex + 1);
    } else {
      goTo(currentIndex - 1);
    }
  });

  viewport.addEventListener('pointerleave', function () {
    pointerStartX = null;
  });

  viewport.addEventListener('pointercancel', function () {
    pointerStartX = null;
  });

  render();
})();
