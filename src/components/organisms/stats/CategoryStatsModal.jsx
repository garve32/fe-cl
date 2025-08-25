import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDownIcon, ChartBarIcon } from '@heroicons/react/outline';
import {
  closeStatsModal,
  setLoading,
  setError,
  setCategoryStats,
  resetStats,
} from '../../../features/stats/statsSlice';
import { showAlert } from '../../../features/modal/modalSlice';
import { callApi } from '../../../functions/commonUtil';

function CategoryStatsModal() {
  const dispatch = useDispatch();
  const { modalOpen, isLoading, error, categoryStats } = useSelector(state => state.stats);
  const user = useSelector(state => state.user);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  // const [viewMode, setViewMode] = useState('chart'); // 'chart' only

  // 사용자가 풀어본 카테고리 목록 조회
  const fetchAvailableCategories = useCallback(async () => {
    if (!user || !user.id) return;

    try {
      const response = await callApi('get', `/u/his/categories?user_id=${user.id}`);
      const histories = response.data || [];
      setAvailableCategories(histories);

      if (histories.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(histories[0].id);
      }
    } catch (err) {
      console.error('카테고리 목록 조회 오류:', err);
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: '카테고리 목록을 불러오는 중 오류가 발생했습니다.',
        callback: () => {
        },
      }));
    }
  }, [user, selectedCategoryId, dispatch]);

  // 선택된 카테고리의 통계 조회
  const fetchCategoryStats = useCallback(async (categoryId) => {
    if (!categoryId || !user || !user.id) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await callApi('get', `/u/category-stats?user_id=${user.id}&category_id=${categoryId}`);
      if (response.data) {
        dispatch(setCategoryStats(response.data));
      }
    } catch (err) {
      const errorMessage = (err.response && err.response.data && err.response.data.message) || '통계를 불러오는 중 오류가 발생했습니다.';
      dispatch(setError(errorMessage));
      dispatch(showAlert({
        isShow: true,
        title: '알림',
        message: errorMessage,
        callback: () => {
        },
      }));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (modalOpen && user && user.id) {
      fetchAvailableCategories();
    }
  }, [modalOpen, user, fetchAvailableCategories]);

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

  useEffect(() => {
    if (!user || !user.id) {
      if (modalOpen) dispatch(closeStatsModal());
      setSelectedCategoryId(null);
      setAvailableCategories([]);
      dispatch(resetStats());
    }
  }, [user, modalOpen, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
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

  // 통계 데이터 계산
  const getStatsAnalysis = () => {
    if (!categoryStats || categoryStats.length === 0) return null;

    const totalQuestions = categoryStats.reduce((sum, item) => sum + item.attempt_count, 0);
    const sortedData = [...categoryStats].sort((a, b) => a.select_count - b.select_count);

    // 성취도 분석
    const excellentProblems = categoryStats.filter(item => item.correct_rate >= 80).reduce((sum, item) => sum + item.attempt_count, 0);
    const strugglingProblems = categoryStats.filter(item => item.correct_rate < 60).reduce((sum, item) => sum + item.attempt_count, 0);
    const notAttempts = categoryStats.filter(item => item.select_count === 0).reduce((sum, item) => sum + item.attempt_count, 0);

    // 도전 패턴 분석
    const selectedCategory = availableCategories.find(cat => cat.id === selectedCategoryId);
    const maxAttempts = selectedCategory ? selectedCategory.attempt_count : 0;
    console.log(selectedCategory);
    console.log(selectedCategoryId);
    console.log(maxAttempts);

    // const maxAttempts = (() => {
    //   const selectedCategory = availableCategories.find(cat => cat.id === selectedCategoryId);
    //   return selectedCategory?.attempt_count || 0;
    // })();
    // const maxAttempts = Math.max(...categoryStats.map(item => item.select_count));
    const avgCorrectRate = categoryStats.reduce((sum, item) => sum + (item.correct_rate * item.attempt_count), 0) / totalQuestions;

    return {
      totalQuestions,
      sortedData,
      excellentProblems,
      strugglingProblems,
      notAttempts,
      maxAttempts,
      avgCorrectRate: avgCorrectRate || 0,
    };
  };

  const stats = getStatsAnalysis();

  // 색상 함수들
  const getColorsByCorrectRate = (correctRate) => {
    if (correctRate >= 90) return {
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      text: 'text-emerald-900',
      ring: 'ring-emerald-200',
    };
    if (correctRate >= 80) return {
      bg: 'bg-green-500',
      bgLight: 'bg-green-50',
      text: 'text-green-900',
      ring: 'ring-green-200',
    };
    if (correctRate >= 70) return {
      bg: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      text: 'text-blue-900',
      ring: 'ring-blue-200',
    };
    if (correctRate >= 60) return {
      bg: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      text: 'text-yellow-900',
      ring: 'ring-yellow-200',
    };
    if (correctRate >= 40) return {
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      text: 'text-orange-900',
      ring: 'ring-orange-200',
    };
    return { bg: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-900', ring: 'ring-red-200' };
  };

  // 로딩 상태
  const renderLoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200" />
        <div
          className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0 left-0" />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-base font-medium text-gray-900">통계를 불러오는 중...</h3>
        <p className="text-xs text-gray-500 mt-1">잠시만 기다려주세요</p>
      </div>
    </div>
  );

  // 에러 상태
  const renderErrorState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="text-red-500 mb-2">⚠️</div>
        <div className="text-gray-600 text-sm">{error}</div>
        <button
          type="button"
          onClick={() => fetchCategoryStats(selectedCategoryId)}
          className="mt-3 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          다시 시도
        </button>
      </div>
    </div>
  );

  // 헤더
  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <ChartBarIcon className="w-5 h-5" />
        </div>
        <div>
          <h2 id="modal-title" className="text-lg font-bold text-gray-900">문제 풀이 현황</h2>
          <p className="text-xs text-gray-600 mt-1">도전 횟수별 성취도를 한눈에 확인하세요</p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-white hover:shadow-sm transition-all"
        aria-label="모달 닫기"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );

  // 카테고리 선택 및 요약
  const renderCategorySection = () => (
    <div className="p-2 bg-white border-b">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* 카테고리 선택 */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategoryId || ''}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8 text-sm"
            >
              <option value="">카테고리를 선택하세요</option>
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 요약 통계 */}
        {stats && (
          <div className="flex gap-1 sm:gap-1">
            <div className="text-center p-1 bg-blue-50 rounded-lg min-w-[60px]">
              <div className="text-sm font-bold text-blue-600">📊총 {stats.totalQuestions} 문제</div>
            </div>
            <div className="text-center p-1 bg-purple-50 rounded-lg min-w-[60px]">
              <div className="text-sm font-bold text-purple-600">🔥{stats.maxAttempts}회 도전</div>
            </div>
            <div className="text-center p-1 bg-orange-50 rounded-lg min-w-[60px]">
              <div className="text-sm font-bold text-orange-600">💪안 본 {stats.notAttempts}문제</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 차트 뷰
  const renderChartView = () => {
    if (!stats || stats.sortedData.length === 0) return null;

    // const maxQuestionCount = Math.max(...stats.sortedData.map(item => item.attempt_count));

    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">도전 횟수별 정답률</h3>

        <div className="bg-white rounded-lg border border-gray-200 p-2">
          <div className="space-y-2">
            {stats.sortedData.map((item) => {
              const colors = getColorsByCorrectRate(item.correct_rate);
              // const barWidth_o = (item.attempt_count / maxQuestionCount) * 100;
              const barWidth = item.correct_rate;

              return (
                <div key={`${item.select_count}-${item.attempt_count}`} className="flex items-center gap-2">
                  {/* 도전 횟수 라벨 */}
                  <div className="w-16 text-right">
                    <div className="text-xs font-medium text-gray-900">{item.select_count}번 풀어본</div>
                  </div>

                  {/* 바 차트 */}
                  <div className="flex-1 relative">
                    <div className="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className={`${colors.bg} h-6 rounded-full transition-all duration-700 flex items-center justify-start pl-4`}
                        style={{ width: `${Math.max(barWidth, 8)}%` }}
                      />
                    </div>
                    {/*  */}
                    <div className="absolute left top-0 h-6 flex items-center pl-2">
                      <div className={`text-xs font-bold ${colors.text}`}>
                        {item.attempt_count} 문제
                      </div>
                    </div>

                    {/* 정답률 표시 */}
                    <div className="absolute right-0 top-0 h-6 flex items-center pr-2">
                      <div className={`text-xs font-bold ${colors.text}`}>
                        {item.correct_rate.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 빈 상태
  const renderEmptyState = () => {
    if (availableCategories.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">아직 풀어본 문제가 없습니다</h3>
          <p className="text-gray-600 text-sm">문제를 풀어보면 여기에 통계가 표시됩니다</p>
        </div>
      );
    }

    if (!selectedCategoryId) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">카테고리를 선택해주세요</h3>
          <p className="text-gray-600 text-sm">위에서 카테고리를 선택하면 통계를 확인할 수 있습니다</p>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📈</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">데이터가 없습니다</h3>
        <p className="text-gray-600 text-sm">선택한 카테고리의 문제를 풀어보세요</p>
      </div>
    );
  };

  // 메인 컨텐츠
  const renderContent = () => {
    if (isLoading) return renderLoadingState();
    if (error) return renderErrorState();
    if (!stats || stats.totalQuestions === 0) return renderEmptyState();

    return (
      <>
        {renderCategorySection()}
        {renderChartView()}
      </>
    );
  };

  if (!modalOpen) return null;

  return (
    <div // eslint-disable-line jsx-a11y/no-noninteractive-element-interactions
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={(e) => {
        if (e.key === 'Escape') handleClose();
      }}
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {renderHeader()}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsModal;