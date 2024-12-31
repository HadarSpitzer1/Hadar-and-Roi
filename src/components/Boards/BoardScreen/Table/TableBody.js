import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const TableBody = ({
  shifts,
  schools,
  schedule,
  conflicts,
  employees,
  employeeData,
  hoveredShiftIndex,
  setHoveredShiftIndex,
  handleTeacherSelect,
  handleAddShift,
  editingShiftIndex,
  newShiftLabel,
  handleEditShift,
  handleShiftLabelChange,
  handleShiftLabelSave,
  handleDeleteShift, handleAddRow, handleAddSlot,
}) => {
  return (
    <tbody>
      {shifts.map((Shift, rowIndex) => (
        <tr key={rowIndex} className="border-b border-indigo-100 dark:border-indigo-800/50">
          <td className="p-3 text-center bg-indigo-50 dark:bg-indigo-900 text-gray-700 dark:text-gray-200">
            Additional Info {/* Replace with dynamic data if needed */}
          </td>
          <td
              className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center text-gray-700 dark:text-gray-200 relative min-w-[70px]"
              dir="ltr"
            onMouseEnter={() => setHoveredShiftIndex(rowIndex)}
            onMouseLeave={() => setHoveredShiftIndex(null)}
          >
            {editingShiftIndex === rowIndex ? (
              <input
                type="text"
                value={newShiftLabel}
                onChange={(e) => handleShiftLabelChange(e.target.value)}
                onBlur={() => handleShiftLabelSave(rowIndex)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleShiftLabelSave(rowIndex);
                  }
                }}
                autoFocus
                className="w-full p-1 text-center bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded"
              />
            ) : (

              <div className="flex items-center justify-center">
                <span className="cursor-default">{Shift}</span>
                {hoveredShiftIndex === rowIndex && (
                  <div className="absolute top-0 left-0 flex space-x-2 px-1">
                    <button
                      onClick={() => handleEditShift(rowIndex)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Row Name"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteShift(rowIndex)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Row"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            )}
          </td>

          {schools.map((school) => {
            const isConflict = conflicts[Shift] && conflicts[Shift].includes(school);
            const assignedEmployee = schedule[school]?.[Shift];
            const employeeColor = assignedEmployee
              ? employeeData[assignedEmployee]?.color || "#ffffff"
              : "#ffffff";

            return (
              <td
                key={`${school}-${Shift}`}
                className={`p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50 dark:green ${
                  isConflict ? "bg-red-200 dark:bg-red-800" : ""
                }`}
                style={{
                  backgroundColor: isConflict ? "#FFCDD2" : employeeColor,
                  color: assignedEmployee ? "#000000" : "inherit",
                }}
              >
                <select
                  className={`w-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isConflict
                      ? "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-500 text-gray-700 dark:text-gray-200"
                      : "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 text-gray-700 dark:text-gray-200"
                  }`}
                  value={assignedEmployee || ""}
                  onChange={(e) => handleTeacherSelect(school, Shift, e.target.value)}
                >
                  <option value="">בחר מורה</option>
                  {employees.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </td>
            );
          })}
          <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
        </tr>
      ))}
      <tr>
        <td className="p-3 text-center bg-indigo-50/50 dark:bg-indigo-900/30">
          <button
              onClick={handleAddRow}
              className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors ${
                  hoveredShiftIndex === 0 ? "opacity-100" : "opacity-75"
              }`}
              title="Add Row"
          >
            ＋
          </button>
        </td>
        {schools.map((_, index) => (
          <td key={index} className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
        ))}
        <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
      </tr>
    </tbody>
  );
};

export default TableBody;
