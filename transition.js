/*
  Page transition: clicking a link marked data-transition slides a panel up from
  the bottom while the current page drifts upward (like scrolling down), then
  loads the next page. The next page starts covered and the panel lifts away as
  its content rises into place.
*/
(() => {
  const DURATION = 900; // ms for each half of the transition
  const EASE = 'cubic-bezier(.77,0,.18,1)';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = `
    .pt-panel { position: fixed; inset: 0; z-index: 1000; background: #070707; pointer-events: none;
      transform: translateY(100%); will-change: transform; }
    .pt-panel.is-covering { pointer-events: all; }
    .pt-drift { transition: transform ${DURATION}ms ${EASE}, opacity ${DURATION}ms ${EASE}; will-change: transform; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.className = 'pt-panel';
  panel.setAttribute('aria-hidden', 'true');
  document.body.appendChild(panel);

  const page = document.querySelector('.page') || document.body;
  const arrived = sessionStorage.getItem('pt-arrive') === '1';
  sessionStorage.removeItem('pt-arrive');

  // ---- Entering: the panel starts over the page and lifts away
  if (arrived && !reduced) {
    panel.style.transform = 'translateY(0)';
    page.classList.add('pt-drift');
    page.style.transition = 'none';
    page.style.transform = 'translateY(12vh)';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      panel.style.transition = `transform ${DURATION}ms ${EASE}`;
      panel.style.transform = 'translateY(-100%)';
      page.style.transition = '';
      page.style.transform = 'translateY(0)';
    }));
    setTimeout(() => { page.style.transform = ''; page.classList.remove('pt-drift'); }, DURATION + 50);
  }

  // ---- Leaving: the panel rises from the bottom while the page drifts up
  function leave(href) {
    if (reduced) { location.href = href; return; }
    if (window.__lenis) window.__lenis.stop();
    panel.classList.add('is-covering');
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(100%)';
    page.classList.add('pt-drift');
    void panel.offsetWidth;
    panel.style.transition = `transform ${DURATION}ms ${EASE}`;
    panel.style.transform = 'translateY(0)';
    page.style.transform = 'translateY(-12vh)';
    page.style.opacity = '0.6';
    sessionStorage.setItem('pt-arrive', '1');
    setTimeout(() => { location.href = href; }, DURATION);
  }

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-transition]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    e.preventDefault();
    leave(href);
  });

  // Coming back with the browser's Back button can restore a covered page from cache: reset it
  window.addEventListener('pageshow', ev => {
    if (!ev.persisted) return;
    panel.style.transition = 'none';
    panel.style.transform = 'translateY(100%)';
    panel.classList.remove('is-covering');
    page.style.transform = ''; page.style.opacity = '';
    page.classList.remove('pt-drift');
    if (window.__lenis) window.__lenis.start();
  });
})();
