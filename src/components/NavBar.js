// components/NavBar.js

import React from 'react';
import { Layout, Users, Settings, PhoneCall } from 'lucide-react';

const NavBar = ({ currentPage, setCurrentPage }) => {
  const isActive = (page) => currentPage === page;

  const buttonClass = (page) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive(page)
        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
        : 'hover:bg-indigo-50 dark:hover:bg-indigo-900/50 text-gray-700 dark:text-gray-200'
    }`;

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg mb-8 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentPage('boards')}
              className="text-2xl font-bold text-indigo-600 dark:text-indigo-400"
            >
              MatchBox
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className={buttonClass('boards')}
              onClick={() => setCurrentPage('boards')}
            >
              <Layout size={20} />
              <span>לוחות</span>
            </button>
            <button
              className={buttonClass('employees')}
              onClick={() => setCurrentPage('employees')}
            >
              <Users size={20} />
              <span>עובדים</span>
            </button>
            <button
              className={buttonClass('settings')}
              onClick={() => setCurrentPage('settings')}
            >
              <Settings size={20} />
              <span>הגדרות</span>
            </button>
            <button
              className={buttonClass('contact')}
              onClick={() => setCurrentPage('contact')}
            >
              <PhoneCall size={20} />
              <span>צור קשר</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
