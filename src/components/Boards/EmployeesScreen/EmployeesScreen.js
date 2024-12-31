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
    addManager,
    removeManager,
    currentTable,
    employeeData,
  } = useBoards();

  const [newEmployee, setNewEmployee] = useState("");
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [schedule, setSchedule] = useState({});
  const [promotedEmployees, setPromotedEmployees] = useState([]); // Fix: State for promoted employees


  const schools = schedules[currentTable]?.schools || [];
  const slots = schedules[currentTable]?.slots || [];
  const handleAddEmployee = () => {
    addEmployee(username, newEmployee, setEmployees, setNewEmployee, currentTable,getAccessTokenSilently);
  };

  const handlePromoteToManager = (employee) => {
    if (managers.includes(employee)) {
      // Remove from managers
      removeManager(employee);
      setPromotedEmployees((prev) => prev.filter((promoted) => promoted !== employee));
    } else {
      // Add to managers
      addManager(employee);
      setPromotedEmployees((prev) => [...prev, employee]);
    }
  };



  const { handleSolve, loading: solving, error: solveError } = useSolveAndExport({
    employees,
    employeeData,
    schools,
    slots,
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
                className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
               <span className="relative flex items-center">
                 <svg 
                   className="w-4 h-4 mr-2"
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor"
                 >
                   <path 
                     strokeLinecap="round" 
                     strokeLinejoin="round" 
                     strokeWidth={2} 
                     d="M12 4v16m8-8H4" 
                   />
                 </svg>
                 הוסף עובד
               </span>
               <div className="absolute inset-0 rounded-lg overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
               </div>
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
                          className="group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg shadow-md hover:from-rose-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        <span className="relative flex items-center">
                          <svg 
                            className="w-3 h-3 mr-1"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          הסר
                        </span>
                      </button>
                      <button
                          onClick={() => handlePromoteToManager(employee)}
                          className={`group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              managers.includes(employee)
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500"
                                  : "bg-gradient-to-r from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700 focus:ring-gray-500"
                          }`}
                      >
                        <span className="relative flex items-center">
                          <svg 
                            className="w-3 h-3 mr-1"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          אחמ״ש
                        </span>
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
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow-inner transition-all">
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
                className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
            >
               <span className="relative flex items-center">
                 {solving ? (
                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                   </svg>
                 ) : (
                   <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                 )}
                  {solving ? "...מחשב" : "פתור"}
               </span>
               <div className="absolute inset-0 rounded-lg overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
               </div>
            </button>
            {solveError && <div className="text-red-500 mt-2">{solveError}</div>}
          </div>
        </div>
      </div>
  );
};
export default EmployeesScreen;