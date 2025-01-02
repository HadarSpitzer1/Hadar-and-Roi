import { fetchUserData, saveUserData } from "../../../../api";

export const loadTables = async (
    setLoading,
    setError,
    setSchedules,
    setEmployees,
    setCurrentTable,
    setSchools,
    setSlots,
    setSchedule,
    setEmployeeData,
    username,
    getAccessTokenSilently
) => {
    try {
        setLoading(true);
        setError(null);
        const data = await fetchUserData(username, getAccessTokenSilently);
        if (data) {
            // Convert old slot format to new format if needed
            const convertedTables = Object.entries(data.tables || {}).reduce((acc, [key, table]) => {
                // Check if slots is an array of strings (old format)
                const isOldFormat = Array.isArray(table.slots) && 
                    (table.slots.length === 0 || typeof table.slots[0] === 'string');

                const convertedSlots = isOldFormat ? [
                    {
                        shift: "משמרת 1",
                        slots: table.slots || []
                    }
                ] : table.slots;

                acc[key] = {
                    ...table,
                    slots: convertedSlots
                };
                return acc;
            }, {});

            setSchedules(convertedTables);
            setEmployees(data.employees || []);
            setEmployeeData(data.employeeData || {});

            const tableKeys = Object.keys(convertedTables);
            if (tableKeys.length > 0) {
                const firstTableKey = tableKeys[0];
                setCurrentTable(firstTableKey);

                const initialTable = convertedTables[firstTableKey];
                setSchools(initialTable.schools || []);
                setSlots(initialTable.slots || [{
                    shift: "משמרת 1",
                    slots: ["תא 1"]
                }]);
                setSchedule(initialTable.schedule || {});
            }
        }
    } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load data. Please try again.");
    } finally {
        setLoading(false);
    }
};

export const handleSave = async (username, schedules, employees, getAccessTokenSilently, employeeData) => {
    try {
        await saveUserData(username, schedules, employees, getAccessTokenSilently,employeeData);
    } catch (err) {
        console.error("Error saving data:", err);
    }
};
export const addNewTable = (schedules, setSchedules, setCurrentTable, setSchools, setSlots, setSchedule) => {
    const newTableKey = `טבלה ${Object.keys(schedules).length + 1}`;
    const newTable = {
        schools: [`עמודה 1`],
        slots: [{
            shift: "משמרת 1",
            slots: ["תא 1"]
        }],
        schedule: {},
    };

    const updatedSchedules = { ...schedules, [newTableKey]: newTable };
    setSchedules(updatedSchedules);
    setCurrentTable(newTableKey);
    setSchools([...newTable.schools]);
    setSlots([...newTable.slots]);
    setSchedule({...newTable.schedule});
};

export const deleteCurrentTable = (currentTable, schedules, setSchedules, setCurrentTable, setSchools, setSlots, setSchedule) => {
    if (!currentTable) {
        return;
    }

    if (window.confirm(`Are you sure you want to delete the table "${currentTable}"?`)) {
        const updatedSchedules = { ...schedules };
        delete updatedSchedules[currentTable];

        setSchedules(updatedSchedules);

        const remainingTables = Object.keys(updatedSchedules);
        setCurrentTable(remainingTables.length > 0 ? remainingTables[0] : null);

        if (remainingTables.length > 0) {
            const newCurrentTable = updatedSchedules[remainingTables[0]];
            setSchools(newCurrentTable.schools || []);
            setSlots(newCurrentTable.slots || []);
            setSchedule(newCurrentTable.schedule || {});
        } else {
            setSchools([]);
            setSlots([]);
            setSchedule({});
        }
    }
};
export const handleRenameTable = (newTableName, currentTable, schedules, setSchedules, setCurrentTable, setIsRenaming, setNewTableName) => {
    if (!newTableName.trim()) {
        return;
    }

    if (schedules[newTableName]) {
        return;
    }

    const updatedSchedules = { ...schedules };
    const tableData = updatedSchedules[currentTable];

    delete updatedSchedules[currentTable];
    updatedSchedules[newTableName] = tableData;

    setSchedules(updatedSchedules);
    setCurrentTable(newTableName);
    setIsRenaming(false);
    setNewTableName("");
};
export const handleTableSwitch = (tableKey, schedules, setCurrentTable, setSchools, setSlots, setSchedule) => {
    const tableData = schedules[tableKey] || {};
    
    const newSchools = Array.isArray(tableData.schools) ? [...tableData.schools] : [];
    const newSlots = Array.isArray(tableData.slots) ? JSON.parse(JSON.stringify(tableData.slots)) : [];
    const newSchedule = tableData.schedule ? {...tableData.schedule} : {};
    
    setCurrentTable(tableKey);
    setSchools(newSchools);
    setSlots(newSlots);
    setSchedule(newSchedule);
};

const TableActionButton = ({ onClick, icon, label, color = "indigo" }) => {
  const colorClasses = {
    indigo: "from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:ring-indigo-500",
    red: "from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 focus:ring-rose-500",
    green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500",
    blue: "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 focus:ring-blue-500",
  };

  return (
    <button
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r ${colorClasses[color]} rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2`}
    >
      <span className="relative flex items-center">
        {icon}
        {label}
      </span>
    </button>
  );
};

