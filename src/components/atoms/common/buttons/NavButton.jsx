import React from 'react';
import NavIcon from '../icons/NavIcon';

function NavButton({ onClick }) {
  return (
    <button
      type="button"
      className="flex size-8 items-center justify-center text-slate-500 hover:text-slate-600"
      onClick={onClick}
    >
      <span className="sr-only">Navigation</span>
      <NavIcon />
    </button>
  );
}

export default NavButton;
