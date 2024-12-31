// TableHeader.js
import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

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
  hoveredShiftIndex,
  setHoveredShiftIndex,
  handleAddRow, // Handles adding new rows
}) => {
  return (
    <thead>
      <tr
        className="bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200"
        onMouseEnter={() => setHoveredShiftIndex(0)} // Assuming 0 is the header row index
        onMouseLeave={() => setHoveredShiftIndex(null)}
      >
        {/* Add new row button */}
        <th className="p-3 text-center rounded-tl-xl">
        {/*  <button*/}
        {/*    onClick={handleAddRow}*/}
        {/*    className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors ${*/}
        {/*      hoveredShiftIndex === 0 ? "opacity-100" : "opacity-75"*/}
        {/*    }`}*/}
        {/*    title="Add Row"*/}
        {/*  >*/}
        {/*    ＋*/}
        {/*  </button>*/}
        </th>

        {/* Render columns for each school */}
        {schools.map((school, index) => (
          <th
            key={index}
            className={`p-3 text-center border-l border-indigo-200 dark:border-indigo-800 relative ${
              index === schools.length - 1 ? "rounded-tr-xl" : ""
            }`}
            onMouseEnter={() => setHoveredSchoolIndex(index)}
            onMouseLeave={() => setHoveredSchoolIndex(null)}
          >
            {editingSchoolIndex === index ? (
              <input
                type="text"
                value={newSchoolName}
                onChange={(e) => handleSchoolNameChange(e.target.value)}
                onBlur={() => handleSchoolNameSave(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSchoolNameSave(index);
                  }
                }}
                autoFocus
                className="w-full p-1 text-center bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-800 rounded"
              />
            ) : (
              <div className="flex items-center justify-center">
                <span className="cursor-default">{school}</span>
                {hoveredSchoolIndex === index && (
                  <div className="absolute top-0 right-0 flex space-x-2">
                    <button
                      onClick={() => handleEditSchool(index)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit Name"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(index)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Column"
                    >
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
            )}
          </th>
        ))}

        {/* Add new school button */}
        <th className="p-3 text-center border-l border-indigo-200 dark:border-indigo-800">
          <button
            onClick={handleAddSchool}
            className={`text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 transition-colors ${
              hoveredShiftIndex === 0 ? "opacity-100" : "opacity-75"
            }`}
            title="Add Column"
          >
            ＋
          </button>
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
