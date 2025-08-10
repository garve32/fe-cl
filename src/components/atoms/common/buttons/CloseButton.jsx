import React from 'react';
import CloseIcon from '../icons/CloseIcon';

function CloseButton({ onClick }) {
  return (
    <button
      type="button"
      className="absolute right-5 top-5 flex size-8 items-center justify-center text-slate-500 hover:text-slate-600"
      tabIndex="0"
      onClick={onClick}
    >
      <span className="sr-only">Close navigation</span>
      <CloseIcon />
    </button>
  );
}

export default CloseButton;
