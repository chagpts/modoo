const scenarios = {
  loan: {
    title: "샘플 시나리오: 운영자금 대출 계약서 자동 처리",
    summary: "대출 실행일 2026.06.29 · 원금 500,000,000원 · 연 5.2% · 만기 3년",
    fileIcon: "📄",
    fileName: "loan_agreement_2026.pdf",
    fileMeta: "PDF · 8 pages · 대출 계약서",
    fields: { 금융기관: "한국은행", 원금: "500,000,000원", 이자율: "연 5.2%", 만기: "3년" },
    head: ["차변", "대변", "금액", "설명"],
    rows: [["보통예금", "장기차입금", "500,000,000", "대출 실행 분개"], ["이자비용", "미지급이자", "2,166,667", "월 이자 인식"]],
    fs: [["현금성 자산", "+500,000,000"], ["장기차입금", "+500,000,000"], ["월 이자비용", "+2,166,667"]],
    controls: [["승인권자 결재", "PASS", "pass"], ["차입 한도 초과 여부", "WARN", "warn"], ["계약서 첨부", "PASS", "pass"]],
    conclusion: "대출 계약 정보와 회계처리는 대체로 일치하나 차입 한도 검토가 필요합니다.",
    bullets: ["대출 실행 분개와 계약서 원금 일치", "월 이자비용 자동 계산 결과 검토 필요", "이사회 승인 문서 추가 확인 권고"]
  },
  invoice: {
    title: "샘플 시나리오: 매입 세금계산서 자동 분개",
    summary: "공급가액 12,000,000원 · 부가세 1,200,000원 · 지급 예정",
    fileIcon: "🧾",
    fileName: "purchase_tax_invoice.xml",
    fileMeta: "XML · 전자세금계산서",
    fields: { 공급자: "세무테크", 공급가액: "12,000,000원", 부가세: "1,200,000원", 합계: "13,200,000원" },
    head: ["차변", "대변", "금액", "설명"],
    rows: [["소모품비", "미지급금", "12,000,000", "매입 비용 인식"], ["부가세대급금", "미지급금", "1,200,000", "매입세액 인식"]],
    fs: [["비용", "+12,000,000"], ["부가세대급금", "+1,200,000"], ["미지급금", "+13,200,000"]],
    controls: [["사업자번호 유효성", "PASS", "pass"], ["중복 세금계산서", "PASS", "pass"], ["결재 승인", "WARN", "warn"]],
    conclusion: "세금계산서 필드 추출과 분개는 정상이나 결재 승인 증적 확인이 필요합니다.",
    bullets: ["공급가액과 부가세 분리 인식", "중복 발행 여부 이상 없음", "승인 워크플로우 완료 후 지급 권고"]
  },
  receipt: {
    title: "샘플 시나리오: 법인카드 영수증 비용 검토",
    summary: "접대비 286,000원 · 야간 사용 · 증빙 적정성 검토",
    fileIcon: "💳",
    fileName: "corporate_card_receipt.jpg",
    fileMeta: "JPG · 법인카드 영수증",
    fields: { 사용처: "강남비즈니스라운지", 금액: "286,000원", 시간: "23:42", 카드번호: "****-8821" },
    head: ["검토항목", "결과", "위험도", "설명"],
    rows: [["야간 사용", "탐지", "중", "업무 관련성 확인 필요"], ["한도 초과", "정상", "낮음", "부서 한도 이내"]],
    fs: [["접대비", "+286,000"], ["미확인 증빙", "검토 필요"], ["위험 점수", "62/100"]],
    controls: [["영수증 첨부", "PASS", "pass"], ["야간 사용 사유", "WARN", "warn"], ["사용자 권한", "PASS", "pass"]],
    conclusion: "비용 금액은 정상 범위이나 야간 사용 사유 확인이 필요합니다.",
    bullets: ["법인카드 사용 금액 OCR 추출 완료", "야간 사용 통제 조건에 해당", "업무 관련 증빙 또는 참석자 내역 추가 권고"]
  },
  access: {
    title: "샘플 시나리오: ERP 권한표 직무분리 점검",
    summary: "사용자 184명 · 관리자 7명 · 퇴사자 계정 3건 후보",
    fileIcon: "🔐",
    fileName: "erp_access_matrix.xlsx",
    fileMeta: "XLSX · ERP 사용자 권한표",
    fields: { 사용자수: "184명", 관리자: "7명", 퇴사자계정: "3건", SoD위반: "5건" },
    head: ["테스트", "대상", "결과", "설명"],
    rows: [["퇴사자 계정", "3명", "FAIL", "계정 비활성화 필요"], ["승인/등록 겸무", "5명", "WARN", "직무분리 검토 필요"]],
    fs: [["권한 위험", "높음"], ["퇴사자 계정", "3건"], ["개선 권고", "즉시 조치"]],
    controls: [["퇴사자 계정 통제", "FAIL", "fail"], ["관리자 권한 검토", "WARN", "warn"], ["정기 권한 리뷰", "PASS", "pass"]],
    conclusion: "ERP 권한 관리에서 퇴사자 계정과 직무분리 위반 후보가 확인되었습니다.",
    bullets: ["퇴사자 계정 즉시 비활성화 필요", "승인자와 전표 등록자 겸무 권한 분리 권고", "분기별 권한 리뷰 증적 보관 필요"]
  },
  log: {
    title: "샘플 시나리오: ERP 접속 로그 이상행위 탐지",
    summary: "로그 32,410건 · 해외 IP 4건 · 야간 다운로드 11건",
    fileIcon: "📊",
    fileName: "erp_access_log.csv",
    fileMeta: "CSV · ERP 접속 로그",
    fields: { 로그건수: "32,410건", 해외IP: "4건", 야간접속: "37건", 다운로드: "11건" },
    head: ["탐지 규칙", "건수", "위험도", "설명"],
    rows: [["해외 IP 접속", "4", "높음", "MFA 확인 필요"], ["야간 대량 다운로드", "11", "중", "업무 사유 확인 필요"]],
    fs: [["보안 위험", "중~높음"], ["데이터 반출 후보", "11건"], ["추가 확인", "MFA 로그"]],
    controls: [["MFA 적용", "WARN", "warn"], ["접속 로그 보관", "PASS", "pass"], ["대량 다운로드 통제", "WARN", "warn"]],
    conclusion: "ERP 접속 로그에서 해외 IP와 야간 대량 다운로드 후보가 발견되었습니다.",
    bullets: ["해외 IP 접속 사용자 본인 확인 필요", "대량 다운로드 사유서 및 승인 이력 확인", "MFA와 DLP 정책 강화 권고"]
  }
};

let activeScenario = "loan";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function setScenario(key) {
  activeScenario = key;
  const item = scenarios[key];
  if (!item) return;

  $("#caseTitle").textContent = item.title;
  $("#caseSummary").textContent = item.summary;
  $("#caseFileIcon").textContent = item.fileIcon;
  $("#caseFileName").textContent = item.fileName;
  $("#caseFileMeta").textContent = `${item.fileMeta} · 첨부 대기`;
  $("#caseExtractFields").innerHTML = "";
  $("#caseJournalHead").innerHTML = "";
  $("#caseJournalBody").innerHTML = "";
  $("#caseFsBody").innerHTML = "";
  $("#caseControlList").innerHTML = "";
  $("#caseReportConclusion").textContent = "";
  $("#caseReportBullets").innerHTML = "";
  $("#caseDemoLog").textContent = "[대기] 케이스를 선택한 뒤 실행 버튼을 누르면 처리 로그가 표시됩니다.";

  $$(".case-card").forEach((card) => {
    card.classList.remove("running", "done");
    card.querySelector(".demo-status").textContent = "대기 중";
  });
}

function fillScenario() {
  const item = scenarios[activeScenario];

  $("#caseFileMeta").textContent = `${item.fileMeta} · 첨부 완료`;
  $("#caseExtractFields").innerHTML = Object.entries(item.fields)
    .map(([key, value]) => `<div><span>${key}</span><b>${value}</b></div>`)
    .join("");

  $("#caseJournalHead").innerHTML = `<tr>${item.head.map((h) => `<th>${h}</th>`).join("")}</tr>`;
  $("#caseJournalBody").innerHTML = item.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`)
    .join("");

  $("#caseFsBody").innerHTML = item.fs
    .map(([key, value]) => `<tr><td>${key}</td><td class="amount">${value}</td></tr>`)
    .join("");

  $("#caseControlList").innerHTML = item.controls
    .map(([label, value, type]) => `<div><span>${label}</span><b class="${type}">${value}</b></div>`)
    .join("");

  $("#caseReportConclusion").textContent = item.conclusion;
  $("#caseReportBullets").innerHTML = item.bullets.map((text) => `<li>${text}</li>`).join("");
  $("#caseDemoLog").textContent = `[완료] ${item.fileName} 분석 → 통제 테스트 → 보고서 초안 생성이 완료되었습니다.`;
}

async function runCaseDemo() {
  setScenario(activeScenario);
  const cards = [...$$(".case-card")];

  for (const card of cards) {
    card.classList.add("running");
    card.querySelector(".demo-status").textContent = "처리 중";
    await new Promise((resolve) => setTimeout(resolve, 320));
    card.classList.remove("running");
    card.classList.add("done");
    card.querySelector(".demo-status").textContent = "완료";
  }

  fillScenario();
}

$$(".scenario-tab").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".scenario-tab").forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    setScenario(button.dataset.scenario);
  });
});

$$("[data-run-case-demo]").forEach((button) => button.addEventListener("click", runCaseDemo));

setScenario(activeScenario);
