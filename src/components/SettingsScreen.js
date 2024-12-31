import React from "react";
import { Sun, Moon } from "lucide-react";

const SettingsScreen = ({ isDarkMode, toggleDarkMode, period, togglePeriod }) => {
    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
            <div className="flex flex-col gap-4">
                {/* Dark Mode Button */}
                <button
                    onClick={toggleDarkMode}
                    className="group relative inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white"
                >
                    <span className="relative flex items-center">
                        {isDarkMode ? <Sun size={18} className="mr-2" /> : <Moon size={18} className="mr-2" />}
                        <span>{isDarkMode ? "מצב כהה" : "מצב בהיר"}</span>
                    </span>
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
                    </div>
                </button>

                {/* Period Button */}
                <button
                    onClick={togglePeriod}
                    className="group relative inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium transition-all duration-200 ease-in-out transform bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 text-white"
                >
                    <span className="relative flex items-center">
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {`תקופת שיבוץ: ${period === "שבועי" ? "חודשי" : "שבועי"}`}
                    </span>
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-emerald-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
