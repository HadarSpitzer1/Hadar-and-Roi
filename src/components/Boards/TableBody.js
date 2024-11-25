// components/TableBody.js

import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TableBody = ({
  hours,
  schools,
  schedule,
  conflicts,
  employees,
  editingHourIndex,
  newHourLabel,
  handleEditHour,
  handleHourLabelChange,
  handleHourLabelSave,
  handleDeleteHour,
  hoveredHourIndex,
  setHoveredHourIndex,
  handleTeacherSelect,
  handleAddHour,
}) => {
  return (
    <tbody>
      {hours.map((hour, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-indigo-100 dark:border-indigo-800/50"
        >
          <td
            className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center text-gray-700 dark:text-gray-200 relative"
            dir="ltr"
            onMouseEnter={() => setHoveredHourIndex(rowIndex)}
            onMouseLeave={() => setHoveredHourIndex(null)}
          >
            {editingHourIndex === rowIndex ? (
              <input
                type="text"
                value={newHourLabel}
                onChange={(e) => handleHourLabelChange(e.target.value)}
                onBlur={() => handleHourLabelSave(rowIndex)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleHourLabelSave(rowIndex);
                  }
                }}
                autoFocus
                className="w-full p-1 text-center bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded"
              />
            ) : (
              <div className="flex items-center justify-center">
                <span className="cursor-default">{hour}</span>
                {hoveredHourIndex === rowIndex && (
                  <>
                    <button
                      onClick={() => handleEditHour(rowIndex)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      title="ערוך שעה"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteHour(rowIndex)}
                      className="ml-2 text-red-600 hover:text-red-800"
                      title="מחק שורה"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            )}
          </td>
          {schools.map((school) => {
            const isConflict =
              conflicts[hour] && conflicts[hour].includes(school);

            return (
              <td
                key={`${school}-${hour}`}
                className={`p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50 ${
                  isConflict ? 'bg-red-200 dark:bg-red-800' : ''
                }`}
              >
                <select
                  className={`w-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isConflict
                      ? 'bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-500 text-gray-700 dark:text-gray-200'
                      : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 text-gray-700 dark:text-gray-200'
                  }`}
                  value={schedule[school]?.[hour] || ''}
                  onChange={(e) =>
                    handleTeacherSelect(school, hour, e.target.value)
                  }
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
          {/* Extra cell for the add column button */}
          <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
        </tr>
      ))}
      {/* Add Row Button */}
      <tr>
        <td className="p-3 text-center">
          <button
            onClick={handleAddHour}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
            title="הוסף שורה"
          >
            ＋
          </button>
        </td>
        {schools.map((_, index) => (
          <td
            key={index}
            className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"
          >
            {/* Empty cells for alignment */}
          </td>
        ))}
        {/* Extra cell for the add column button */}
        <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
      </tr>
    </tbody>
  );
};

export default TableBody;
