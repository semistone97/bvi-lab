import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 🧩 부품들 불러오기
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import NewsSection from './components/NewsSection';
import MembersSection from './components/MembersSection';

// Supabase 클라이언트 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      const { data: news } = await supabase.from('news').select('*').order('date', { ascending: false });
      if (news) setNewsData(news);

      const { data: members } = await supabase.from('members').select('*').order('id', { ascending: true });
      if (members) setMembersData(members);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 1. 헤더 */}
      <Header />

      {/* 2. 배너 */}
      <HeroSection />

      {/* 3. 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* 탭 버튼 */}
        <div className="mb-8 flex gap-6 border-b border-gray-200">
           <button onClick={() => setActiveTab('news')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'news' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Research & Activities</button>
           <button onClick={() => setActiveTab('members')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'members' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>People</button>
        </div>

        {/* 4. 탭 내용물 교체 (데이터만 내려줌) */}
        {activeTab === 'news' && (
          <NewsSection newsData={newsData} loading={loading} />
        )}

        {activeTab === 'members' && (
          <MembersSection membersData={membersData} />
        )}
      </main>
    </div>
  );
};

export default MainPage;