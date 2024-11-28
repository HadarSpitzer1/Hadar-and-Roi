import React, { useState } from "react";
import { fetchUserData, saveUserData } from "../../api";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";

const BoardsScreen = ({ username, getAccessTokenSilently }) => {
  const [currentTable, setCurrentTable] = useState(null);
  const [schedules, setSchedules] = useState({});
  const [employees, setEmployees] = useState([]);
  const [schools, setSchools] = useState([]);
  const [hours, setHours] = useState([]);
  const [schedule, setSchedule] = useState({});
  const [conflicts, setConflicts] = useState({});
  const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [editingHourIndex, setEditingHourIndex] = useState(null);
  const [newHourLabel, setNewHourLabel] = useState("");
  const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      } else {
        setSchedules({});
        setEmployees([]);
        setSchools([]);
        setHours([]);
        setSchedule({});
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const addNewTable = async () => {
    try {
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

      await saveUserData(username, updatedSchedules, employees, getAccessTokenSilently);
      alert(`Table "${newTableKey}" created successfully!`);
    } catch (err) {
      console.error("Error adding new table:", err);
      alert("Failed to create new table. Please try again.");
    }
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
    const oldSchoolName = schools[index];
    const newSchoolNameTrimmed = newSchoolName.trim() || oldSchoolName;

    updatedSchools[index] = newSchoolNameTrimmed;
    setSchools(updatedSchools);
    setEditingSchoolIndex(null);
    setNewSchoolName("");

    const updatedSchedule = { ...schedule };
    updatedSchedule[newSchoolNameTrimmed] = updatedSchedule[oldSchoolName];
    delete updatedSchedule[oldSchoolName];
    setSchedule(updatedSchedule);

    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [currentTable]: {
        ...prevSchedules[currentTable],
        schools: updatedSchools,
        schedule: updatedSchedule,
      },
    }));
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
    updatedHours[index] = newHourLabel.trim() || hours[index];
    setHours(updatedHours);
    setEditingHourIndex(null);
    setNewHourLabel("");

    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [currentTable]: {
        ...prevSchedules[currentTable],
        hours: updatedHours,
      },
    }));
  };

  const handleAddSchool = () => {
    const newSchoolName = `School ${schools.length + 1}`;
    setSchools([...schools, newSchoolName]);

    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [currentTable]: {
        ...prevSchedules[currentTable],
        schools: [...schools, newSchoolName],
      },
    }));
  };

  const handleAddHour = () => {
    const newHourLabel = `Hour ${hours.length + 1}`;
    setHours([...hours, newHourLabel]);

    setSchedules((prevSchedules) => ({
      ...prevSchedules,
      [currentTable]: {
        ...prevSchedules[currentTable],
        hours: [...hours, newHourLabel],
      },
    }));
  };

  return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <button
              onClick={loadTables}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600"
          >
            Load Tables
          </button>

          <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          >
            Save to Cloud
          </button>

          <select
              value={currentTable || ""}
              onChange={(e) => handleTableSwitch(e.target.value)}
              className="px-4 py-2 bg-gray-100 border rounded"
          >
            {Object.keys(schedules).map((tableKey) => (
                <option key={tableKey} value={tableKey}>
                  {tableKey}
                </option>
            ))}
          </select>

          <button
              onClick={addNewTable}
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          >
            Add New Table
          </button>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}

        {!loading && (
            <div>
              <h2 className="text-xl font-bold">Table Editor</h2>
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
                      handleDeleteSchool={() => {}}
                      hoveredSchoolIndex={hoveredSchoolIndex}
                      setHoveredSchoolIndex={setHoveredSchoolIndex}
                  />
                  <TableBody
                      hours={hours}
                      schools={schools}
                      schedule={schedule}
                      conflicts={conflicts}
                      employees={employees}
                      editingHourIndex={editingHourIndex}
                      newHourLabel={newHourLabel}
                      handleEditHour={handleEditHour}
                      handleHourLabelChange={handleHourLabelChange}
                      handleHourLabelSave={handleHourLabelSave}
                      handleDeleteHour={() => {}}
                      hoveredHourIndex={hoveredHourIndex}
                      setHoveredHourIndex={setHoveredHourIndex}
                      handleTeacherSelect={() => {}}
                      handleAddHour={handleAddHour}
                  />
                </table>
              </div>
            </div>
        )}
      </div>
  );
};

export default BoardsScreen;
