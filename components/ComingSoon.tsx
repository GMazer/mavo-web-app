import React from 'react';

interface ComingSoonProps {
  title: string;
  onGoHome: () => void;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, onGoHome }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center animate-fade-in">
      <div className="w-24 h-24 mb-8 text-gray-200">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h1 className="text-3xl lg:text-4xl font-normal uppercase tracking-wide mb-4">
        {title}
      </h1>
      <p className="text-gray-500 max-w-md mb-10 leading-relaxed">
        Danh mục này hiện chưa có sản phẩm nào hoặc đang trong quá trình cập nhật. Vui lòng quay lại sau hoặc khám phá các sản phẩm khác của MAVO.
      </p>
      <button 
        onClick={onGoHome}
        className="bg-black text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
      >
        Tiếp tục mua sắm
      </button>
    </div>
  );
};

export default ComingSoon;
