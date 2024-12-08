import React, { useState } from "react";
import { useBoards } from "./Boards/BoardsContext";
import useSolveSchedule from "../hooks/useSolveSchedule";
import SmallTable from "./SmallTable";

const EmployeesScreen = ({ username, getAccessTokenSilently }) => {
  const {
    schedules,
    setSchedules,
    employees,
    setEmployees,
    currentTable,
    employeeData,
  } = useBoards();

  const [newEmployee, setNewEmployee] = useState("");
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [schedule, setSchedule] = useState({}); // Add state to store the schedule

  const calculateConstraints = () => {
    const unavailable_constraints = {};

    employees.forEach((employee) => {
      const markedCells = employeeData[employee] || {};
      unavailable_constraints[employee] = Object.keys(markedCells)
          .filter((key) => markedCells[key])
          .map((key) => parseInt(key, 10));
    });

    return unavailable_constraints;
  };

  const { handleSolve, loading: solving, error: solveError } = useSolveSchedule({
    employees,
    calculateConstraints,
    schools: [],
    hours: [],
    currentTable,
    schedules,
    setSchedules,
    setSchedule, // Pass setSchedule to update the local state
  });

  const addEmployee = () => {
    if (newEmployee.trim()) {
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee.trim()]);
      setNewEmployee("");
    }
  };

  const removeEmployee = (index) => {
    setEmployees((prevEmployees) => prevEmployees.filter((_, i) => i !== index));
  };

  const toggleExpandEmployee = (index) => {
    setExpandedEmployee((prev) => (prev === index ? null : index));
  };
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={newEmployee}
            onChange={(e) => setNewEmployee(e.target.value)}
            placeholder="שם העובד החדש"
            className="flex-1 p-2 border border-indigo-200 dark:border-indigo-800 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          />
          <button
            onClick={addEmployee}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            הוסף עובד
          </button>
          <button
              onClick={handleSolve}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {solving ? "Solving..." : "Solve"}
          </button>
          {solveError && <div className="text-red-500">{solveError}</div>}

        </div>
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <div key={index}>
              {/* Employee Row */}
              <div
                className={`flex justify-between items-center p-3 rounded-lg transition-all ${
                  expandedEmployee === index
                    ? "bg-indigo-100 dark:bg-indigo-800"
                    : "bg-indigo-50 dark:bg-indigo-900/50"
                }`}
              >
                <button
                  onClick={() => removeEmployee(index)}
                  className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  הסר
                </button>
                <span
                  className="cursor-pointer text-gray-700 dark:text-gray-200 hover:underline"
                  onClick={() => toggleExpandEmployee(index)}
                >
                  {employee}
                </span>
              </div>

              {/* Expanded Table */}
              {expandedEmployee === index && (
                <div
                  className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-inner transition-all"
                  style={{
                    maxHeight: "300px",
                    overflow: "hidden",
                  }}
                >
                <SmallTable employeeName={employee} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeesScreen;
