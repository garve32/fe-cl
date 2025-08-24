import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeStatsModal, setLoading, setError, setCategoryStats, resetStats } from '../../../features/stats/statsSlice';
import { showAlert } from '../../../features/modal/modalSlice';
import { callApi } from '../../../functions/commonUtil';
import CategoryStatsCard from './CategoryStatsCard';

function CategoryStatsModal() {
  const dispatch = useDispatch();
  const { modalOpen, isLoading, error, categoryStats } = useSelector(state => state.stats);
  const user = useSelector(state => state.user);

  // 선택된 카테고리 상태
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);

  // 사용자가 풀어본 카테고리 목록 조회
  const fetchAvailableCategories = useCallback(async () => {
    // 사용자 정보가 없으면 실행하지 않음
    if (!user || !user.id) {
      return;
    }

    try {
      const response = await callApi('get', `/u/his/categories?user_id=${user.id}`);
      const histories = response.data || [];

      setAvailableCategories(histories);

      // 첫 번째 카테고리를 기본 선택
      if (histories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(histories[0].id);
      }
    } catch (err) {
      console.error('카테고리 목록 조회 오류:', err);
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: '카테고리 목록을 불러오는 중 오류가 발생했습니다.',
        callback: () => {},
      }));
    }
  }, [user, selectedCategoryId, dispatch]);

  // 선택된 카테고리의 통계 조회
  const fetchCategoryStats = useCallback(async (categoryId) => {
    // 사용자 정보나 카테고리 ID가 없으면 실행하지 않음
    if (!categoryId || !user || !user.id) {
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await callApi('get', `/u/category-stats?user_id=${user.id}&category_id=${categoryId}`);

      if (response.data) {
        // API 응답을 CategoryStatsCard에서 사용할 수 있는 형식으로 변환
        const statsData = response.data;
        dispatch(setCategoryStats(statsData));
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || '통계를 불러오는 중 오류가 발생했습니다.';
      dispatch(setError(errorMessage));
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: errorMessage,
        callback: () => {}
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, user]);

  // 모달 열림 시 카테고리 목록 조회
  useEffect(() => {
    if (modalOpen && user && user.id) {
      fetchAvailableCategories();
    }
  }, [modalOpen, user, fetchAvailableCategories]);

  // 선택된 카테고리 변경 시 통계 조회
  useEffect(() => {
    if (selectedCategoryId && user && user.id) {
      fetchCategoryStats(selectedCategoryId);
    }
  }, [selectedCategoryId, user, fetchCategoryStats]);

  const handleClose = () => {
    dispatch(closeStatsModal());
    setSelectedCategoryId(null);
    setAvailableCategories([]);
    dispatch(setCategoryStats([]));
    dispatch(setError(null));
    dispatch(setLoading(false));
  };

  // 사용자가 로그아웃되면 모달 상태 완전 초기화
  useEffect(() => {
    if (!user || !user.id) {
      if (modalOpen) {
        dispatch(closeStatsModal());
      }
      // 모든 상태 초기화
      setSelectedCategoryId(null);
      setAvailableCategories([]);
      dispatch(resetStats());
    }
  }, [user, modalOpen, dispatch]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [modalOpen]);

  const renderLoadingState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200" />
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0" />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium text-gray-900">통계를 불러오는 중...</h3>
          <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  };

  const renderErrorState = () => {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <div className="text-gray-600">{error}</div>
          <button
            type="button"
            onClick={() => fetchCategoryStats(selectedCategoryId)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  };

  const renderCategorySelector = () => {
    return (
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            카테고리 선택:
          </span>
          <select
            value={selectedCategoryId || ''}
            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
            aria-label="카테고리 선택"
            className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">카테고리를 선택하세요</option>
            {availableCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderStatsContent = () => {
    if (availableCategories.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">📊</div>
          <div className="text-gray-600">아직 풀어본 문제가 없습니다.</div>
        </div>
      );
    }

    if (!selectedCategoryId) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">📊</div>
          <div className="text-gray-600">카테고리를 선택해주세요.</div>
        </div>
      );
    }

    if (!categoryStats || categoryStats.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-2">📊</div>
          <div className="text-gray-600">선택한 카테고리의 데이터가 없습니다.</div>
        </div>
      );
    }

    // 선택된 카테고리 이름 찾기
    const selectedCategory = availableCategories.find(cat => cat.id === selectedCategoryId);

    return (
      <div className="p-6">
        <CategoryStatsCard 
          categoryData={categoryStats} 
          categoryName={selectedCategory?.name || '선택된 카테고리'}
        />
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (error) return renderErrorState();

    return (
      <>
        {renderCategorySelector()}
        {renderStatsContent()}
      </>
    );
  };

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              카테고리별 문제 풀이 현황
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              선택한 카테고리의 문제별 도전 횟수와 정답률을 확인하세요
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="모달 닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsModal;