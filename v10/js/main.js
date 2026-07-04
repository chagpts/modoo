const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const mainMenu = document.getElementById('mainMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

menuToggle?.addEventListener('click', () => {
  mainMenu.classList.toggle('open');
});

document.querySelectorAll('.menu a').forEach((link) => {
  link.addEventListener('click', () => mainMenu.classList.remove('open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const runDemo = document.getElementById('runDemo');
const demoStatus = document.getElementById('demoStatus');
const riskResults = document.getElementById('riskResults');
const reportPreview = document.getElementById('reportPreview');

runDemo?.addEventListener('click', () => {
  demoStatus.textContent = '분석 중';
  reportPreview.classList.remove('active');
  reportPreview.textContent = '전표, 증빙, 권한표, 로그를 정규화하고 위험 룰을 적용하는 중입니다.';

  const values = ['분석 중', '분석 중', '분석 중', '분석 중'];
  riskResults.querySelectorAll('strong').forEach((item, index) => {
    item.textContent = values[index];
  });

  setTimeout(() => {
    demoStatus.textContent = '완료';
    const resultValues = ['12건', '18건', '5건', '9건'];
    riskResults.querySelectorAll('strong').forEach((item, index) => {
      item.textContent = resultValues[index];
    });
    reportPreview.classList.add('active');
    reportPreview.innerHTML = '<b>조서 초안</b><br>중복 지급 후보 12건, 증빙 누락 18건, ERP 권한 위험 5건, 접속 로그 이상 9건이 식별되었습니다. 검토자는 금액 중요도와 통제 영향도를 기준으로 우선순위를 정하고 후속 확인 절차를 수행해야 합니다.';
  }, 900);
});
