import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import BoardsScreen from "./components/Boards/BoardsScreen";
import EmployeesScreen from "./components/EmployeesScreen";
import SettingsScreen from "./components/SettingsScreen";
import ContactScreen from "./components/ContactScreen";
import LandingPage from "./components/LandingPage";
import { useAuth0 } from "@auth0/auth0-react";

const App = () => {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [currentPage, setCurrentPage] = useState("boards");

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

  const renderCurrentPage = () => {
    if (currentPage === "boards") {
      return (
          <BoardsScreen
              username={user.sub}
              getAccessTokenSilently={getAccessTokenSilently}
          />
      );
    } else if (currentPage === "employees") {
      return (
          <EmployeesScreen
              username={user.sub}
              getAccessTokenSilently={getAccessTokenSilently}
          />
      );
    }
     else if (currentPage === "settings") {
      return (
          <SettingsScreen
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
          />
      );
    } else if (currentPage === "contact") {
      return <ContactScreen />;
    }
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
