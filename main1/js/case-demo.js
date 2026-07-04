(function(){
  const scenarios={
    loan:{title:'샘플 시나리오: 운영자금 대출 계약서',summary:'대출 실행일 2026.06.29 · 원금 500,000,000원 · 연 5.2% · 만기 3년',icon:'📎',file:'loan_agreement_2026.pdf',meta:'PDF · 8 pages',fields:[['차입금','500,000,000원'],['이자율','연 5.2%'],['만기','3년'],['상환','원리금 균등']],head:['구분','차변','대변','금액'],rows:[['대출 실행','보통예금','장기차입금','500,000,000'],['월 이자','이자비용','보통예금','2,166,667']],fs:[['현금 증가','+500,000,000'],['부채 증가','+500,000,000'],['월 비용 반영','이자비용']],controls:[['승인권자 확인','정상'],['계약서 첨부','정상'],['한도 초과 여부','검토 필요']],conclusion:'차입 실행 분개는 가능하나 한도 승인 근거 확인이 필요합니다.',bullets:['이사회 또는 대표 승인 문서 대조','이자율 조건 검토','만기별 부채 분류 확인']},
    invoice:{title:'샘플 시나리오: 매입 세금계산서',summary:'공급가액 12,000,000원 · 부가세 1,200,000원 · 지급 예정',icon:'🧾',file:'purchase_invoice_2026.xml',meta:'XML · 전자세금계산서',fields:[['공급자','대한소프트'],['공급가액','12,000,000원'],['부가세','1,200,000원'],['품목','ERP 유지보수']],head:['구분','차변','대변','금액'],rows:[['매입 인식','지급수수료','미지급금','12,000,000'],['부가세','부가세대급금','미지급금','1,200,000']],fs:[['비용 증가','+12,000,000'],['유동부채 증가','+13,200,000'],['부가세 대급금','+1,200,000']],controls:[['사업자번호 검증','정상'],['중복 수취 여부','정상'],['발행일/승인일','정상']],conclusion:'세금계산서 주요 필드는 정상 추출되었습니다.',bullets:['거래처 마스터 정보 대조','중복 세금계산서 여부 확인','지급 승인 단계 연결']},
    receipt:{title:'샘플 시나리오: 법인카드 영수증',summary:'식대 186,000원 · 야간 사용 · 증빙 첨부',icon:'💳',file:'corp_card_receipt.jpg',meta:'JPG · 영수증 이미지',fields:[['가맹점','서울비즈식당'],['금액','186,000원'],['사용시간','22:47'],['카드소유자','김감사']],head:['구분','차변','대변','금액'],rows:[['비용 처리','복리후생비','미지급금','186,000'],['카드 정산','미지급금','보통예금','186,000']],fs:[['비용 증가','+186,000'],['카드 미지급','+186,000'],['위험 플래그','야간 사용']],controls:[['증빙 첨부','정상'],['야간 사용','주의'],['한도 초과','정상']],conclusion:'야간 사용 거래로 추가 소명 요청 대상입니다.',bullets:['참석자와 업무 관련성 확인','카드 사용 한도 확인','동일일자 분할 결제 여부 점검']},
    access:{title:'샘플 시나리오: ERP 권한표',summary:'사용자 184명 · 관리자 9명 · 퇴사자 3명 포함',icon:'🔐',file:'erp_access_matrix.xlsx',meta:'XLSX · 권한 매트릭스',fields:[['전체 계정','184명'],['관리자','9명'],['퇴사자','3명'],['SoD 충돌','5건']],head:['테스트','조건','결과','위험'],rows:[['퇴사자 계정','재직상태=N','3건','High'],['관리자 권한','Admin=Y','9건','Medium'],['겸직 권한','작성+승인','5건','High']],fs:[['위험 대시보드','High 8건'],['통제 미비','권한 회수 지연'],['보고 대상','ITGC']],controls:[['퇴사자 비활성화','미흡'],['권한 정기검토','검토 필요'],['승인 이력','일부 누락']],conclusion:'퇴사자 계정과 겸직 권한 충돌이 확인되었습니다.',bullets:['퇴사자 계정 즉시 비활성화','관리자 권한 승인 근거 확보','SoD 충돌 사용자 재검토']},
    log:{title:'샘플 시나리오: 접속 로그',summary:'로그 12,480건 · 해외 IP · 야간 접속 포함',icon:'🖥️',file:'erp_access_log.csv',meta:'CSV · 접속 로그',fields:[['로그 수','12,480건'],['해외 IP','14건'],['야간 접속','27건'],['실패 로그인','43건']],head:['테스트','탐지 조건','결과','위험'],rows:[['해외 IP','KR 외 국가','14건','Medium'],['야간 접속','22:00~06:00','27건','Medium'],['실패 로그인','5회 이상','6계정','High']],fs:[['위험 대시보드','High 6건'],['통제 미비','접속 모니터링'],['보고 대상','보안 감사']],controls:[['MFA 적용','검토 필요'],['로그 보관','정상'],['이상접속 알림','미흡']],conclusion:'반복 실패 로그인과 해외 IP 접속은 보안 검토 대상입니다.',bullets:['접속 원천 IP 확인','MFA 적용 범위 점검','이상접속 알림 정책 개선']}
  };
  let current='loan';
  const $=id=>document.getElementById(id);
  function setScenario(key){
    current=key;const data=scenarios[key];if(!data)return;
    $('caseTitle').textContent=data.title;$('caseSummary').textContent=data.summary;$('caseFileIcon').textContent=data.icon;$('caseFileName').textContent=data.file;$('caseFileMeta').textContent=data.meta+' · 첨부 대기';
    renderData(data,false);
  }
  function renderData(data,done){
    $('caseExtractFields').innerHTML=data.fields.map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
    $('caseJournalHead').innerHTML='<tr>'+data.head.map(h=>`<th>${h}</th>`).join('')+'</tr>';
    $('caseJournalBody').innerHTML=data.rows.map(r=>'<tr>'+r.map((c,i)=>`<td class="${i===3?'amount':''}">${c}</td>`).join('')+'</tr>').join('');
    $('caseFsBody').innerHTML=data.fs.map(([k,v])=>`<tr><td>${k}</td><td class="amount">${v}</td></tr>`).join('');
    $('caseControlList').innerHTML=data.controls.map(([k,v])=>`<div><span>${k}</span><b>${v}</b></div>`).join('');
    $('caseReportConclusion').textContent=data.conclusion;
    $('caseReportBullets').innerHTML=data.bullets.map(b=>`<li>${b}</li>`).join('');
    $('caseDemoLog').textContent=done?'[완료] OCR 추출 → 회계/감사 테스트 → 통제 점검 → 보고서 생성 완료':'[대기] 케이스를 선택한 뒤 실행 버튼을 누르면 처리 로그가 표시됩니다.';
  }
  function runDemo(){
    const cards=[...document.querySelectorAll('.case-card')];
    cards.forEach(card=>{card.classList.remove('done');card.classList.add('running');card.querySelector('.demo-status').textContent='처리 중'});
    $('caseFileMeta').textContent=scenarios[current].meta+' · 첨부 완료';
    cards.forEach((card,index)=>setTimeout(()=>{card.classList.remove('running');card.classList.add('done');card.querySelector('.demo-status').textContent='완료';if(index===cards.length-1)renderData(scenarios[current],true)},250*(index+1)));
  }
  document.querySelectorAll('.scenario-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.scenario-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');setScenario(btn.dataset.scenario)}));
  document.querySelectorAll('[data-run-case-demo]').forEach(btn=>btn.addEventListener('click',runDemo));
  setScenario(current);
})();
