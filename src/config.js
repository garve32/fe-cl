// API Base URL Resolver
// 우선순위: queryString(apiBaseUrl) → localStorage(API_BASE_URL) → REACT_APP_API_BASE_URL → 기본값
const DEFAULT_API_BASE_URL = 'http://localhost:9002/api';

export const getApiBaseUrl = () => {
  // 1) 쿼리스트링으로 즉석 전환 (예: ?apiBaseUrl=https://quiz-a.example.com/api)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const fromQuery = searchParams.get('apiBaseUrl');
    if (fromQuery) {
      try {
        localStorage.setItem('API_BASE_URL', fromQuery);
      } catch (_) {
        // storage 사용 불가 환경은 무시
      }
      return fromQuery;
    }
  } catch (_) {
    // window 미존재 환경은 무시
  }

  // 2) 로컬 저장소 오버라이드
  try {
    const fromLocalStorage = localStorage.getItem('API_BASE_URL');
    if (fromLocalStorage) return fromLocalStorage;
  } catch (_) {
    // storage 사용 불가 환경은 무시
  }

  // 3) 빌드 타임 환경 변수 (CRA: REACT_APP_ 접두사 필요)
  if (
    typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL
  ) {
    return process.env.REACT_APP_API_BASE_URL;
  }

  // 4) 기본값
  return DEFAULT_API_BASE_URL;
};

export default getApiBaseUrl;

