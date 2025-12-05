import React, { useState } from 'react';
import { BookOpen, Calendar, Users, ChevronRight, Award, FileText } from 'lucide-react';

// --- Mock Data (PDF 내용을 바탕으로 재구성) ---

// 1. 연구 성과/뉴스 (새로 강조되는 섹션)
const newsData = [
  {
    id: 1,
    category: "Paper Accepted",
    title: "AI Agent를 활용한 가상 경제 모델링 연구, SSCI 저널 게재 확정",
    author: "오준석, 김태영",
    date: "2025.10.12",
    description: "메타버스 내 경제 활동의 자동화를 위한 AI 에이전트의 역할에 관한 연구가 저널에 게재되었습니다."
  },
  {
    id: 2,
    category: "Award",
    title: "2025 메타버스 비즈니스 아이디어 공모전 대상 수상",
    author: "박문수, 최제호",
    date: "2025.09.20",
    description: "Digital Twin 기술을 활용한 스마트 시티 ESG 솔루션 제안으로 대상을 수상하였습니다."
  },
  {
    id: 3,
    category: "Conference",
    title: "제3회 메타버스 비즈니스 박사간담회 발표",
    author: "BVI Lab",
    date: "2025.08.09",
    description: "비즈니스 모델 혁신을 주제로 한 박사 과정 연구원들의 정기 학술 간담회가 진행되었습니다."
  }
];

// 2. 랩 활동 아카이브 (기존 Updates 재가공)
const activitiesData = [
  {
    id: 1,
    type: "Seminar",
    title: "2025 하이원 메타버스 AI 세미나",
    date: "2025.02.07",
    summary: "최신 생성형 AI 트렌드와 메타버스 융합 사례 분석"
  },
  {
    id: 2,
    type: "Workshop",
    title: "가상자산 및 블록체인 비즈니스 워크샵",
    date: "2025.04.12",
    summary: "Web3 경제 생태계의 변화와 법적 이슈 검토"
  },
  {
    id: 3,
    type: "Seminar",
    title: "메타버스 교육산업 연구 세미나",
    date: "2025.08.09",
    summary: "에듀테크와 XR 기술의 결합을 통한 교육 혁신 방안"
  }
];

// 3. 연구원 소개 (데이터베이스 형태에서 리스트 형태로)
const membersData = [
  { name: "이석근", role: "지도교수", tags: ["Business Strategy", "Innovation"] },
  { name: "오준석", role: "박사과정", tags: ["AI", "Digital Twin", "EduTech"] },
  { name: "백현영", role: "박사과정", tags: ["Education Solution", "Data Analysis"] },
  { name: "김태영", role: "박사과정", tags: ["Big Data", "HCI"] },
  { name: "임정훈", role: "박사과정", tags: ["Digital Twin", "Legal", "Ethics"] },
  // ... PDF의 추가 멤버들 포함 가능
];

const BviLabWebsite = () => {
  const [activeTab, setActiveTab] = useState('news');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* --- Header --- */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold">B</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Sogang BVI Lab</h1>
              <p className="text-xs text-slate-500">Business for Virtual Innovation</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => setActiveTab('news')} className={`${activeTab === 'news' ? 'text-blue-700' : 'hover:text-blue-700'}`}>Research News</button>
            <button onClick={() => setActiveTab('activities')} className={`${activeTab === 'activities' ? 'text-blue-700' : 'hover:text-blue-700'}`}>Activities</button>
            <button onClick={() => setActiveTab('members')} className={`${activeTab === 'members' ? 'text-blue-700' : 'hover:text-blue-700'}`}>People</button>
          </nav>
        </div>
      </header>

      {/* --- Hero Section --- */}
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Leading the Future of <br className="hidden md:block" />
            <span className="text-blue-800">Virtual Business Innovation</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            서강대학교 BVI Lab은 메타버스, AI, 블록체인 등 가상 혁신 기술을 비즈니스 관점에서 연구합니다.
            학술적 깊이와 실무적 통찰을 통해 지식 기반 사업화와 정책 제언을 주도합니다.
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* --- Section 1: Research News (가장 강조) --- */}
        <div className={`mb-16 ${activeTab !== 'news' && activeTab !== 'all' ? 'hidden' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-6 h-6 text-blue-700" />
            <h3 className="text-2xl font-bold text-slate-900">Research & News</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {newsData.map((news) => (
              <div key={news.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded border border-blue-100">
                    {news.category}
                  </span>
                  <span className="text-sm text-gray-400">{news.date}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{news.title}</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{news.description}</p>
                <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" /> {news.author}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Section 2: Lab Activities (아카이브) --- */}
        <div className={`mb-16 ${activeTab !== 'activities' && activeTab !== 'all' ? 'hidden' : ''}`}>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-blue-700" />
            <h3 className="text-2xl font-bold text-slate-900">Lab Activities</h3>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {activitiesData.map((activity, index) => (
              <div key={activity.id} className={`p-6 flex flex-col md:flex-row gap-4 hover:bg-slate-50 transition-colors ${index !== activitiesData.length -1 ? 'border-b border-gray-100' : ''}`}>
                <div className="md:w-32 flex-shrink-0">
                  <span className="block text-sm font-bold text-blue-800">{activity.date}</span>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{activity.type}</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800 mb-1">{activity.title}</h4>
                  <p className="text-slate-600 text-sm">{activity.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- Section 3: Members (간단한 디렉토리) --- */}
        <div className={`${activeTab !== 'members' && activeTab !== 'all' ? 'hidden' : ''}`}>
           <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-blue-700" />
            <h3 className="text-2xl font-bold text-slate-900">People</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {membersData.map((member, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center text-gray-400">
                  {/* 실제 이미지 URL이 있다면 img 태그 사용 */}
                  <span className="text-xl">👤</span>
                </div>
                <h5 className="font-bold text-slate-900">{member.name}</h5>
                <p className="text-xs text-blue-600 font-medium mb-2">{member.role}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {member.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div>
            <h5 className="text-white font-bold mb-2">Sogang BVI Lab</h5>
            <p className="text-sm">서울 마포구 백범로 35 삼성가브리엘관 GA611A호</p>
            <p className="text-sm mt-1">Email: metaonebizlab@gmail.com</p>
          </div>
          <div className="flex md:justify-end gap-4">
            <a href="#" className="hover:text-white transition-colors">Youtube</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BviLabWebsite;