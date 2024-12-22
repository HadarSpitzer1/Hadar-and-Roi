import React, { useState, useEffect } from 'react';
import { Sun, Moon, Users, Settings, Layout, PhoneCall } from 'lucide-react';

// Mock database remains the same


const NavBar = ({ currentPage, setCurrentPage, isDarkMode }) => {
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
                            מערכת שיבוץ
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className={buttonClass('boards')} onClick={() => setCurrentPage('boards')}>
                            <Layout size={20} />
                            <span>לוחות</span>
                        </button>
                        <button className={buttonClass('employees')} onClick={() => setCurrentPage('employees')}>
                            <Users size={20} />
                            <span>עובדים</span>
                        </button>
                        <button className={buttonClass('settings')} onClick={() => setCurrentPage('settings')}>
                            <Settings size={20} />
                            <span>הגדרות</span>
                        </button>
                        <button className={buttonClass('contact')} onClick={() => setCurrentPage('contact')}>
                            <PhoneCall size={20} />
                            <span>צור קשר</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const BoardsScreen = ({ currentTable, setCurrentTable, schedule, setSchedule }) => {
    const { schools, teachers } = mockDatabase[currentTable];
    const hours = currentTable === 'table1' ? mockDatabase.table1.hours : mockDatabase[currentTable].hours_range;

    const handleTeacherSelect = (school, hour, teacher) => {
        setSchedule((prev) => ({
            ...prev,
            [school]: {
                ...prev[school],
                [hour]: teacher,
            },
        }));
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                <div className="relative">
                    <select
                        value={currentTable}
                        onChange={(e) => setCurrentTable(e.target.value)}
                        className="appearance-none bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="table1">לקות שמיעה</option>
                        <option value="table2">לקות למידה</option>
                        <option value="table3">לקות ראייה</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg">
                <table className="w-full" dir="rtl">
                    <thead>
                        <tr className="bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200">
                            <th className="p-3 text-center rounded-tl-xl">שעות</th>
                            {schools.map((school, index) => (
                                <th
                                    key={school}
                                    className={`p-3 text-center border-l border-indigo-200 dark:border-indigo-800 ${
                                        index === schools.length - 1 ? 'rounded-tr-xl' : ''
                                    }`}
                                >
                                    {school}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hours.map((hour, rowIndex) => (
                            <tr key={hour} className="border-b border-indigo-100 dark:border-indigo-800/50">
                                <td
                                    className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center text-gray-700 dark:text-gray-200"
                                    dir="ltr"
                                >
                                    {hour}
                                </td>
                                {schools.map((school) => (
                                    <td
                                        key={`${school}-${hour}`}
                                        className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"
                                    >
                                        <select
                                            className="w-full bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 dark:text-gray-200"
                                            value={schedule[school]?.[hour] || ''}
                                            onChange={(e) =>
                                                handleTeacherSelect(school, hour, e.target.value)
                                            }
                                        >
                                            <option value="">בחר מורה</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher} value={teacher}>
                                                    {teacher}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const EmployeesScreen = () => {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState('');

    const addEmployee = () => {
        if (newEmployee.trim()) {
            setEmployees([...employees, newEmployee.trim()]);
            setNewEmployee('');
        }
    };

    const removeEmployee = (index) => {
        setEmployees(employees.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
            <div className="space-y-6">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newEmployee}
                        onChange={(e) => setNewEmployee(e.target.value)}
                        placeholder="שם העובד החדש"
                        className="flex-1 p-2 border border-indigo-200 dark:border-indigo-800 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                    />
                    <button 
                        onClick={addEmployee}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        הוסף עובד
                    </button>
                </div>
                
                <div className="space-y-4">
                    {employees.map((employee, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                            <button
                                onClick={() => removeEmployee(index)}
                                className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                            >
                                הסר
                            </button>
                            <span className="text-gray-700 dark:text-gray-200">{employee}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

const ContactScreen = () => {
    const [showAlert, setShowAlert] = useState(false);

    const handleContact = () => {
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
    };

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
            <div className="space-y-6">
                <button 
                    onClick={handleContact}
                    className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    צור קשר
                </button>
                
                {showAlert && (
                    <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 rounded-lg">
                        הטופס נשלח בהצלחה! נחזור אליך בהקדם.
                    </div>
                )}
            </div>
        </div>
    );
};

const App = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check if user has a dark mode preference in local storage
        const savedMode = localStorage.getItem('darkMode');
        return savedMode ? JSON.parse(savedMode) : false;
    });
    const [currentTable, setCurrentTable] = useState('table1');
    const [schedule, setSchedule] = useState({});
    const [currentPage, setCurrentPage] = useState('boards');

    useEffect(() => {
        // Save dark mode preference to local storage
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        
        // Update the document class
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        console.log("Toggling dark mode");
        setIsDarkMode(prev => !prev);
    };

    const renderCurrentPage = () => {
        switch (currentPage) {
            case 'boards':
                return (
                    <BoardsScreen 
                        currentTable={currentTable}
                        setCurrentTable={setCurrentTable}
                        schedule={schedule}
                        setSchedule={setSchedule}
                    />
                );
            case 'employees':
                return <EmployeesScreen />;
            case 'settings':
                return (
                    <SettingsScreen isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                    
                );
            case 'contact':
                return <ContactScreen />;
            default:
                return null;
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className="bg-indigo-50/50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
                <NavBar 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    isDarkMode={isDarkMode}
                />
                <div className="max-w-6xl mx-auto p-8">
                    {renderCurrentPage()}
                </div>
            </div>
        </div>
    );
};

export default App;