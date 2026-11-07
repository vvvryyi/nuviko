// Keep the bottom navigation in sync with the existing daily tabs and history.
(() => {
  const daily = document.getElementById('daily-app');
  const sync = () => {
    const view = document.querySelector('.view.active')?.id;
    const dailyTab = daily.querySelector('.choice.active[data-tab]')?.dataset.tab;
    document.querySelectorAll('.mobile-nav button').forEach(button => {
      const current = button.dataset.go === view &&
        (view !== 'daily' || button.dataset.dailyTab === dailyTab);
      if (current) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    });
  };
  new MutationObserver(sync).observe(daily, {childList: true, subtree: true});
  document.addEventListener('click', sync);
  window.addEventListener('popstate', sync);
  sync();
})();
