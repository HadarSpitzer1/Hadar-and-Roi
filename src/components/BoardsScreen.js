// components/BoardsScreen.js

import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';
import mockDatabase from '../data/mockDatabase';

const BoardsScreen = ({
  currentTable,
  setCurrentTable,
  schedule,
  setSchedule,
  employees,
}) => {
  // Initialize schools and hours with state
  const [schools, setSchools] = useState(() => {
    const savedSchools = localStorage.getItem(`schools_${currentTable}`);
    return savedSchools
      ? JSON.parse(savedSchools)
      : [...mockDatabase[currentTable].schools];
  });

  const [hours, setHours] = useState(() => {
    const savedHours = localStorage.getItem(`hours_${currentTable}`);
    return savedHours
      ? JSON.parse(savedHours)
      : currentTable === 'table1'
      ? [...mockDatabase.table1.hours]
      : [...mockDatabase[currentTable].hours_range];
  });

  // Update schools and hours when currentTable changes
  useEffect(() => {
    const savedSchools = localStorage.getItem(`schools_${currentTable}`);
    setSchools(
      savedSchools
        ? JSON.parse(savedSchools)
        : [...mockDatabase[currentTable].schools]
    );

    const savedHours = localStorage.getItem(`hours_${currentTable}`);
    setHours(
      savedHours
        ? JSON.parse(savedHours)
        : currentTable === 'table1'
        ? [...mockDatabase.table1.hours]
        : [...mockDatabase[currentTable].hours_range]
    );
  }, [currentTable]);

  // Conflict detection logic
  const [conflicts, setConflicts] = useState({});

  useEffect(() => {
    const newConflicts = {};

    hours.forEach((hour) => {
      const assignedTeachers = {};

      schools.forEach((school) => {
        const teacher = schedule[school]?.[hour];
        if (teacher) {
          if (assignedTeachers[teacher]) {
            // Conflict detected
            newConflicts[hour] = newConflicts[hour] || [];
            newConflicts[hour].push(school);
            newConflicts[hour].push(assignedTeachers[teacher]);
          } else {
            assignedTeachers[teacher] = school;
          }
        }
      });
    });

    // Remove duplicate school entries
    for (const hour in newConflicts) {
      newConflicts[hour] = [...new Set(newConflicts[hour])];
    }

    setConflicts(newConflicts);
  }, [schedule, schools, hours]);

  const handleTeacherSelect = (school, hour, teacher) => {
    const newSchedule = {
      ...schedule,
      [school]: {
        ...schedule[school],
        [hour]: teacher,
      },
    };
    setSchedule(newSchedule);
  };

  // Editing state and handlers for schools
  const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
  const [newSchoolName, setNewSchoolName] = useState('');

  const handleEditSchool = (index) => {
    setEditingSchoolIndex(index);
    setNewSchoolName(schools[index]);
  };

  const handleSchoolNameSave = (index) => {
    const updatedSchools = [...schools];
    updatedSchools[index] = newSchoolName.trim() || schools[index];
    setSchools(updatedSchools);
    setEditingSchoolIndex(null);
    setNewSchoolName('');
  };

  // Editing state and handlers for hours
  const [editingHourIndex, setEditingHourIndex] = useState(null);
  const [newHourLabel, setNewHourLabel] = useState('');

  const handleEditHour = (index) => {
    setEditingHourIndex(index);
    setNewHourLabel(hours[index]);
  };

  const handleHourLabelSave = (index) => {
    const updatedHours = [...hours];
    updatedHours[index] = newHourLabel.trim() || hours[index];
    setHours(updatedHours);
    setEditingHourIndex(null);
    setNewHourLabel('');
  };

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem(`schools_${currentTable}`, JSON.stringify(schools));
  }, [schools, currentTable]);

  useEffect(() => {
    localStorage.setItem(`hours_${currentTable}`, JSON.stringify(hours));
  }, [hours, currentTable]);

  // Function to add a new school (column)
  const handleAddSchool = () => {
    const newSchoolName = `בית ספר ${schools.length + 1}`;
    setSchools([...schools, newSchoolName]);
  };

  // Function to add a new hour (row)
  const handleAddHour = () => {
    const newHourLabel = `שעה ${hours.length + 1}`;
    setHours([...hours, newHourLabel]);
  };

  // State for hovered indices
  const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

  // Functions for deleting schools and hours
  const handleDeleteSchool = (index) => {
    const updatedSchools = schools.filter((_, i) => i !== index);
    setSchools(updatedSchools);

    // Also remove related entries from the schedule
    const updatedSchedule = { ...schedule };
    const schoolToRemove = schools[index];
    delete updatedSchedule[schoolToRemove];
    setSchedule(updatedSchedule);
  };

  const handleDeleteHour = (index) => {
    const updatedHours = hours.filter((_, i) => i !== index);
    setHours(updatedHours);

    // Also remove related entries from the schedule
    const hourToRemove = hours[index];
    const updatedSchedule = {};

    for (const school in schedule) {
      if (schedule.hasOwnProperty(school)) {
        const { [hourToRemove]: _, ...remainingHours } = schedule[school];
        updatedSchedule[school] = remainingHours;
      }
    }

    setSchedule(updatedSchedule);
  };

  return (
    <div className="space-y-8">
      {/* Table selection and other controls */}
      <div className="flex justify-start items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-gray-700 dark:text-gray-200">:בחר טבלה</span>
          <div className="relative">
            <select
              value={currentTable}
              onChange={(e) => setCurrentTable(e.target.value)}
              className="appearance-none bg-indigo-50 dark:bg-indigo-900/50 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="table1">לקות שמיעה</option>
              <option value="table2">לקות למידה</option>
              <option value="table3">לקות ראייה</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 12l-4-4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg">
        <table className="w-full" dir="rtl">
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
                      onChange={(e) => setNewSchoolName(e.target.value)}
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
                      onChange={(e) => setNewHourLabel(e.target.value)}
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
        </table>
      </div>
    </div>
  );
};

export default BoardsScreen;
