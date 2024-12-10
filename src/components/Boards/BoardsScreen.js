import React, { useEffect, useState } from "react";
import { useBoards } from "./BoardsContext";
import useSolveSchedule from "../../hooks/useSolveSchedule";
import {FaSyncAlt, FaSave, FaPlus, FaPen, FaTrash, FaFilePdf, FaFileExcel} from "react-icons/fa";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { fetchUserData, saveUserData } from "../../api";
import * as XLSX from "xlsx";

const BoardsScreen = ({ username, getAccessTokenSilently }) => {
  const {
    schedules,
    setSchedules,
    employees,
    setEmployees,
    currentTable,
    setCurrentTable,
    employeeData,
  } = useBoards();

  const [schools, setSchools] = useState([]);
  const [hours, setHours] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);
  const [editingHourIndex, setEditingHourIndex] = useState(null);
  const [newHourLabel, setNewHourLabel] = useState("");
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

  useEffect(() => {
    if (currentTable && schedules[currentTable]) {
      const tableData = schedules[currentTable];
      setSchools(tableData.schools || []);
      setHours(tableData.hours || []);
      setSchedule(tableData.schedule || {});
    }
  }, [currentTable, schedules]);

  const calculateConstraints = () => {
    const unavailable_constraints = {};

    employees.forEach((employee) => {
      const markedCells = employeeData[employee] || {};
      const filteredKeys = Object.keys(markedCells)
        .filter((key) => markedCells[key] === true) // Only include true (X marked)
        .map((key) => parseInt(key, 10)) // Convert to integers
        .filter((key) => !isNaN(key)); // Ensure valid integers only

      if (filteredKeys.length > 0) {
        unavailable_constraints[employee] = filteredKeys;
      }
    });

    return unavailable_constraints;
  };
  
  const calculatePreferNotToConstraints = () => {
    const preferNotToConstraints = {};
  
    employees.forEach((employee) => {
      const markedCells = employeeData[employee] || {};
      const filteredKeys = Object.keys(markedCells)
        .filter((key) => markedCells[key] === "-") // Only include "-" (prefer not to)
        .map((key) => parseInt(key, 10)) // Convert to integers
        .filter((key) => !isNaN(key)); // Ensure valid integers only
  
      if (filteredKeys.length > 0) {
        preferNotToConstraints[employee] = filteredKeys;
      }
    });
  
    return preferNotToConstraints;
  };



  const { handleSolve, loading: solving, error: solveError } = useSolveSchedule({
    employees,
    employeeData, // Pass employeeData here
    calculateConstraints,
    schools,
    hours,
    currentTable,
    schedules,
    setSchedules,
    setSchedule,
  });
  const loadTables = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchUserData(username, getAccessTokenSilently);
      if (data) {
        setSchedules(data.tables || {});
        setEmployees(data.employees || []);
        const tableKeys = Object.keys(data.tables || {});
        if (tableKeys.length > 0) {
          const firstTableKey = tableKeys[0];
          setCurrentTable(firstTableKey);

          const initialTable = data.tables[firstTableKey] || {};
          setSchools(initialTable.schools || []);
          setHours(initialTable.hours || []);
          setSchedule(initialTable.schedule || {});
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  const handleTeacherSelect = (school, hour, teacher) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[school]) {
      newSchedule[school] = {};
    }
    newSchedule[school][hour] = teacher || undefined;

    setSchedule(newSchedule);

    const updatedSchedules = {
      ...schedules,
      [currentTable]: {
        ...schedules[currentTable],
        schedule: newSchedule,
      },
    };

    setSchedules(updatedSchedules);
  };

  const handleSave = async () => {
    try {
      await saveUserData(username, schedules, employees, getAccessTokenSilently);
      alert("Data saved successfully!");
    } catch (err) {
      console.error("Error saving data:", err);
      alert("Failed to save data. Please try again.");
    }
  };

  const addNewTable = () => {
    const newTableKey = `table${Object.keys(schedules).length + 1}`;
    const newTable = {
      schools: [`School ${Object.keys(schedules).length + 1}`],
      hours: ["Hour 1", "Hour 2"],
      schedule: {},
    };

    const updatedSchedules = { ...schedules, [newTableKey]: newTable };
    setSchedules(updatedSchedules);
    setCurrentTable(newTableKey);
    setSchools(newTable.schools);
    setHours(newTable.hours);
    setSchedule(newTable.schedule);
  };

  const deleteCurrentTable = () => {
    if (!currentTable) {
      alert("No table selected to delete!");
      return;
    }

    if (window.confirm(`Are you sure you want to delete the table "${currentTable}"?`)) {
      const updatedSchedules = { ...schedules };
      delete updatedSchedules[currentTable];

      setSchedules(updatedSchedules);

      const remainingTables = Object.keys(updatedSchedules);
      setCurrentTable(remainingTables.length > 0 ? remainingTables[0] : null);

      if (remainingTables.length > 0) {
        const newCurrentTable = updatedSchedules[remainingTables[0]];
        setSchools(newCurrentTable.schools || []);
        setHours(newCurrentTable.hours || []);
        setSchedule(newCurrentTable.schedule || {});
      } else {
        setSchools([]);
        setHours([]);
        setSchedule({});
      }
    }
  };

  const handleRenameTable = () => {
    if (!newTableName.trim()) {
      alert("Table name cannot be empty!");
      return;
    }

    if (schedules[newTableName]) {
      alert("A table with this name already exists!");
      return;
    }

    const updatedSchedules = { ...schedules };
    const tableData = updatedSchedules[currentTable];

    delete updatedSchedules[currentTable];
    updatedSchedules[newTableName] = tableData;

    setSchedules(updatedSchedules);
    setCurrentTable(newTableName);
    setIsRenaming(false);
    setNewTableName("");
  };

  const handleTableSwitch = (tableKey) => {
    setCurrentTable(tableKey);

    const tableData = schedules[tableKey] || {};
    setSchools(tableData.schools || []);
    setHours(tableData.hours || []);
    setSchedule(tableData.schedule || {});
  };

  const handleEditSchool = (index) => {
    setEditingSchoolIndex(index);
    setNewSchoolName(schools[index]);
  };

  const handleSchoolNameChange = (value) => {
    setNewSchoolName(value);
  };

  const handleSchoolNameSave = (index) => {
    const updatedSchools = [...schools];
    updatedSchools[index] = newSchoolName;
    setSchools(updatedSchools);

    const updatedSchedules = {
      ...schedules,
      [currentTable]: {
        ...schedules[currentTable],
        schools: updatedSchools,
      },
    };
    setSchedules(updatedSchedules);

    setEditingSchoolIndex(null);
    setNewSchoolName("");
  };

  const handleDeleteSchool = (index) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
      const updatedSchools = schools.filter((_, i) => i !== index);

      const { [schools[index]]: _, ...updatedSchedule } = schedule;

      setSchools(updatedSchools);
      setSchedule(updatedSchedule);

      const updatedSchedules = {
        ...schedules,
        [currentTable]: {
          ...schedules[currentTable],
          schools: updatedSchools,
          schedule: updatedSchedule,
        },
      };
      setSchedules(updatedSchedules);
    }
  };

  const handleAddSchool = () => {
    const newSchoolName = `עמודה ${schools.length + 1}`;
    const updatedSchools = [...schools, newSchoolName];
    setSchools(updatedSchools);

    const updatedSchedules = {
      ...schedules,
      [currentTable]: {
        ...schedules[currentTable],
        schools: updatedSchools,
      },
    };
    setSchedules(updatedSchedules);
  };

  const handleAddHour = () => {
    const newHourName = `Hour ${hours.length + 1}`;
    const updatedHours = [...hours, newHourName];
    setHours(updatedHours);

    const updatedSchedules = {
      ...schedules,
      [currentTable]: {
        ...schedules[currentTable],
        hours: updatedHours,
      },
    };
    setSchedules(updatedSchedules);
  };

  const handleEditHour = (index) => {
    setEditingHourIndex(index);
    setNewHourLabel(hours[index]);
  };

  const handleHourLabelChange = (value) => {
    setNewHourLabel(value);
  };

  const handleHourLabelSave = (index) => {
    const updatedHours = [...hours];
    updatedHours[index] = newHourLabel;
    setHours(updatedHours);

    const updatedSchedules = {
      ...schedules,
      [currentTable]: {
        ...schedules[currentTable],
        hours: updatedHours,
      },
    };
    setSchedules(updatedSchedules);

    setEditingHourIndex(null);
    setNewHourLabel("");
  };

  const handleDeleteHour = (index) => {
    if (window.confirm("Are you sure you want to delete this hour?")) {
      const updatedHours = hours.filter((_, i) => i !== index);

      // Remove the hour from the schedule for each school
      const updatedSchedule = { ...schedule };
      schools.forEach(school => {
        if (updatedSchedule[school]) {
          delete updatedSchedule[school][hours[index]];
        }
      });

      setHours(updatedHours);
      setSchedule(updatedSchedule);

      const updatedSchedules = {
        ...schedules,
        [currentTable]: {
          ...schedules[currentTable],
          hours: updatedHours,
          schedule: updatedSchedule,
        },
      };
      setSchedules(updatedSchedules);
    }
  };
  // Export to Excel function
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    const tableData = [];
  
    // Add the first row with hours
    tableData.push([" ", ...schools]);
  
    // Build each row based on hours
    for (const hour of hours) {
      const row = [hour];
      for (const school of schools) {
        row.push(schedule[school]?.[hour] || "");
      }
      tableData.push(row);
    }
  
    const worksheet = XLSX.utils.aoa_to_sheet(tableData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
    XLSX.writeFile(workbook, "schedule.xlsx");
  };
  
  return (
      <div className="space-y-8">
        <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <button
                  onClick={loadTables}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                  title="Refresh"
              >
                <FaSyncAlt />
              </button>
              <button
                  onClick={handleSave}
                  className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                  title="Save"
              >
                <FaSave />
              </button>
            </div>
          <select
              value={currentTable || ""}
              onChange={(e) => handleTableSwitch(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border dark:border-gray-600 rounded-lg shadow-md"
          >
            {Object.keys(schedules).map((tableKey) => (
                <option key={tableKey} value={tableKey}>
                  {tableKey}
                </option>
            ))}
          </select>
          <div className="flex items-center space-x-4">
            <button
                onClick={addNewTable}
                className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                title="Add New Table"
            >
              <FaPlus />
            </button>
            <button
                onClick={() => setIsRenaming(true)}
                className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                title="Rename Table"
            >
              <FaPen />
            </button>
            <button
                onClick={deleteCurrentTable}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="Delete Table"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && Object.keys(schedules).length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No tables available. Click "Add New Table" to create one.
            </div>
        )}
        {!loading && Object.keys(schedules).length > 0 && (
            <div>
              <div className="overflow-x-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg">
                <table className="w-full" dir="rtl">
                  <TableHeader
                      schools={schools}
                      editingSchoolIndex={editingSchoolIndex}
                      newSchoolName={newSchoolName}
                      handleEditSchool={handleEditSchool}
                      handleSchoolNameChange={handleSchoolNameChange}
                      handleSchoolNameSave={handleSchoolNameSave}
                      handleAddSchool={handleAddSchool}
                      handleDeleteSchool={handleDeleteSchool}
                      hoveredSchoolIndex={hoveredSchoolIndex}
                      setHoveredSchoolIndex={setHoveredSchoolIndex}
                      hoveredHourIndex = {hoveredHourIndex}
                      setHoveredHourIndex = {setHoveredHourIndex}
                      handleAddRow={handleAddHour} // Add this line
                  />
                  <TableBody
                      hours={hours}
                      schools={schools}
                      schedule={schedule}
                      conflicts={{}}
                      employees={employees}
                      handleTeacherSelect={handleTeacherSelect}
                      handleAddHour={handleAddHour}
                      editingHourIndex={editingHourIndex}
                      newHourLabel={newHourLabel}
                      handleEditHour={handleEditHour}
                      employeeData={employeeData} // Pass employeeData here
                      handleHourLabelChange={handleHourLabelChange}
                      handleHourLabelSave={handleHourLabelSave}
                      handleDeleteHour={handleDeleteHour}
                      hoveredHourIndex={hoveredHourIndex}
                      setHoveredHourIndex={setHoveredHourIndex}
                  />
                </table>
              </div>
            </div>
        )}

        {isRenaming && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
                <h2 className="text-lg font-bold dark:text-gray-100">Rename Table</h2>
                <input
                    type="text"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-white"
                    placeholder="Enter new table name"
                />
                <div className="flex space-x-4">
                  <button
                      onClick={handleRenameTable}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                  <button
                      onClick={() => setIsRenaming(false)}
                      className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
        )}
        <div className="flex justify-center mt-6">
          <div className="text-center">
            <button
                onClick={handleSolve}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {solving ? "Solving..." : "Solve"}
            </button>
            {solveError && <div className="text-red-500 mt-2">{solveError}</div>}
            <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mt-4 ml-4"
            >
              <FaFileExcel className="inline-block mr-2" /> Export to Excel
            </button>
          </div>
        </div>
      </div>
  );
};

export default BoardsScreen;