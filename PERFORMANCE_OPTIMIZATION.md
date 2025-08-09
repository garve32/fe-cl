# 성능 최적화 가이드

## 📊 현재 성능 상태

### 개발 vs 프로덕션
- **개발 모드**: commonUtil.js 1.8MB (소스맵 + HMR 포함)
- **프로덕션 빌드**: main.js 152.87kB (gzipped) ✅ 정상

### 주요 성능 병목점
1. **React 리렌더링**: React.memo, useMemo, useCallback 미사용
2. **API 호출**: 중복 요청 및 캐싱 부족
3. **번들 크기**: 불필요한 import와 라이브러리
4. **이미지 최적화**: 이미지 레이지 로딩 부족

## 🚀 성능 개선 방안

### 1. React 컴포넌트 최적화

#### Before (최적화 전)
```javascript
function Question() {
  const getCheckedOptions = (originOptions) => {
    // 매번 재계산됨
  };
  
  const handleSubmit = (e) => {
    // 매번 재생성됨
  };
}
```

#### After (최적화 후)
```javascript
const Question = React.memo(() => {
  const getCheckedOptions = useMemo(() => {
    // 의존성이 변경될 때만 재계산
  }, [quiz.questionSet, quiz.answerSet, id]);
  
  const handleSubmit = useCallback((e) => {
    // 의존성이 변경될 때만 재생성
  }, [quiz.questionSet, id]);
});
```

### 2. API 호출 최적화

#### React Query 도입 (권장)
```bash
npm install @tanstack/react-query
```

```javascript
import { useQuery } from '@tanstack/react-query';

const useQuestion = (id) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => callApi('get', `/q/${id}`),
    staleTime: 5 * 60 * 1000, // 5분 캐싱
    cacheTime: 10 * 60 * 1000, // 10분 보관
  });
};
```

### 3. 코드 분할 (Code Splitting)

```javascript
// 라우트 레벨 코드 분할
const Question = React.lazy(() => import('./components/pages/Question'));
const Review = React.lazy(() => import('./components/pages/Review'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/q/:id" element={<Question />} />
        <Route path="/r/:id" element={<Review />} />
      </Routes>
    </Suspense>
  );
}
```

### 4. 이미지 최적화

```javascript
// 이미지 레이지 로딩
const LazyImage = ({ src, alt, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};
```

### 5. Virtual Scrolling

긴 리스트의 경우:
```bash
npm install react-window react-window-infinite-loader
```

### 6. 웹팩 번들 분석

```bash
npm install --save-dev webpack-bundle-analyzer
```

```json
{
  "scripts": {
    "analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
  }
}
```

## 🎯 성능 측정 도구

### 1. React DevTools Profiler
- 컴포넌트 렌더링 시간 측정
- 리렌더링 원인 분석

### 2. Chrome DevTools
- Network 탭: 로딩 시간 분석
- Performance 탭: 런타임 성능 분석
- Lighthouse: 전체적인 성능 점수

### 3. Web Vitals
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

## 📈 성능 개선 체크리스트

### React 최적화
- [ ] React.memo 적용
- [ ] useMemo/useCallback 적용
- [ ] useState 배치 업데이트
- [ ] 불필요한 useEffect 제거

### 번들 최적화
- [ ] 코드 분할 적용
- [ ] Tree shaking 확인
- [ ] 불필요한 라이브러리 제거
- [ ] Dynamic import 사용

### 네트워크 최적화
- [ ] API 캐싱 구현
- [ ] 중복 요청 방지
- [ ] Prefetching 적용
- [ ] Service Worker 활용

### 렌더링 최적화
- [ ] Virtual Scrolling
- [ ] Image lazy loading
- [ ] CSS 최적화
- [ ] Font loading 최적화

## 🔧 즉시 적용 가능한 개선사항

1. **QuestionOptimized.jsx** 적용
2. **ReviewSiderOptimized.jsx** 적용
3. **QuestionOptionOptimized.jsx** 적용
4. **React Query** 도입 고려
5. **번들 분석** 실행

## 📊 예상 성능 개선 효과

- **초기 로딩**: 20-30% 개선
- **페이지 전환**: 50-70% 개선  
- **메모리 사용량**: 15-25% 감소
- **배터리 소모**: 10-20% 감소

이러한 최적화를 단계적으로 적용하면 사용자 경험이 크게 향상될 것입니다!
