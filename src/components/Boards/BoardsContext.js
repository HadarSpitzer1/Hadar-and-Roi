import React, { createContext, useState, useContext } from "react";

const BoardsContext = createContext();

export const useBoards = () => useContext(BoardsContext);

export const BoardsProvider = ({ children }) => {
    const [schedules, setSchedules] = useState({});
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]); // New state for managers
    const [currentTable, setCurrentTable] = useState(null);
    const [employeeData, setEmployeeData] = useState({}); // Track employee data

    return (
        <BoardsContext.Provider
            value={{
                schedules,
                setSchedules,
                employees,
                setEmployees,
                managers,
                setManagers,
                currentTable,
                setCurrentTable,
                employeeData,
                setEmployeeData,
            }}
        >
            {children}
        </BoardsContext.Provider>
    );
};
