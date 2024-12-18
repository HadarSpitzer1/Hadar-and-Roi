export const addEmployee = (newEmployee, setEmployees, setNewEmployee) => {
    if (newEmployee.trim()) {
        setEmployees((prevEmployees) => [...prevEmployees, newEmployee.trim()]);
        setNewEmployee("");
    }
};

export const removeEmployee = (index, setEmployees) => {
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
