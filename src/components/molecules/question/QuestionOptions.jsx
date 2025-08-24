import React from 'react';
import QuestionOption from './QuestionOption';

function QuestionOptions({ type, options, setOptions }) {
  const handleChange = selectedId => {
    if (type === 'S') {
      const newOptions = options.map(option => {
        if (option.id === selectedId) {
          return { ...option, checked: true };
        }
        return { ...option, checked: false };
      });
      setOptions(newOptions);
    }
  };

  return (
    <div className="space-y-3">
      {options.map(option => (
        <QuestionOption
          key={option.id}
          type={type}
          option={option}
          handleChange={handleChange}
        />
      ))}
    </div>
  );
}

export default QuestionOptions;
