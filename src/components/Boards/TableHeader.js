// components/TableHeader.js

import React from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

const TableHeader = ({
  schools,
  editingSchoolIndex,
  newSchoolName,
  handleEditSchool,
  handleSchoolNameChange,
  handleSchoolNameSave,
  handleAddSchool,
  handleDeleteSchool,
  hoveredSchoolIndex,
  setHoveredSchoolIndex,
}) => {
  return (
    <thead>
      <tr className="bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200">
        <th className="p-3 text-center rounded-tl-xl">שעות</th>
        {schools.map((school, index) => (
          <th
            key={index}
            className={`p-3 text-center border-l border-indigo-200 dark:border-indigo-800 relative ${
              index === schools.length - 1 ? 'rounded-tr-xl' : ''
            }`}
          >
            {editingSchoolIndex === index ? (
              <input
                type="text"
                value={newSchoolName}
                onChange={(e) => handleSchoolNameChange(e.target.value)}
                onBlur={() => handleSchoolNameSave(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSchoolNameSave(index);
                  }
                }}
                autoFocus
                className="w-full p-1 text-center bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded"
              />
            ) : (
              <div
                className="flex items-center justify-center"
                onMouseEnter={() => setHoveredSchoolIndex(index)}
                onMouseLeave={() => setHoveredSchoolIndex(null)}
              >
                <span className="cursor-default">{school}</span>
                {hoveredSchoolIndex === index && (
                  <>
                    <button
                      onClick={() => handleEditSchool(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      title="ערוך שם"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                      title="מחק עמודה"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            )}
          </th>
        ))}
        {/* Add Column Button */}
        <th className="p-3 text-center border-l border-indigo-200 dark:border-indigo-800">
          <button
            onClick={handleAddSchool}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors"
            title="הוסף עמודה"
          >
            ＋
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;