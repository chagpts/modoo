(function(){
  const samplePosts=[
    {id:1,category:'notice',title:'AI 전산감사 실습 과정 오픈 안내',author:'관리자',views:124,date:'2026.07.01',content:'8단계 로드맵과 케이스 데모를 순서대로 학습할 수 있습니다.'},
    {id:2,category:'qna',title:'OCR 결과 검증은 어떤 기준으로 하나요?',author:'수강생',views:38,date:'2026.07.02',content:'금액, 거래처, 세액, 날짜, 계정과목 추천 결과를 원본 증빙과 대조합니다.'},
    {id:3,category:'resource',title:'ITGC 권한 검토 체크리스트',author:'튜터',views:72,date:'2026.07.03',content:'퇴사자 계정, 관리자 권한, 겸직 권한, 운영 DB 접근 권한을 우선 확인합니다.'},
    {id:4,category:'case',title:'중복 지급 의심 거래 분석 케이스',author:'관리자',views:91,date:'2026.07.04',content:'동일 거래처, 동일 금액, 유사 일자 조건으로 중복 지급 후보를 추출합니다.'}
  ];
  const labels={notice:'공지',qna:'질문',resource:'자료',case:'케이스'};
  let posts=[...samplePosts];
  let currentFilter='all';

  const $=id=>document.getElementById(id);
  const table=$('boardTable'),status=$('boardStatus'),empty=$('boardEmpty');
  const writeModal=$('writeModal'),detailModal=$('detailModal'),postForm=$('postForm');

  function visiblePosts(){return currentFilter==='all'?posts:posts.filter(p=>p.category===currentFilter)}
  function render(){
    if(!table)return;
    const list=visiblePosts();
    table.innerHTML='<div class="board-row board-head"><span>분류</span><span>제목</span><span>작성자</span><span>조회</span><span>날짜</span></div>';
    list.forEach(post=>{
      const row=document.createElement('div');
      row.className='board-row';
      row.innerHTML=`<span><em class="category-pill">${labels[post.category]||post.category}</em></span><span class="board-title">${escapeHtml(post.title)}</span><span class="board-meta">${escapeHtml(post.author)}</span><span class="board-meta">${post.views||0}</span><span class="board-meta">${post.date||''}</span>`;
      row.addEventListener('click',()=>openDetail(post));
      table.appendChild(row);
    });
    if(status)status.textContent='샘플 데이터 모드입니다. Supabase 설정 후 실제 게시글로 연결할 수 있습니다.';
    if(empty)empty.style.display=list.length?'none':'block';
  }
  function escapeHtml(str=''){return String(str).replace(/[&<>"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s]))}
  function openDetail(post){
    const detail=$('postDetail');
    if(!detail||!detailModal)return;
    detail.innerHTML=`<h3>${escapeHtml(post.title)}</h3><div class="detail-meta">${labels[post.category]||post.category} · ${escapeHtml(post.author)} · 조회 ${post.views||0} · ${post.date||''}</div><div class="detail-content">${escapeHtml(post.content||'내용이 없습니다.')}</div>`;
    detailModal.classList.add('open');detailModal.setAttribute('aria-hidden','false');
  }
  function closeModal(modal){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true')}

  document.querySelectorAll('[data-board-filter]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-board-filter]').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');currentFilter=btn.dataset.boardFilter;render();
  }));
  $('refreshBoard')?.addEventListener('click',render);
  $('openWrite')?.addEventListener('click',()=>{writeModal?.classList.add('open');writeModal?.setAttribute('aria-hidden','false')});
  $('closeWrite')?.addEventListener('click',()=>closeModal(writeModal));
  $('cancelWrite')?.addEventListener('click',()=>closeModal(writeModal));
  $('closeDetail')?.addEventListener('click',()=>closeModal(detailModal));
  [writeModal,detailModal].forEach(modal=>modal?.addEventListener('click',e=>{if(e.target===modal)closeModal(modal)}));
  postForm?.addEventListener('submit',e=>{
    e.preventDefault();
    const form=new FormData(postForm);
    posts.unshift({id:Date.now(),category:form.get('category'),title:form.get('title'),author:form.get('author'),views:0,date:new Date().toISOString().slice(0,10).replaceAll('-','.'),content:form.get('content')});
    postForm.reset();closeModal(writeModal);currentFilter='all';
    document.querySelectorAll('[data-board-filter]').forEach(b=>b.classList.toggle('active',b.dataset.boardFilter==='all'));
    render();
  });
  render();
})();
