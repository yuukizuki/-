
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 21h18"></path>
              <path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3l2-4h14l2 4"></path>
              <path d="M5 21V10.85"></path>
              <path d="M19 21V10.85"></path>
              <path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">UrbanRender AI</h1>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Transforming City Fabric</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Documentation</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Gallery</a>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all">
            Pro Features
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
