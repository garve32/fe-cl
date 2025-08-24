import React from 'react';
import StatsBadge from '../../atoms/stats/StatsBadge';

function CategoryStatsCard({ categoryData, categoryName }) {
  // categoryData는 API에서 받은 배열 형태의 데이터
  // [{select_count: 2, attempt_count: 28, correct_rate: 16.07}, ...]
  
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="border border-gray-200 p-4 rounded-lg">
        <div className="text-center py-6">
          <div className="text-gray-500 mb-2 text-2xl">📊</div>
          <div className="text-gray-600 text-sm">통계 데이터가 없습니다.</div>
        </div>
      </div>
    );
  }

  // 전체 문제 수 계산 (모든 attempt_count의 합)
  const totalQuestions = categoryData.reduce((sum, item) => sum + item.attempt_count, 0);
  
  // 데이터를 선택 횟수별로 정렬
  const sortedData = [...categoryData].sort((a, b) => a.select_count - b.select_count);

  return (
    <div className="border border-gray-200 p-4 rounded-lg transition-all duration-200 hover:shadow-md bg-white">
      {/* 카테고리 헤더 - 더 컴팩트하게 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm font-bold">
              {categoryName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{categoryName}</h3>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-xl text-blue-600">
            총 {totalQuestions}문제
          </div>
        </div>
      </div>

      {/* 도전 횟수별 현황 - 더 간결하게 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">도전 횟수별 현황</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1.5">
          {sortedData.map((item) => (
            <StatsBadge
              key={`${item.select_count}-${item.attempt_count}`}
              attemptCount={item.select_count}
              questionCount={item.attempt_count}
              correctRate={parseFloat(item.correct_rate)}
              compact
            />
          ))}
        </div>
      </div>

      {/* 간단한 인사이트 메시지 */}
      <div className="mt-3 p-2 bg-blue-50 border-l-2 border-blue-400 rounded-r-md">
        <div className="flex items-start">
          <div className="text-blue-500 mr-2 text-sm">💡</div>
          <div className="text-xs text-blue-800">
            {(() => {
              if (sortedData.length === 0) {
                return '통계 데이터가 부족합니다. 더 많은 문제를 풀어보세요!';
              }
              
              // 가장 높은 정답률과 가장 낮은 정답률 찾기
              const highestRateItem = sortedData.reduce((prev, current) => 
                prev.correct_rate > current.correct_rate ? prev : current
              );
              const lowestRateItem = sortedData.reduce((prev, current) => 
                prev.correct_rate < current.correct_rate ? prev : current
              );
              
              if (highestRateItem.correct_rate >= 80) {
                return `${highestRateItem.select_count}번 도전한 문제들의 정답률이 ${highestRateItem.correct_rate.toFixed(1)}%로 높습니다! 🎉`;
              }
              if (lowestRateItem.correct_rate < 60) {
                return `${lowestRateItem.select_count}번 도전한 문제들을 더 연습해보세요 (${lowestRateItem.correct_rate.toFixed(1)}%) 💪`;
              }
              return '꾸준히 연습하고 있네요! 계속 화이팅! 📚';
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsCard;