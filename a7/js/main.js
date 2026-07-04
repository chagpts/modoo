document.addEventListener('DOMContentLoaded',()=>{
  const toggle=document.querySelector('[data-nav-toggle]');
  const nav=document.querySelector('[data-nav]');
  if(toggle&&nav){toggle.addEventListener('click',()=>nav.classList.toggle('is-open'));}

  const rotator=document.querySelector('[data-question-rotator]');
  if(rotator){
    const questions=[
      'AI를 활용한 회계감사를 배울 데가 없나?',
      '내부회계관리 시스템 구축은 어디서부터 하지?',
      '운영평가와 설계평가를 실무처럼 연습할 수 없나?',
      '전산감사는 SQL과 로그를 어떻게 봐야 하지?',
      'AI OCR로 증빙에서 전표까지 자동화할 수 있을까?',
      'ITGC와 ITAC를 감사 조서로 어떻게 남기지?',
      '회계·보안·데이터를 같이 배울 과정은 없나?'
    ];
    let index=0;
    setInterval(()=>{
      rotator.classList.add('is-changing');
      window.setTimeout(()=>{
        index=(index+1)%questions.length;
        rotator.textContent=questions[index];
        rotator.classList.remove('is-changing');
      },350);
    },2600);
  }

  const form=document.querySelector('[data-contact-form]');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());const result=form.querySelector('[data-form-result]');result.textContent=`${data.name}님의 상담 요청 내용을 확인했습니다.`;});}

  const search=document.querySelector('[data-lesson-search]');
  if(search){const cards=[...document.querySelectorAll('[data-lesson-card]')];search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();cards.forEach(card=>{card.style.display=card.textContent.toLowerCase().includes(q)?'block':'none';});});}
});
