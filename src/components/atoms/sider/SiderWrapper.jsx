import React, { forwardRef } from 'react';

const SiderWrapper = forwardRef(({ children }, ref) => {
  return (
    <div 
      ref={ref}
      className="fixed bottom-0 right-[max(0px,calc(50%-45rem))] top-[3.8125rem] z-20 hidden w-[19.5rem] overflow-y-auto px-8 py-10 xl:block scrollbar-hide"
    >
      {children}
    </div>
  );
});

SiderWrapper.displayName = 'SiderWrapper';

export default SiderWrapper;
