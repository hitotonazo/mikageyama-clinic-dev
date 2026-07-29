(() => {
  'use strict';

  const updateFacility = () => {
    const phase = window.MikageGameState?.getPhase() ?? 'phase0';
    const completed = phase === 'phase2' || phase === 'phase3';
    const trigger = document.querySelector('[data-step2-trigger]');
    if (trigger) {
      trigger.disabled = phase !== 'phase1';
      trigger.setAttribute('aria-hidden', phase === 'phase0' ? 'true' : 'false');
      trigger.setAttribute('aria-label', completed ? '地下へ続く階段（確認済み）' : '地下へ続く階段を調べる');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    const trigger = document.querySelector('[data-step2-trigger]');
    updateFacility();
    document.addEventListener('mikage:phasechange', updateFacility);

    trigger?.addEventListener('click', () => {
      if (window.MikageGameState?.getPhase() !== 'phase1' || window.MikageAlteration?.isPlaying()) return;
      const target = document.querySelector('[data-underground-reveal]');
      window.MikageAlteration?.play({
        onChange: () => window.MikageGameState?.setPhase('phase2'),
        focusTarget: target
      });
    });
  });
})();
