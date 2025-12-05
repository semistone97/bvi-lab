import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Users, Award, Lock, Plus, ArrowLeft } from 'lucide-react';

// --- 1. Supabase 클라이언트 설정 ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// --- 2. 메인 페이지 컴포넌트 ---
const MainPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // DB에서 데이터 가져오기
  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('id', { ascending: false }); // 최신순 정렬
      
      if (data) setNewsData(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-sm flex items-center justify-center text-white font-bold">B</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none">Sogang BVI Lab</h1>
              <p className="text-xs text-slate-500">Business for Virtual Innovation</p>
            </div>
          </div>
          {/* Admin Link (비밀 공간) */}
          <Link to="/admin" className="text-xs text-gray-300 hover:text-blue-500">Admin</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8 flex gap-4 border-b border-gray-200 pb-4">
           <button onClick={() => setActiveTab('news')} className={`font-bold ${activeTab === 'news' ? 'text-blue-800' : 'text-gray-400'}`}>Research News</button>
           <button onClick={() => setActiveTab('activities')} className={`font-bold ${activeTab === 'activities' ? 'text-blue-800' : 'text-gray-400'}`}>Activities</button>
        </div>

        {/* News Section */}
        {activeTab === 'news' && (
          <div className="grid md:grid-cols-2 gap-6">
            {loading ? <p>Loading...</p> : newsData.map((news) => (
              <div key={news.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
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
        )}
        
        {/* Activities Section (Mock Data 유지 - 필요시 DB화 가능) */}
        {activeTab === 'activities' && (
          <div className="p-10 text-center text-gray-500 bg-white border rounded-lg">
             활동 기록 DB는 아직 연결되지 않았습니다. (News 탭을 확인해보세요!)
          </div>
        )}
      </main>
    </div>
  );
};

// --- 3. 관리자(Admin) 페이지 컴포넌트 ---
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  // 폼 상태
  const [formData, setFormData] = useState({
    title: '', category: 'News', author: '', date: '', description: ''
  });

  const handleLogin = () => {
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('news').insert([formData]);
    if (error) alert('업로드 실패: ' + error.message);
    else {
      alert('업로드 성공!');
      setFormData({ title: '', category: 'News', author: '', date: '', description: '' }); // 초기화
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-80">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Lock className="w-5 h-5"/> Admin Access</h2>
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          <button type="submit" className="w-full bg-blue-800 text-white py-3 rounded font-bold hover:bg-blue-900 flex justify-center items-center gap-2">
            <Plus className="w-5 h-5" /> 게시물 업로드
          </button>
        </form>
      </div>
    </div>
  );
};

// --- 4. 메인 라우터 ---
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