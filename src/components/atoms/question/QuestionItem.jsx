import React, { forwardRef } from 'react';

const QuestionItem = forwardRef(({ id, children }, ref) => {
  return (
    <li className="flex items-center" key={id} ref={ref}>
      {children}
    </li>
  );
});

QuestionItem.displayName = 'QuestionItem';

export default QuestionItem;
