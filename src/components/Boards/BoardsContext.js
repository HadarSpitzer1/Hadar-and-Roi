import React, { createContext, useState, useContext } from "react";

const BoardsContext = createContext();

export const useBoards = () => useContext(BoardsContext);

export const BoardsProvider = ({ children }) => {
    const [schedules, setSchedules] = useState({});
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [currentTable, setCurrentTable] = useState(null);
    const [employeeData, setEmployeeData] = useState({});
    const [period, setPeriod] = useState(() => {
        const savedPeriod = localStorage.getItem("period");
        return savedPeriod || "שבועית";
    });

    const addManager = (manager) => {
        setManagers((prev) => [...prev, manager]);
    };

    const removeManager = (manager) => {
        setManagers((prev) => prev.filter((m) => m !== manager));
    };

    return (
        <BoardsContext.Provider
            value={{
                schedules,
                setSchedules,
                employees,
                setEmployees,
                managers,
                setManagers,
                addManager, // Add manager to the list
                removeManager, // Remove manager from the list
                currentTable,
                setCurrentTable,
                employeeData,
                setEmployeeData,
                period,
                setPeriod,
            }}
        >
            {children}
        </BoardsContext.Provider>
    );
};
