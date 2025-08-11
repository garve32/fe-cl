import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../../features/user/userSlice';
import { resetQuiz } from '../../../features/quiz/quizSlice';
import { resetHistory } from '../../../features/history/historySlice';
import { resetMenu } from '../../../features/menu/menuSlice';
import { persistor } from '../../../app/store';

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // 1) 메모리 상태 초기화
    dispatch(userLogout());
    dispatch(resetQuiz());
    dispatch(resetHistory());
    dispatch(resetMenu());

    // 2) 영속 저장소 비우기 (redux-persist)
    try {
      await persistor.flush();
      await persistor.purge();
    } finally {
      try {
        window.localStorage.removeItem('persist:root');
      } catch (_) {}
    }

    // 3) 로그인 페이지로 이동
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
