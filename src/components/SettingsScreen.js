// components/SettingsScreen.js

import React, { useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const SettingsScreen = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-gray-700 dark:text-gray-200"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{isDarkMode ? 'מצב בהיר' : 'מצב כהה'}</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsScreen;
