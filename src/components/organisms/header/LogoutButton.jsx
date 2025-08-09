import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../../features/user/userSlice';
import sessionManager from '../../../utils/sessionManager';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Redux store에서 로그아웃
    dispatch(userLogout());
    
    // 세션 매니저 종료
    sessionManager.endSession();
    
    // 로그인 페이지로 이동
    navigate('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="text-slate-700 hover:text-slate-900 transition-colors duration-200"
    >
      로그아웃
    </button>
  );
}

export default LogoutButton;
