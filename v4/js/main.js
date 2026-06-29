(function () {
  const menuToggle = document.getElementById('menuToggle');
  const mainMenu = document.getElementById('mainMenu');
  const navbar = document.getElementById('navbar');

  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      mainMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-label', mainMenu.classList.contains('open') ? '메뉴 닫기' : '메뉴 열기');
    });

    mainMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mainMenu.classList.remove('open'));
    });
  }

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('show'));
  }

  const tabs = document.querySelectorAll('.tab[data-filter]');
  const rows = document.querySelectorAll('.board-row[data-category]');
  const boardEmpty = document.getElementById('boardEmpty');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');

      let visibleCount = 0;
      rows.forEach(row => {
        const visible = filter === 'all' || row.dataset.category === filter;
        row.style.display = visible ? 'grid' : 'none';
        if (visible) visibleCount += 1;
      });

      if (boardEmpty) boardEmpty.style.display = visibleCount ? 'none' : 'block';
    });
  });

  const openWrite = document.getElementById('openWrite');
  const closeWrite = document.getElementById('closeWrite');
  const writeModal = document.getElementById('writeModal');

  function setModal(open) {
    if (!writeModal) return;
    writeModal.setAttribute('aria-hidden', open ? 'false' : 'true');
  }

  if (openWrite) openWrite.addEventListener('click', () => setModal(true));
  if (closeWrite) closeWrite.addEventListener('click', () => setModal(false));
  if (writeModal) {
    writeModal.addEventListener('click', event => {
      if (event.target === writeModal) setModal(false);
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setModal(false);
  });
})();
