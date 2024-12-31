import React, { useEffect, useState } from "react";
import { useBoards } from "./Boards/BoardsContext";

const SmallTable = ({ employeeName }) => {
  const { schedules, currentTable, employeeData, setEmployeeData } = useBoards();
  const [tableData, setTableData] = useState({ schools: [], slots: [], schedule: {} });

  // Fetch data for the current table
  useEffect(() => {
    if (currentTable && schedules[currentTable]) {
      const { schools = [], slots = [], schedule = {} } = schedules[currentTable];
      setTableData({ schools, slots, schedule });
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

  const toggleCell = (shiftIndex, col) => {
    const visualKey = `visual_${shiftIndex * 7 + col}`;
    const currentState = markedCells[visualKey];
    let updatedState;

    // Toggle cell state
    if (currentState === "x") {
      updatedState = "-";
    } else if (currentState === "-") {
      updatedState = false;
    } else {
      updatedState = "x";
    }

    // Create a fresh copy of markedCells without the visual keys
    const updatedMarkedCells = {};
    Object.entries(markedCells).forEach(([key, value]) => {
      if (key.startsWith('visual_')) {
        updatedMarkedCells[key] = value;
      }
    });

    // Update the visual state
    updatedMarkedCells[visualKey] = updatedState;

    // Calculate corresponding indices for this shift
    const numSchools = tableData.schools.length;
    let baseIndex = 0;
    for (let i = 0; i < shiftIndex; i++) {
      const slotsInShift = (tableData.slots[i]?.slots?.length || 0);
      baseIndex += slotsInShift * numSchools;
    }
    
    const currentShiftSlotsCount = (tableData.slots[shiftIndex]?.slots?.length || 0);
    const correspondingIndices = [];
    
    // Get all corresponding indices for this shift+column
    for (let i = 0; i < currentShiftSlotsCount; i++) {
      const slotKey = baseIndex + (i * numSchools) + col;
      correspondingIndices.push(slotKey);
    }

    // Add marks based on the updated state
    if (updatedState === "x" || updatedState === "-") {
      correspondingIndices.forEach(index => {
        updatedMarkedCells[index] = updatedState;
      });
    }

    console.log('Updated marked cells:', updatedMarkedCells); // Debug log

    setEmployeeData((prev) => ({
      ...prev,
      [employeeName]: updatedMarkedCells,
    }));
  };

  // Get only the shifts (not the individual slots) for display
  const shifts = tableData.slots.map(slot => slot.shift);

  const markAllCells = () => {
    const updatedMarkedCells = {};
    
    // Check if all cells are already marked (to determine if we should mark or unmark)
    const allMarked = shifts.every((_, shiftIndex) => 
      tableData.schools.every((_, colIndex) => {
        const visualKey = `visual_${shiftIndex * 7 + colIndex}`;
        return markedCells[visualKey] === "x";
      })
    );

    if (!allMarked) {
      // Mark all cells
      shifts.forEach((_, shiftIndex) => {
        tableData.schools.forEach((_, colIndex) => {
          const visualKey = `visual_${shiftIndex * 7 + colIndex}`;
          updatedMarkedCells[visualKey] = "x";
        });
      });

      // Calculate and mark all corresponding indices
      shifts.forEach((_, shiftIndex) => {
        tableData.schools.forEach((_, colIndex) => {
          const numSchools = tableData.schools.length;
          let baseIndex = 0;
          
          // Calculate base index for this shift
          for (let i = 0; i < shiftIndex; i++) {
            const slotsInShift = (tableData.slots[i]?.slots?.length || 0);
            baseIndex += slotsInShift * numSchools;
          }
          
          // Mark all slots for this shift and column
          const currentShiftSlotsCount = (tableData.slots[shiftIndex]?.slots?.length || 0);
          for (let i = 0; i < currentShiftSlotsCount; i++) {
            const slotKey = baseIndex + (i * numSchools) + colIndex;
            updatedMarkedCells[slotKey] = "x";
          }
        });
      });
    }
    // If all cells are marked, updatedMarkedCells remains empty (unmarking all)

    setEmployeeData((prev) => ({
      ...prev,
      [employeeName]: updatedMarkedCells,
    }));
  };

  const allMarked = shifts.every((_, shiftIndex) => 
    tableData.schools.every((_, colIndex) => {
      const visualKey = `visual_${shiftIndex * 7 + colIndex}`;
      return markedCells[visualKey] === "x";
    })
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      <table
        className="w-full border-collapse rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800"
        dir="rtl"
      >
        {/* Header */}
        <thead>
          <tr style={{ backgroundColor: employeeColor }} className="text-gray-700 dark:text-gray-200">
            <th className="p-3 text-center font-medium border-b border-r border-indigo-200 dark:border-indigo-800">
              שעות
            </th>
            {tableData.schools.map((school, index) => (
              <th
                key={index}
                className="p-3 text-center font-medium border-b border-r border-indigo-200 dark:border-indigo-800"
              >
                {school}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {shifts.map((shift, shiftIndex) => (
            <tr key={shiftIndex} className="hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
              {/* Row Header */}
              <td
                className="p-3 text-center font-medium border-b border-r border-indigo-200 dark:border-indigo-800"
                style={{ backgroundColor: employeeColor }}
              >
                {shift}
              </td>

              {/* Data Cells */}
              {tableData.schools.map((school, colIndex) => {
                const cellKey = shiftIndex * 7 + colIndex;
                const cellState = markedCells[`visual_${cellKey}`];

                return (
                  <td
                    key={colIndex}
                    onClick={() => toggleCell(shiftIndex, colIndex)}
                    className={`p-3 text-center border-b border-r border-indigo-200 dark:border-indigo-800 cursor-pointer transition-colors`}
                    style={{
                      backgroundColor:
                        cellState === "x"
                          ? "#FFCDD2"
                          : cellState === "-"
                            ? "#FFF4C4"
                            : "transparent",
                      color: cellState ? "#000000" : "inherit",
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
      
      <button
        onClick={markAllCells}
        className="group relative inline-flex items-center justify-center px-6 py-3 text-lg font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
      >
        <span className="relative">
          <svg 
            className={`w-5 h-5 mr-2 inline-block transition-transform ${allMarked ? 'rotate-45' : ''} group-hover:${allMarked ? 'rotate-0' : 'rotate-180'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
            />
          </svg>
          {allMarked ? 'נקה הכל' : 'סמן הכל'}
        </span>
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
        </div>
      </button>
    </div>
  );
};

export default SmallTable;
