import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Users, Award, Lock, Plus, ArrowLeft, Image as ImageIcon } from 'lucide-react';

// --- 1. Supabase 클라이언트 설정 ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 2. 메인 페이지 ---
const MainPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 필터 상태 관리 ---
  const [searchTerm, setSearchTerm] = useState(''); // 이름 검색
  const [statusFilter, setStatusFilter] = useState('All'); // 재학/수료 필터
  const [selectedTag, setSelectedTag] = useState('All'); // 태그 필터

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
  // 1. 모든 멤버의 태그를 수집해서 중복 제거 (태그 버튼 생성용)
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
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold">B</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Sogang BVI Lab</h1>
              <p className="text-xs text-slate-500">Business for Virtual Innovation</p>
            </div>
          </div>
          <Link to="/admin" className="text-xs text-gray-300 hover:text-blue-500">Admin</Link>
        </div>
      </header>

      {/* Hero Section */}
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

      <main className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8 flex gap-6 border-b border-gray-200">
           <button onClick={() => setActiveTab('news')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'news' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>Research & Activities</button>
           <button onClick={() => setActiveTab('members')} className={`pb-3 font-bold text-lg border-b-2 transition-colors ${activeTab === 'members' ? 'text-blue-800 border-blue-800' : 'text-gray-400 border-transparent hover:text-gray-600'}`}>People</button>
        </div>

        {/* --- News Tab --- */}
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

        {/* --- People Tab (필터 기능 추가됨) --- */}
        {activeTab === 'members' && (
          <div>
            {/* 1. 필터 컨트롤러 영역 */}
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
                <input 
                  type="text" 
                  placeholder="이름 검색..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                />
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
                  <div key={member.id} className="bg-white p-5 rounded-lg border border-gray-200 text-center hover:border-blue-300 transition-colors animate-fade-in">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-3 flex items-center justify-center text-slate-400 text-2xl overflow-hidden">
                      {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover"/> : '👤'}
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
                <div className="col-span-full text-center py-12 text-gray-400">
                  해당하는 연구원이 없습니다. 😅
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

// --- 3. 관리자 페이지 (이미지 업로드 추가) ---
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false); // 업로드 로딩 상태
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '', category: 'News', author: '', date: '', description: ''
  });
  const [file, setFile] = useState(null); // 파일 상태

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) setIsAuthenticated(true);
    else alert('비밀번호가 틀렸습니다.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = null;

    // 1. 이미지가 있다면 Storage에 먼저 업로드
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // 파일명 중복 방지 (시간값 사용)
      const { error: uploadError } = await supabase.storage
        .from('images') // 아까 만든 버킷 이름
        .upload(fileName, file);

      if (uploadError) {
        alert('이미지 업로드 실패: ' + uploadError.message);
        setUploading(false);
        return;
      }

      // 2. 업로드된 이미지의 공개 주소 가져오기
      const { data } = supabase.storage.from('images').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // 3. DB에 저장 (이미지 주소 포함)
    const { error } = await supabase.from('news').insert([{ ...formData, image_url: imageUrl }]);

    if (error) alert('게시물 저장 실패: ' + error.message);
    else {
      alert('업로드 성공!');
      setFormData({ title: '', category: 'News', author: '', date: '', description: '' });
      setFile(null);
    }
    setUploading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5"/> Admin Access</h2>
          <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-blue-800 text-white p-2 rounded">Enter</button>
          <Link to="/" className="block text-center mt-4 text-sm text-gray-500">Go Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">새 게시물 작성</h2>
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-black"><ArrowLeft className="w-4 h-4"/> 메인으로</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">제목</label>
            <input required className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          {/* 이미지 업로드 필드 */}
          <div className="bg-blue-50 p-4 rounded border border-blue-100">
            <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-blue-800">
              <ImageIcon className="w-4 h-4" /> 대표 이미지 (선택)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">카테고리</label>
              <select className="w-full p-2 border rounded" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option>News</option>
                <option>Paper Accepted</option>
                <option>Award</option>
                <option>Conference</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">날짜</label>
              <input type="date" required className="w-full p-2 border rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">작성자/연구원</label>
            <input required className="w-full p-2 border rounded" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">내용 요약</label>
            <textarea required rows="4" className="w-full p-2 border rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <button type="submit" disabled={uploading} className="w-full bg-blue-800 text-white py-3 rounded font-bold hover:bg-blue-900 flex justify-center items-center gap-2 disabled:bg-gray-400">
            {uploading ? '업로드 중...' : <><Plus className="w-5 h-5" /> 게시물 업로드</>}
          </button>
        </form>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;