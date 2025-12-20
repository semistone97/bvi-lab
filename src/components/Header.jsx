import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
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
  );
};

export default Header;