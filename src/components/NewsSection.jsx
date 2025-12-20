import React from 'react';
import { Users } from 'lucide-react';

const NewsSection = ({ newsData, loading }) => {
  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {newsData.map((news) => (
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
  );
};

export default NewsSection;