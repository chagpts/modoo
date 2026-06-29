// Multi-case AI OCR / IT audit simulation - Vanilla DOM only
(function () {
  const scenarios = {
    loan: {
      title: '샘플 시나리오: 운영자금 대출 계약서 자동 처리',
      summary: '대출 실행일 2026.06.29 · 원금 500,000,000원 · 연 5.2% · 만기 3년 · 원리금 분개 및 내부통제 검토',
      icon: '📄',
      file: 'loan_agreement_2026.pdf',
      meta: 'PDF · 8 pages · 계약서 샘플',
      extracts: [
        ['차입처', '한국상업은행'], ['대출원금', '500,000,000원'], ['이자율', '연 5.2%'], ['만기', '2029.06.29'], ['AI 신뢰도', '98.7%']
      ],
      journalHead: ['일자', '차변', '대변', '금액', '상태'],
      journalRows: [
        ['2026.06.29', '보통예금', '장기차입금', '500,000,000', 'AI 생성 · 검토대기'],
        ['2026.06.30', '이자비용', '미지급이자', '2,166,667', '자동 계산']
      ],
      fs: [['현금및현금성자산', '+500,000,000'], ['장기차입금', '+500,000,000'], ['이자비용', '+2,166,667'], ['미지급이자', '+2,166,667']],
      controls: [['권한 통제', '작성자·승인자 분리 확인'], ['변경관리', '분개 룰 v1.4 승인됨'], ['운영 접근', '관리자 직접수정 없음'], ['자동통제', '한도·이자율 검증 통과']],
      conclusion: '결론: 대출 계약서 OCR, 자동분개, 재무제표 반영 및 승인 흐름은 설계된 ITGC/ITAC 통제 기준에 따라 처리된 것으로 표시됩니다.',
      bullets: ['증빙 원본과 OCR 추출값의 매칭률이 기준치 95%를 초과했습니다.', '분개 생성 룰, 승인권자, 변경 이력, 처리 로그가 감사 추적 가능하게 보존되었습니다.', '작성자와 승인자가 분리되어 내부회계관리상 업무분장 통제에 부합합니다.', '예외사항은 발견되지 않았으며, 최종 검토자 승인 후 전표 확정이 가능합니다.']
    },
    invoice: {
      title: '샘플 시나리오: 매입 세금계산서 자동 회계처리',
      summary: '공급가액 12,000,000원 · 부가세 1,200,000원 · 거래처 신규 여부와 매입 승인 통제 검토',
      icon: '🧾', file: 'purchase_tax_invoice_sample.xml', meta: 'XML · 전자세금계산서 · 매입 샘플',
      extracts: [['공급자', '에이원솔루션'], ['공급가액', '12,000,000원'], ['부가세', '1,200,000원'], ['품목', '보안 점검 용역'], ['AI 신뢰도', '99.1%']],
      journalHead: ['일자', '차변', '대변', '금액', '상태'],
      journalRows: [['2026.06.29', '지급수수료', '미지급금', '12,000,000', 'AI 추천'], ['2026.06.29', '부가세대급금', '미지급금', '1,200,000', '세액 자동분리']],
      fs: [['판매관리비', '+12,000,000'], ['부가세대급금', '+1,200,000'], ['미지급금', '+13,200,000'], ['거래처 마스터', '신규 거래처 검토 필요']],
      controls: [['증빙 통제', '국세청 승인번호 형식 확인'], ['거래처 통제', '신규 거래처 승인 필요'], ['중복 통제', '계산서번호 중복 없음'], ['자동통제', '세액 10% 검증 통과']],
      conclusion: '결론: 매입 세금계산서의 금액·세액·거래처 정보는 자동 추출되었으며, 신규 거래처 승인 통제를 거친 후 전표 확정이 가능한 상태로 표시됩니다.',
      bullets: ['공급가액과 부가세 분리 계산 결과가 증빙 정보와 일치합니다.', '전자세금계산서 승인번호와 작성일자가 누락 없이 인식되었습니다.', '동일 계산서번호 중복 지급 위험은 발견되지 않았습니다.', '신규 거래처 승인 절차는 내부회계관리상 보완 확인 항목으로 표시됩니다.']
    },
    receipt: {
      title: '샘플 시나리오: 법인카드 영수증 비용 처리',
      summary: '출장 식대 184,000원 · 야간 사용 · 증빙 첨부와 예산 한도 통제 검토',
      icon: '💳', file: 'corporate_card_receipt.jpg', meta: 'JPG · 모바일 영수증 · 비용 샘플',
      extracts: [['가맹점', '서울비즈니스다이닝'], ['결제금액', '184,000원'], ['결제시간', '22:48'], ['비용유형', '출장 식대'], ['AI 신뢰도', '96.4%']],
      journalHead: ['일자', '차변', '대변', '금액', '상태'],
      journalRows: [['2026.06.29', '여비교통비', '미지급금', '184,000', 'AI 추천'], ['2026.06.29', '미지급금', '법인카드미지급금', '184,000', '카드 정산 대기']],
      fs: [['판매관리비', '+184,000'], ['법인카드미지급금', '+184,000'], ['예산 사용률', '월 한도 82%'], ['위험 플래그', '야간 사용 검토']],
      controls: [['증빙 통제', '영수증 이미지 첨부 확인'], ['승인 통제', '팀장 사전승인 매칭'], ['한도 통제', '개인별 월 한도 이내'], ['이상거래', '야간 결제 사유 검토 필요']],
      conclusion: '결론: 법인카드 영수증은 비용 계정으로 자동 추천되었고, 한도 통제는 통과했으나 야간 결제 사유 검토가 필요한 예외 항목으로 표시됩니다.',
      bullets: ['영수증 금액과 카드 승인 데이터가 일치합니다.', '비용 계정은 사용처와 메모 기준으로 여비교통비가 추천되었습니다.', '개인별 예산 한도 초과는 발견되지 않았습니다.', '야간 결제 정책에 따라 사유 입력 및 승인자 검토가 필요합니다.']
    },
    access: {
      title: '샘플 시나리오: ERP 권한표 기반 ITGC 점검',
      summary: '사용자 128명 · 퇴사자 계정 2건 · 전표 작성/승인 겸직 권한 분리 점검',
      icon: '🔐', file: 'erp_user_access_matrix.xlsx', meta: 'XLSX · 사용자 권한표 · ITGC 샘플',
      extracts: [['사용자 수', '128명'], ['관리자 권한', '6명'], ['퇴사자 계정', '2건'], ['겸직 권한', '3건'], ['분석 신뢰도', '97.9%']],
      journalHead: ['테스트 ID', '통제 목적', '발견사항', '위험도', '상태'],
      journalRows: [['ITGC-01', '퇴사자 접근 차단', '퇴사자 계정 2건 활성', 'High', '예외'], ['ITGC-02', '업무분장', '작성/승인 겸직 3건', 'Medium', '검토 필요']],
      fs: [['재무제표 영향', '직접 금액 영향 없음'], ['감사 위험', '무단 전표 생성 가능성'], ['통제 결함 후보', '5건'], ['개선권고', '계정 비활성화 및 권한 재설계']],
      controls: [['접근권한', '퇴사자 계정 비활성화 미흡'], ['업무분장', '전표 작성·승인 권한 충돌'], ['정기검토', '분기별 권한검토 증적 필요'], ['변경관리', '권한 변경 승인 로그 확인']],
      conclusion: '결론: ERP 권한표 분석 결과 일부 ITGC 예외가 발견되어 계정 비활성화, 권한 재설계, 정기 권한검토 증적 보완이 필요한 상태로 표시됩니다.',
      bullets: ['퇴사자 계정 활성 상태는 접근통제상 핵심 예외입니다.', '전표 작성과 승인 권한이 동시에 부여된 사용자는 업무분장 위험을 높입니다.', '재무제표 금액은 직접 변경되지 않았지만 전표 무단 생성 위험이 존재합니다.', '조치 완료 후 재수행 테스트를 통해 통제 개선 여부를 확인해야 합니다.']
    },
    log: {
      title: '샘플 시나리오: ERP 접속 로그 이상거래 탐지',
      summary: '야간 접속 14건 · 운영 DB 직접조회 3건 · 결산기간 전표 수정 로그 점검',
      icon: '🖥️', file: 'erp_access_log_2026_06.csv', meta: 'CSV · 접속 로그 · 전산감사 샘플',
      extracts: [['로그 건수', '24,318건'], ['야간 접속', '14건'], ['DB 직접조회', '3건'], ['전표 수정', '7건'], ['분석 신뢰도', '98.2%']],
      journalHead: ['테스트 ID', '분석 항목', '탐지 결과', '위험도', '상태'],
      journalRows: [['DA-01', '야간 전표 수정', '7건 탐지', 'Medium', '샘플링'], ['DA-02', '운영 DB 직접조회', '3건 탐지', 'High', '증적 요청']],
      fs: [['손익 영향 후보', '수정 전표 7건'], ['감사 샘플', '10건 자동 선정'], ['이상 로그', '17건'], ['보고 상태', 'IT 감사 조서 생성']],
      controls: [['운영 접근', 'DB 직접조회 승인 증적 필요'], ['로그 보존', '원본 로그 해시값 저장'], ['변경 추적', '수정 전후 값 비교 가능'], ['모니터링', '결산기간 알림 룰 작동']],
      conclusion: '결론: 접속 로그 분석 결과 결산기간 야간 수정과 운영 DB 직접조회가 탐지되어 감사 샘플 선정 및 운영 접근 승인 증적 확인이 필요한 상태로 표시됩니다.',
      bullets: ['야간 전표 수정은 결산 조작 위험과 연결될 수 있어 별도 검토가 필요합니다.', '운영 DB 직접조회 로그는 승인 요청서와 대조해야 합니다.', '수정 전후 값 비교와 원본 로그 해시 보존으로 감사 추적성을 확보합니다.', '탐지된 로그는 IT 감사 조서와 내부회계관리 미비점 검토 자료로 연결됩니다.']
    }
  };

  let currentKey = 'loan';
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const els = {
    title: $('#caseTitle'), summary: $('#caseSummary'), icon: $('#caseFileIcon'), file: $('#caseFileName'), meta: $('#caseFileMeta'),
    extract: $('#caseExtractFields'), journalHead: $('#caseJournalHead'), journalBody: $('#caseJournalBody'), fs: $('#caseFsBody'),
    controls: $('#caseControlList'), conclusion: $('#caseReportConclusion'), bullets: $('#caseReportBullets'), log: $('#caseDemoLog')
  };

  function renderPairs(container, rows) {
    if (!container) return;
    container.innerHTML = rows.map(([label, value]) => `<div><span>${label}</span><b>${value}</b></div>`).join('');
  }

  function renderJournal(scenario) {
    if (els.journalHead) {
      els.journalHead.innerHTML = `<tr>${scenario.journalHead.map((h, i) => `<th class="${i === 3 ? 'amount' : ''}">${h}</th>`).join('')}</tr>`;
    }
    if (els.journalBody) {
      els.journalBody.innerHTML = scenario.journalRows.map(row => `<tr>${row.map((cell, i) => `<td class="${i === 3 ? 'amount' : ''}">${cell}</td>`).join('')}</tr>`).join('');
    }
  }

  function renderScenario(key) {
    const scenario = scenarios[key] || scenarios.loan;
    currentKey = key;
    if (els.title) els.title.textContent = scenario.title;
    if (els.summary) els.summary.textContent = scenario.summary;
    if (els.icon) els.icon.textContent = scenario.icon;
    if (els.file) els.file.textContent = scenario.file;
    if (els.meta) els.meta.textContent = scenario.meta;
    renderPairs(els.extract, scenario.extracts);
    renderJournal(scenario);
    if (els.fs) els.fs.innerHTML = scenario.fs.map(([label, value]) => `<tr><td>${label}</td><td class="amount">${value}</td></tr>`).join('');
    renderPairs(els.controls, scenario.controls);
    if (els.conclusion) els.conclusion.innerHTML = `<strong>${scenario.conclusion.replace('결론:', '결론:')}</strong>`;
    if (els.bullets) els.bullets.innerHTML = scenario.bullets.map(item => `<li>${item}</li>`).join('');
    resetDemo(`[대기] ${scenario.file} 케이스가 선택되었습니다. 실행 버튼을 누르면 AI 처리 흐름이 시작됩니다.`);
  }

  function setStatus(card, text) {
    const status = card.querySelector('.demo-status');
    if (status) status.textContent = text;
  }

  function resetDemo(message) {
    $$('#case-demo [data-step]').forEach(card => {
      card.classList.remove('is-active', 'is-done');
      setStatus(card, '대기 중');
    });
    if (els.log) els.log.textContent = message || '[시작] AI 처리 파이프라인을 초기화했습니다.';
  }

  function runDemo() {
    const scenario = scenarios[currentKey] || scenarios.loan;
    const target = $('#case-demo');
    const cards = $$('#case-demo [data-step]');
    const messages = [
      `[1/6] ${scenario.file} 교육용 샘플 첨부 완료`,
      '[2/6] AI OCR/분석 실행: 핵심 필드 추출 및 신뢰도 산정 완료',
      '[3/6] 회계 룰 또는 감사 테스트 매핑: 자동 처리 결과 생성',
      '[4/6] 재무제표·위험 대시보드 반영 완료',
      '[5/6] ITGC/ITAC/내부통제 점검: 권한, 변경관리, 증빙, 로그 검토 완료',
      '[6/6] 내부회계관리 보고서 초안 생성 완료'
    ];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resetDemo('[시작] AI 처리 파이프라인을 초기화했습니다.');
    cards.forEach((card, index) => {
      window.setTimeout(() => {
        cards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');
        setStatus(card, '처리 중');
        if (els.log) els.log.textContent = messages.slice(0, index + 1).join('\n');
      }, 700 * index);

      window.setTimeout(() => {
        card.classList.remove('is-active');
        card.classList.add('is-done');
        setStatus(card, '완료');
      }, 700 * index + 620);
    });
  }

  $$('.scenario-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.scenario-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderScenario(tab.dataset.scenario);
    });
  });

  $$('[data-run-case-demo]').forEach(btn => btn.addEventListener('click', runDemo));
  renderScenario(currentKey);
})();
