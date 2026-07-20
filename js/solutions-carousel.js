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
  var originalSlides = track ? Array.prototype.slice.call(track.querySelectorAll('[data-solutions-slide]')) : [];
  var originalSlideCount = originalSlides.length;
  var currentIndex = 1;
  var pointerStartX = null;
  var swipeThreshold = 48;
  var isAnimating = false;
  var reduceMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  if (!viewport || !track || !prevButton || !nextButton || !pagination || !originalSlideCount) {
    return;
  }

  var firstClone = originalSlides[0].cloneNode(true);
  var lastClone = originalSlides[originalSlideCount - 1].cloneNode(true);
  firstClone.setAttribute('data-clone', 'first');
  lastClone.setAttribute('data-clone', 'last');
  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalSlides[0]);

  var allSlides = Array.prototype.slice.call(track.querySelectorAll('[data-solutions-slide]'));

  var dots = originalSlides.map(function (_, index) {
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'solutions-carousel-dot';
    dot.setAttribute('aria-label', 'Go to solution ' + (index + 1));
    dot.addEventListener('click', function () {
      moveTo(index + 1);
    });
    pagination.appendChild(dot);
    return dot;
  });

  function getRealIndex() {
    if (currentIndex === 0) {
      return originalSlideCount - 1;
    }

    if (currentIndex === allSlides.length - 1) {
      return 0;
    }

    return currentIndex - 1;
  }

  function getSlidePosition(index) {
    if (index === 0) {
      return originalSlideCount;
    }

    if (index === allSlides.length - 1) {
      return 1;
    }

    return index;
  }

  function render(animate) {
    var realIndex = getRealIndex();

    track.style.transition = animate ? '' : 'none';
    track.style.transform = 'translateX(-' + currentIndex * 100 + '%)';

    allSlides.forEach(function (slide, index) {
      var slidePosition = getSlidePosition(index);
      var isActive = index === currentIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      slide.setAttribute('aria-label', 'Solution ' + slidePosition + ' of ' + originalSlideCount);
    });

    dots.forEach(function (dot, index) {
      var isActive = index === realIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
  }

  function shouldAnimate() {
    return !(reduceMotionQuery && reduceMotionQuery.matches);
  }

  function finishMove() {
    if (currentIndex === 0) {
      currentIndex = originalSlideCount;
      render(false);
    } else if (currentIndex === allSlides.length - 1) {
      currentIndex = 1;
      render(false);
    }

    track.getBoundingClientRect();
    track.style.transition = '';
    isAnimating = false;
  }

  function moveTo(index) {
    if (isAnimating || index === currentIndex) {
      return;
    }

    var animate = shouldAnimate();
    currentIndex = index;
    isAnimating = true;
    render(animate);

    if (!animate) {
      finishMove();
    }
  }

  prevButton.addEventListener('click', function () {
    moveTo(currentIndex - 1);
  });

  nextButton.addEventListener('click', function () {
    moveTo(currentIndex + 1);
  });

  viewport.addEventListener('pointerdown', function (event) {
    if (isAnimating) {
      return;
    }

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
      moveTo(currentIndex + 1);
    } else {
      moveTo(currentIndex - 1);
    }
  });

  viewport.addEventListener('pointerleave', function () {
    pointerStartX = null;
  });

  viewport.addEventListener('pointercancel', function () {
    pointerStartX = null;
  });

  track.addEventListener('transitionend', function (event) {
    if (event.target !== track || event.propertyName !== 'transform') {
      return;
    }

    finishMove();
  });

  render(false);
})();
