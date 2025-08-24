import React from 'react';

function StatsOverview({ overallStats }) {
  const {
    totalCategories,
    totalQuestions,
    attemptedQuestions,
    overallCorrectRate,
  } = overallStats;

  const statItems = [
    {
      id: 'categories',
      label: '총 카테고리',
      value: totalCategories,
      color: 'text-blue-600',
      icon: '📚',
    },
    {
      id: 'total-questions',
      label: '총 문제 수',
      value: totalQuestions.toLocaleString(),
      color: 'text-green-600',
      icon: '📝',
    },
    {
      id: 'attempted-questions',
      label: '도전한 문제',
      value: attemptedQuestions.toLocaleString(),
      color: 'text-purple-600',
      icon: '🎯',
    },
    {
      id: 'correct-rate',
      label: '전체 정답률',
      value: `${overallCorrectRate}%`,
      color: 'text-orange-600',
      icon: '🏆',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
      <div className="gap-4 grid grid-cols-1 md:grid-cols-4">
        {statItems.map((item) => (
          <div
            key={item.id}
            className="bg-white hover:shadow-md p-4 rounded-xl shadow-sm transition-shadow"
          >
            <div className="flex gap-2 items-center mb-2">
              <span className="text-lg">{item.icon}</span>
              <div className="text-gray-600 text-sm">{item.label}</div>
            </div>
            <div className={`font-bold text-2xl ${item.color}`}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsOverview;
