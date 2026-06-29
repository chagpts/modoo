(function () {
  const SAMPLE_POSTS = [
    {
      id: 'sample-1', category: 'notice', title: '8단계 로드맵 학습 순서 안내',
      author: '관리자', views: 312, created_at: '2026-06-29T09:00:00+09:00',
      content: '회계 데이터 이해 → 내부회계관리 → AI OCR 자동분개 → ITGC/ITAC → 전산감사 분석 순서로 학습하는 것을 권장합니다.'
    },
    {
      id: 'sample-2', category: 'resource', title: 'AI OCR 실습용 영수증 샘플 데이터',
      author: 'AuditSecu', views: 189, created_at: '2026-06-28T11:20:00+09:00',
      content: '법인카드 영수증을 업로드하고 계정과목 추천, 부가세 구분, 승인 통제 점검까지 확인하는 실습 자료입니다.'
    },
    {
      id: 'sample-3', category: 'qna', title: 'ITGC와 ITAC는 어떤 순서로 공부해야 하나요?',
      author: 'learn01', views: 76, created_at: '2026-06-27T14:40:00+09:00',
      content: 'ITGC는 권한, 변경관리, 운영관리처럼 시스템 전반의 통제를 보고, ITAC는 업무 프로세스 안의 자동통제를 봅니다.'
    },
    {
      id: 'sample-4', category: 'case', title: '중복 지급 탐지 케이스 리뷰',
      author: 'mentor', views: 141, created_at: '2026-06-25T17:10:00+09:00',
      content: '동일 거래처, 동일 금액, 동일 증빙번호 조건을 조합해 중복 지급 후보를 추출하고 감사 조서로 정리합니다.'
    }
  ];

  const CATEGORY_LABELS = {
    notice: '공지', qna: '질문', resource: '자료', case: '케이스'
  };

  const table = document.getElementById('boardTable');
  const status = document.getElementById('boardStatus');
  const empty = document.getElementById('boardEmpty');
  const filterButtons = document.querySelectorAll('[data-board-filter]');
  const refreshButton = document.getElementById('refreshBoard');
  const writeModal = document.getElementById('writeModal');
  const detailModal = document.getElementById('detailModal');
  const postDetail = document.getElementById('postDetail');
  const postForm = document.getElementById('postForm');
  const submitPost = document.getElementById('submitPost');

  let supabaseClient = null;
  let posts = [];
  let currentFilter = 'all';
  let usingSampleMode = true;

  function getSupabaseClient() {
    const config = window.AUDITSECU_SUPABASE || {};
    const isConfigured = config.url && config.anonKey && !config.url.includes('YOUR_PROJECT_REF') && !config.anonKey.includes('YOUR_SUPABASE_ANON_KEY');
    if (!isConfigured || !window.supabase) return null;
    return window.supabase.createClient(config.url, config.anonKey);
  }

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.dataset.type = type || 'info';
  }

  function formatDate(value) {
    if (!value) return '-';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit'
    }).format(new Date(value)).replace(/\. /g, '.').replace(/\.$/, '');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function openModal(modal) {
    if (modal) modal.setAttribute('aria-hidden', 'false');
  }

  function closeModal(modal) {
    if (modal) modal.setAttribute('aria-hidden', 'true');
  }

  function renderPosts() {
    if (!table) return;
    const visiblePosts = posts.filter(post => currentFilter === 'all' || post.category === currentFilter);
    const head = '<div class="board-row board-head"><span>분류</span><span>제목</span><span>작성자</span><span>조회</span><span>날짜</span></div>';

    const rows = visiblePosts.map(post => `
      <button class="board-row" type="button" data-post-id="${escapeHtml(post.id)}" data-category="${escapeHtml(post.category)}">
        <span class="tag ${escapeHtml(post.category)}">${escapeHtml(CATEGORY_LABELS[post.category] || post.category)}</span>
        <strong>${escapeHtml(post.title)}</strong>
        <span>${escapeHtml(post.author)}</span>
        <span>${Number(post.views || 0).toLocaleString('ko-KR')}</span>
        <span>${formatDate(post.created_at)}</span>
      </button>
    `).join('');

    table.innerHTML = head + rows;
    if (empty) empty.style.display = visiblePosts.length ? 'none' : 'block';

    table.querySelectorAll('[data-post-id]').forEach(row => {
      row.addEventListener('click', () => showPost(row.dataset.postId));
    });
  }

  async function loadPosts() {
    supabaseClient = supabaseClient || getSupabaseClient();

    if (!supabaseClient) {
      usingSampleMode = true;
      posts = SAMPLE_POSTS;
      setStatus('Supabase 설정 전입니다. 현재는 샘플 게시글을 표시합니다. js/supabase-config.js를 설정하면 실제 DB와 연결됩니다.', 'warning');
      renderPosts();
      return;
    }

    usingSampleMode = false;
    setStatus('Supabase에서 게시글을 불러오는 중입니다.', 'info');

    const { data, error } = await supabaseClient
      .from('board_posts')
      .select('id, category, title, author, content, views, created_at')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      posts = SAMPLE_POSTS;
      usingSampleMode = true;
      setStatus(`Supabase 조회 실패: ${error.message}. 샘플 데이터를 표시합니다.`, 'error');
      renderPosts();
      return;
    }

    posts = data || [];
    setStatus(`${posts.length.toLocaleString('ko-KR')}개의 게시글을 불러왔습니다.`, 'success');
    renderPosts();
  }

  async function showPost(id) {
    const post = posts.find(item => String(item.id) === String(id));
    if (!post || !postDetail) return;

    postDetail.innerHTML = `
      <span class="tag ${escapeHtml(post.category)}">${escapeHtml(CATEGORY_LABELS[post.category] || post.category)}</span>
      <h3>${escapeHtml(post.title)}</h3>
      <div class="detail-meta">작성자 ${escapeHtml(post.author)} · 조회 ${Number(post.views || 0).toLocaleString('ko-KR')} · ${formatDate(post.created_at)}</div>
      <div class="detail-content">${escapeHtml(post.content).replace(/\n/g, '<br />')}</div>
    `;
    openModal(detailModal);

    if (!usingSampleMode && supabaseClient && !String(id).startsWith('sample-')) {
      await supabaseClient.rpc('increment_board_post_views', { post_id: id });
      const found = posts.find(item => String(item.id) === String(id));
      if (found) found.views = Number(found.views || 0) + 1;
      renderPosts();
    }
  }

  async function createPost(event) {
    event.preventDefault();
    if (!postForm) return;

    supabaseClient = supabaseClient || getSupabaseClient();
    if (!supabaseClient) {
      setStatus('Supabase 설정이 아직 없습니다. js/supabase-config.js에 URL과 anon key를 입력하세요.', 'error');
      return;
    }

    const formData = new FormData(postForm);
    const payload = {
      title: String(formData.get('title') || '').trim(),
      category: String(formData.get('category') || 'qna'),
      author: String(formData.get('author') || '').trim(),
      content: String(formData.get('content') || '').trim()
    };

    if (!payload.title || !payload.author || !payload.content) {
      setStatus('제목, 작성자, 내용을 모두 입력하세요.', 'error');
      return;
    }

    submitPost.disabled = true;
    submitPost.textContent = '등록 중...';

    const { error } = await supabaseClient.from('board_posts').insert(payload);

    submitPost.disabled = false;
    submitPost.textContent = '등록하기';

    if (error) {
      setStatus(`게시글 등록 실패: ${error.message}`, 'error');
      return;
    }

    postForm.reset();
    closeModal(writeModal);
    setStatus('게시글이 등록되었습니다.', 'success');
    await loadPosts();
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.boardFilter;
      filterButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderPosts();
    });
  });

  document.getElementById('openWrite')?.addEventListener('click', () => openModal(writeModal));
  document.getElementById('closeWrite')?.addEventListener('click', () => closeModal(writeModal));
  document.getElementById('cancelWrite')?.addEventListener('click', () => closeModal(writeModal));
  document.getElementById('closeDetail')?.addEventListener('click', () => closeModal(detailModal));
  refreshButton?.addEventListener('click', loadPosts);
  postForm?.addEventListener('submit', createPost);

  [writeModal, detailModal].forEach(modal => {
    modal?.addEventListener('click', event => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal(writeModal);
      closeModal(detailModal);
    }
  });

  loadPosts();
})();
