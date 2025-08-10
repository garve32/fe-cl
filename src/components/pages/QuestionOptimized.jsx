/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import QuestionContent from '../molecules/question/QuestionContent';
import QuestionOptions from '../molecules/question/QuestionOptions';

import { menuChanged } from '../../features/menu/menuSlice';
import {
  initQuiz,
  setAnswerSet,
  setProgressSet,
} from '../../features/quiz/quizSlice';

import { showAlert } from '../../features/modal/modalSlice';

import {
  callApi,
  isEmpty,
  getFormattedAnswer,
} from '../../functions/commonUtil';
import SubmitButton from '../atoms/common/buttons/SubmitButton';
import QuestionHeader from '../organisms/question/QuestionHeader';
import Divider from '../atoms/common/Divider';

const Question = React.memo(() => {
  const navigate = useNavigate();
  const quiz = useSelector(state => state.quiz);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [question, setQuestion] = useState({});
  const [options, setOptions] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const formRef = useRef();
  const isEndingRef = useRef(false); // endQuestion 호출 중인지 추적

  // useMemo로 계산 최적화
  const getCheckedOptions = useMemo(() => {
    return (originOptions) => {
      const currentIndex = quiz.questionSet.indexOf(id);
      if (currentIndex < 0) {
        return originOptions.map(option => ({ ...option, checked: false }));
      }
      const currentAnswer = quiz.answerSet[currentIndex]?.split(':') || [];
      
      return originOptions.map(option => ({
        ...option,
        checked: currentAnswer.includes(String(option.id)),
      }));
    };
  }, [quiz.questionSet, quiz.answerSet, id]);

  // 함수 참조를 useRef로 보관해서 선언 순서 경고 회피
  const endQuestionRef = useRef(() => {});
  const moveQuestionIndexRef = useRef(() => {});

  // 현재 URL의 q번호가 현 문제셋에 속하는지 검증
  const isValidQuestionId = useMemo(() => {
    return quiz.questionSet?.includes(id);
  }, [quiz.questionSet, id]);

  // useCallback으로 함수 최적화
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const currentIndex = quiz.questionSet.indexOf(id);
    const buttonName = e.nativeEvent.submitter.name;

    if (buttonName === 'next') {
      const targetIndex = currentIndex + 1;
      // 정의 이후 참조하도록 콜백 안에서 동적 import 형태로 우회
      moveQuestionIndexRef.current(e.target, targetIndex);
    } else if (buttonName === 'prev') {
      const targetIndex = currentIndex - 1;
      moveQuestionIndexRef.current(e.target, targetIndex);
    } else if (buttonName === 'end') {
      endQuestionRef.current(e.target, currentIndex);
    }
  }, [quiz.questionSet, id]);


  // API 호출을 useCallback으로 최적화 (id 변경시에만 호출)
  const fetchQuestion = useCallback(async () => {
    if (isEmpty(quiz.id)) {
      navigate('../../c');
      return;
    }

    if (!isValidQuestionId) {
      navigate(`../../`);
      return;
    }

    try {
      const response = await callApi('get', `/q/${id}`);
      setQuestion(response.data.question);
      setOptions(getCheckedOptions(response.data.options));
    } catch (error) {
      const errorMessage = error.response?.data?.message || '문제를 불러오는 중 오류가 발생했습니다.';
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: errorMessage,
        callback: () => {},
      }));
    }
  }, [id, quiz.id, navigate, dispatch, getCheckedOptions, isValidQuestionId]);

  useEffect(() => {
    dispatch(menuChanged({
      id: 'Question',
      description: '문제를 잘 읽고 정답을 고르세요.',
    }));

    if (formRef.current) {
      window.scrollTo({
        top: formRef.current.offsetTop,
        left: 0,
        behavior: 'auto',
      });
    }

    // 현재 위치 기준 마지막 문제 여부 판단 (progressSet 변경과 무관)
    setIsLast(quiz.questionSet.indexOf(id) === quiz.questionSet.length - 1);

    // endQuestion 호출 중이 아니고, 문제가 유효하고 퀴즈가 진행 중일 때만 fetchQuestion 호출
    if (!isEndingRef.current && isValidQuestionId && !isEmpty(quiz.id)) {
      fetchQuestion();
    }
  }, [id, quiz.questionSet, dispatch, isValidQuestionId, quiz.id]);

  // 기타 함수들도 useCallback으로 최적화
  const getIsLast = useCallback(() => {
    if (isLast) return true;
    const targetIndex = quiz.questionSet.indexOf(id) + 1;
    const lastIndex = quiz.questionSet.length - 1;
    return targetIndex > lastIndex;
  }, [isLast, quiz.questionSet, id]);

  const endQuestion = useCallback(async (target, currentIndex) => {
    // endQuestion 호출 중임을 표시
    isEndingRef.current = true;
    
    const formData = new FormData(target);
    const answerSet = [...quiz.answerSet];
    const progressSet = [...quiz.progressSet];

    const formattedAnswer = getFormattedAnswer(formData.entries());
    
    if (isEmpty(formattedAnswer)) {
      progressSet[currentIndex] = '1';
      answerSet[currentIndex] = '0';
    } else {
      progressSet[currentIndex] = '2';
      answerSet[currentIndex] = formattedAnswer;
    }

    // 미완료 검증
    for (let i = 0; i < progressSet.length; i += 1) {
      if (String(progressSet[i]) === '0') {
        isEndingRef.current = false; // 검증 실패 시 플래그 리셋
        dispatch(showAlert({
          isShow: true,
          title: '알림',
          message: `질문 ${i + 1}번이 완료되지 않았습니다.`,
          callback: () => {},
        }));
        return;
      }
    }

    const params = {
      answer_set: answerSet.toString(),
      category_id: quiz.categoryId,
      correct_set: quiz.correctSet.toString(),
      id: quiz.id,
      progress_set: progressSet.toString(),
      question_id: id,
      question_set: quiz.questionSet.toString(),
      success_cd: quiz.successCd,
      accum_sec: quiz.accumSec,
    };

    try {
      const response = await callApi('post', '/q/end', params);
      const payload = {
        answerSet: response.data.answer_set.split(','),
        categoryId: response.data.category_id,
        correctSet: response.data.correct_set.split(','),
        endDt: response.data.end_dt,
        id: response.data.id,
        progressSet: response.data.progress_set.split(','),
        questionSet: response.data.question_set.split(','),
        seq: response.data.seq,
        startDt: response.data.start_dt,
        successCd: response.data.success_cd,
        userId: response.data.user_id,
        accumSec: response.data.accum_sec,
      };
      dispatch(initQuiz(payload));
      
      // navigate 호출하여 리뷰 페이지로 이동
      navigate(`../../r/${quiz.id}`);
    } catch (error) {
      isEndingRef.current = false; // 에러 발생 시 플래그 리셋
      const errorMessage = error.response?.data?.message || '문제 제출 중 오류가 발생했습니다.';
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: errorMessage,
        callback: () => {},
      }));
    }
  }, [quiz, id, dispatch, navigate]);

  // 최신 구현을 ref에 연결
  endQuestionRef.current = endQuestion;

  const moveQuestionIndex = useCallback(async (target, targetIndex) => {
    const currentIndex = quiz.questionSet.indexOf(id);
    if (targetIndex < 0) return;

    const formData = new FormData(target);
    const answerSet = [...quiz.answerSet];
    const progressSet = [...quiz.progressSet];

    const formattedAnswer = getFormattedAnswer(formData.entries());
    
    if (isEmpty(formattedAnswer)) {
      progressSet[currentIndex] = '1';
      answerSet[currentIndex] = '0';
    } else {
      progressSet[currentIndex] = '2';
      answerSet[currentIndex] = formattedAnswer;
    }

    const params = {
      answer_set: answerSet.toString(),
      category_id: quiz.categoryId,
      correct_set: quiz.correctSet.toString(),
      id: quiz.id,
      progress_set: progressSet.toString(),
      question_id: id,
      question_set: quiz.questionSet.toString(),
      success_cd: quiz.successCd,
      accum_sec: quiz.accumSec,
    };

    try {
      // 먼저 상태를 업데이트하고 라우팅하여 화면을 즉시 다음/이전 문제로 이동
      dispatch(setAnswerSet(answerSet));
      dispatch(setProgressSet(progressSet));
      navigate(`../../q/${quiz.questionSet[targetIndex]}`);
      // 뒤에서 비동기로 서버에 진행상황 반영 (실패해도 화면 전환은 유지)
      await callApi('post', '/q/move', params);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '문제 이동 중 오류가 발생했습니다.';
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: errorMessage,
        callback: () => {},
      }));
    }
  }, [quiz, id, dispatch, navigate]);

  // 최신 구현을 ref에 연결
  moveQuestionIndexRef.current = moveQuestionIndex;

  // 렌더링 최적화
  const memoizedButtons = useMemo(() => {
    const currentIndex = quiz.questionSet.indexOf(id);
    const isFirst = currentIndex === 0;
    const isLastQuestion = getIsLast();

    return (
      <div className="flex justify-between">
        {!isFirst && (
          <SubmitButton name="prev" type="submit">
            이전
          </SubmitButton>
        )}
        <div className="ml-auto space-x-4">
          {!isLastQuestion ? (
            <SubmitButton name="next" type="submit">
              다음
            </SubmitButton>
          ) : (
            <SubmitButton name="end" type="submit">
              완료
            </SubmitButton>
          )}
        </div>
      </div>
    );
  }, [quiz.questionSet, id, getIsLast]);

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <QuestionHeader />
      <div className="space-y-2">
        <QuestionContent
          seq={quiz.questionSet.indexOf(id) + 1}
          text={question.text}
          image={question.image}
        />
        <Divider padding="1" />
        <QuestionOptions
          type={question.type}
          options={options}
          setOptions={setOptions}
        />
      </div>
      <div className="mt-8">
        {memoizedButtons}
      </div>
    </form>
  );
});

Question.displayName = 'Question';

export default Question;
