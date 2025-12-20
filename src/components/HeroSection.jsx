import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-white py-12 border-b border-gray-100 mb-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* 수정 포인트:
           - 기존에 있던 <br className="hidden md:block" /> 태그를 제거했습니다.
           - 이제 화면 크기에 따라 텍스트가 자연스럽게 줄바꿈됩니다.
        */}
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
          Leading the Future of <span className="text-blue-800">Virtual Business Innovation</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed word-keep-all">
          서강대학교 BVI Lab은 메타버스, AI, 블록체인 등 가상 혁신 기술을 비즈니스 관점에서 연구합니다.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;