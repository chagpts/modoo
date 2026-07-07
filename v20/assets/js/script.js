const revealTargets = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealTargets.forEach((target) => observer.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}

const video = document.querySelector('.hero-video');
if (video) {
  video.addEventListener('error', () => { video.style.display = 'none'; });
}

const scenarios = {
  loan: {
    title: '대출 계약서', summary: '원금, 이자율, 만기를 추출하고 분개와 통제를 점검합니다.', icon: '📄', file: 'loan_agreement.pdf', meta: 'PDF · 분석 대기',
    fields: [['원금','500,000,000원'], ['이자율','연 5.2%'], ['만기','3년']],
    head: ['일자','차변','대변','금액'], rows: [['06-29','현금','차입금','500,000,000'], ['06-30','이자비용','미지급이자','71,233']],
    fs: [['부채 증가','500,000,000원'], ['위험 등급','중간']], controls: [['이자율 재계산','일치'], ['Cut-off','추가 확인']],
    conclusion: '차입금 인식은 적정하나 월말 이자비용 검토가 필요합니다.', bullets: ['계약 조건과 전표가 일치합니다.', '미지급이자 자동계산 통제를 확인해야 합니다.']
  },
  invoice: {
    title: '세금계산서', summary: '공급가액, 부가세, 거래처를 ERP와 비교합니다.', icon: '🧾', file: 'purchase_invoice.xml', meta: 'XML · 분석 대기',
    fields: [['공급가액','18,700,000원'], ['부가세','1,870,000원'], ['거래처','대성소프트']],
    head: ['항목','증빙','ERP','결과'], rows: [['공급가액','18,700,000','18,700,000','일치'], ['부가세','1,870,000','1,780,000','불일치']],
    fs: [['매입채무','20,570,000원'], ['위험 등급','높음']], controls: [['증빙 중복','없음'], ['부가세 검증','불일치']],
    conclusion: '부가세 금액 불일치가 발견되어 수정 검토가 필요합니다.', bullets: ['공급가액은 일치합니다.', '부가세 입력값 재확인이 필요합니다.']
  },
  receipt: {
    title: '법인카드 영수증', summary: '사용자, 시간, 업종, 계정과목을 검토합니다.', icon: '💳', file: 'corporate_card.jpg', meta: 'JPG · 분석 대기',
    fields: [['금액','342,000원'], ['업종','유흥'], ['사용일시','토요일 23:41']],
    head: ['항목','값','판단','조치'], rows: [['업종','유흥','예외','승인 필요'], ['시간','야간/휴일','주의','소명 요청']],
    fs: [['비용 후보','342,000원'], ['위험 등급','높음']], controls: [['휴일 사용','탐지'], ['증빙 첨부','확인']],
    conclusion: '정책 예외 가능성이 있어 소명과 승인 이력 확인이 필요합니다.', bullets: ['휴일 야간 사용입니다.', '업종 제한 규정과 대조해야 합니다.']
  },
  access: {
    title: 'ERP 권한표', summary: '직무분리와 퇴사자 계정 위험을 점검합니다.', icon: '🔐', file: 'erp_access_matrix.xlsx', meta: 'XLSX · 분석 대기',
    fields: [['사용자','김OO'], ['권한','전표 작성+승인'], ['상태','재직']],
    head: ['사용자','권한 조합','위험','결과'], rows: [['김OO','작성+승인','SoD 위반','검토'], ['박OO','관리자','과다 권한','검토']],
    fs: [['영향 영역','전표 승인'], ['위험 등급','높음']], controls: [['직무분리','위반'], ['권한 재검토','필요']],
    conclusion: '전표 작성과 승인 권한이 한 사용자에게 집중되어 통제 미비가 의심됩니다.', bullets: ['직무분리 위반 후보가 있습니다.', '권한 회수 또는 승인 보완이 필요합니다.']
  },
  log: {
    title: '접속 로그', summary: '비정상 시간, 관리자 접근, 데이터 변경을 확인합니다.', icon: '🧠', file: 'erp_access_log.csv', meta: 'CSV · 분석 대기',
    fields: [['접속','02:13'], ['계정','admin'], ['작업','전표 수정']],
    head: ['시간','계정','작업','판단'], rows: [['02:13','admin','전표 수정','예외'], ['02:17','admin','로그 조회','주의']],
    fs: [['영향 영역','매출/비용'], ['위험 등급','중간']], controls: [['야간 접근','탐지'], ['변경 승인','미확인']],
    conclusion: '야간 관리자 전표 수정 로그가 있어 승인 근거 확인이 필요합니다.', bullets: ['비업무시간 접속입니다.', '변경관리 티켓과 대조해야 합니다.']
  }
};

let currentScenario = 'loan';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function renderScenario(key) {
  if (!scenarios[key]) return;
  currentScenario = key;
  const data = scenarios[key];
  $('#caseTitle') && ($('#caseTitle').textContent = data.title);
  $('#caseSummary') && ($('#caseSummary').textContent = data.summary);
  $('#caseFileIcon') && ($('#caseFileIcon').textContent = data.icon);
  $('#caseFileName') && ($('#caseFileName').textContent = data.file);
  $('#caseFileMeta') && ($('#caseFileMeta').textContent = data.meta);
  $('#caseExtractFields') && ($('#caseExtractFields').innerHTML = '');
  $('#caseJournalHead') && ($('#caseJournalHead').innerHTML = '');
  $('#caseJournalBody') && ($('#caseJournalBody').innerHTML = '');
  $('#caseFsBody') && ($('#caseFsBody').innerHTML = '');
  $('#caseControlList') && ($('#caseControlList').innerHTML = '');
  $('#caseReportConclusion') && ($('#caseReportConclusion').textContent = '');
  $('#caseReportBullets') && ($('#caseReportBullets').innerHTML = '');
  $('#caseDemoLog') && ($('#caseDemoLog').textContent = '[대기] 실행 버튼을 누르세요.');
  $$('.case-card').forEach(card => { card.classList.remove('running','done'); const s = card.querySelector('.demo-status'); if (s) s.textContent = '대기'; });
  $$('.scenario-tab').forEach(tab => tab.classList.toggle('active', tab.dataset.scenario === key));
}

function fillData() {
  const data = scenarios[currentScenario];
  $('#caseExtractFields').innerHTML = data.fields.map(([k,v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
  $('#caseJournalHead').innerHTML = `<tr>${data.head.map(h => `<th>${h}</th>`).join('')}</tr>`;
  $('#caseJournalBody').innerHTML = data.rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('');
  $('#caseFsBody').innerHTML = data.fs.map(([k,v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  $('#caseControlList').innerHTML = data.controls.map(([k,v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
  $('#caseReportConclusion').textContent = data.conclusion;
  $('#caseReportBullets').innerHTML = data.bullets.map(item => `<li>${item}</li>`).join('');
}

async function runDemo() {
  if (!$('#caseDemoLog')) return;
  fillData();
  const cards = $$('.case-card');
  const log = $('#caseDemoLog');
  log.textContent = '[시작] 샘플 파일 분석';
  for (let i = 0; i < cards.length; i++) {
    cards.forEach(card => card.classList.remove('running'));
    cards[i].classList.add('running');
    const status = cards[i].querySelector('.demo-status');
    if (status) status.textContent = '처리 중';
    log.textContent += `\n[${i + 1}/6] ${cards[i].querySelector('h3').textContent}`;
    await new Promise(resolve => setTimeout(resolve, 650));
    cards[i].classList.remove('running');
    cards[i].classList.add('done');
    if (status) status.textContent = '완료';
  }
  log.textContent += '\n[완료] 보고서 초안 생성';
}

$$('.scenario-tab').forEach(tab => tab.addEventListener('click', () => renderScenario(tab.dataset.scenario)));
$$('[data-run-case-demo]').forEach(btn => btn.addEventListener('click', runDemo));
renderScenario(currentScenario);
