import React from 'react';

import QuestionOption from './QuestionOptionOptimized';

function QuestionOptions({ type, options, setOptions = () => {}, children }) {
  const handleChange = (id, willCheck) => {
    // 단일 선택: 선택된 항목만 true, 나머지는 false. 해제는 허용하지 않음
    if (type === 'S') {
      if (!willCheck) return; // 단일 선택에서 해제는 무시
      setOptions(
        options.map(option =>
          option.id === id
            ? { ...option, checked: true }
            : { ...option, checked: false },
        ),
      );
      return;
    }

    // 다중 선택: 해당 항목만 토글
    setOptions(
      options.map(option =>
        option.id === id ? { ...option, checked: willCheck } : option,
      ),
    );
  };

  const getOptions = _options => {
    return _options.map(option => {
      return (
        <QuestionOption
          key={option.id}
          type={type}
          option={option}
          handleChange={handleChange}
        />
      );
    });
  };

  return (
    <fieldset>
      <legend className="sr-only">Options</legend>
      <div className="relative z-10 p-4">
        <div className="space-y-4">
          {options ? getOptions(options) : children}
        </div>
      </div>
    </fieldset>
  );
}

export default QuestionOptions;
