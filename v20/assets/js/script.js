const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal
const revealItems = $$('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealItems.forEach((item) => revealObserver.observe(item));

// Cursor glow
const cursorGlow = $('.cursor-glow');
if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener('pointermove', (event) => {
    cursorGlow.style.opacity = '1';
    cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
  });
}

// Magnetic buttons and logo
if (!prefersReducedMotion) {
  $$('.magnetic').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.12}px, ${y * 0.18}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// Tilt cards
if (!prefersReducedMotion) {
  $$('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -7}deg) rotateY(${x * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0) translateY(0)';
    });
  });
}

// Particle canvas for hero motion graphics
const canvas = $('#particleCanvas');
const ctx = canvas?.getContext('2d');
let particles = [];
let width = 0;
let height = 0;
let rafId = null;

function resizeCanvas() {
  if (!canvas || !ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(42, Math.floor(width / 24));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 2.2 + 0.8,
    alpha: Math.random() * 0.45 + 0.18
  }));
}

function drawParticles() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, width, height);

  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0 || p.x > width) p.vx *= -1;
    if (p.y < 0 || p.y > height) p.vy *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(37, 99, 235, ${p.alpha})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(37, 99, 235, ${(1 - dist / 120) * 0.12})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  rafId = requestAnimationFrame(drawParticles);
}

if (canvas && ctx && !prefersReducedMotion) {
  resizeCanvas();
  drawParticles();
  window.addEventListener('resize', resizeCanvas);
} else if (canvas) {
  canvas.style.display = 'none';
}

// Hero video parallax
const heroVideo = $('.hero-video');
const heroVisual = $('.hero-visual');
if (!prefersReducedMotion) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroVideo) heroVideo.style.transform = `scale(1.1) translateY(${y * 0.08}px)`;
    if (heroVisual) heroVisual.style.transform = `translateY(${y * -0.04}px)`;
  }, { passive: true });
}

window.addEventListener('beforeunload', () => {
  if (rafId) cancelAnimationFrame(rafId);
});


/* =========================
   Audit Simulation Lab Demo
========================= */

const auditCases = {
  loan: {
    title: '대출 계약서',
    summary: '원금, 이자율, 만기를 추출하고 분개와 통제를 점검합니다.',
    icon: '📄',
    file: 'loan_agreement.pdf',
    meta: 'PDF · 대출 계약서',
    fields: [
      ['차입처', '한빛은행'],
      ['원금', '₩500,000,000'],
      ['이자율', '연 5.2%'],
      ['만기', '2027-12-31']
    ],
    journalHead: ['일자', '계정', '차변', '대변'],
    journalRows: [
      ['2026-01-02', '현금', '500,000,000', '-'],
      ['2026-01-02', '장기차입금', '-', '500,000,000'],
      ['2026-01-31', '이자비용', '2,166,667', '-'],
      ['2026-01-31', '미지급이자', '-', '2,166,667']
    ],
    fs: [
      ['부채 증가', '장기차입금 반영'],
      ['금융비용', '이자비용 발생'],
      ['주석', '차입 조건 공시 필요']
    ],
    controls: [
      ['계약서 승인', '통과'],
      ['이자율 재계산', '통과'],
      ['만기 분류', '검토 필요']
    ],
    conclusion: '대출 계약의 주요 조건은 추출되었으며, 장단기 분류 검토가 필요합니다.',
    bullets: [
      '원금과 이자율은 계약서 조건과 일치합니다.',
      '만기 기준 유동성 대체 여부를 추가 확인해야 합니다.',
      '이자비용 계산 로직은 정상입니다.'
    ]
  },

  invoice: {
    title: '세금계산서',
    summary: '공급가액, 부가세, 거래처를 추출하고 매입 처리 적정성을 점검합니다.',
    icon: '🧾',
    file: 'tax_invoice.xml',
    meta: 'XML · 전자세금계산서',
    fields: [
      ['공급자', '세움테크'],
      ['공급가액', '₩12,000,000'],
      ['부가세', '₩1,200,000'],
      ['작성일자', '2026-02-10']
    ],
    journalHead: ['일자', '계정', '차변', '대변'],
    journalRows: [
      ['2026-02-10', '소모품비', '12,000,000', '-'],
      ['2026-02-10', '부가세대급금', '1,200,000', '-'],
      ['2026-02-10', '미지급금', '-', '13,200,000']
    ],
    fs: [
      ['비용', '소모품비 반영'],
      ['자산', '부가세대급금 반영'],
      ['부채', '미지급금 증가']
    ],
    controls: [
      ['사업자번호 형식', '통과'],
      ['중복 계산서', '통과'],
      ['승인번호 검증', '통과']
    ],
    conclusion: '세금계산서 처리 결과 중복 위험은 낮고, 회계처리는 정상 범위입니다.',
    bullets: [
      '공급가액과 부가세 합계가 총액과 일치합니다.',
      '동일 승인번호 중복 입력은 발견되지 않았습니다.',
      '매입세액 공제 가능 여부는 거래 성격 확인이 필요합니다.'
    ]
  },

  receipt: {
    title: '법인카드',
    summary: '사용처, 금액, 증빙 상태를 추출하고 비용 처리 위험을 점검합니다.',
    icon: '💳',
    file: 'corporate_card_receipt.jpg',
    meta: 'JPG · 카드 영수증',
    fields: [
      ['사용처', '블루호텔'],
      ['금액', '₩438,000'],
      ['사용일시', '2026-03-14 22:48'],
      ['카드번호', '****-3842']
    ],
    journalHead: ['일자', '계정', '차변', '대변'],
    journalRows: [
      ['2026-03-14', '여비교통비', '438,000', '-'],
      ['2026-03-14', '미지급금', '-', '438,000']
    ],
    fs: [
      ['비용', '여비교통비 반영'],
      ['증빙', '영수증 이미지 첨부'],
      ['위험', '심야 사용 검토']
    ],
    controls: [
      ['한도 초과 여부', '통과'],
      ['심야 사용', '검토 필요'],
      ['증빙 첨부', '통과']
    ],
    conclusion: '법인카드 사용은 증빙이 있으나, 심야 사용 건으로 추가 승인이 권고됩니다.',
    bullets: [
      '영수증 이미지에서 금액과 사용처가 추출되었습니다.',
      '회사 비용 규정상 심야 사용 사유 확인이 필요합니다.',
      '중복 청구 흔적은 확인되지 않았습니다.'
    ]
  },

  access: {
    title: '권한표',
    summary: '사용자 권한과 직무분리를 분석해 통제 위반 가능성을 점검합니다.',
    icon: '🔐',
    file: 'user_access_matrix.xlsx',
    meta: 'XLSX · 권한 매트릭스',
    fields: [
      ['사용자 수', '128명'],
      ['관리자 권한', '7명'],
      ['퇴사자 계정', '2건'],
      ['SoD 충돌', '3건']
    ],
    journalHead: ['사용자', '부서', '권한', '판정'],
    journalRows: [
      ['kim.jw', '재무', '전표 입력 + 승인', '충돌'],
      ['lee.hr', '인사', '급여 조회', '정상'],
      ['park.ex', '퇴사자', 'ERP 접근', '위험']
    ],
    fs: [
      ['접근통제', '퇴사자 계정 존재'],
      ['직무분리', '승인/입력 권한 중복'],
      ['감사위험', '권한 회수 지연']
    ],
    controls: [
      ['퇴사자 계정 차단', '미흡'],
      ['관리자 권한 검토', '검토 필요'],
      ['직무분리 원칙', '미흡']
    ],
    conclusion: '권한표 분석 결과 퇴사자 계정과 직무분리 충돌이 발견되었습니다.',
    bullets: [
      '퇴사자 계정 2건은 즉시 비활성화가 필요합니다.',
      '전표 입력과 승인 권한을 동시에 가진 사용자가 있습니다.',
      '관리자 권한 보유자 정기 검토 증적이 필요합니다.'
    ]
  },

  log: {
    title: '접속 로그',
    summary: '접속 시간, IP, 실패 횟수를 분석해 비정상 접근 가능성을 점검합니다.',
    icon: '🛰️',
    file: 'access_log.csv',
    meta: 'CSV · 시스템 접속 로그',
    fields: [
      ['로그 건수', '24,891건'],
      ['실패 로그인', '184건'],
      ['해외 IP', '6건'],
      ['심야 접속', '31건']
    ],
    journalHead: ['시간', '사용자', '이벤트', '위험'],
    journalRows: [
      ['02:14:08', 'admin01', '로그인 성공', '주의'],
      ['03:02:55', 'guest', '로그인 실패 12회', '높음'],
      ['04:18:21', 'api_user', '권한 변경', '높음']
    ],
    fs: [
      ['보안 이벤트', '비정상 접속 탐지'],
      ['운영통제', '권한 변경 로그 확인'],
      ['감사증적', '로그 보존 필요']
    ],
    controls: [
      ['로그 보존 기간', '통과'],
      ['실패 로그인 임계치', '미흡'],
      ['권한 변경 승인', '검토 필요']
    ],
    conclusion: '접속 로그에서 반복 실패와 심야 권한 변경 이벤트가 확인되었습니다.',
    bullets: [
      '특정 계정에서 반복 로그인 실패가 발생했습니다.',
      '심야 시간대 관리자 권한 변경 이력이 있습니다.',
      'MFA 적용 여부와 승인 티켓 대조가 필요합니다.'
    ]
  }
};

let currentAuditCase = 'loan';

function setAuditCase(caseKey) {
  const data = auditCases[caseKey];
  if (!data) return;

  currentAuditCase = caseKey;

  $('#caseTitle') && ($('#caseTitle').textContent = data.title);
  $('#caseSummary') && ($('#caseSummary').textContent = data.summary);
  $('#caseFileIcon') && ($('#caseFileIcon').textContent = data.icon);
  $('#caseFileName') && ($('#caseFileName').textContent = data.file);
  $('#caseFileMeta') && ($('#caseFileMeta').textContent = data.meta);

  $$('.scenario-tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.scenario === caseKey);
  });

  resetAuditDemo();
}

function resetAuditDemo() {
  $$('.case-card').forEach((card) => {
    card.classList.remove('is-running', 'is-done');
    const status = $('.demo-status', card);
    if (status) status.textContent = '대기';
  });

  const extract = $('#caseExtractFields');
  const journalHead = $('#caseJournalHead');
  const journalBody = $('#caseJournalBody');
  const fsBody = $('#caseFsBody');
  const controlList = $('#caseControlList');
  const conclusion = $('#caseReportConclusion');
  const bullets = $('#caseReportBullets');
  const log = $('#caseDemoLog');

  if (extract) extract.innerHTML = '';
  if (journalHead) journalHead.innerHTML = '';
  if (journalBody) journalBody.innerHTML = '';
  if (fsBody) fsBody.innerHTML = '';
  if (controlList) controlList.innerHTML = '';
  if (conclusion) conclusion.textContent = '';
  if (bullets) bullets.innerHTML = '';
  if (log) log.textContent = '[대기] 실행 버튼을 누르세요.';
}

function fillAuditDemoStep(step, data) {
  if (step === 2) {
    $('#caseExtractFields').innerHTML = data.fields
      .map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`)
      .join('');
  }

  if (step === 3) {
    $('#caseJournalHead').innerHTML = `
      <tr>${data.journalHead.map((item) => `<th>${item}</th>`).join('')}</tr>
    `;

    $('#caseJournalBody').innerHTML = data.journalRows
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('');
  }

  if (step === 4) {
    $('#caseFsBody').innerHTML = data.fs
      .map(([item, result]) => `<tr><td>${item}</td><td>${result}</td></tr>`)
      .join('');
  }

  if (step === 5) {
    $('#caseControlList').innerHTML = data.controls
      .map(([item, result]) => `<div><span>${item}</span><b>${result}</b></div>`)
      .join('');
  }

  if (step === 6) {
    $('#caseReportConclusion').textContent = data.conclusion;
    $('#caseReportBullets').innerHTML = data.bullets
      .map((item) => `<li>${item}</li>`)
      .join('');
  }
}

function runAuditDemo() {
  const data = auditCases[currentAuditCase];
  if (!data) return;

  resetAuditDemo();

  const steps = [1, 2, 3, 4, 5, 6];

  steps.forEach((step, index) => {
    window.setTimeout(() => {
      const card = $(`.case-card[data-step="${step}"]`);
      if (!card) return;

      card.classList.add('is-running');

      const status = $('.demo-status', card);
      if (status) status.textContent = '처리중';

      const log = $('#caseDemoLog');
      if (log) {
        const labels = {
          1: '파일 업로드 확인',
          2: 'AI OCR 필드 추출',
          3: '자동 분개 생성',
          4: '재무제표 영향 반영',
          5: '통제 점검 수행',
          6: '감사 보고서 초안 생성'
        };
        log.textContent = `[진행] ${labels[step]}...`;
      }

      window.setTimeout(() => {
        fillAuditDemoStep(step, data);

        card.classList.remove('is-running');
        card.classList.add('is-done');

        if (status) status.textContent = '완료';

        if (step === 6 && log) {
          log.textContent = '[완료] AI 감사 시뮬레이션 결과가 생성되었습니다.';
        }
      }, prefersReducedMotion ? 80 : 520);
    }, prefersReducedMotion ? index * 100 : index * 760);
  });
}

if ($('.lab-page')) {
  $$('.scenario-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      setAuditCase(tab.dataset.scenario);
    });
  });

  $$('[data-run-case-demo]').forEach((button) => {
    button.addEventListener('click', runAuditDemo);
  });

  setAuditCase(currentAuditCase);
          }
