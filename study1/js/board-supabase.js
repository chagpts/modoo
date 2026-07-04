const boardTable = document.getElementById("boardTable");
const boardStatus = document.getElementById("boardStatus");
const boardEmpty = document.getElementById("boardEmpty");
const refreshBoard = document.getElementById("refreshBoard");
const filterButtons = document.querySelectorAll("[data-board-filter]");

const writeModal = document.getElementById("writeModal");
const openWrite = document.getElementById("openWrite");
const closeWrite = document.getElementById("closeWrite");
const cancelWrite = document.getElementById("cancelWrite");
const postForm = document.getElementById("postForm");

const detailModal = document.getElementById("detailModal");
const closeDetail = document.getElementById("closeDetail");
const postDetail = document.getElementById("postDetail");

let currentCategory = "all";
let posts = [];

const samplePosts = [
  { id: 1, category: "notice", title: "AI 전산감사 실무 과정 1기 수강 안내", author: "관리자", views: 132, content: "개인 수강생과 기업 교육 담당자를 위한 1기 과정을 모집합니다.", created_at: "2026-07-01" },
  { id: 2, category: "resource", title: "영수증 OCR 자동분개 실습 자료", author: "강사", views: 88, content: "수업에서 사용하는 영수증 OCR 실습 자료 안내입니다.", created_at: "2026-07-02" },
  { id: 3, category: "qna", title: "회계 지식이 없어도 수강 가능한가요?", author: "수강문의", views: 45, content: "입문 단계에서 거래, 증빙, 분개 구조를 먼저 설명합니다.", created_at: "2026-07-03" },
  { id: 4, category: "case", title: "ERP 권한표 감사 케이스 리뷰", author: "관리자", views: 61, content: "퇴사자 계정, 관리자 권한, 직무분리 위반을 점검하는 케이스입니다.", created_at: "2026-07-04" },
];

const categoryLabels = { notice: "공지", qna: "질문", resource: "자료", case: "케이스" };

function setBoardStatus(message) {
  if (boardStatus) boardStatus.textContent = message;
}

function formatDate(value) {
  if (!value) return "-";
  return String(value).slice(0, 10);
}

function filteredPosts() {
  if (currentCategory === "all") return posts;
  return posts.filter((post) => post.category === currentCategory);
}

function renderBoard() {
  if (!boardTable) return;

  const visiblePosts = filteredPosts();
  boardTable.innerHTML = `
    <div class="board-row board-head">
      <span>분류</span><span>제목</span><span>작성자</span><span>조회</span><span>날짜</span>
    </div>
  `;

  if (boardEmpty) boardEmpty.style.display = visiblePosts.length ? "none" : "block";

  visiblePosts.forEach((post) => {
    const row = document.createElement("div");
    row.className = "board-row";
    row.innerHTML = `
      <span><b class="category-badge">${categoryLabels[post.category] || post.category}</b></span>
      <span class="board-title" role="button" tabindex="0">${post.title}</span>
      <span>${post.author || "관리자"}</span>
      <span>${post.views || 0}</span>
      <span>${formatDate(post.created_at)}</span>
    `;
    row.querySelector(".board-title").addEventListener("click", () => openPostDetail(post));
    boardTable.appendChild(row);
  });
}

async function loadPosts() {
  if (!supabaseClient) {
    posts = samplePosts;
    setBoardStatus("Supabase 설정 전입니다. 샘플 게시글이 표시됩니다.");
    renderBoard();
    return;
  }

  setBoardStatus("게시글을 불러오는 중입니다...");

  const { data, error } = await supabaseClient
    .from("board_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    posts = samplePosts;
    setBoardStatus("게시글 로딩 오류가 발생해 샘플 게시글을 표시합니다.");
  } else {
    posts = data || [];
    setBoardStatus(`총 ${posts.length}개의 게시글이 있습니다.`);
  }

  renderBoard();
}

function openPostDetail(post) {
  if (!postDetail || !detailModal) return;
  postDetail.innerHTML = `
    <h3>${post.title}</h3>
    <div class="detail-meta">
      <span>${categoryLabels[post.category] || post.category}</span>
      <span>${post.author || "관리자"}</span>
      <span>${formatDate(post.created_at)}</span>
      <span>조회 ${post.views || 0}</span>
    </div>
    <div class="detail-content">${post.content || "내용이 없습니다."}</div>
  `;
  detailModal.classList.add("show");
  detailModal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
  modal?.classList.remove("show");
  modal?.setAttribute("aria-hidden", "true");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    currentCategory = button.dataset.boardFilter;
    renderBoard();
  });
});

openWrite?.addEventListener("click", () => {
  writeModal?.classList.add("show");
  writeModal?.setAttribute("aria-hidden", "false");
});
closeWrite?.addEventListener("click", () => closeModal(writeModal));
cancelWrite?.addEventListener("click", () => closeModal(writeModal));
closeDetail?.addEventListener("click", () => closeModal(detailModal));
refreshBoard?.addEventListener("click", loadPosts);

postForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: document.getElementById("postTitle").value.trim(),
    category: document.getElementById("postCategory").value,
    author: document.getElementById("postAuthor").value.trim(),
    content: document.getElementById("postContent").value.trim(),
    views: 0,
  };

  if (!supabaseClient) {
    posts.unshift({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
    postForm.reset();
    closeModal(writeModal);
    setBoardStatus("Supabase 설정 전입니다. 브라우저 화면에만 임시 추가되었습니다.");
    renderBoard();
    return;
  }

  const { error } = await supabaseClient.from("board_posts").insert([payload]);

  if (error) {
    console.error(error);
    alert("게시글 등록 중 오류가 발생했습니다. Supabase 테이블과 RLS 정책을 확인해 주세요.");
    return;
  }

  postForm.reset();
  closeModal(writeModal);
  loadPosts();
});

loadPosts();
