import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TableBody = ({
  hours,
  schools,
  schedule,
  conflicts,
  employees,
  hoveredHourIndex,
  setHoveredHourIndex,
  handleTeacherSelect,
  handleAddHour,
}) => {
  return (
    <tbody>
      {hours.map((hour, rowIndex) => (
        <tr key={rowIndex} className="border-b border-indigo-100 dark:border-indigo-800/50">
          <td
            className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center text-gray-700 dark:text-gray-200 relative"
            dir="ltr"
            onMouseEnter={() => setHoveredHourIndex(rowIndex)}
            onMouseLeave={() => setHoveredHourIndex(null)}
          >
            <span className="cursor-default">{hour}</span>
          </td>
          {schools.map((school) => {
            const isConflict = conflicts[hour] && conflicts[hour].includes(school);
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
                  onChange={(e) => handleTeacherSelect(school, hour, e.target.value)}
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
          <td key={index} className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
        ))}
        <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
      </tr>
    </tbody>
  );
};

export default TableBody;
