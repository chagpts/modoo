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
  demoStatus.textContent = 'Processing';
  reportPreview.classList.remove('active');
  reportPreview.textContent = '입력 데이터 정규화, 통제 기준 매핑, 예외 거래 선별 절차를 수행하고 있습니다.';

  const values = ['검토 중', '검토 중', '검토 중', '검토 중'];
  riskResults.querySelectorAll('strong').forEach((item, index) => {
    item.textContent = values[index];
  });

  setTimeout(() => {
    demoStatus.textContent = 'Completed';
    const resultValues = ['12건', '18건', '5건', '9건'];
    riskResults.querySelectorAll('strong').forEach((item, index) => {
      item.textContent = resultValues[index];
    });
    reportPreview.classList.add('active');
    reportPreview.innerHTML = '<b>검토 메모 초안</b><br>중복 지급 후보 12건, 증빙 누락 18건, 접근권한 예외 5건, 접속 로그 이상 징후 9건이 식별되었습니다. 중요도, 발생 빈도, 통제 영향도를 기준으로 우선순위를 부여하고 후속 확인 절차를 수행할 수 있습니다.';
  }, 900);
});
