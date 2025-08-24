import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import AnchorButton from '../../atoms/common/buttons/AnchorButton';
import Status from '../../atoms/common/Status';
import QuestionItem from '../../atoms/question/QuestionItem';
import QuestionList from '../../atoms/question/QuestionList';
import SiderTitle from '../../atoms/sider/SiderTitle';
import SiderWrapper from '../../atoms/sider/SiderWrapper';

const ReviewSider = React.memo(() => {
  const history = useSelector(state => state.history);
  const filter = useSelector(state => state.history.filter);
  
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

  // useMemo로 리스트 렌더링 최적화
  const questionItems = useMemo(() => {
    return filteredResults.map((resultDetail, index) => {
      const { question } = resultDetail;
      
      // 필터링된 결과에서의 스크롤 핸들러 생성
      const handleScroll = (e) => {
        e.preventDefault();
        // 현재 화면에서 해당 question.id를 가진 요소를 찾아서 스크롤
        const targetElement = document.querySelector(`[data-question-id="${question.id}"]`);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100, // 약간의 여백을 위해 100px 위로
            left: 0,
            behavior: 'smooth',
          });
        }
      };
      
      return (
        <QuestionItem key={question.id}>
          <AnchorButton id={question.id} onClick={handleScroll}>
            {`질문 ${index + 1}`}
          </AnchorButton>
          <Status value={question.correct_yn} />
        </QuestionItem>
      );
    });
  }, [filteredResults]);

  return (
    <SiderWrapper>
      <SiderTitle>바로가기</SiderTitle>
      <QuestionList>{questionItems}</QuestionList>
    </SiderWrapper>
  );
});

ReviewSider.displayName = 'ReviewSider';

export default ReviewSider;