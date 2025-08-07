import React from 'react';

import { useSelector } from 'react-redux';

function MainHeader() {
  const menu = useSelector(state => state.menu);
  const user = useSelector(state => state.user);

  // 인트로 화면일 때 개인화된 헤더 표시
  if (menu.id === 'Intro') {
    return (
      <header id="header" className="relative z-20">
        <div>
          <p className="mb-2 text-sm font-semibold leading-6 text-indigo-600">
            환영합니다
          </p>
          <div className="flex items-center">
            <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {user.name ? `${user.name}님, 안녕하세요!` : '안녕하세요!'}
            </h1>
          </div>
        </div>
        <p className="mt-2 text-lg text-slate-700">
          새로운 테스트를 시작하거나 진행 중인 테스트를 이어서 풀어보세요
        </p>
      </header>
    );
  }

  // 다른 화면들에서는 기존 헤더 유지
  return (
    <header id="header" className="relative z-20">
      <div>
        <p className="mb-2 text-sm font-semibold leading-6 text-indigo-600">
          {menu.id}
        </p>
        <div className="flex items-center">
          <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {menu.name}
          </h1>
        </div>
      </div>
      <p className="mt-2 text-lg text-slate-700">{menu.description}</p>
    </header>
  );
}

export default MainHeader;
