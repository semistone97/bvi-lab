import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-white py-12 border-b border-gray-100 mb-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Leading the Future of <br className="hidden md:block" />
          <span className="text-blue-800">Virtual Business Innovation</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
          서강대학교 BVI Lab은 메타버스, AI, 블록체인 등 가상 혁신 기술을 비즈니스 관점에서 연구합니다.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;