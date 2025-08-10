import React, { useState } from 'react';
import { createPortal } from 'react-dom';

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
          className="mx-auto my-0 cursor-pointer transition-opacity hover:opacity-80"
          onClick={handleImageClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="이미지를 클릭하여 확대보기"
        >
          <img
            className="mx-auto max-h-80 max-w-full object-contain"
            src={`data:image/png;base64,${src}`}
            alt="문제 이미지"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : null}
      
      {/* 이미지 오버레이 */}
      {isOverlayOpen && createPortal(
        (
          <div 
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75"
            role="dialog"
            aria-label="확대된 이미지"
            tabIndex={-1}
          >
            <button
              type="button"
              className="absolute inset-0 size-full"
              onClick={handleOverlayClose}
              onKeyDown={handleOverlayKeyDown}
              aria-label="오버레이 닫기"
            />
            <div 
              className="relative max-h-[90vh] max-w-[90vw]"
              role="presentation"
            >
              <div
                className="max-h-full max-w-full"
                role="img"
                aria-label="확대된 이미지"
              >
                <img
                  className="size-full object-contain max-h-[85vh] max-w-[85vw]"
                  src={`data:image/png;base64,${src}`}
                  alt="확대된 이미지"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <button
                type="button"
                className="absolute right-4 top-4 text-white transition-colors hover:text-gray-300"
                onClick={handleOverlayClose}
                aria-label="이미지 닫기"
              >
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ),
        document.body
      )}
    </>
  );
}

export default Image;
