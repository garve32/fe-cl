import React from 'react';
import { TrophyIcon } from '@heroicons/react/24/solid';

// 정답률 기준 색상 체계 (개선된 버전)
const getColorsByCorrectRate = (correctRate) => {
  if (correctRate >= 95) {
    return { 
      bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600', 
      bgLight: 'bg-emerald-50', 
      border: 'border-emerald-200', 
      text: 'text-emerald-700', 
      progress: 'bg-emerald-500',
      ring: 'ring-emerald-200',
      icon: '🏆'
    };
  }
  if (correctRate >= 85) {
    return { 
      bg: 'bg-gradient-to-br from-green-500 to-green-600', 
      bgLight: 'bg-green-50', 
      border: 'border-green-200', 
      text: 'text-green-700', 
      progress: 'bg-green-500',
      ring: 'ring-green-200',
      icon: '🎖️'
    };
  }
  if (correctRate >= 75) {
    return { 
      bg: 'bg-gradient-to-br from-blue-500 to-blue-600', 
      bgLight: 'bg-blue-50', 
      border: 'border-blue-200', 
      text: 'text-blue-700', 
      progress: 'bg-blue-500',
      ring: 'ring-blue-200',
      icon: '⭐'
    };
  }
  if (correctRate >= 65) {
    return { 
      bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600', 
      bgLight: 'bg-indigo-50', 
      border: 'border-indigo-200', 
      text: 'text-indigo-700', 
      progress: 'bg-indigo-500',
      ring: 'ring-indigo-200',
      icon: '👍'
    };
  }
  if (correctRate >= 50) {
    return { 
      bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600', 
      bgLight: 'bg-yellow-50', 
      border: 'border-yellow-200', 
      text: 'text-yellow-700', 
      progress: 'bg-yellow-500',
      ring: 'ring-yellow-200',
      icon: '📚'
    };
  }
  if (correctRate >= 30) {
    return { 
      bg: 'bg-gradient-to-br from-orange-500 to-orange-600', 
      bgLight: 'bg-orange-50', 
      border: 'border-orange-200', 
      text: 'text-orange-700', 
      progress: 'bg-orange-500',
      ring: 'ring-orange-200',
      icon: '💪'
    };
  }
  return { 
    bg: 'bg-gradient-to-br from-red-500 to-red-600', 
    bgLight: 'bg-red-50', 
    border: 'border-red-200', 
    text: 'text-red-700', 
    progress: 'bg-red-500',
    ring: 'ring-red-200',
    icon: '🔥'
  };
};

// 미도전 전용 색상
const getNoAttemptColors = () => {
  return { 
    bg: 'bg-gradient-to-br from-gray-400 to-gray-500', 
    bgLight: 'bg-gray-50', 
    border: 'border-gray-200', 
    text: 'text-gray-600', 
    progress: 'bg-gray-400',
    ring: 'ring-gray-200',
    icon: '❓'
  };
};

// 도전 횟수에 따른 특별 배지
const getAttemptBadge = (attemptCount) => {
  if (attemptCount === 1) return { text: '첫 도전', color: 'bg-yellow-400', textColor: 'text-white' };
  if (attemptCount >= 5) return { text: '도전왕', color: 'bg-purple-500', textColor: 'text-white' };
  if (attemptCount >= 3) return { text: '끈기', color: 'bg-blue-500', textColor: 'text-white' };
  return null;
};

function StatsBadge({ 
  attemptCount, 
  questionCount, 
  correctRate, 
  compact = false,
  animated = true,
  showBadge = true,
  onClick = null 
}) {
  // 도전 횟수가 0이면 미도전 색상, 아니면 정답률 기준 색상
  const colors = attemptCount === 0 ? getNoAttemptColors() : getColorsByCorrectRate(correctRate);
  const badge = showBadge ? getAttemptBadge(attemptCount) : null;
  
  const getAttemptText = (count) => {
    if (count === 0) return '미도전';
    return `${count}번째 도전`;
  };

  const baseClasses = `
    relative overflow-hidden transition-all duration-200
    ${onClick ? 'cursor-pointer hover:scale-105 hover:shadow-lg' : ''}
    ${animated ? 'group' : ''}
  `;

  if (compact) {
    return (
      <div 
        className={`${baseClasses} ${colors.bgLight} border ${colors.border} p-3 rounded-xl text-center`}
        onClick={onClick}
      >
        {/* 배지 */}
        {badge && (
          <div className={`absolute -top-1 -right-1 ${badge.color} ${badge.textColor} text-xs px-1.5 py-0.5 rounded-full font-medium z-10`}>
            {badge.text}
          </div>
        )}

        {/* 성취 아이콘 */}
        {correctRate >= 85 && (
          <div className="absolute top-1 left-1">
            <TrophyIcon className="w-3 h-3 text-yellow-500" />
          </div>
        )}

        {/* 메인 컨텐츠 */}
        <div className="space-y-2">
          {/* 도전 횟수 */}
          <div className={`font-bold text-sm ${colors.text} flex items-center justify-center gap-1`}>
            <span className="text-xs">{colors.icon}</span>
            <span>{attemptCount === 0 ? '미도전' : `${attemptCount}번`}</span>
          </div>
          
          {/* 문제 수 */}
          <div className="text-xs text-gray-600 font-medium">{questionCount}문제</div>
          
          {/* 프로그레스 바 */}
          <div className="relative">
            <div className="bg-gray-200 h-1 rounded-full overflow-hidden">
              <div
                className={`${colors.progress} h-1 rounded-full transition-all duration-700 ease-out ${animated ? 'group-hover:animate-pulse' : ''}`}
                style={{ width: `${Math.max(correctRate, 2)}%` }}
              />
            </div>
          </div>
          
          {/* 정답률 */}
          <div className={`font-bold text-xs ${colors.text}`}>
            {correctRate.toFixed(1)}%
          </div>
        </div>

        {/* 호버 효과 */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl" />
        )}
      </div>
    );
  }

  // 일반 크기 뷰
  return (
    <div 
      className={`${baseClasses} ${colors.bgLight} border-2 ${colors.border} p-6 rounded-2xl text-center hover:${colors.ring} hover:ring-2`}
      onClick={onClick}
    >
      {/* 배지 */}
      {badge && (
        <div className={`absolute -top-2 -right-2 ${badge.color} ${badge.textColor} text-xs px-3 py-1.5 rounded-full font-medium shadow-md z-10`}>
          {badge.text}
        </div>
      )}

      {/* 성취 아이콘 */}
      {correctRate >= 85 && (
        <div className="absolute top-2 left-2">
          <TrophyIcon className="w-5 h-5 text-yellow-500 drop-shadow-sm" />
        </div>
      )}

      {/* 메인 컨텐츠 */}
      <div className="space-y-3">
        {/* 도전 횟수와 아이콘 */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-2xl">{colors.icon}</span>
          <div>
            <div className={`font-bold text-2xl ${colors.text}`}>
              {attemptCount}번
            </div>
            <div className="text-xs text-gray-500 font-medium">{getAttemptText(attemptCount)}</div>
          </div>
        </div>

        {/* 문제 수 */}
        <div className="space-y-2">
          <div className="font-semibold text-lg text-gray-800">{questionCount}문제</div>
          
          {/* 향상된 프로그레스 바 */}
          <div className="relative">
            <div className="bg-gray-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className={`${colors.progress} h-3 rounded-full transition-all duration-1000 ease-out relative ${animated ? 'group-hover:animate-pulse' : ''}`}
                style={{ width: `${Math.max(correctRate, 3)}%` }}
              >
                {/* 프로그레스 바 내부 하이라이트 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* 정답률 */}
        <div className={`font-bold text-xl ${colors.text}`}>
          {correctRate.toFixed(1)}% 정답률
        </div>

        {/* 성능 평가 텍스트 */}
        <div className="text-xs text-gray-600">
          {(() => {
            if (correctRate >= 95) return '완벽해요! 🏆';
            if (correctRate >= 85) return '훌륭해요! 🎖️';
            if (correctRate >= 75) return '잘하고 있어요! ⭐';
            if (correctRate >= 65) return '괜찮아요! 👍';
            if (correctRate >= 50) return '조금 더! 📚';
            if (correctRate >= 30) return '화이팅! 💪';
            return '다시 도전! 🔥';
          })()}
        </div>
      </div>

      {/* 호버 효과 */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl" />
      )}
    </div>
  );
}

export default StatsBadge;