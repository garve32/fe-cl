import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { userLogin } from '../../../features/user/userSlice';
import { getAdminUrl } from '../../../config';
import CloseButton from '../../atoms/common/buttons/CloseButton';

function HeaderNav({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const handleLogout = e => {
    e.preventDefault();
    setIsOpen(false);
    dispatch(userLogin({}));
  };

  return isOpen ? (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 h-screen bg-black/20 backdrop-blur-sm dark:bg-slate-900/80"
        aria-hidden="true"
      >
        <div className="fixed right-4 top-4 w-full max-w-40 rounded-lg bg-white p-6 text-base font-semibold text-slate-900 shadow-lg lg:hidden">
          <CloseButton
            onClick={() => {
              setIsOpen(false);
            }}
          />
          <ul className="space-y-6">
            {user?.adminYn === 'Y' ? (
              <li>
                <a
                  className="hover:text-sky-500"
                  href={getAdminUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  Admin
                </a>
              </li>
            ) : null}
            <li>
              <button
                className="hover:text-sky-500"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : null;
}

export default HeaderNav;
