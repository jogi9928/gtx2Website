(function () {
  var carousel = document.querySelector('[data-feature-carousel]');

  if (!carousel) {
    return;
  }

  var track = carousel.querySelector('[data-feature-track]');
  var prevButton = carousel.querySelector('[data-feature-prev]');
  var nextButton = carousel.querySelector('[data-feature-next]');
  var slides = Array.prototype.slice.call(track.querySelectorAll('.feature-slide'));
  var originalSlideCount = slides.length;
  var currentIndex = 1;
  var pointerStartX = null;
  var isAnimating = false;

  if (!track || !originalSlideCount || !prevButton || !nextButton) {
    return;
  }

  var firstClone = slides[0].cloneNode(true);
  var lastClone = slides[originalSlideCount - 1].cloneNode(true);
  firstClone.setAttribute('data-clone', 'first');
  lastClone.setAttribute('data-clone', 'last');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  var allSlides = Array.prototype.slice.call(track.querySelectorAll('.feature-slide'));

  function getRealIndex() {
    if (currentIndex === 0) {
      return originalSlideCount - 1;
    }

    if (currentIndex === allSlides.length - 1) {
      return 0;
    }

    return currentIndex - 1;
  }

  function renderCarousel(animate) {
    track.style.transition = animate ? '' : 'none';
    track.style.transform = 'translateX(-' + currentIndex * 100 + '%)';

    allSlides.forEach(function (slide, index) {
      slide.classList.toggle('is-active', index === currentIndex);
      slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
    });
  }

  function moveTo(index) {
    if (isAnimating) {
      return;
    }

    currentIndex = index;
    isAnimating = true;
    renderCarousel(true);
  }

  prevButton.addEventListener('click', function () {
    moveTo(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    moveTo(currentIndex + 1);
  });

  track.addEventListener('pointerdown', function (event) {
    if (isAnimating) {
      return;
    }

    pointerStartX = event.clientX;
  });

  track.addEventListener('pointerup', function (event) {
    if (pointerStartX === null) {
      return;
    }

    var deltaX = event.clientX - pointerStartX;
    pointerStartX = null;

    if (Math.abs(deltaX) < 40) {
      return;
    }

    if (deltaX < 0) {
      moveTo(currentIndex + 1);
    } else if (deltaX > 0) {
      moveTo(currentIndex - 1);
    }
  });

  track.addEventListener('pointerleave', function () {
    pointerStartX = null;
  });

  track.addEventListener('transitionend', function () {
    if (currentIndex === 0) {
      currentIndex = originalSlideCount;
      renderCarousel(false);
    } else if (currentIndex === allSlides.length - 1) {
      currentIndex = 1;
      renderCarousel(false);
    }

    // Force the browser to commit the non-animated jump before restoring transitions.
    track.getBoundingClientRect();
    track.style.transition = '';
    isAnimating = false;
  });

  // Keep non-current slides hidden to assistive tech on first paint.
  allSlides.forEach(function (slide, index) {
    slide.setAttribute('aria-hidden', index === currentIndex ? 'false' : 'true');
  });

  renderCarousel(false);
})();
