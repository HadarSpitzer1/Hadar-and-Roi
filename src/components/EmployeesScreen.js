import React, { useState, useRef, useEffect } from 'react';

const EmployeesScreen = ({ employees, setEmployees }) => {
  const [newEmployee, setNewEmployee] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const itemsRef = useRef([]);

  const addEmployee = () => {
    if (newEmployee.trim()) {
      setEmployees([...employees, newEmployee.trim()]);
      setNewEmployee('');
    }
  };

  const removeEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
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
          {employees.map((employee, index) => {
            const isDragging = index === draggedIndex;

            return (
              <div
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                className={`flex justify-between items-center p-3 rounded-lg transition-transform duration-300 ${
                  isDragging
                    ? 'opacity-50'
                    : 'bg-indigo-50 dark:bg-indigo-900/50'
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

                <span className="text-gray-700 dark:text-gray-200">{employee}</span>
                
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployeesScreen;
