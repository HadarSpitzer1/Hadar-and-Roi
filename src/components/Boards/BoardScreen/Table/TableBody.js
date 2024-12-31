import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const TableBody = ({
  slots = [],
  schools,
  schedule,
  conflicts,
  employees,
  employeeData,
  hoveredSlotIndex,
  setHoveredSlotIndex,
  handleTeacherSelect,
  handleAddSlot,
  editingSlotIndex,
  newSlotLabel,
  handleEditSlot,
  handleSlotLabelChange,
  handleSlotLabelSave,
  handleDeleteSlot,
  handleAddRow,
  handleAddSubSlot,
}) => {
  return (
    <tbody>
      {(slots || []).map((slotGroup, shiftIndex) => (
        <React.Fragment key={`shift-${shiftIndex}`}>
          <tr className="border-b border-indigo-100 dark:border-indigo-800/50">
            <td
              className="p-3 text-center bg-indigo-50 dark:bg-indigo-900 text-gray-700 dark:text-gray-200 relative border-b border-indigo-100 dark:border-indigo-800/50"
              rowSpan={(slotGroup?.slots?.length || 1)}
              onMouseEnter={() => setHoveredSlotIndex(shiftIndex)}
              onMouseLeave={() => setHoveredSlotIndex(null)}
            >
              <div className="flex items-center justify-between">
                <span className="cursor-default">{slotGroup?.shift || `משמרת ${shiftIndex + 1}`}</span>
                
                  <button
                    onClick={() => handleAddSubSlot(shiftIndex)}
                    className="ml-2 text-indigo-600 transition-colors"
                    title="Add Slot"
                  >
                    ＋
                  </button>
                
              </div>
            </td>
            <td
              className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center text-gray-700 dark:text-gray-200 relative min-w-[70px] border-b border-indigo-100 dark:border-indigo-800/50"
              dir="ltr"
              onMouseEnter={() => setHoveredSlotIndex(shiftIndex)}
              onMouseLeave={() => setHoveredSlotIndex(null)}
            >
              {(slotGroup?.slots?.[0]) || "Default Slot"}
            </td>
            {schools.map((school) => (
              <td 
                key={`${school}-${slotGroup.shift}-0`} 
                className="p-3 text-center border-l border-b border-indigo-100 dark:border-indigo-800/50"
              >
                <select
                  className={`w-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    conflicts[slotGroup.shift] && conflicts[slotGroup.shift].includes(school)
                      ? "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-500 text-gray-700 dark:text-gray-200"
                      : "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 text-gray-700 dark:text-gray-200"
                  }`}
                  value={schedule[school]?.[slotGroup.shift] || ""}
                  onChange={(e) => handleTeacherSelect(school, slotGroup.shift, e.target.value)}
                >
                  <option value="">בחר מורה</option>
                  {employees.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </td>
            ))}
            <td className="p-3 text-center border-l border-b border-indigo-100 dark:border-indigo-800/50"></td>
          </tr>
          {(slotGroup?.slots || []).slice(1).map((slot, slotIndex) => (
            <tr 
              key={`slot-${shiftIndex}-${slotIndex + 1}`}
              className="border-b border-indigo-100 dark:border-indigo-800/50"
            >
              <td 
                className="p-3 font-medium bg-indigo-50/50 dark:bg-indigo-900/30 text-center border-b border-indigo-100 dark:border-indigo-800/50"
              >
                {slot}
              </td>
              {schools.map((school) => (
                <td 
                  key={`${school}-${slotGroup.shift}-${slotIndex + 1}`} 
                  className="p-3 text-center border-l border-b border-indigo-100 dark:border-indigo-800/50"
                >
                  <select
                    className={`w-full hover:bg-indigo-50 dark:hover:bg-indigo-900/50 border rounded-lg px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      conflicts[slot] && conflicts[slot].includes(school)
                        ? "bg-red-200 dark:bg-red-800 border-red-500 dark:border-red-500 text-gray-700 dark:text-gray-200"
                        : "bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-800 text-gray-700 dark:text-gray-200"
                    }`}
                    value={schedule[school]?.[slot] || ""}
                    onChange={(e) => handleTeacherSelect(school, slot, e.target.value)}
                  >
                    <option value="">בחר מורה</option>
                    {employees.map((teacher) => (
                      <option key={teacher} value={teacher}>
                        {teacher}
                      </option>
                    ))}
                  </select>
                </td>
              ))}
              <td className="p-3 text-center border-l border-b border-indigo-100 dark:border-indigo-800/50"></td>
            </tr>
          ))}
        </React.Fragment>
      ))}
      <tr>
        <td colSpan={schools.length + 2} className="p-3 text-center">
          <button
            onClick={handleAddRow}
            className="text-indigo-600 hover:text-indigo-800"
            title="Add New Shift"
          >
            ＋ Add Shift
          </button>
        </td>
        <td className="p-3 text-center border-l border-indigo-100 dark:border-indigo-800/50"></td>
      </tr>
    </tbody>
  );
};

export default TableBody;
