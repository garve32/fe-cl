import React from 'react';
import { getEnvironment } from '../../config';

// 개발 중에만 환경 정보를 표시하는 컴포넌트
const EnvironmentInfo = () => {
  const env = getEnvironment();
  
  // 프로덕션에서는 렌더링하지 않음
  if (env.isProduction) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs p-2 rounded opacity-75 z-50">
      <div>ENV: {env.nodeEnv}</div>
      <div>API: {env.apiBaseUrl}</div>
    </div>
  );
};

export default EnvironmentInfo;
