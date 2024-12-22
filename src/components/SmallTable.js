import React, { useEffect, useState } from "react";
import { useBoards } from "./Boards/BoardsContext";

const SmallTable = ({ employeeName }) => {
  const { schedules, currentTable, employeeData, setEmployeeData } = useBoards();
  const [tableData, setTableData] = useState({ schools: [], hours: [], schedule: {} });

  // Fetch data for the current table
  useEffect(() => {
    if (currentTable && schedules[currentTable]) {
      const { schools = [], hours = [], schedule = {} } = schedules[currentTable];
      setTableData({ schools, hours, schedule });
    }
  }, [currentTable, schedules]);

  // Ensure the employee has an entry in employeeData
  useEffect(() => {
    if (!employeeData || !employeeData[employeeName]) {
      setEmployeeData((prev) => ({
        ...prev,
        [employeeName]: {}, // Create a new entry for the employee if it doesn't exist
      }));
    }
  }, [employeeName, employeeData, setEmployeeData]);

  // Safely access markedCells and employee color
  const markedCells = employeeData?.[employeeName] || {};
  const employeeColor = employeeData?.[employeeName]?.color || "#ffffff";

  const toggleCell = (row, col) => {
    const key = row * 7 + col; // Use i*7+j as the key
    const currentState = markedCells[key];
    let updatedState;

    // Toggle cell state
    if (currentState === "x") {
      updatedState = "-"; // Move from X to warning state
    } else if (currentState === "-") {
      updatedState = false; // Move from warning to unmarked
    } else {
      updatedState = "x"; // Move from unmarked to X
    }

    const updatedMarkedCells = {
      ...markedCells,
      [key]: updatedState,
    };

    setEmployeeData((prev) => ({
      ...prev,
      [employeeName]: updatedMarkedCells,
    }));
  };

  const { schools, hours } = tableData;

  return (
    <table
      className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800"
      dir="rtl"
    >
      {/* Header */}
      <thead>
        <tr style={{ backgroundColor: employeeColor }} className="text-gray-700 dark:text-gray-200">
          <th className="p-3 text-center font-medium border-b border-indigo-200 dark:border-indigo-800">
            שעות
          </th>
          {schools.map((school, index) => (
            <th
              key={index}
              className="p-3 text-center font-medium border-b border-indigo-200 dark:border-indigo-800"
            >
              {school}
            </th>
          ))}
        </tr>
      </thead>

      {/* Body */}
      <tbody>
        {hours.map((hour, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
            {/* Row Header */}
            <td
              className="p-3 text-center font-medium border-b border-indigo-200 dark:border-indigo-800"
              style={{ backgroundColor: employeeColor }}
            >
              {hour}
            </td>

            {/* Data Cells */}
            {schools.map((school, colIndex) => {
              const cellKey = rowIndex * 7 + colIndex;
              const cellState = markedCells[cellKey]; // true (X), "-" (warning), or undefined (unmarked)

              return (
                <td
                  key={colIndex}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                  className={`p-3 text-center border-b border-indigo-200 dark:border-indigo-800 cursor-pointer transition-colors`}
                  style={{
                    backgroundColor:
                      cellState === "x"
                        ? "#FFCDD2" // Red for X
                        : cellState === "-"
                        ? "#FFF4C4" // Yellow/Orange for warning
                        : "transparent", // Unmarked cells inherit table background
                    color: cellState ? "#000000" : "inherit", // Ensure text visibility for marked states
                  }}
                >
                  {cellState === "x" ? "X" : cellState === "-" ? "-" : ""}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SmallTable;
