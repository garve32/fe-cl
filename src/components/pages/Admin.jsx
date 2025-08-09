import React from 'react';
import BACKEND_ORIGIN from '../../config';

function LinkRow({ label, path, sample }) {
  const href = `${BACKEND_ORIGIN}${path}`;
  return (
    <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-sm">
      <div className="space-y-1">
        <div className="font-semibold text-slate-900">{label}</div>
        <div className="text-xs text-slate-500">{href}</div>
        {sample ? (
          <div className="text-xs text-slate-400">예: {`${BACKEND_ORIGIN}${sample}`}</div>
        ) : null}
      </div>
      <a
        className="whitespace-nowrap rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
        href={href}
        target="_blank"
        rel="noreferrer"
      >
        새 창에서 열기
      </a>
    </div>
  );
}

export default function Admin() {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-slate-900">관리자 바로가기</h1>
      <p className="text-sm text-slate-600">
        아래 링크는 백엔드(Thymeleaf) 관리자 화면으로 이동합니다. 프론트 내 메뉴에는 노출하지 않고, URL로 직접 접근합니다.
      </p>

      <div className="space-y-3">
        <LinkRow label="관리자 홈" path="/admin" />
        <LinkRow label="카테고리 목록" path="/admin/categories" />
        <LinkRow label="카테고리 상세" path="/admin/category/1" sample="/admin/category/1" />
        <LinkRow label="문제 목록" path="/admin/questions" />
        <LinkRow label="문제 등록" path="/admin/question/add" />
        <LinkRow label="문제 상세" path="/admin/question/101" sample="/admin/question/101" />
        <LinkRow label="문제 검색(제목)" path="/admin/questions?searchType=title&searchKeyword=IAM" />
        <LinkRow label="문제 검색(카테고리)" path="/admin/questions?searchType=category&searchKeyword=AWS" />
      </div>
    </div>
  );
}


