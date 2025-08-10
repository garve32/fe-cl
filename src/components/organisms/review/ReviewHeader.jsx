import React from 'react';
import {
  getCategoryInfoText,
  getFormattedProgressTimeText,
} from '../../../functions/commonUtil';
import Status from '../../atoms/common/Status';
import Chart from '../../molecules/common/Chart';

function ReviewHeader({ history }) {
  // end_dt를 한국어 형식으로 포매팅하는 함수
  const formatEndDate = (endDt) => {
    if (!endDt) return '';
    
    try {
      const date = new Date(endDt);
      return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (error) {
      return endDt; // 파싱 실패 시 원본 반환
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-3 pb-6 pt-3 sm:px-4 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-6 lg:px-6 lg:pb-8 lg:pt-6">
      {/* 헤더 영역 - 더 컴팩트하게 */}
      <div className="flex items-center justify-between lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-6">
        <div className="flex items-center space-x-2">
          <h3 className="text-base font-semibold leading-6 text-gray-900 sm:text-lg">
            {`${history.category_nm} 결과`}
          </h3>
        </div>
        <Status value={history.success_cd} />
      </div>

      {/* 차트 영역 - 더 작게 */}
      <div className="mt-3 lg:row-span-3 lg:mt-0">
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
          <Chart history={history} />
        </div>
      </div>

      {/* 상세 정보 영역 - 더 컴팩트하게 */}
      <div className="py-3 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-6 lg:pr-4 lg:pt-2">
        <p className="mb-2 text-xs font-semibold leading-5 text-indigo-600 sm:text-sm">
          {getCategoryInfoText(
            history.total_q_cnt,
            history.time_limit,
            history.success_per,
          )}
        </p>
        <div className="mt-6 sm:mt-8">
          <ul className="list-disc space-y-1.5 pl-3 text-sm sm:space-y-2 sm:pl-4 sm:text-base">
            {/* {String(history.success_cd) === 'F' ? (
              <li className="text-rose-600">
                <span className="text-xs sm:text-sm">
                  {`합격하려면 ${history.success_per}%를 달성해야 함`}
                </span>
              </li>
            ) : null} */}
            <li className="text-slate-700">
              <span className="text-xl font-extrabold text-slate-900 sm:text-2xl">
                {`${history.correct_per}% `}
              </span>
              <span className="text-xs text-slate-900 sm:text-sm">
                {`정답 (${history.correct_cnt}/${history.total_q_cnt})`}
              </span>
            </li>
            <li className="text-slate-700">
              <span className="text-xs text-slate-900 sm:text-sm">
                {getFormattedProgressTimeText(history.accum_sec)}
              </span>
            </li>
            <li className="text-slate-700">
              <span className="text-xs text-slate-900 sm:text-sm">
                {formatEndDate(history.start_dt)} ~ {formatEndDate(history.end_dt)}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReviewHeader;
