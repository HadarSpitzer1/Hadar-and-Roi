// App.js

import React, { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import BoardsScreen from './components/BoardsScreen';
import EmployeesScreen from './components/EmployeesScreen';
import SettingsScreen from './components/SettingsScreen';
import ContactScreen from './components/ContactScreen';

const defaultEmployees = [
  'מר כהן',
  'גברת לוי',
  'מר רפאל',
  'גברת סויסה',
  'מר ביטון',
  'גברת שפירא',
];

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [currentTable, setCurrentTable] = useState('table1');
  const [currentPage, setCurrentPage] = useState('boards');

  // Initialize employees state with defaultEmployees array
  const [employees, setEmployees] = useState(() => {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : defaultEmployees;
  });

  // Initialize schedules state per table
  const [schedules, setSchedules] = useState(() => {
    const savedSchedules = localStorage.getItem('schedules');
    return savedSchedules
      ? JSON.parse(savedSchedules)
      : {
          table1: {},
          table2: {},
          table3: {},
        };
  });

  // Save dark mode preference, employees, and schedules to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    localStorage.setItem('employees', JSON.stringify(employees));
    localStorage.setItem('schedules', JSON.stringify(schedules));

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, employees, schedules]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'boards':
        return (
          <BoardsScreen
            currentTable={currentTable}
            setCurrentTable={setCurrentTable}
            schedule={schedules[currentTable] || {}}
            setSchedule={(newSchedule) =>
              setSchedules((prevSchedules) => ({
                ...prevSchedules,
                [currentTable]: newSchedule,
              }))
            }
            employees={employees}
          />
        );
      case 'employees':
        return (
          <EmployeesScreen
            employees={employees}
            setEmployees={setEmployees}
          />
        );
      case 'settings':
        return (
          <SettingsScreen
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
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
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="max-w-6xl mx-auto p-8">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default App;
