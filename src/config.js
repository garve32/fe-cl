// API Base URL Resolver
// 환경변수 우선순위: 
// 1. 배포 서비스 환경변수 (Vercel/Render)
// 2. .env 파일들 (.env.production, .env.development, .env.local, .env)
// 3. 기본값 (fallback)

const DEFAULT_API_BASE_URL = 'https://quiz-d0xy.onrender.com/api';

export const getApiBaseUrl = () => {
  // 빌드 타임에 환경변수가 주입됨
  const envUrl = process.env.REACT_APP_API_BASE_URL;
  
  // 디버깅을 위한 로그 (프로덕션에서는 제거)
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment:', process.env.NODE_ENV);
    console.log('API Base URL from env:', envUrl);
  }
  
  return envUrl || DEFAULT_API_BASE_URL;
};

// 현재 환경 정보
export const getEnvironment = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiBaseUrl: getApiBaseUrl(),
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development'
  };
};

export default getApiBaseUrl;
