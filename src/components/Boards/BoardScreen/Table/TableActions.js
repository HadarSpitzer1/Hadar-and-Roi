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
        schools: [`עמודה ${Object.keys(schedules).length + 1}`],
        slots: [{
            shift: "משמרת 1",
            slots: ["תא 1"]
        }],
        schedule: {},
    };

    const updatedSchedules = { ...schedules, [newTableKey]: newTable };
    setSchedules(updatedSchedules);
    setCurrentTable(newTableKey);
    setSchools(newTable.schools);
    setSlots(newTable.slots);
    setSchedule(newTable.schedule);
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
    setCurrentTable(tableKey);

    const tableData = schedules[tableKey] || {};
    setSchools(tableData.schools || []);
    setSlots(tableData.slots || []);
    setSchedule(tableData.schedule || {});
};

