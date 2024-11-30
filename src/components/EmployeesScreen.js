import React, { useState, useRef } from "react";
import { useBoards } from "./Boards/BoardsContext"; // Use context for shared state
import { saveUserData } from "../api";

const EmployeesScreen = ({ username, getAccessTokenSilently }) => {
  const { employees, setEmployees } = useBoards(); // Access employees from context
  const [newEmployee, setNewEmployee] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsRef = useRef([]);

  // Save employees to the server
  const saveEmployees = async () => {
    try {
      if (!getAccessTokenSilently) {
        throw new Error("Authentication function not provided.");
      }

      const token = await getAccessTokenSilently();
      await saveUserData(username, {}, employees, () => token); // Save employees to backend
      alert("Employees saved successfully!");
    } catch (err) {
      console.error("Error saving employees:", err);
      alert("Failed to save employees. Please try again.");
    }
  };

  const addEmployee = () => {
    if (newEmployee.trim()) {
      setEmployees((prevEmployees) => [...prevEmployees, newEmployee.trim()]);
      setNewEmployee("");
    }
  };

  const removeEmployee = (index) => {
    setEmployees((prevEmployees) =>
      prevEmployees.filter((_, i) => i !== index)
    );
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    setOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex === null || overIndex === null) return;

    const updatedEmployees = [...employees];
    const [removed] = updatedEmployees.splice(draggedIndex, 1);
    updatedEmployees.splice(overIndex, 0, removed);
    setEmployees(updatedEmployees);

    setDraggedIndex(null);
    setOverIndex(null);
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Error Message */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Input and Add Employee Button */}
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
        </div>

        {/* Employees List */}
        <div className="space-y-4">
          {loading && <div>Loading...</div>}
          {!loading &&
            employees.map((employee, index) => {
              const isDragging = index === draggedIndex;

              return (
                <div
                  key={index}
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={`flex justify-between items-center p-3 rounded-lg transition-transform duration-300 ${
                    isDragging
                      ? "opacity-50"
                      : "bg-indigo-50 dark:bg-indigo-900/50"
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <button
                    onClick={() => removeEmployee(index)}
                    className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                  >
                    הסר
                  </button>

                  <span className="text-gray-700 dark:text-gray-200">
                    {employee}
                  </span>
                </div>
              );
            })}
        </div>

        {/* Save Employees Button */}
        <div className="text-center">
          <button
            onClick={saveEmployees}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            שמור עובדים לענן
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeesScreen;
