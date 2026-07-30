(() => {
  'use strict';

  const SHARE_CONFIG = {
    // TODO: 公開前に元の告知投稿URLへ差し替えてください。
    originalPostUrl: 'REPLACE_WITH_ORIGINAL_POST_URL',
    siteUrl: window.location.origin + window.location.pathname.replace(/truth\.html$/, ''),
  };

  let heroRestored = false;

  const restoreHero = () => {
    const hero = document.querySelector('.truth-hero');
    if (!hero || heroRestored || window.MikageGameState?.getPhase() !== 'phase3') return;
    heroRestored = true;
    hero.classList.add('is-restoring');
    window.setTimeout(() => {
      hero.classList.remove('is-restoring');
      hero.classList.add('is-restored');
    }, 2200);
  };

  const initPhotoReveal = () => {
    const photo = document.querySelector('[data-truth-photo]');
    if (!photo) return;

    photo.addEventListener('click', () => {
      if (photo.classList.contains('is-restored')) return;
      photo.classList.add('is-restoring');
      window.setTimeout(() => {
        photo.classList.remove('is-restoring');
        photo.classList.add('is-restored');
        photo.setAttribute('aria-pressed', 'true');
        photo.setAttribute('aria-label', '感染管理下で撮影された復元済みの集合写真');
        const image = photo.querySelector('img');
        if (image) image.alt = '患者たちと中央の防護服姿の院長が写る地下療養区画の集合写真';
      }, 420);
    });
  };

  const initShare = () => {
    document.querySelector('[data-share-x]')?.addEventListener('click', () => {
      const text = [
        '彼らの存在がいずれ明るみになった時、',
        'この選択の結果が出るだろう。',
        '',
        '#おかしなサイト',
        '',
        SHARE_CONFIG.originalPostUrl,
      ].join('\n');
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(SHARE_CONFIG.siteUrl)}`;
      const shareWindow = window.open(intentUrl, '_blank', 'noopener,noreferrer');
      if (shareWindow) shareWindow.opener = null;
    });
  };

  document.addEventListener('DOMContentLoaded', () => {
    restoreHero();
    initPhotoReveal();
    initShare();
  });
  document.addEventListener('mikage:phasechange', restoreHero);
})();
