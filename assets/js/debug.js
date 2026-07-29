(() => {
  'use strict';

  const DEBUG_KEY = 'mikageClinicDebug';
  const PANEL_KEY = 'mikageClinicDebugPanelVisible';
  let panel = null;

  const readSession = (key) => {
    try { return sessionStorage.getItem(key); } catch { return null; }
  };

  const writeSession = (key, value) => {
    try { sessionStorage.setItem(key, value); } catch { /* Session storage may be unavailable. */ }
  };

  const removeSession = (key) => {
    try { sessionStorage.removeItem(key); } catch { /* Session storage may be unavailable. */ }
  };

  const params = new URLSearchParams(window.location.search);
  if (params.get('debug') === '1') {
    writeSession(DEBUG_KEY, 'true');
    if (readSession(PANEL_KEY) === null) writeSession(PANEL_KEY, 'true');
  }

  const isDebugMode = () => readSession(DEBUG_KEY) === 'true';

  const isEditableTarget = (target) => {
    return target instanceof HTMLElement &&
      (target.matches('input, textarea, select, [contenteditable="true"]') ||
       target.closest('input, textarea, select, [contenteditable="true"]'));
  };

  const playDebugEffect = () => {
    if (!isDebugMode() || window.MikageAlteration?.isPlaying()) return;
    window.MikageAlteration?.play();
  };

  const setPanelVisible = (visible) => {
    if (!panel) return;
    panel.hidden = !visible;
    writeSession(PANEL_KEY, String(visible));
  };

  const createPanel = () => {
    if (!isDebugMode() || !window.MikageGameState || panel) return;
    panel = document.createElement('aside');
    panel.className = 'debug-panel';
    panel.setAttribute('aria-label', 'デバッグパネル');
    panel.innerHTML = `
      <div class="debug-panel__heading">DEBUG <span data-current-phase>${window.MikageGameState.getPhase()}</span></div>
      <div class="debug-panel__body">
        <p>現在: <strong data-current-phase>${window.MikageGameState.getPhase()}</strong></p>
        <div class="debug-panel__phases" aria-label="phase変更">
          ${window.MikageGameState.phases.map((phase) => `<button type="button" data-debug-phase="${phase}">${phase}</button>`).join('')}
        </div>
        <button type="button" data-debug-effect>改変演出を再生</button>
        <button type="button" data-debug-hide>パネルを隠す</button>
        <button type="button" data-debug-exit>デバッグ終了</button>
      </div>`;
    document.body.append(panel);
    setPanelVisible(readSession(PANEL_KEY) !== 'false');

    panel.querySelectorAll('[data-debug-phase]').forEach((button) => {
      button.addEventListener('click', () => window.MikageGameState.setPhase(button.dataset.debugPhase));
    });
    panel.querySelector('[data-debug-effect]')?.addEventListener('click', playDebugEffect);
    panel.querySelector('[data-debug-hide]')?.addEventListener('click', () => setPanelVisible(false));
    panel.querySelector('[data-debug-exit]')?.addEventListener('click', () => {
      removeSession(DEBUG_KEY);
      removeSession(PANEL_KEY);
      params.delete('debug');
      const query = params.toString();
      history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
      panel.remove();
      panel = null;
    });
  };

  window.addEventListener('keydown', (event) => {
    if (!isDebugMode() || isEditableTarget(event.target)) return;

    if (event.altKey && event.shiftKey && event.code === 'KeyA') {
      event.preventDefault();
      playDebugEffect();
    }

    if (event.altKey && event.shiftKey && event.code === 'KeyD') {
      event.preventDefault();
      if (!panel) createPanel();
      setPanelVisible(panel?.hidden ?? true);
    }
  });

  document.addEventListener('DOMContentLoaded', createPanel);
})();
