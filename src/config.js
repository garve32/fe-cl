// API Base URL Resolver (쿼리스트링/로컬스토리지 사용 금지)
// 우선순위: REACT_APP_API_BASE_URL → 기본값
const DEFAULT_API_BASE_URL = 'https://quiz-d0xy.onrender.com/api';
// const DEFAULT_API_BASE_URL = 'http://localhost:9002/api';

export const getApiBaseUrl = () => {
  const fromEnv =
    typeof process !== 'undefined' &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL
      ? process.env.REACT_APP_API_BASE_URL
      : null;

  return fromEnv || DEFAULT_API_BASE_URL;
};

export default getApiBaseUrl;

