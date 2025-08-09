import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AnchorButton from '../../atoms/common/buttons/AnchorButton';
import Status from '../../atoms/common/Status';
import QuestionItem from '../../atoms/question/QuestionItem';
import QuestionList from '../../atoms/question/QuestionList';
import SiderTitle from '../../atoms/sider/SiderTitle';
import SiderWrapper from '../../atoms/sider/SiderWrapper';

function QuestionSider() {
  const navigate = useNavigate();
  const quiz = useSelector(state => state.quiz);
  const { id } = useParams();
  const currentQuestionRef = useRef(null);
  const siderWrapperRef = useRef(null);

  const handleClick = (e, questionNumber) => {
    e.preventDefault();
    navigate(`../../q/${questionNumber}`);
  };

  // 현재 문제에 해당하는 항목으로 자동 스크롤
  useEffect(() => {
    if (currentQuestionRef.current && siderWrapperRef.current) {
      const currentElement = currentQuestionRef.current;
      const container = siderWrapperRef.current;
      
      // 컨테이너의 중앙에 오도록 스크롤 계산
      const containerHeight = container.clientHeight;
      const elementTop = currentElement.offsetTop;
      const elementHeight = currentElement.clientHeight;
      
      const scrollTop = elementTop - (containerHeight / 2) + (elementHeight / 2);
      
      container.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      });
    }
  }, [id]);

  const getQuestionItem = () => {
    return quiz.questionSet.map((qid, index) => {
      const isCurrentQuestion = qid === id;
      
      return (
        <QuestionItem 
          key={qid}
          ref={isCurrentQuestion ? currentQuestionRef : null}
        >
          <AnchorButton
            id={qid}
            current={id}
            onClick={e => handleClick(e, qid)}
          >
            {`질문 ${index + 1}`}
          </AnchorButton>
          <Status value={quiz.progressSet[index]} />
        </QuestionItem>
      );
    });
  };

  return (
    <SiderWrapper ref={siderWrapperRef}>
      <SiderTitle>검토하기</SiderTitle>
      <QuestionList>{getQuestionItem()}</QuestionList>
    </SiderWrapper>
  );
}

export default QuestionSider;
