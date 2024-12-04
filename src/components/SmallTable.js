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

  // Safely access markedCells
  const markedCells = employeeData?.[employeeName] || {};

  const toggleCell = (row, col) => {
    const key = `${row}-${col}`;
    const updatedMarkedCells = {
      ...markedCells,
      [key]: !markedCells[key], // Toggle the cell state
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
        <tr className="bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200">
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
          <tr
            key={rowIndex}
            className="hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
          >
            {/* Row Header */}
            <td className="p-3 text-center font-medium bg-indigo-50 dark:bg-indigo-900/50 border-b border-indigo-200 dark:border-indigo-800">
              {hour}
            </td>

            {/* Data Cells */}
            {schools.map((school, colIndex) => {
              const isMarked = markedCells[`${rowIndex}-${colIndex}`];
              return (
                <td
                  key={colIndex}
                  onClick={() => toggleCell(rowIndex, colIndex)}
                  className={`p-3 text-center border-b border-indigo-200 dark:border-indigo-800 cursor-pointer transition-colors ${
                    isMarked
                      ? "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                  }`}
                >
                  {isMarked ? "X" : ""}
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
