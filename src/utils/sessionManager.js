import store from '../app/store';
import { userLogout } from '../features/user/userSlice';
import { showAlert } from '../features/modal/modalSlice';

class SessionManager {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30분 (밀리초)
    this.warningTime = 5 * 60 * 1000; // 5분 전 경고 (밀리초)
    this.timeoutId = null;
    this.warningTimeoutId = null;
    this.lastActivity = Date.now();
    
    this.init();
  }

  init() {
    // 사용자 활동 감지 이벤트 등록
    this.bindActivityEvents();
    // 세션 타이머 시작
    this.resetTimer();
  }

  bindActivityEvents() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.updateActivity();
      }, true);
    });
  }

  updateActivity() {
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  resetTimer() {
    // 기존 타이머 클리어
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
    }

    // 로그인 상태인지 확인
    const state = store.getState();
    const userId = state.user.id;
    
    if (!userId) {
      return; // 로그인하지 않은 상태면 타이머 설정 안함
    }

    // 경고 타이머 설정 (세션 만료 5분 전)
    this.warningTimeoutId = setTimeout(() => {
      this.showWarning();
    }, this.sessionTimeout - this.warningTime);

    // 세션 만료 타이머 설정
    this.timeoutId = setTimeout(() => {
      this.handleSessionExpired();
    }, this.sessionTimeout);
  }

  showWarning() {
    store.dispatch(showAlert({
      isShow: true,
      title: '세션 만료 경고',
      message: '5분 후 자동 로그아웃됩니다. 계속 사용하시려면 확인을 클릭하세요.',
      callback: () => {
        // 사용자가 확인을 클릭하면 세션 연장
        this.extendSession();
      },
    }));
  }

  extendSession() {
    // 클라이언트 사이드 세션 연장 (타이머 리셋)
    const state = store.getState();
    const userId = state.user.id;
    
    if (userId) {
      this.resetTimer(); // 타이머 재설정
    }
  }

  handleSessionExpired() {
    // Redux store에서 로그아웃 액션 디스패치
    store.dispatch(userLogout());
    
    // 세션 만료 알림 표시
    store.dispatch(showAlert({
      isShow: true,
      title: '세션 만료',
      message: '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
      callback: () => {
        // 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      },
    }));

    // 타이머 클리어
    this.clearTimers();
  }

  clearTimers() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningTimeoutId) {
      clearTimeout(this.warningTimeoutId);
      this.warningTimeoutId = null;
    }
  }

  // 로그인 시 호출
  startSession() {
    this.lastActivity = Date.now();
    this.resetTimer();
  }

  // 로그아웃 시 호출
  endSession() {
    this.clearTimers();
  }
}

// 싱글톤 인스턴스
const sessionManager = new SessionManager();

export default sessionManager;
