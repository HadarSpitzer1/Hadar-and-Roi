import React, { useState, useEffect } from "react";
import { useBoards } from "./Boards/BoardsContext";
import useSolveSchedule from "../hooks/useSolveSchedule";
import SmallTable from "./SmallTable";
import { useNavigate } from "react-router-dom";

const DEFAULT_COLORS = [
  "#FFCDD2", // Light Red
  "#F8BBD0", // Light Pink
  "#BBDEFB", // Light Blue
  "#C8E6C9", // Light Green
  "#FFF9C4", // Light Yellow
  "#D1C4E9", // Light Purple
  "#B3E5FC", // Light Cyan
  "#FFECB3", // Light Orange
];

const EmployeesScreen = ({ username, getAccessTokenSilently }) => {
  const {
    schedules,
    setSchedules,
    employees,
    setEmployees,
    currentTable,
    employeeData,
    setEmployeeData,
  } = useBoards();

  const [newEmployee, setNewEmployee] = useState("");
  const [expandedEmployee, setExpandedEmployee] = useState(null);

  const navigate = useNavigate();

  // Add color to each employee on server load
  useEffect(() => {
    if (employees.length > 0) {
      const updatedEmployeeData = { ...employeeData };

      employees.forEach((employee, index) => {
        if (!updatedEmployeeData[employee]) {
          updatedEmployeeData[employee] = {
            color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          };
        }
      });

      setEmployeeData(updatedEmployeeData);
    }
  }, [employees, employeeData, setEmployeeData]);

  const addEmployee = () => {
    if (newEmployee.trim()) {
      const defaultColor =
        DEFAULT_COLORS[(employees.length + 1) % DEFAULT_COLORS.length];
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee.trim()]);
      setEmployeeData((prevData) => ({
        ...prevData,
        [newEmployee.trim()]: { color: defaultColor },
      }));
      setNewEmployee("");
    }
  };

  const removeEmployee = (index) => {
    const removedEmployee = employees[index];
    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, i) => i !== index)
    );
    setEmployeeData((prevData) => {
      const newData = { ...prevData };
      delete newData[removedEmployee];
      return newData;
    });
  };

  const updateEmployeeColor = (employee, color) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [employee]: {
        ...prevData[employee],
        color,
      },
    }));
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
                className={`flex justify-between items-center p-3 rounded-lg transition-all cursor-pointer`}
                style={{
                  backgroundColor: employeeData[employee]?.color || "#ffffff",
                }}
                onClick={() =>
                  setExpandedEmployee((prev) => (prev === index ? null : index))
                }
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEmployee(index);
                  }}
                  className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                >
                  הסר
                </button>
                <span className="text-gray-700 dark:text-gray-200 hover:underline">
                  {employee}
                </span>
                <input
                  type="color"
                  value={employeeData[employee]?.color || DEFAULT_COLORS[0]}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateEmployeeColor(employee, e.target.value);
                  }}
                  className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 shadow"
                  title={`בחר צבע עבור ${employee}`}
                />
              </div>

              {expandedEmployee === index && (
                <div
                  className="mt-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-inner transition-all"
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
            onClick={() => console.log("Solve!")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Solve
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesScreen;
