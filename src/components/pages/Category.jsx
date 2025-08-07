import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import { menuChanged } from '../../features/menu/menuSlice';
import { initQuiz } from '../../features/quiz/quizSlice';
import { showAlert } from '../../features/modal/modalSlice';

import {
  callApi,
  getFormattedQuizInfo,
} from '../../functions/commonUtil';

function Category() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(
      menuChanged({
        id: 'Category',
        name: '카테고리 선택하기',
        description: '원하는 카테고리를 선택하면 시험을 시작합니다.',
      }),
    );

    callApi('get', '/q/category')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        dispatch(
          showAlert({
            isShow: true,
            title: '알림',
            message: error.response.data.message,
            callback: () => {},
          }),
        );
      });
  }, []);

  const handleClick = category => {
    const params = {
      category_id: category.id,
      question_cnt: category.question_cnt,
      user_id: user.id,
    };
    callApi('post', '/q/start', params)
      .then(response => {
        const payload = getFormattedQuizInfo(response.data);
        dispatch(initQuiz(payload));
        navigate(`/q/${payload.questionSet[0]}`);
      })
      .catch(error => {
        dispatch(
          showAlert({
            isShow: true,
            title: '알림',
            message: error.response.data.message,
            callback: () => {},
          }),
        );
      });
  };

  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div
          key={category.id}
          className="flex flex-col bg-slate-50 rounded-xl p-4 sm:p-5 lg:flex-row lg:items-center"
        >
          {/* 콘텐츠 영역 */}
          <div className="flex-1 mb-3 lg:mb-0 lg:mr-6">
            <h3 className="mb-2 text-sm font-semibold leading-6 text-indigo-600">
              {`${category.question_cnt}개의 질문 | ${category.time_limit}시간 | 합격하려면 ${category.success_percent}%의 정답을 달성해야함`}
            </h3>
            <p className="mb-1 text-lg font-semibold tracking-tight text-slate-900">
              {category.name}
            </p>
            <div className="mb-3 space-y-1 text-sm leading-6 text-slate-600">
              <p>
                {`준비된 문제 : ${category.pool_cnt} 문항`}
              </p>
              <p>{category.description}</p>
            </div>
            <button
              className={`group inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:bg-slate-300 ${
                category.active_yn === 'Y' ? 'bg-slate-700' : 'bg-slate-300'
              }`}
              type="button"
              onClick={() => handleClick(category)}
              disabled={category.active_yn === 'N'}
            >
              {category.active_yn === 'Y' ? '시험보기' : '준비중'}
              <svg
                className="ml-3 overflow-visible text-slate-300 disabled:text-white enabled:group-hover:text-slate-200 disabled:group-hover:text-slate-300"
                width="3"
                height="6"
                viewBox="0 0 3 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M0 0L3 3L0 6" />
              </svg>
            </button>
          </div>

          {/* 이미지 영역 */}
          <div className="flex-shrink-0 w-full lg:w-48 xl:w-56">
            <div className="relative h-40 lg:h-36 xl:h-40 overflow-hidden rounded-lg bg-slate-100 shadow-lg">
              <img 
                className="w-full h-full object-contain p-2" 
                src={category.logo_url} 
                alt={category.name}
              />
              {category.active_yn === 'N' && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
                  <span className="text-white text-sm font-medium">준비중</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Category;
