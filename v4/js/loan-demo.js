// Loan agreement OCR demo simulation
    (function () {
      const runButtons = document.querySelectorAll('[data-run-loan-demo]');
      const cards = Array.from(document.querySelectorAll('#loan-demo [data-step]'));
      const log = document.getElementById('loanDemoLog');
      const messages = [
        '[1/6] loan_agreement_2026.pdf 첨부 완료',
        '[2/6] AI OCR 실행: 차입처, 원금, 이자율, 만기 추출 완료',
        '[3/6] 회계 룰 매핑: 보통예금 / 장기차입금 / 이자비용 / 미지급이자 자동분개 생성',
        '[4/6] 재무제표 반영: 현금성자산, 장기차입금, 이자비용, 미지급이자 업데이트',
        '[5/6] ITGC/ITAC 점검: 권한, 변경관리, 운영접근, 자동통제 검증 통과',
        '[6/6] 내부회계관리 보고서 생성 완료: 예외사항 없음'
      ];

      function setStatus(card, text) {
        const status = card.querySelector('.demo-status');
        if (status) status.textContent = text;
      }

      function resetDemo() {
        cards.forEach(card => {
          card.classList.remove('is-active', 'is-done');
          setStatus(card, '대기 중');
        });
        if (log) log.textContent = '[시작] AI OCR 처리 파이프라인을 초기화했습니다.';
      }

      function runDemo() {
        const target = document.getElementById('loan-demo');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        resetDemo();
        cards.forEach((card, index) => {
          window.setTimeout(() => {
            cards.forEach(c => c.classList.remove('is-active'));
            card.classList.add('is-active');
            setStatus(card, '처리 중');
            if (log) log.textContent = messages.slice(0, index + 1).join('\n');
          }, 700 * index);

          window.setTimeout(() => {
            card.classList.remove('is-active');
            card.classList.add('is-done');
            setStatus(card, '완료');
          }, 700 * index + 620);
        });
      }

      runButtons.forEach(btn => btn.addEventListener('click', runDemo));
    })();
