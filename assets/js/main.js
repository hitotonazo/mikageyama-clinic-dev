(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('[data-menu-toggle]');
    const navigation = document.querySelector('[data-navigation]');

    const closeMenu = () => {
      if (!toggle || !navigation) return;
      toggle.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
    };

    toggle?.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      navigation?.classList.toggle('is-open', !open);
    });

    navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });
  });
})();
