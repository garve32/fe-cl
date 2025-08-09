import React, { useState } from 'react';

function Image({ src }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleImageClick = () => {
    if (src) {
      setIsOverlayOpen(true);
    }
  };

  const handleOverlayClose = () => {
    setIsOverlayOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
    }
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleOverlayClose();
    }
  };

  return (
    <>
      {src ? (
        <div
          className="my-0 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="이미지를 클릭하여 확대보기"
        >
          <img
            className="max-w-full max-h-80 object-contain mx-auto"
            src={`data:image/png;base64,${src}`}
            alt="문제 이미지"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      
      {/* 이미지 오버레이 */}
      {isOverlayOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          role="dialog"
          aria-label="확대된 이미지"
          tabIndex={-1}
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full"
            onClick={handleOverlayClose}
            onKeyDown={handleOverlayKeyDown}
            aria-label="오버레이 닫기"
          />
          <div 
            className="relative max-w-[90vw] max-h-[90vh]"
            role="presentation"
          >
            <div
              className="max-w-full max-h-full"
              role="img"
              aria-label="확대된 이미지"
            >
              <img
                className="w-full h-full object-contain max-w-[85vw] max-h-[85vh]"
                src={`data:image/png;base64,${src}`}
                alt="확대된 이미지"
                loading="eager"
                decoding="async"
              />
            </div>
            <button
              type="button"
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={handleOverlayClose}
              aria-label="이미지 닫기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Image;
