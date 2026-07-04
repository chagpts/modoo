const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

function setContactStatus(message, type = "") {
  if (!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.className = `form-status ${type}`.trim();
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    name: document.getElementById("contactName").value.trim(),
    email: document.getElementById("contactEmail").value.trim(),
    phone: document.getElementById("contactPhone").value.trim(),
    inquiry_type: document.getElementById("contactType").value,
    message: document.getElementById("contactMessage").value.trim(),
  };

  if (!payload.name || !payload.email || !payload.inquiry_type) {
    setContactStatus("이름, 이메일, 수강 유형을 입력해 주세요.", "error");
    return;
  }

  if (!supabaseClient) {
    console.log("문의 샘플 데이터", payload);
    setContactStatus("Supabase 설정 전입니다. 콘솔에 문의 데이터가 표시됩니다.", "error");
    return;
  }

  setContactStatus("문의 내용을 저장하는 중입니다...");

  const { error } = await supabaseClient
    .from("contact_inquiries")
    .insert([payload]);

  if (error) {
    console.error(error);
    setContactStatus("문의 저장 중 오류가 발생했습니다. Supabase 테이블과 RLS 정책을 확인해 주세요.", "error");
    return;
  }

  contactForm.reset();
  setContactStatus("문의가 접수되었습니다. 확인 후 연락드리겠습니다.", "success");
});
