import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { Lock, LogOut, Upload, Trash2, Plus, Save, User, FileText } from 'lucide-react';

// Supabase 설정
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 🚨 [필수] 관리자로 허용할 이메일을 여기에 입력하세요!
const ALLOWED_EMAILS = ['ojs0ojs@gmail.com', 'semistone97@sogang.ac.kr']; 

const AdminPage = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('news'); // 'news' or 'members'

  // 데이터 상태
  const [news, setNews] = useState([]);
  const [members, setMembers] = useState([]);

  // 입력 폼 상태 (뉴스)
  const [newsForm, setNewsForm] = useState({
    title: '', category: 'News', date: new Date().toISOString().split('T')[0],
    author: 'BVI Lab', description: '', image: null
  });

  // 입력 폼 상태 (멤버)
  const [memberForm, setMemberForm] = useState({
    name: '', role: '박사과정', status: '재학', tags: '', image: null
  });

  // 1. 초기 로딩 및 로그인 체크
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => checkUser(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => checkUser(session));
    return () => subscription.unsubscribe();
  }, []);

  const checkUser = (session) => {
    setSession(session);
    if (session?.user?.email && ALLOWED_EMAILS.includes(session.user.email)) {
      setIsAdmin(true);
      fetchData(); // 관리자 인증 성공 시 데이터 불러오기
    } else {
      setIsAdmin(false);
    }
  };

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/admin' },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setSession(null);
    navigate('/');
  };

  // 2. 데이터 불러오기
  const fetchData = async () => {
    setLoading(true);
    const { data: n } = await supabase.from('news').select('*').order('date', { ascending: false });
    const { data: m } = await supabase.from('members').select('*').order('id', { ascending: true });
    if (n) setNews(n);
    if (m) setMembers(m);
    setLoading(false);
  };

  // 3. 파일 업로드 핸들러
  const handleFileUpload = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);
    if (uploadError) {
      alert('이미지 업로드 실패: ' + uploadError.message);
      return null;
    }
    
    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  // 4. 뉴스 등록
  const handleAddNews = async () => {
    if (!newsForm.title) return alert('제목을 입력하세요');
    setLoading(true);

    let imageUrl = null;
    if (newsForm.image) {
      imageUrl = await handleFileUpload(newsForm.image);
    }

    const { error } = await supabase.from('news').insert([{
      title: newsForm.title,
      category: newsForm.category,
      date: newsForm.date,
      author: newsForm.author,
      description: newsForm.description,
      image_url: imageUrl
    }]);

    if (error) alert('저장 실패: ' + error.message);
    else {
      alert('뉴스가 등록되었습니다!');
      setNewsForm({ ...newsForm, title: '', description: '', image: null }); // 초기화
      fetchData();
    }
    setLoading(false);
  };

  // 5. 멤버 등록
  const handleAddMember = async () => {
    if (!memberForm.name) return alert('이름을 입력하세요');
    setLoading(true);

    let imageUrl = null;
    if (memberForm.image) {
      imageUrl = await handleFileUpload(memberForm.image);
    }

    const { error } = await supabase.from('members').insert([{
      name: memberForm.name,
      role: memberForm.role,
      status: memberForm.status,
      tags: memberForm.tags,
      image_url: imageUrl
    }]);

    if (error) alert('저장 실패: ' + error.message);
    else {
      alert('멤버가 등록되었습니다!');
      setMemberForm({ ...memberForm, name: '', tags: '', image: null });
      fetchData();
    }
    setLoading(false);
  };

  // 6. 삭제 기능
  const handleDelete = async (table, id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert('삭제 실패');
    else fetchData();
  };


  // --- 렌더링 시작 ---

  // 로그인 안 된 경우
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-sm w-full">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">BVI Lab Admin</h2>
          <button onClick={handleLogin} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-lg hover:bg-gray-50 shadow-sm mt-4">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Google 계정으로 로그인
          </button>
          <button onClick={() => navigate('/')} className="mt-4 text-xs text-gray-400">메인으로</button>
        </div>
      </div>
    );
  }

  // 권한 없는 경우
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">접근 권한 없음</h2>
            <p className="text-gray-600 mb-4">로그인된 계정 ({session.user.email})은 권한이 없습니다.</p>
            <button onClick={handleLogout} className="bg-gray-800 text-white px-4 py-2 rounded">로그아웃</button>
         </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-lg font-bold text-slate-800">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:inline">{session.user.email}</span>
          <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md">
            <LogOut className="w-4 h-4" /> 로그아웃
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6">
        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('news')}
            className={`pb-2 px-4 font-bold flex items-center gap-2 ${activeTab === 'news' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-400'}`}
          >
            <FileText className="w-4 h-4"/> 소식(News) 관리
          </button>
          <button 
            onClick={() => setActiveTab('members')}
            className={`pb-2 px-4 font-bold flex items-center gap-2 ${activeTab === 'members' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-400'}`}
          >
            <User className="w-4 h-4"/> 멤버(Members) 관리
          </button>
        </div>

        {/* --- 뉴스 관리 탭 --- */}
        {activeTab === 'news' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> 새 소식 등록</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="제목" className="border p-2 rounded" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} />
                <select className="border p-2 rounded" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})}>
                  <option>News</option><option>Seminar</option><option>Conference</option>
                </select>
                <input type="date" className="border p-2 rounded" value={newsForm.date} onChange={e => setNewsForm({...newsForm, date: e.target.value})} />
                <input type="text" placeholder="작성자" className="border p-2 rounded" value={newsForm.author} onChange={e => setNewsForm({...newsForm, author: e.target.value})} />
              </div>
              <textarea placeholder="내용 요약" className="w-full border p-2 rounded mb-4 h-24" value={newsForm.description} onChange={e => setNewsForm({...newsForm, description: e.target.value})} />
              <div className="flex justify-between items-center">
                <input type="file" onChange={e => setNewsForm({...newsForm, image: e.target.files[0]})} className="text-sm text-gray-500" />
                <button onClick={handleAddNews} disabled={loading} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {loading ? '저장 중...' : '등록하기'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {news.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.date} | {item.category}</p>
                  </div>
                  <button onClick={() => handleDelete('news', item.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* --- 멤버 관리 탭 --- */}
        {activeTab === 'members' && (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5"/> 새 멤버 등록</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="이름 (예: 홍길동)" className="border p-2 rounded" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} />
                <input type="text" placeholder="직함 (예: 박사과정)" className="border p-2 rounded" value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} />
                <select className="border p-2 rounded" value={memberForm.status} onChange={e => setMemberForm({...memberForm, status: e.target.value})}>
                  <option>재학</option><option>수료</option><option>졸업</option><option>교수</option>
                </select>
                <input type="text" placeholder="태그 (쉼표로 구분, 예: AI, Web3)" className="border p-2 rounded" value={memberForm.tags} onChange={e => setMemberForm({...memberForm, tags: e.target.value})} />
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">프로필 사진:</span>
                  <input type="file" onChange={e => setMemberForm({...memberForm, image: e.target.files[0]})} className="text-sm text-gray-500" />
                </div>
                <button onClick={handleAddMember} disabled={loading} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 flex items-center gap-2">
                  <Save className="w-4 h-4" /> {loading ? '저장 중...' : '등록하기'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map(member => (
                <div key={member.id} className="bg-white p-4 rounded-lg border flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                       {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover"/> : '👤'}
                    </div>
                    <div>
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-xs text-gray-500">{member.role} | {member.status}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete('members', member.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminPage;