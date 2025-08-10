import axios from 'axios';
import { getApiBaseUrl } from '../config';
// TODO: 백엔드 세션 기반 인증 구현 시 재활성화
// import store from '../app/store';
// import { userLogout } from '../features/user/userSlice';
// import { showAlert } from '../features/modal/modalSlice';

// 세션 만료 처리 함수 (현재 비활성화)
// TODO: 백엔드 세션 기반 인증 구현 시 재활성화
// const handleSessionExpired = () => {
//   // Redux store에서 로그아웃 액션 디스패치
//   store.dispatch(userLogout());
//   
//   // 세션 만료 알림 표시
//   store.dispatch(showAlert({
//     isShow: true,
//     title: '세션 만료',
//     message: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
//     callback: () => {
//       // 로그인 페이지로 리다이렉트
//       window.location.href = '/login';
//     },
//   }));
// };

export const isEmpty = value => {
  if (
    value === '' ||
    value === null ||
    typeof value === 'undefined' ||
    value === undefined ||
    (value != null && typeof value === 'object' && !Object.keys(value).length)
  ) {
    return true;
  }
  return false;
};

export const nvl = (a, b) => {
  if (isEmpty(a)) {
    return b;
  }
  return a;
};

export const getHyphenated = (a, b) => {
  if (isEmpty(a) && isEmpty(b)) {
    return '';
  }
  if (isEmpty(a)) {
    return b;
  }
  if (isEmpty(b)) {
    return a;
  }
  return `${a}-${b}`;
};

// eslint-disable-next-line default-param-last
export const callApi = (method, url, params, type = 'json') => {
  const baseurl = getApiBaseUrl();

  const instance = axios.create({
    baseURL: baseurl,
    withCredentials: false, // CORS 문제 해결을 위해 임시로 false로 설정
    responseType: type,
  });

  instance.interceptors.request.use(
    request => {
      return request;
    },
    // error => Promise.reject(error),
  );

  instance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // 세션 만료 처리 (현재는 비활성화)
      // TODO: 백엔드에서 세션 기반 인증이 활성화되면 주석 해제
      // if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      //   handleSessionExpired();
      // }
      return Promise.reject(error);
    },
  );

  if (method.toLowerCase() === 'post') {
    return instance.post(url, params);
  }
  return instance.get(url, { params });
};

export const getFormattedAnswer = entries => {
  let formattedAnswer = '';
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of entries) {
    if (value === 'true') {
      formattedAnswer += `${key}:`;
    }
  }

  return formattedAnswer.slice(0, -1);
};

export const getFormattedQuizInfo = data => {
  const safeSplit = value => {
    if (isEmpty(value)) return [];
    return String(value).split(',');
  };

  return {
    answerSet: safeSplit(data.answer_set),
    categoryId: data.category_id,
    categoryNm: data.category_nm,
    correctSet: safeSplit(data.correct_set),
    correctCnt: data.correct_cnt,
    endDt: data.end_dt,
    id: data.id,
    progressSet: safeSplit(data.progress_set),
    questionSet: safeSplit(data.question_set),
    questionCnt: data.question_cnt,
    seq: data.seq,
    startDt: data.start_dt,
    successCd: data.success_cd,
    userId: data.user_id,
    logoUrl: data.logo_url,
    accumSec: data.accum_sec,
  };
};

export const getIsProgressed = value => {
  if (String(value) === '0') {
    return false;
  }
  return true;
};

// export const getProgressedText = value => {
//   if (String(value) === '2') {
//     return '완료됨';
//   }
//   if (String(value) === '1') {
//     return '건너뜀';
//   }
//   if (String(value) === 'S') {
//     return '완료됨';
//   }
//   return '미완료';
// };

export const getStatusText = value => {
  if (isEmpty(value)) {
    return '진행중';
  }

  switch (String(value)) {
    case '2':
      return '완료됨';
    case '1':
      return '건너뜀';
    case 'S':
      return '합격';
    case 'F':
      return '불합격';
    case 'Y':
      return '정답';
    case 'N':
      return '오답';
    default:
      return '알수없음';
  }
};

export const getStatusStyle = value => {
  switch (String(value)) {
    case '2':
      return 'bg-sky-400/10 text-sky-600';
    case '1':
      return 'bg-slate-400/20';
    case 'S':
      return 'bg-indigo-600 text-white';
    case 'F':
      return 'bg-rose-600 text-white';
    case 'Y':
      return 'bg-indigo-600 text-white';
    case 'N':
      return 'bg-rose-600 text-white';
    default:
      return 'bg-slate-400/20';
  }
};
export const getOptionColor = (checked, correct) => {
  // 정답
  // if (correct && checked) {
  //   return 'rgb(99 102 241)';
  // }
  // 미채점
  if (isEmpty(correct) && checked) {
    return 'rgb(79 70 229)';
  }
  // 오답
  if (!correct && checked) {
    return 'rgb(256 256 256)';
  }
  // 오답 시 정답 표기
  // if (correct && !checked) {
  //   return 'rgb(244 63 94)';
  // }
  return '';
};

export const getOptionStyle = (checked, correct) => {
  // 정답
  if (correct && checked) {
    return 'ring-2 ring-indigo-600';
  }
  // 오답
  if (!correct && checked) {
    return 'ring-2 ring-indigo-600';
  }
  // 미채점
  if (isEmpty(correct) && checked) {
    return 'ring-2 ring-indigo-600';
  }
  // 오답 시 정답 표기
  // if (correct && !checked) {
  //   return 'ring-2 ring-rose-500';
  // }
  return 'ring-1 ring-slate-700/10';
};

export const getProgressTimeText = progressTime => {
  const hour = String(parseInt(progressTime / 3600, 10)).padStart(2, '0');
  const minute = String(parseInt((progressTime % 3600) / 60, 10)).padStart(
    2,
    '0',
  );
  const second = String(parseInt(progressTime % 60, 10)).padStart(2, '0');
  return `${hour}:${minute}:${second}`;
};

export const getFormattedProgressTimeText = progressTime => {
  const hour = parseInt(progressTime / 3600, 10);
  const minute = parseInt((progressTime % 3600) / 60, 10);
  const second = parseInt(progressTime % 60, 10);

  const formattedProgressTimeText = [];
  if (hour > 0) {
    formattedProgressTimeText.push(`${hour}시간`);
  }
  if (minute > 0) {
    formattedProgressTimeText.push(`${minute}분`);
  }
  if (second > 0) {
    formattedProgressTimeText.push(`${second}초`);
  }

  if (formattedProgressTimeText.length > 0) {
    return formattedProgressTimeText.join(' ');
  }
  return '0초';
};

export const getCategoryInfoText = (
  questionCount,
  timeLimit,
  successPercent,
) => {
  return `${questionCount}개의 질문  |  ${getFormattedProgressTimeText(
    timeLimit * 60,
  )}  |  합격하려면 ${successPercent}%의 정답을 달성해야함`;
};
