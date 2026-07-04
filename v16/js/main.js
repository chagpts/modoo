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
const pipelineSteps = document.querySelectorAll('.pipeline-step');

runDemo?.addEventListener('click', () => {
  demoStatus.textContent = 'Processing';
  reportPreview.classList.remove('active');
  reportPreview.textContent = '대출 계약서 OCR, ERP 로그 정규화, 회계처리 기준 매핑, 접근통제 점검을 순차적으로 수행하고 있습니다.';

  pipelineSteps.forEach((step, index) => step.classList.toggle('active', index === 0));
  riskResults.querySelectorAll('strong').forEach((item) => {
    item.textContent = '분석 중';
  });

  const outputs = [
    ['추출 완료', '계약금액 500,000,000원 · 연 5.2% · 실행일 2026.06.29 · 만기 3년'],
    ['검토 완료', '차입금 인식 및 월할 이자비용 계산은 적정하나, 유동성 대체 검토 필요'],
    ['예외 식별', '전표 승인 전 관리자 계정 접속 및 대출 마스터 변경 이력 확인 필요'],
    ['초안 생성', '내부회계관리 조서 1건 · 경영진 보고용 요약 1건 · 개선 권고 3건']
  ];

  outputs.forEach((output, index) => {
    setTimeout(() => {
      pipelineSteps.forEach((step, stepIndex) => step.classList.toggle('active', stepIndex <= index));
      const card = riskResults.querySelectorAll('article')[index];
      card.querySelector('strong').textContent = output[0];
      card.querySelector('p').textContent = output[1];
    }, 450 * (index + 1));
  });

  setTimeout(() => {
    demoStatus.textContent = 'Completed';
    reportPreview.classList.add('active');
    reportPreview.innerHTML = '<b>내부회계관리 조서 초안</b><br>대출 계약 조건과 ERP 등록 정보는 주요 필드 기준으로 일치합니다. 다만 전표 승인 전 관리자 계정 접속 및 대출 마스터 변경 이력이 확인되어, 접근권한 승인 근거와 변경 요청 이력의 추가 검토가 필요합니다. 개선 권고안은 권한 변경 승인 절차 강화, 대출 마스터 변경 로그 보관, 결산 시 유동성 대체 검토 체크리스트 반영입니다.';
  }, 2300);
});
