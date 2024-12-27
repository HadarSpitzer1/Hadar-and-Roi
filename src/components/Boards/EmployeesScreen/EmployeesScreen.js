import React, { useState } from "react";
import { useBoards } from "../BoardsContext";
import useSolveAndExport from "../../../hooks/SolveAndExport";
import SmallTable from "../../SmallTable";
import { useNavigate } from "react-router-dom";
import {
  addEmployee,
  removeEmployee,
  toggleExpandEmployee,
  getEmployeeColor,
} from "./EmployeeActions";

const EmployeesScreen = ({username, getAccessTokenSilently }) => {
  const {
    schedules,
    setSchedules,
    employees,
    setEmployees,
    managers,
    setManagers,
    currentTable,
    employeeData,
  } = useBoards();

  const [newEmployee, setNewEmployee] = useState("");
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [promotedEmployees, setPromotedEmployees] = useState([]); // Fix: State for promoted employees


  const schools = schedules[currentTable]?.schools || [];
  const hours = schedules[currentTable]?.hours || [];
  const handleAddEmployee = () => {
    addEmployee(username, newEmployee, setEmployees, setNewEmployee, currentTable,getAccessTokenSilently);
  };

  const handlePromoteToManager = (employee) => {
    if (managers.includes(employee)) {
      // If already a manager, remove from managers and promotedEmployees
      setManagers(managers.filter((manager) => manager !== employee));
      setPromotedEmployees(promotedEmployees.filter((promoted) => promoted !== employee));
    } else {
      // Otherwise, promote the employee
      setManagers([...managers, employee]);
      setPromotedEmployees([...promotedEmployees, employee]);
    }
  };


  const { handleSolve, loading: solving, error: solveError } = useSolveAndExport({
    employees,
    employeeData,
    schools,
    hours,
    currentTable,
    schedules,
    setSchedules,
    setSchedule,
    managers,
  });

  return (
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div className="flex gap-4">
            <button
                onClick={handleAddEmployee}
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
                      className={`flex justify-between items-center p-3 rounded-lg transition-all ${getEmployeeColor(
                          employee
                      )}`}
                  >
                    <div className="flex gap-2">
                      <button
                          onClick={() => removeEmployee(index, setEmployees)}
                          className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                      >
                        הסר
                      </button>
                      <button
                          onClick={() => handlePromoteToManager(employee)}
                          className={`px-3 py-1 text-white rounded-lg transition-colors ${
                              promotedEmployees.includes(employee)
                                  ? "bg-green-500 hover:bg-green-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                          }`}
                      >
                        אחמ״ש
                      </button>
                    </div>
                    <span
                        className="cursor-pointer text-gray-700 dark:text-gray-200 hover:underline"
                        onClick={() => toggleExpandEmployee(index, setExpandedEmployee)}
                    >
    {employee}
  </span>
                  </div>


                  {expandedEmployee === index && (
                      <div
                          className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-inner transition-all"
                          style={{ overflow: "hidden" }}
                      >
                        <SmallTable employeeName={employee} />
                      </div>
                  )}
                </div>
            ))}
          </div>
          <div className="mt-4" dir="rtl">
            <h3 className="text-lg rounded-lg font-bold text-gray-800 dark:text-gray-200">
              אחמ״שים
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-200">
              {managers.map((manager, index) => (
                  <li key={index}>{manager}</li>
              ))}
            </ul>
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
