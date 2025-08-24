import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { initHistory, setHistoryFilter } from '../../features/history/historySlice';

import { menuChanged } from '../../features/menu/menuSlice';
import { showAlert } from '../../features/modal/modalSlice';

import { callApi } from '../../functions/commonUtil';
import Divider from '../atoms/common/Divider';
import QuestionContent from '../molecules/question/QuestionContent';
import QuestionOptions from '../molecules/question/QuestionOptions';
import ReviewHeader from '../organisms/review/ReviewHeader';
import ScrollTopButton from '../atoms/common/buttons/ScrollTopButton';

function Review() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useSelector(state => state.history);
  const filter = useSelector(state => state.history.filter);
  const [isResponsed, setIsResponsed] = useState(false);
  const itemsRef = useRef([]);

  const getFormattedOptions = options => {
    return options.map(option => {
      return {
        ...option,
        checked: option.select_yn === 'Y',
        correct: option.correct_yn === 'Y',
      };
    });
  };

  // 필터링된 결과 계산
  const getFilteredResults = () => {
    if (!history.resultDetails) return [];
    
    switch (filter) {
      case 'correct':
        return history.resultDetails.filter(detail => detail.question.correct_yn === 'Y');
      case 'incorrect':
        return history.resultDetails.filter(detail => detail.question.correct_yn === 'N');
      default:
        return history.resultDetails;
    }
  };

  const filteredResults = getFilteredResults();

  useEffect(() => {
    dispatch(
      menuChanged({
        id: 'Review',
        name: '검토하기',
        description: '완료된 테스트 결과를 확인하고 오답을 확인해 보세요.',
      }),
    );

    callApi('get', `/u/his/${id}`)
      .then(response => {
        const payload = {
          ...response.data,
          resultDetails: response.data.resultDetails.map(
            (resultDetail, index) => {
              return {
                ...resultDetail,
                handleScroll: e => {
                  e.preventDefault();
                  window.scrollTo({
                    top: itemsRef.current[index].offsetTop,
                    left: 0,
                    behavior: 'smooth',
                  });
                },
              };
            },
          ),
        };
        setIsResponsed(true);
        dispatch(initHistory(payload));
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || '리뷰 데이터를 불러오는 중 오류가 발생했습니다.';
        dispatch(
          showAlert({
            isShow: true,
            title: '알림',
            message: errorMessage,
            callback: () => {},
          }),
        );
      });
  }, [id]);

  return (
    <>
      {isResponsed ? (
        <ReviewHeader history={history} />
      ) : null}
      
      {/* 필터 토글 버튼 */}
      {isResponsed && (
        <div className="mx-auto max-w-2xl px-3 pb-4 sm:px-4 lg:max-w-7xl lg:px-6">
          <div className="flex justify-center space-x-1 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => dispatch(setHistoryFilter('all'))}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              전체 ({history.totalQCnt})
            </button>
            <button
              type="button"
              onClick={() => dispatch(setHistoryFilter('correct'))}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'correct'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              정답 ({history.correctCnt})
            </button>
            <button
              type="button"
              onClick={() => dispatch(setHistoryFilter('incorrect'))}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                filter === 'incorrect'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              오답 ({history.totalQCnt - history.correctCnt})
            </button>
          </div>
        </div>
      )}

      {/* 필터링된 문제 목록 */}
      {isResponsed
        ? filteredResults.map((resultDetail, index) => {
            const { question, options } = resultDetail;
            return (
              <div
                className="mb-4 overflow-hidden shadow sm:rounded-md"
                key={question.id}
                data-question-id={question.id}
                ref={ref => {
                  itemsRef.current = { ...itemsRef.current, [index]: ref };
                }}
              >
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="space-y-2">
                    <QuestionContent
                      seq={index + 1}
                      text={question.text}
                      status={question.correct_yn}
                      image={question.image}
                    />
                    <Divider padding="1" />
                    <QuestionOptions
                      type={question.type}
                      options={getFormattedOptions(options)}
                    />
                  </div>
                </div>
              </div>
            );
          })
        : null}
      <ScrollTopButton />
    </>
  );
}

export default Review;