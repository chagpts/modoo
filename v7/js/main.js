
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
navToggle?.addEventListener('click', () => nav?.classList.toggle('open'));

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => nav?.classList.remove('open'));
});

const form = document.querySelector('[data-contact-form]');
const result = document.querySelector('[data-form-result]');
form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const saved = JSON.parse(localStorage.getItem('auditsecu-inquiries') || '[]');
  saved.push({...data, createdAt: new Date().toISOString()});
  localStorage.setItem('auditsecu-inquiries', JSON.stringify(saved));
  if (result) result.textContent = '문의 내용이 브라우저에 임시 저장되었습니다. 실제 전송은 백엔드 연결 후 활성화하세요.';
  form.reset();
});
