import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getOptionStyle, isEmpty } from '../../../functions/commonUtil';

import CheckIcon from '../../atoms/common/icons/CheckIcon';
import Status from '../../atoms/common/Status';

const QuestionOption = React.memo(({ option, handleChange }) => {
  const [checked, setChecked] = useState(option.checked);
  
  // useMemo로 클래스명 계산 최적화
  const className = useMemo(() => {
    return `group pointer-events-auto w-full cursor-pointer whitespace-pre-wrap rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 ${getOptionStyle(
      checked,
      option.correct,
    )} hover:bg-slate-50`;
  }, [checked, option.correct]);

  useEffect(() => {
    setChecked(option.checked);
  }, [option.checked]);

  // useCallback으로 이벤트 핸들러 최적화
  const handleClick = useCallback((e) => {
    e.preventDefault();
    if (!isEmpty(option.select_yn)) {
      return;
    }
    
    const newChecked = !checked;
    setChecked(newChecked);
    // 부모에 변경 전달 (단일/다중 처리 포함)
    handleChange(option.id, newChecked);
  }, [checked, option.select_yn, option.id, handleChange]);

  return (
    <div
      className={className}
      onClick={handleClick}
      role="button"
      tabIndex="0"
      onKeyDown={() => {}}
    >
      <div className="flex items-center justify-between">
        <div 
          className="font-medium text-slate-900"
          dangerouslySetInnerHTML={{ __html: option.text }}
        />
        <input id={option.seq} name={option.id} type="hidden" value={checked} />
        {option.correct ? (
          <Status value={option.correct_yn} />
        ) : (
          <CheckIcon checked={checked} correct={option.correct} />
        )}
      </div>
    </div>
  );
});

QuestionOption.displayName = 'QuestionOption';

export default QuestionOption;
