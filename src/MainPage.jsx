import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import { Users, Search } from 'lucide-react';

// Supabase 클라이언트 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const MainPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 필터 및 검색 상태 ---
  const [searchTerm, setSearchTerm] = useState(''); // 이름 검색
  const [statusFilter, setStatusFilter] = useState('All'); // 재학/수료 필터
  const [selectedTag, setSelectedTag] = useState('All'); // 태그 필터

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // 1. 뉴스 가져오기
      const { data: news } = await supabase
        .from('news')
        .select('*')
        .order('date', { ascending: false });
      if (news) setNewsData(news);

      // 2. 멤버 가져오기
      const { data: members } = await supabase
        .from('members')
        .select('*')
        .order('id', { ascending: true });
      if (members) setMembersData(members);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- 필터링 로직 ---
  // 1. 모든 멤버의 태그를 수집해서 중복 제거 (상단 태그 버튼용)
  const allTags = ['All', ...new Set(membersData.flatMap(m => 
    m.tags ? m.tags.split(',').map(t => t.trim()) : []
  ))].sort();

  // 2. 실제 필터링된 리스트 계산
  const filteredMembers = membersData.filter(member => {
    // (1) 상태 필터 (재학/수료)
    const matchStatus = statusFilter === 'All' || member.status === statusFilter;
    // (2) 태그 필터 (포함 여부 확인)
    const matchTag = selectedTag === 'All' || (member.tags && member.tags.includes(selectedTag));
    // (3) 이름 검색
    const matchName = member.name.includes(searchTerm) || (member.role && member.role.includes(searchTerm));

    return matchStatus && matchTag && matchName;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold">B</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Sogang BVI Lab</h1>
              <p className="text-xs text-slate-500">Business for Virtual Innovation</p>
            </div>
          </div>
          <Link to="/admin" className="text-xs text-gray-400 hover:text-blue-500 transition-colors font-medium">
            Admin Login
          </Link>
        </div>
      </header>

      {/* 히어로 섹션 */}
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

      {/* 메인 콘텐츠 */}
      <main className="max-w-6xl mx-auto px-6 pb-20">
        {/* 탭 버튼 */}
        <div className="mb-8 flex gap-6 border-b border-gray-200">
           <button onClick={() => setActiveTab('news')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'news' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Research & Activities</button>
           <button onClick={() => setActiveTab('members')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'members' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>People</button>
        </div>

        {/* --- 뉴스 탭 --- */}
        {activeTab === 'news' && (
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? <p>Loading...</p> : newsData.map((news) => (
              <div key={news.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                {news.image_url && (
                  <div className="h-48 overflow-hidden bg-gray-100 border-b border-gray-100">
                    <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${news.category === 'Seminar' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                      {news.category}
                    </span>
                    <span className="text-sm text-gray-400">{news.date}</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{news.title}</h4>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{news.description}</p>
                  <div className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" /> {news.author}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- 멤버 탭 (필터 기능 포함) --- */}
        {activeTab === 'members' && (
          <div>
            {/* 1. 필터 컨트롤러 */}
            <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                {/* 상태 필터 버튼 */}
                <div className="flex gap-2">
                  {['All', '재학', '수료'].map(status => (
                    <button 
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${statusFilter === status ? 'bg-blue-800 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      {status === 'All' ? '전체 보기' : status}
                    </button>
                  ))}
                </div>
                {/* 검색창 */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="이름 검색..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full md:w-64"
                  />
                </div>
              </div>

              {/* 태그 필터 (가로 스크롤) */}
              <div className="pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
                <div className="flex gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${selectedTag === tag ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. 멤버 리스트 (필터링된 결과) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.id} className="bg-white p-5 rounded-lg border border-gray-200 text-center hover:border-blue-300 transition-colors">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400 text-2xl overflow-hidden shadow-inner">
                      {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover"/> : '👤'}
                    </div>
                    <h5 className="font-bold text-slate-900 text-lg">{member.name}</h5>
                    <p className="text-xs text-blue-600 font-bold uppercase mb-1">{member.role} <span className="text-gray-300">|</span> {member.status}</p>
                    
                    <div className="mt-3 flex flex-wrap justify-center gap-1">
                      {member.tags && member.tags.split(',').slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-100 text-gray-400">
                  <p>조건에 맞는 연구원이 없습니다. 😅</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;