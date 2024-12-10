import React, { useState } from "react";
import { useBoards } from "./Boards/BoardsContext";
import useSolveSchedule from "../hooks/useSolveSchedule";
import SmallTable from "./SmallTable";
import { useNavigate } from "react-router-dom";

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
  const [schedule, setSchedule] = useState({});

  const navigate = useNavigate(); // Hook for navigation

  // Get the schools and hours from the current table in schedules
  const schools = schedules[currentTable]?.schools || [];
  const hours = schedules[currentTable]?.hours || [];

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
    employeeData,
    schools,
    hours,
    currentTable,
    schedules,
    setSchedules,
    setSchedule,
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
  const employeeColors = [
    "bg-red-100",       // Soft red
    "bg-orange-100",    // Soft orange
    "bg-yellow-100",    // Soft yellow
    "bg-green-100",     // Soft green
    "bg-teal-100",      // Soft teal
    "bg-cyan-100",      // Soft cyan
    "bg-sky-100",       // Soft sky blue
    "bg-blue-100",      // Soft blue
    "bg-indigo-100",    // Soft indigo
    "bg-violet-100",    // Soft violet
    "bg-purple-100",    // Soft purple
    "bg-fuchsia-100",   // Soft fuchsia
    "bg-pink-100",      // Soft pink
    "bg-rose-100",      // Soft rose
  ];

// Function to get a consistent color based on employee name
  const getEmployeeColor = (name) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return employeeColors[hash % employeeColors.length];
  };

  return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
                onClick={addEmployee}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              הוסף עובד
            </button>
            <input
                type="text"
                value={newEmployee}
                onChange={(e) => setNewEmployee(e.target.value)}
                placeholder="...שם העובד החדש"
                className="flex-1 p-2 border border-indigo-200 dark:border-indigo-800 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
            />
          </div>
          <div className="space-y-4">
            {employees.map((employee, index) => (
                <div key={index}>
                  <div
                      className={`flex justify-between items-center p-3 rounded-lg transition-all ${getEmployeeColor(employee)}`}
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
        <div className="flex justify-center mt-6">
          <div className="text-center">
            <button
                onClick={handleSolve}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {solving ? "Solving..." : "Solve"}
            </button>
            {solveError && <div className="text-red-500 mt-2">{solveError}</div>}
          </div>
        </div>
      </div>
  );
};

export default EmployeesScreen;