import React from 'react';

// 정답률 기준 색상 체계 (UX 친화적)
const getColorsByCorrectRate = (correctRate) => {
  if (correctRate >= 90) {
    return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', progress: 'bg-emerald-500' };
  }
  if (correctRate >= 80) {
    return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', progress: 'bg-green-500' };
  }
  if (correctRate >= 70) {
    return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', progress: 'bg-blue-500' };
  }
  if (correctRate >= 60) {
    return { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', progress: 'bg-yellow-500' };
  }
  if (correctRate >= 40) {
    return { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', progress: 'bg-orange-500' };
  }
  return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', progress: 'bg-red-500' };
};

// 미도전 전용 색상
const getNoAttemptColors = () => {
  return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', progress: 'bg-gray-400' };
};

function StatsBadge({ attemptCount, questionCount, correctRate, compact = false }) {
  // 도전 횟수가 0이면 미도전 색상, 아니면 정답률 기준 색상
  const colors = attemptCount === 0 ? getNoAttemptColors() : getColorsByCorrectRate(correctRate);
  
  const getAttemptText = (count) => {
    if (count === 0) return '첫 도전';
    return `${count}번째`;
  };

  if (compact) {
    return (
      <div className={`${colors.bg} border ${colors.border} duration-200 hover:scale-105 p-1.5 rounded text-center transition-all`}>
        <div className={`font-bold text-xs ${colors.text} mb-1`}>
          {attemptCount === 0 ? '미도전' : `${attemptCount}번 도전`}
        </div>
        <div className="space-y-0.5">
          <div className="font-medium text-xs text-gray-700">{questionCount}문제</div>
          <div className="bg-gray-200 h-0.5 rounded-full w-full">
            <div
              className={`${colors.progress} duration-500 ease-out h-0.5 rounded-full transition-all`}
              style={{ width: `${correctRate}%` }}
            />
          </div>
          <div className={`font-semibold text-xs ${colors.text}`}>
            {correctRate.toFixed(1)}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colors.bg} border ${colors.border} duration-200 hover:scale-105 p-4 rounded-xl text-center transition-all`}>
      <div className={`font-bold text-lg ${colors.text}`}>
        {attemptCount}번
      </div>
      <div className="mb-2 text-gray-600 text-xs">{getAttemptText(attemptCount)}</div>
      <div className="space-y-1">
        <div className="font-medium text-sm">{questionCount}문제</div>
        <div className="bg-gray-200 h-2 rounded-full w-full">
          <div
            className={`${colors.progress} duration-700 ease-out h-2 rounded-full transition-all`}
            style={{ width: `${correctRate}%` }}
          />
        </div>
        <div className={`font-medium text-xs ${colors.text}`}>
          {correctRate}% 정답률
        </div>
      </div>
    </div>
  );
}

export default StatsBadge;
