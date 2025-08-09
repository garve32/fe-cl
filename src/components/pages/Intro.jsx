import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { menuChanged } from '../../features/menu/menuSlice';
import { showAlert } from '../../features/modal/modalSlice';
import {
  callApi,
  getFormattedQuizInfo,
  isEmpty,
  getFormattedProgressTimeText,
} from '../../functions/commonUtil';

import { initQuiz } from '../../features/quiz/quizSlice';
import Status from '../atoms/common/Status';
import IntroHeader from '../organisms/intro/IntroHeader';

function Intro() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [histories, setHistories] = useState([]);
  const [isResponsed, setIsResponsed] = useState(false);

  useEffect(() => {
    if (!isEmpty(user.id)) {
      dispatch(
        menuChanged({
          id: 'Intro',
          name: '시작하기',
          description:
            '새 테스트 또는 진행하던 테스트를 이어서 시작할 수 있습니다.',
        }),
      );

      callApi('get', `/u/his?user_id=${user.id}`)
        .then(response => {
          const payload = response.data.map(data => {
            return getFormattedQuizInfo(data);
          });
          setHistories(payload);
          setIsResponsed(true);
        })
        .catch(error => {
          const errorMessage = error.response?.data?.message || '히스토리를 불러오는 중 오류가 발생했습니다.';
          dispatch(
            showAlert({
              isShow: true,
              title: '알림',
              message: errorMessage,
              callback: () => {},
            }),
          );
        });
    }
  }, []);

  const getProgressCnt = progressSet => {
    return progressSet.filter(value => value === '2' || value === '1').length;
  };

  const handleContinueClick = history => {
    dispatch(initQuiz(history));

    const continueIndex = history.progressSet.findIndex(value => value === '0');

    if (continueIndex < 0) navigate(`/q/${history.questionSet[0]}`);
    else navigate(`/q/${history.questionSet[continueIndex]}`);
  };

  const handleReviewClick = history => {
    navigate(`/r/${history.id}`);
  };

  const getCorrectCnt = correctSet => {
    if (!correctSet || correctSet.length < 1) return 0;
    return correctSet.filter(v => String(v) === 'Y' || String(v) === '1').length;
  };

  const getScore = (correctCnt, totalCnt) => {
    if (!totalCnt) return 0;
    return Math.round((correctCnt / totalCnt) * 100);
  };

  return isResponsed ? (
    <div className="mt-6 space-y-3 sm:mt-8">
      <ul className="divide-y divide-gray-100">
        {histories.map(history => {
          return (
            <li key={history.id}>
              <div className="group relative py-4 sm:rounded-2xl">
                <div className="absolute -inset-x-4 -inset-y-px bg-gray-50 opacity-0 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl lg:-inset-x-8" />
                <div className="relative flex items-center">
                  <div className="relative h-[3.125rem] w-[3.125rem] flex-none sm:h-[3.75rem] sm:w-[3.75rem]">
                    <img
                      className="absolute inset-0 h-full w-full rounded-full object-cover"
                      src={history.logoUrl}
                      alt=""
                    />
                    <div className="absolute inset-0 rounded-full ring-0 ring-inset ring-black/[0.08]" />
                  </div>
                  <dl className="ml-4 flex min-w-0 flex-auto flex-col gap-y-1 sm:ml-6 sm:grid sm:w-full sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-x-6">
                    {/* 제목 */}
                    <div className="min-w-0 sm:col-span-1">
                      <dt className="sr-only">Category</dt>
                      <dd className="truncate text-[0.9375rem] font-semibold leading-6 text-gray-900">
                        <button
                          type="button"
                          onClick={() => {
                            if (isEmpty(history.successCd)) {
                              return handleContinueClick(history);
                            }
                            return handleReviewClick(history);
                          }}
                        >
                          <span className="absolute -inset-x-4 inset-y-[calc(-1*(theme(spacing.6)+1px))] sm:-inset-x-6 sm:rounded-2xl lg:-inset-x-8" />
                          {history.categoryNm}
                        </button>
                      </dd>
                    </div>

                    {/* 상태 배지 + 날짜 (모바일/데스크톱 모두 한 줄, 함께 배치) */}
                    <div className="flex items-center gap-3 text-xs leading-6 sm:col-span-2 sm:justify-self-start">
                      <div className="flex items-center text-gray-600">
                        <dt className="sr-only">Status</dt>
                        <Status value={history.successCd} />
                      </div>
                      <div className="text-gray-400">
                        <dt className="sr-only">Start</dt>
                        <time dateTime={history.start_dt}>
                          {new Intl.DateTimeFormat('ko-KR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }).format(new Date(history.startDt))}
                        </time>
                      </div>
                    </div>

                    {/* 진행/결과 요약 (두 번째 줄 전체 폭) */}
                    <div className="min-w-0 sm:col-span-3">
                      <dt className="sr-only">Summary</dt>
                      <dd className="truncate text-xs leading-6 text-gray-600">
                        {(() => {
                          const total = history.questionSet.length;
                          const completed = getProgressCnt(history.progressSet);
                          const progressText = `풀이 진행 ${completed}/${total}`;
                          const correct = getCorrectCnt(history.correctSet);
                          const score = getScore(correct, total);
                          const timeText = getFormattedProgressTimeText(Number(history.accumSec) || 0);
                          const resultText = `${score}% 정답 (${correct}/${total})`;
                          // 진행중이면 정답률/정답수는 숨김
                          return isEmpty(history.successCd)
                            ? `${progressText}  |  소요 ${timeText}`
                            : `${progressText}  |  ${resultText}  |  소요 ${timeText}`;
                        })()}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <IntroHeader />
    </div>
  ) : null;
}

export default Intro;
