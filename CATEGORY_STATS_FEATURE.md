# 카테고리별 문제 풀이 현황 기능

## 🎯 기능 개요

사용자가 각 카테고리별로 문제를 몇 번씩 풀어봤는지, 그리고 각 도전 횟수별 정답률은 어떻게 되는지 한눈에 볼 수 있는 통계 기능입니다.

## 📊 표시되는 정보

### 전체 통계 요약
- 총 카테고리 수
- 총 문제 수  
- 도전한 문제 수
- 전체 정답률

### 카테고리별 상세 현황
각 카테고리마다:
- **5번 도전한 문제**: 문제 수 + 정답률
- **4번 도전한 문제**: 문제 수 + 정답률  
- **3번 도전한 문제**: 문제 수 + 정답률
- **2번 도전한 문제**: 문제 수 + 정답률
- **1번 도전한 문제**: 문제 수 + 정답률
- **미도전 문제**: 문제 수 + 전체 대비 비율

## 🎨 UI/UX 특징

### 색상 구분
- **5번 도전**: 빨간색 (숙련도 최고)
- **4번 도전**: 주황색  
- **3번 도전**: 노란색
- **2번 도전**: 초록색
- **1번 도전**: 파란색

### 시각적 요소
- 프로그레스 바로 정답률 표시
- 호버 효과로 인터랙티브한 느낌
- 반응형 디자인 (모바일/데스크톱 대응)
- 부드러운 애니메이션 효과

## 🔧 구현된 컴포넌트

```
src/
├── features/stats/
│   └── statsSlice.js              # Redux 상태 관리
├── components/
│   ├── atoms/stats/
│   │   ├── ProgressBar.jsx        # 진행률 바
│   │   └── StatsBadge.jsx         # 도전 횟수별 배지
│   └── organisms/stats/
│       ├── CategoryStatsCard.jsx   # 카테고리별 카드
│       ├── StatsOverview.jsx       # 전체 통계 요약
│       └── CategoryStatsModal.jsx  # 메인 모달
```

## 🚀 사용 방법

1. 메인 화면(Intro 페이지)에서 **"문제별 현황"** 버튼 클릭
2. 모달 팝업으로 통계 화면 표시
3. 각 카테고리별로 도전 횟수와 정답률 확인
4. ESC 키 또는 X 버튼으로 모달 닫기

## 🔌 API 연동

### 백엔드 API 엔드포인트
```
GET /u/stats?user_id={userId}
```

### 예상 응답 형식
```json
{
  "overallStats": {
    "totalCategories": 12,
    "totalQuestions": 1847,
    "attemptedQuestions": 624,
    "overallCorrectRate": 73
  },
  "categoryStats": [
    {
      "category_id": 9,
      "category_nm": "JavaScript 기초",
      "logo_url": "...",
      "total_questions": 217,
      "overall_correct_rate": 82,
      "attempt_5_count": 17,
      "attempt_5_correct_rate": 94,
      "attempt_4_count": 36,
      "attempt_4_correct_rate": 86,
      "attempt_3_count": 52,
      "attempt_3_correct_rate": 78,
      "attempt_2_count": 41,
      "attempt_2_correct_rate": 73,
      "attempt_1_count": 28,
      "attempt_1_correct_rate": 64,
      "unattempted_count": 43
    }
  ]
}
```

## ⚠️ 현재 상태

- ✅ 프론트엔드 UI/UX 구현 완료
- ✅ Redux 상태 관리 구현 완료
- ✅ 목업 데이터로 테스트 가능
- ⏳ 백엔드 API 연동 대기 중

백엔드 API가 구현되면 `CategoryStatsModal.jsx`의 주석 처리된 부분을 활성화하고 목업 데이터 부분을 삭제하면 됩니다.

## 🎯 학습 효과

이 기능을 통해 사용자는:
- **반복 학습의 효과**를 시각적으로 확인 (도전 횟수 ↑ = 정답률 ↑)
- **약점 영역** 파악 (낮은 정답률 구간)
- **학습 목표** 설정 (미도전 문제 현황)
- **성취감** 획득 (높은 정답률 영역)

## 🔮 향후 개선 계획

- [ ] 카테고리 필터링 기능
- [ ] 정답률 기준 정렬
- [ ] 차트/그래프 뷰 추가  
- [ ] 기간별 통계 비교
- [ ] CSV 내보내기 기능
