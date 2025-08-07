import React from 'react';
import { Link } from 'react-router-dom';

function IntroHeader() {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 shadow-sm">
      <div className="px-6 py-6 lg:flex lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
              <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                새로운 테스트를 시작하시나요?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                다양한 카테고리의 테스트를 통해 지식을 확인해보세요
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 lg:mt-0 lg:ml-6">
          <Link
            to="../c"
            className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            테스트 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IntroHeader;
