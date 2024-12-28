import React from "react";
import { Sun, Moon } from "lucide-react";

const SettingsScreen = ({ isDarkMode, toggleDarkMode, period, togglePeriod }) => {
    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
            <div className="flex flex-col gap-4">
                {/* Dark Mode Button */}
                <button
                    onClick={toggleDarkMode}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-gray-700 dark:text-gray-200"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{isDarkMode ? "מצב כהה" : "מצב בהיר"}</span>
                </button>

                {/* Period Button */}
                <button
                    onClick={togglePeriod}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/50 transition-colors text-gray-700 dark:text-gray-200"
                >
                    <span>{`תקופת שיבוץ: ${period === "שבועי" ? "חודשי" : "שבועי"}`}</span>
                </button>
            </div>
        </div>
    );
};

export default SettingsScreen;
