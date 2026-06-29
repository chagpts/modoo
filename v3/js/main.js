const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');
if (menuToggle && mainMenu) {
  menuToggle.addEventListener('click', () => mainMenu.classList.toggle('show'));
  mainMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mainMenu.classList.remove('show')));
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', event => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const tabs = document.querySelectorAll('.tab');
const rows = document.querySelectorAll('.board-row[data-category]');
const empty = document.getElementById('boardEmpty');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    let visibleCount = 0;
    rows.forEach(row => {
      const show = filter === 'all' || row.dataset.category === filter;
      row.style.display = show ? 'grid' : 'none';
      if (show) visibleCount += 1;
    });
    if (empty) empty.style.display = visibleCount ? 'none' : 'block';
  });
});

const modal = document.getElementById('writeModal');
const openWrite = document.getElementById('openWrite');
const closeWrite = document.getElementById('closeWrite');
if (modal && openWrite && closeWrite) {
  openWrite.addEventListener('click', () => modal.classList.add('show'));
  closeWrite.addEventListener('click', () => modal.classList.remove('show'));
  modal.addEventListener('click', event => {
    if (event.target === modal) modal.classList.remove('show');
  });
}
