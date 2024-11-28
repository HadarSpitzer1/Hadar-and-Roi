import React, { useEffect, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import mockDatabase from "../../data/mockDatabase";

const BoardsScreen = ({
  currentTable,
  setCurrentTable,
  schedule,
  setSchedule,
  employees,
}) => {
  // Initialize schools and hours based on the passed schedule or default mockDatabase
  const [schools, setSchools] = useState(() => {
    return schedule?.schools || [...mockDatabase[currentTable].schools];
  });

  const [hours, setHours] = useState(() => {
    return schedule?.hours || [...mockDatabase[currentTable].hours];
  });

  // Update schools and hours when the table changes
  useEffect(() => {
    setSchools(schedule?.schools || [...mockDatabase[currentTable].schools]);
    setHours(schedule?.hours || [...mockDatabase[currentTable].hours]);
  }, [currentTable, schedule]);

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
  const [newSchoolName, setNewSchoolName] = useState("");
  const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);

  const handleEditSchool = (index) => {
    setEditingSchoolIndex(index);
    setNewSchoolName(schools[index]);
  };

  const handleSchoolNameChange = (value) => {
    setNewSchoolName(value);
  };

  const handleSchoolNameSave = (index) => {
    const updatedSchools = [...schools];
    updatedSchools[index] = newSchoolName.trim() || schools[index];
    setSchools(updatedSchools);
    setEditingSchoolIndex(null);
    setNewSchoolName("");
  };

  // Editing state and handlers for hours
  const [editingHourIndex, setEditingHourIndex] = useState(null);
  const [newHourLabel, setNewHourLabel] = useState("");
  const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

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
  };

  // Functions for adding and deleting schools/hours
  const handleAddSchool = () => {
    const newSchoolName = `בית ספר ${schools.length + 1}`;
    setSchools([...schools, newSchoolName]);
  };

  const handleDeleteSchool = (index) => {
    const updatedSchools = schools.filter((_, i) => i !== index);
    setSchools(updatedSchools);

    // Also remove related entries from the schedule
    const updatedSchedule = { ...schedule };
    const schoolToRemove = schools[index];
    delete updatedSchedule[schoolToRemove];
    setSchedule(updatedSchedule);
  };

  const handleAddHour = () => {
    const newHourLabel = `שעה ${hours.length + 1}`;
    setHours([...hours, newHourLabel]);
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
            handleDeleteHour={handleDeleteHour}
            hoveredHourIndex={hoveredHourIndex}
            setHoveredHourIndex={setHoveredHourIndex}
            handleTeacherSelect={handleTeacherSelect}
            handleAddHour={handleAddHour}
          />
        </table>
      </div>
    </div>
  );
};

export default BoardsScreen;
