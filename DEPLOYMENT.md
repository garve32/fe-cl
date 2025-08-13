# 배포 환경 설정 가이드

## 환경변수 설정

### Vercel
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Environment Variables
3. 다음 환경변수 추가:
   ```
   Name: REACT_APP_API_BASE_URL
   Value: https://your-backend-api.vercel.app/api
   Environment: Production (또는 모든 환경)
   ```

### Render
1. Render 대시보드 → 서비스 선택
2. Environment 탭
3. 다음 환경변수 추가:
   ```
   Key: REACT_APP_API_BASE_URL
   Value: https://your-backend-api.render.com/api
   ```

### Netlify
1. Netlify 대시보드 → Site settings
2. Environment variables
3. 다음 환경변수 추가:
   ```
   Key: REACT_APP_API_BASE_URL
   Value: https://your-backend-api.netlify.app/api
   ```

## 로컬 개발 환경

### 환경별 설정
- `.env.development`: 개발 환경 (npm start)
- `.env.production`: 프로덕션 빌드 (npm run build)
- `.env.local`: 로컬 개발자별 설정 (git에 포함되지 않음)

### 우선순위
1. 배포 서비스 환경변수 (최우선)
2. `.env.local`
3. `.env.development` 또는 `.env.production`
4. `.env`
5. 코드 내 기본값

## 확인 방법

### 개발 중 확인
```javascript
import { getEnvironment } from './src/config';
console.log(getEnvironment());
```

### 빌드된 앱에서 확인
브라우저 개발자 도구 → Network 탭에서 API 호출 URL 확인

## 주의사항
- 환경변수는 빌드 타임에 코드에 주입됩니다
- 환경변수 변경 후 반드시 재배포 필요
- `REACT_APP_` 접두사가 반드시 필요합니다
- 민감한 정보는 백엔드에서 처리하세요 (프론트엔드 환경변수는 공개됩니다)
