(() => {
  'use strict';

  let playing = false;
  let scrollPosition = 0;
  let previousFocus = null;

  const lockPage = () => {
    scrollPosition = window.scrollY;
    document.documentElement.classList.add('is-alteration-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.right = '0';
    document.body.style.left = '0';
    document.body.style.width = '100%';
  };

  const unlockPage = () => {
    document.documentElement.classList.remove('is-alteration-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.right = '';
    document.body.style.left = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollPosition);
  };

  const play = ({ onChange, focusTarget } = {}) => {
    if (playing) return Promise.resolve(false);
    const overlay = document.querySelector('[data-alteration-overlay]');
    if (!overlay) {
      if (typeof onChange === 'function') onChange();
      return Promise.resolve(true);
    }

    playing = true;
    previousFocus = document.activeElement;
    lockPage();
    document.body.classList.add('is-altering');
    overlay.setAttribute('aria-hidden', 'false');
    const message = overlay.querySelector('[data-alteration-message]');
    overlay.onkeydown = (event) => {
      if (event.key === 'Tab') event.preventDefault();
    };
    message?.focus({ preventScroll: true });

    return new Promise((resolve) => {
      window.setTimeout(() => {
        if (typeof onChange === 'function') onChange();
      }, 650);
      window.setTimeout(() => {
        document.body.classList.remove('is-altering');
        overlay.setAttribute('aria-hidden', 'true');
        overlay.onkeydown = null;
        unlockPage();
        playing = false;
        if (focusTarget) {
          focusTarget.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
          focusTarget.focus({ preventScroll: true });
        } else if (previousFocus instanceof HTMLElement) {
          previousFocus.focus({ preventScroll: true });
        }
        resolve(true);
      }, 1500);
    });
  };

  window.MikageAlteration = { play, isPlaying: () => playing };
})();
