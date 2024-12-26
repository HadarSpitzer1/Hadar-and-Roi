import axios from "axios";
import {createEmployeeData} from "../../../api";
const API_URL = "https://ts1vtu17l7.execute-api.us-east-1.amazonaws.com/api-gateway-stage1";
export const addEmployee = async (rootUsername, newEmployee, setEmployees, setNewEmployee, tableName, getAccessTokenSilently) => {
    try {
        const savedEmployee = await createEmployeeData(rootUsername, newEmployee, tableName, getAccessTokenSilently);
        console.log(savedEmployee.employeeCode);
        setEmployees((prevEmployees) => [...prevEmployees, savedEmployee.name]);
        setNewEmployee("");

        console.log("Employee added successfully:", savedEmployee);
    } catch (error) {
        console.error("Failed to add employee:", error);
        alert("Failed to add employee. Please try again.");
    }
};export const removeEmployee = (index, setEmployees) => {
    setEmployees((prevEmployees) => prevEmployees.filter((_, i) => i !== index));
};

export const toggleExpandEmployee = (index, setExpandedEmployee) => {
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
export const getEmployeeColor = (name) => {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return employeeColors[hash % employeeColors.length];
};
