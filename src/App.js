import React, { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import BoardsScreen from "./components/Boards/BoardScreen/BoardsScreen";
import EmployeesScreen from "./components/Boards/EmployeesScreen/EmployeesScreen";
import SettingsScreen from "./components/SettingsScreen";
import ContactScreen from "./components/ContactScreen";
import LandingPage from "./components/LandingPage";
import { useAuth0 } from "@auth0/auth0-react";
import { BoardsProvider, useBoards } from "./components/Boards/BoardsContext";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { fetchUserData } from "./api";

const AppContent = ({ username, getAccessTokenSilently }) => {
    const { setSchedules, setEmployees, setCurrentTable } = useBoards();

    // Load tables once when the app initializes
    useState(() => {
        const loadTables = async () => {
            try {
                const data = await fetchUserData(username, getAccessTokenSilently);
                if (data) {
                    setSchedules(data.tables || {});
                    setEmployees(data.employees || []);
                    const tableKeys = Object.keys(data.tables || {});
                    if (tableKeys.length > 0) {
                        setCurrentTable(tableKeys[0]);
                    }
                }
            } catch (err) {
                console.error("Error loading data:", err);
            }
        };

        loadTables();
    }, []);

    return (
        <Routes>
            <Route
                path="/"
                element={<BoardsScreen username={username} getAccessTokenSilently={getAccessTokenSilently} />}
            />
            <Route
                path="/employees"
                element={<EmployeesScreen/>}
            />
            <Route path="/settings" element={<SettingsScreen />} />
            <Route path="/contact" element={<ContactScreen />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

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
        <BoardsProvider>
            <Router>
                <div className={`min-h-screen ${isDarkMode ? "dark" : ""}`}>
                    <div className="bg-indigo-50/50 dark:bg-gray-950 min-h-screen transition-colors duration-200">
                        <NavBar />
                        <div className="max-w-6xl mx-auto p-8">
                            <AppContent username={user.sub} getAccessTokenSilently={getAccessTokenSilently} />
                        </div>
                    </div>
                </div>
            </Router>
        </BoardsProvider>
    );
};

export default App;
