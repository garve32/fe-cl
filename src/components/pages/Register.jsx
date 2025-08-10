/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showAlert, showConfirm } from '../../features/modal/modalSlice';

import { callApi, isEmpty } from '../../functions/commonUtil';
import LoginButton from '../atoms/common/buttons/LoginButton';
import LoginInput from '../molecules/login/LoginInput';
import LoginForm from '../organisms/login/LoginForm';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const loginId = formData.get('id');
    const userName = formData.get('name');
    const password = formData.get('password');
    const confirm = formData.get('confirm');

    const params = {
      login_id: loginId,
      name: userName,
      password,
    };

    if (isEmpty(userName)) {
      const payload = {
        isShow: true,
        title: '알림',
        message: '이름을 입력해 주세요.',
        callback: () => {},
      };
      dispatch(showAlert(payload));
      return;
    }

    if (isEmpty(loginId)) {
      const payload = {
        isShow: true,
        title: '알림',
        message: 'ID를 입력해 주세요.',
        callback: () => {},
      };
      dispatch(showAlert(payload));
      return;
    }

    if (isEmpty(password)) {
      const payload = {
        isShow: true,
        title: '알림',
        message: '비밀번호를 입력해 주세요.',
        callback: () => {},
      };
      dispatch(showAlert(payload));
      return;
    }

    if (password !== confirm) {
      const payload = {
        isShow: true,
        title: '알림',
        message: '패스워드와 패스워드 확인이 일치하지 않습니다.',
        callback: () => {},
      };
      dispatch(showAlert(payload));
      return;
    }

    const payload = {
      isShow: true,
      title: '확인',
      message: '등록을 진행하시겠습니까?',
      callback: () => {
        callApi('post', '/u', params)
          .then(response => {
            if (response.status === 200) {
              dispatch(
                showAlert({
                  isShow: true,
                  title: '알림',
                  message:
                    '사용자 등록이 완료되었습니다.\n로그인 후 이용해주세요.',
                  callback: () => {
                    navigate('../');
                  },
                }),
              );
            }
          })
          .catch(error => {
            const errorMessage = error.response?.data?.message || '등록 중 오류가 발생했습니다.';
            dispatch(
              showAlert({
                isShow: true,
                title: '알림',
                message: errorMessage,
                callback: () => {},
              }),
            );
          });
      },
    };
    dispatch(showConfirm(payload));
  };

  return (
    <LoginForm name="register" onSubmit={handleSubmit}>
      <LoginInput type="name" id="name" name="name" required placeholder="닉네임을 입력하세요">
        닉네임
      </LoginInput>
      <LoginInput
        type="id"
        id="id"
        name="id"
        required
        placeholder="아이디를 입력하세요"
      >
        아이디
      </LoginInput>
      <LoginInput
        type="password"
        id="password"
        name="password"
        required
        placeholder="비밀번호를 입력하세요"
      >
        비밀번호
      </LoginInput>
      <LoginInput
        type="password"
        id="confirm"
        name="confirm"
        required
        placeholder="비밀번호를 한번 더 입력하세요"
      >
        비밀번호 확인
      </LoginInput>
      
      {/* 경고 문구 섹션 */}
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex">
          <div className="shrink-0">
            <svg className="size-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-bold text-red-800">⚠️ 주의사항</h3>
            <div className="mt-2 text-sm font-medium text-red-700">
              <p>• 비밀번호 찾기 기능은 제공되지 않습니다</p>
              <p>• 실제 개인정보나 비밀번호를 사용하지 마세요</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <LoginButton>등록하기</LoginButton>
      </div>
    </LoginForm>
  );
}

export default Register;
