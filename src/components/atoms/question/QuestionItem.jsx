import React, { forwardRef } from 'react';

const QuestionItem = forwardRef(({ children }, ref) => {
  return (
    <li className="flex items-center" ref={ref}>
      {children}
    </li>
  );
});

QuestionItem.displayName = 'QuestionItem';

export default QuestionItem;
