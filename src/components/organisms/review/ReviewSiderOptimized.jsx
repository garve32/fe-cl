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

  // useMemo로 리스트 렌더링 최적화
  const questionItems = useMemo(() => {
    return history.resultDetails.map((resultDetail, index) => {
      const { question, handleScroll } = resultDetail;
      return (
        <QuestionItem key={question.id}>
          <AnchorButton id={question.id} onClick={handleScroll}>
            {`질문 ${index + 1}`}
          </AnchorButton>
          <Status value={question.correct_yn} />
        </QuestionItem>
      );
    });
  }, [history.resultDetails]);

  return (
    <SiderWrapper>
      <SiderTitle>바로가기</SiderTitle>
      <QuestionList>{questionItems}</QuestionList>
    </SiderWrapper>
  );
});

ReviewSider.displayName = 'ReviewSider';

export default ReviewSider;
