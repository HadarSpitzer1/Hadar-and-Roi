import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import BoardsScreen from "./components/Boards/BoardsScreen";
import EmployeesScreen from "./components/EmployeesScreen";
import SettingsScreen from "./components/SettingsScreen";
import ContactScreen from "./components/ContactScreen";
import LandingPage from "./components/LandingPage";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchUserData, saveUserData } from "./api";
import mockDatabase from "./data/mockDatabase";

const defaultEmployees = [
  "מר כהן",
  "גברת לוי",
  "מר רפאל",
  "גברת סויסה",
  "מר ביטון",
  "גברת שפירא",
];

const App = () => {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [currentTable, setCurrentTable] = useState("table1");
  const [currentPage, setCurrentPage] = useState("boards");

  // Initialize schedules and employees
  const [schedules, setSchedules] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Fetch user data or load defaults on app initialization
  useEffect(() => {
    const initializeData = async () => {
      if (!isAuthenticated) return;

      const userData = await fetchUserData(user.sub,getAccessTokenSilently);
      if (userData && userData.tables) {
        setSchedules(userData.tables);
        setEmployees(userData.employees || []);
      } else {
        setSchedules(mockDatabase);
        setEmployees(defaultEmployees);
      }
    };

    initializeData();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Save user data to the cloud
  const handleSave = async () => {
    if (schedules && employees) {
      await saveUserData(user.sub, schedules, employees, getAccessTokenSilently);
    }
  };

  const renderCurrentPage = () => {
    return (
      <>
        <button
          onClick={handleSave}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save to Cloud
        </button>
        {currentPage === "boards" && (
          <BoardsScreen
            currentTable={currentTable}
            setCurrentTable={setCurrentTable}
            schedule={schedules?.[currentTable] || {}}
            setSchedule={(newSchedule) =>
              setSchedules((prevSchedules) => ({
                ...prevSchedules,
                [currentTable]: newSchedule,
              }))
            }
            employees={employees}
          />
        )}
        {currentPage === "employees" && (
          <EmployeesScreen employees={employees} setEmployees={setEmployees} />
        )}
        {currentPage === "settings" && (
          <SettingsScreen
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
        {currentPage === "contact" && <ContactScreen />}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <div className="bg-indigo-50/50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
        <NavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="max-w-6xl mx-auto p-8">{renderCurrentPage()}</div>
      </div>
    </div>
  );
};

export default App;
