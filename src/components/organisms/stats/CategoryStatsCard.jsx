import React, { useState } from 'react';
import { TrophyIcon, ChartBarIcon, FireIcon } from '@heroicons/react/24/outline';

function CategoryStatsCard({ categoryData, categoryName }) {
  const [viewMode, setViewMode] = useState('compact'); // 'compact' | 'detailed'
  
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <div className="text-center py-8">
          <div className="text-gray-400 mb-3 text-4xl">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">통계 데이터가 없습니다</h3>
          <p className="text-sm text-gray-500">문제를 풀어보면 여기에 통계가 표시됩니다</p>
        </div>
      </div>
    );
  }

  // 데이터 분석
  const totalQuestions = categoryData.reduce((sum, item) => sum + item.attempt_count, 0);
  const sortedData = [...categoryData].sort((a, b) => a.select_count - b.select_count);
  
  const excellentProblems = categoryData.filter(item => item.correct_rate >= 80).reduce((sum, item) => sum + item.attempt_count, 0);
  const strugglingProblems = categoryData.filter(item => item.correct_rate < 60).reduce((sum, item) => sum + item.attempt_count, 0);
  const maxAttempts = Math.max(...categoryData.map(item => item.select_count));
  const avgCorrectRate = categoryData.reduce((sum, item) => sum + (item.correct_rate * item.attempt_count), 0) / totalQuestions;

  // 색상 함수
  const getColorsByCorrectRate = (correctRate) => {
    if (correctRate >= 90) return { bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    if (correctRate >= 80) return { bg: 'bg-green-500', bgLight: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    if (correctRate >= 70) return { bg: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    if (correctRate >= 60) return { bg: 'bg-yellow-500', bgLight: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    if (correctRate >= 40) return { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    return { bg: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  // 컴팩트 뷰
  const renderCompactView = () => (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {categoryName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{categoryName}</h3>
            <p className="text-sm text-gray-500">총 {totalQuestions}문제 • 평균 {avgCorrectRate.toFixed(1)}%</p>
          </div>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {viewMode === 'compact' ? '자세히' : '간단히'}
        </button>
      </div>

      {/* 요약 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="text-2xl font-bold text-blue-600 mb-1">{totalQuestions}</div>
          <div className="text-xs text-blue-700 font-medium">총 문제</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="text-2xl font-bold text-green-600 mb-1">{excellentProblems}</div>
          <div className="text-xs text-green-700 font-medium">우수 성취</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
          <div className="text-2xl font-bold text-purple-600 mb-1">{maxAttempts}번</div>
          <div className="text-xs text-purple-700 font-medium">최대 도전</div>
        </div>
      </div>

      {/* 도전 현황 그리드 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">도전 횟수별 현황</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {sortedData.slice(0, 8).map((item) => {
            const colors = getColorsByCorrectRate(item.correct_rate);
            return (
              <div key={`${item.select_count}-${item.attempt_count}`} className={`p-3 rounded-lg ${colors.bgLight} ${colors.border} border transition-all hover:scale-105`}>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 mb-1">{item.select_count}</div>
                  <div className="text-xs text-gray-600 mb-2">{item.attempt_count}문제</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mb-1">
                    <div className={`${colors.bg} h-1 rounded-full transition-all duration-500`} style={{ width: `${Math.max(item.correct_rate, 5)}%` }} />
                  </div>
                  <div className={`text-xs font-bold ${colors.text}`}>{item.correct_rate.toFixed(1)}%</div>
                </div>
              </div>
            );
          })}
        </div>
        {sortedData.length > 8 && (
          <button
            onClick={() => setViewMode('detailed')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {sortedData.length - 8}개 더 보기 →
          </button>
        )}
      </div>
    </div>
  );

  // 자세한 뷰
  const renderDetailedView = () => (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            {categoryName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{categoryName}</h3>
            <p className="text-sm text-gray-500">총 {totalQuestions}문제 • 평균 {avgCorrectRate.toFixed(1)}%</p>
          </div>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'compact' ? 'detailed' : 'compact')}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          {viewMode === 'compact' ? '자세히' : '간단히'}
        </button>
      </div>

      {/* 인사이트 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <TrophyIcon className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-800">우수 성취</span>
          </div>
          <div className="text-2xl font-bold text-green-600 mb-1">{excellentProblems}문제</div>
          <div className="text-sm text-green-700">80% 이상의 정답률</div>
        </div>

        <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-orange-600">💪</span>
            <span className="font-medium text-orange-800">개선 필요</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-1">{strugglingProblems}문제</div>
          <div className="text-sm text-orange-700">60% 미만, 재도전 권장</div>
        </div>

        <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <FireIcon className="w-5 h-5 text-purple-600" />
            <span className="font-medium text-purple-800">도전 정신</span>
          </div>
          <div className="text-2xl font-bold text-purple-600 mb-1">{maxAttempts}번</div>
          <div className="text-sm text-purple-700">최대 도전 횟수</div>
        </div>
      </div>

      {/* 전체 도전 현황 */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">전체 도전 현황</h4>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="space-y-3">
            {sortedData.map((item) => {
              const colors = getColorsByCorrectRate(item.correct_rate);
              const maxQuestionCount = Math.max(...sortedData.map(i => i.attempt_count));
              const barWidth = (item.attempt_count / maxQuestionCount) * 100;
              
              return (
                <div key={`${item.select_count}-${item.attempt_count}`} className="flex items-center gap-4">
                  <div className="w-16 text-right">
                    <div className="text-sm font-medium text-gray-900">{item.select_count}번</div>
                  </div>
                  
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`${colors.bg} h-6 rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                        style={{ width: `${Math.max(barWidth, 10)}%` }}
                      >
                        <span className="text-white text-xs font-medium">
                          {item.attempt_count}문제
                        </span>
                      </div>
                    </div>
                    
                    <div className="absolute right-0 top-0 h-6 flex items-center pr-2">
                      <div className={`text-xs font-bold ${colors.text}`}>
                        {item.correct_rate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      {viewMode === 'compact' ? renderCompactView() : renderDetailedView()}
      
      {/* 학습 팁 */}
      <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-xl">
        <div className="flex items-start">
          <div className="text-blue-500 mr-2 text-sm">💡</div>
          <div className="text-sm text-blue-800">
            {(() => {
              if (avgCorrectRate >= 80) {
                return `${categoryName} 카테고리에서 뛰어난 성과를 보이고 있어요! 이 수준을 유지해보세요. 🎉`;
              }
              if (strugglingProblems > totalQuestions * 0.3) {
                return `일부 문제들이 어려워 보이네요. ${strugglingProblems}개 문제를 다시 도전해보는 것을 추천해요. 💪`;
              }
              if (excellentProblems > totalQuestions * 0.5) {
                return `절반 이상의 문제에서 우수한 성과를 내고 있어요! 계속 화이팅! 🔥`;
              }
              return `꾸준히 학습하고 있네요! 반복 학습을 통해 더 좋은 결과를 얻을 수 있어요. 📚`;
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsCard;