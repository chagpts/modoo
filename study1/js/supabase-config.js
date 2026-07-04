// 1) Supabase 프로젝트 생성 후 아래 두 값을 교체하세요.
// 2) 교체 전에는 게시판/문의가 샘플 모드로 동작합니다.
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const isSupabaseReady =
  typeof supabase !== "undefined" &&
  SUPABASE_URL !== "YOUR_SUPABASE_URL" &&
  SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY";

const supabaseClient = isSupabaseReady
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
