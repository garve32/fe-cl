import React, { forwardRef } from 'react';

const SiderWrapper = forwardRef(({ children }, ref) => {
  return (
    <div 
      ref={ref}
      className="fixed top-[3.8125rem] bottom-0 right-[max(0px,calc(50%-45rem))] z-20 hidden w-[19.5rem] overflow-y-auto py-10 px-8 xl:block scrollbar-hide"
    >
      {children}
    </div>
  );
});

SiderWrapper.displayName = 'SiderWrapper';

export default SiderWrapper;
