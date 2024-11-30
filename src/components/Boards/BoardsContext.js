//BoardsContext.js


import React, { createContext, useState, useContext } from "react";

const BoardsContext = createContext();

export const useBoards = () => useContext(BoardsContext);

export const BoardsProvider = ({ children }) => {
  const [schedules, setSchedules] = useState({});
  const [employees, setEmployees] = useState([]);
  const [currentTable, setCurrentTable] = useState(null);

  return (
    <BoardsContext.Provider
      value={{
        schedules,
        setSchedules,
        employees,
        setEmployees,
        currentTable,
        setCurrentTable,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};
