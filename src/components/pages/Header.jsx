import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userLogin } from '../../features/user/userSlice';
import NavButton from '../atoms/common/buttons/NavButton';
import GithubIcon from '../atoms/common/icons/GithubIcon';
import HeaderNav from '../organisms/header/HeaderNav';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleLogout = e => {
    e.preventDefault();
    dispatch(userLogin({}));
  };

  return (
    <div className="supports-backdrop-blur:bg-white/95 sticky top-0 z-40 w-full flex-none bg-white transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10">
      <div className="mx-auto max-w-8xl">
        <div className="mx-4 border-b border-slate-900/10 py-4 lg:mx-0 lg:border-0 lg:px-8">
          <div className="relative flex items-center">
            <a
              className="mr-3 w-[2.0625rem] flex-none overflow-visible md:w-auto"
              href="/"
            >
              <h1 className="inline-block text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                QUIZ
              </h1>
            </a>
            <div className="relative ml-auto hidden items-center lg:flex">
              <nav className="text-sm font-semibold leading-6 text-slate-700">
                <ul className="flex space-x-8">
                  <Link to="c">
                    <li className="hover:text-sky-500">New</li>
                  </Link>
                  {user?.adminYn === 'Y' ? (
                    <a href="https://quiz-d0xy.onrender.com" target="_blank" rel="noreferrer">
                      <li className="hover:text-sky-500">Admin</li>
                    </a>
                  ) : null}
                  <button type="button" onClick={handleLogout}>
                    <li className="hover:text-sky-500">Logout</li>
                  </button>
                </ul>
              </nav>
              <div className="ml-6 flex items-center space-x-4 border-l border-slate-200 pl-6">
                <a
                  href="https://github.com/garve32"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-400 hover:text-slate-500"
                >
                  <span className="sr-only">quiz on GitHub</span>
                  <GithubIcon />
                </a>
                <a
                  href="https://garve32.tistory.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Blog
                </a>
              </div>
            </div>
            {/* 모바일에서도 외부 링크 항상 표시 */}
            <div className="ml-auto flex items-center space-x-3 lg:hidden">
              <a
                href="https://github.com/garve32"
                target="_blank"
                rel="noreferrer"
                className="block text-slate-400 hover:text-slate-500"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://garve32.tistory.com/"
                target="_blank"
                rel="noreferrer"
                className="block text-xs font-medium text-slate-500 hover:text-slate-700"
              >
                Blog
              </a>
              <div className="-my-1">
                <NavButton
                  onClick={() => {
                    setIsNavOpen(true);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <HeaderNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
    </div>
  );
}

export default Header;
