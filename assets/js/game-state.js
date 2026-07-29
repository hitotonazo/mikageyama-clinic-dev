(() => {
  'use strict';

  const STORAGE_KEY = 'mikageClinicPhase';
  const PHASES = ['phase0', 'phase1', 'phase2', 'phase3'];
  let currentPhase = 'phase0';

  const getPhase = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return PHASES.includes(saved) ? saved : 'phase0';
    } catch {
      return 'phase0';
    }
  };

  const setPhase = (phase) => {
    if (!PHASES.includes(phase)) return false;
    currentPhase = phase;
    try { localStorage.setItem(STORAGE_KEY, phase); } catch { /* Storage may be unavailable. */ }
    applyPhase();
    document.dispatchEvent(new CustomEvent('mikage:phasechange', { detail: { phase } }));
    return true;
  };

  const phaseNumber = () => PHASES.indexOf(currentPhase);

  const applyPhase = () => {
    document.body.classList.remove(...PHASES.map((phase) => `is-${phase}`));
    document.body.classList.add(`is-${currentPhase}`);
    document.documentElement.classList.toggle('has-phase3', currentPhase === 'phase3');

    const level = phaseNumber();
    const discharge = document.querySelector('[data-discharge-label]');
    const step1 = document.querySelector('[data-step1-trigger]');
    const directorImage = document.querySelector('[data-director-image]');
    const step3 = document.querySelector('[data-step3-trigger]');
    const step2 = document.querySelector('[data-step2-trigger]');

    if (discharge) discharge.textContent = level >= 1 ? '退院記録なし' : 'ーー';
    if (step1) {
      step1.disabled = level >= 1;
      step1.setAttribute('aria-label', level >= 1 ? '退院記録なし' : '退院者数の記録を確認する');
    }
    if (directorImage) {
      directorImage.src = level >= 2 ? directorImage.dataset.alteredSrc : directorImage.dataset.normalSrc;
      directorImage.alt = level >= 2 ? '記録が改変された御影山診療所 院長' : '御影山診療所 院長';
    }
    if (step3) {
      step3.disabled = level < 2;
      step3.setAttribute('aria-label', currentPhase === 'phase3' ? '非公開療養記録を開く' : '院長の記録を確認する');
    }
    if (step2) {
      step2.disabled = currentPhase !== 'phase1';
      step2.setAttribute('aria-hidden', currentPhase === 'phase0' ? 'true' : 'false');
    }
    document.querySelectorAll('[data-current-phase]').forEach((element) => {
      element.textContent = currentPhase;
    });
  };

  const reset = () => {
    if (!window.confirm('探索の進行状態をリセットしますか？')) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Storage may be unavailable. */ }
    window.location.reload();
  };

  const init = () => {
    currentPhase = getPhase();
    applyPhase();

    document.querySelectorAll('[data-reset-game]').forEach((button) => button.addEventListener('click', reset));

    document.querySelector('[data-step1-trigger]')?.addEventListener('click', () => {
      if (phaseNumber() >= 1 || window.MikageAlteration?.isPlaying()) return;
      window.MikageAlteration?.play({ onChange: () => setPhase('phase1') });
    });

    document.querySelector('[data-step3-trigger]')?.addEventListener('click', () => {
      if (phaseNumber() < 2 || window.MikageAlteration?.isPlaying()) return;
      if (currentPhase === 'phase3') {
        window.location.href = 'truth.html';
        return;
      }
      window.MikageAlteration?.play({
        onChange: () => setPhase('phase3')
      }).then((played) => {
        if (played) window.location.href = 'truth.html';
      });
    });
  };

  document.addEventListener('DOMContentLoaded', init);
  window.MikageGameState = { getPhase, setPhase, reset, phases: [...PHASES] };
})();
