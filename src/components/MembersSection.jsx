import React, { useState } from 'react';
import { Search } from 'lucide-react';

const MembersSection = ({ membersData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');

  // 태그 추출
  const allTags = ['All', ...new Set(membersData.flatMap(m => 
    m.tags ? m.tags.split(',').map(t => t.trim()) : []
  ))].sort();

  // 필터링 로직
  const filteredMembers = membersData.filter(member => {
    const matchStatus = statusFilter === 'All' || member.status === statusFilter;
    const matchTag = selectedTag === 'All' || (member.tags && member.tags.includes(selectedTag));
    const matchName = member.name.includes(searchTerm) || (member.role && member.role.includes(searchTerm));
    return matchStatus && matchTag && matchName;
  });

  return (
    <div>
      {/* 1. 필터 컨트롤러 */}
      <div className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
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

      {/* 2. 멤버 리스트 */}
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
  );
};

export default MembersSection;