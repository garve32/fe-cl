import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeStatsModal, setLoading, setError, setCategoryStats, setOverallStats } from '../../../features/stats/statsSlice';
import { showAlert } from '../../../features/modal/modalSlice';
import StatsOverview from './StatsOverview';
import CategoryStatsCard from './CategoryStatsCard';

function CategoryStatsModal() {
  const dispatch = useDispatch();
  const { modalOpen, isLoading, error, categoryStats, overallStats } = useSelector(state => state.stats);
  const user = useSelector(state => state.user);

  useEffect(() => {
    if (modalOpen && user.id) {
      // eslint-disable-next-line no-use-before-define
      fetchCategoryStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen, user.id]);

  const fetchCategoryStats = async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      // 임시 데이터 - 실제 API 연동 시 수정
      const mockData = {
        data: {
          categoryStats: [
            {
              categoryId: 1,
              categoryNm: 'JavaScript',
              logoUrl: null,
              totalQuestions: 100,
              overallCorrectRate: 85,
              attemptStats: {
                1: { count: 30, correctRate: 90 },
                2: { count: 25, correctRate: 80 },
                3: { count: 20, correctRate: 70 },
                4: { count: 15, correctRate: 60 },
                5: { count: 10, correctRate: 50 }
              },
              unattempted: 0
            },
            {
              categoryId: 2,
              categoryNm: 'React',
              logoUrl: null,
              totalQuestions: 80,
              overallCorrectRate: 78,
              attemptStats: {
                1: { count: 20, correctRate: 85 },
                2: { count: 18, correctRate: 75 },
                3: { count: 15, correctRate: 65 },
                4: { count: 12, correctRate: 55 },
                5: { count: 8, correctRate: 45 }
              },
              unattempted: 7
            }
          ],
          overallStats: {
            totalCategories: 2,
            totalQuestions: 180,
            attemptedQuestions: 173,
            overallCorrectRate: 82
          }
        }
      };

      // 실제 API 호출 시 아래 코드로 교체
      // const response = await callApi('get', `/u/stats?user_id=${user.id}`);
      
      const response = mockData;
      if (response.data) {
        const { categoryStats: stats, overallStats: overall } = response.data;
        dispatch(setCategoryStats(stats || []));
        dispatch(setOverallStats(overall || {
          totalCategories: 0,
          totalQuestions: 0,
          attemptedQuestions: 0,
          overallCorrectRate: 0
        }));
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
  };

  const handleClose = () => {
    dispatch(closeStatsModal());
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // ESC 키로 모달 닫기
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

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: 'blur(4px)' }}
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 모달 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              카테고리별 문제 풀이 현황
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              각 카테고리의 문제별 도전 횟수와 정답률을 확인하세요
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 바디 */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-medium text-gray-900">통계를 불러오는 중...</h3>
                <p className="text-sm text-gray-500 mt-1">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <div className="text-gray-600">{error}</div>
                <button
                  onClick={fetchCategoryStats}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 전체 통계 요약 */}
              <StatsOverview overallStats={overallStats} />

              {/* 카테고리별 상세 현황 */}
              <div className="p-6">
                {categoryStats.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">📊</div>
                    <div className="text-gray-600">표시할 통계 데이터가 없습니다.</div>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {categoryStats.map((category) => (
                      <CategoryStatsCard
                        key={category.categoryId}
                        categoryData={category}
                      />
                    ))}
                    
                    {categoryStats.length > 2 && (
                      <div className="text-center py-4 text-gray-500">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        </div>
                        <p className="mt-2 text-sm">
                          총 {overallStats.totalCategories}개 카테고리 중 {categoryStats.length}개 표시
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryStatsModal;
