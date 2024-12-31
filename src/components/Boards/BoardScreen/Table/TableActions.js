import { fetchUserData, saveUserData } from "../../../../api";

export const loadTables = async (
    setLoading,
    setError,
    setSchedules,
    setEmployees,
    setCurrentTable,
    setSchools,
    setShifts,
    setSchedule,
    setEmployeeData,
    username,
    getAccessTokenSilently
) => {
    try {
        setLoading(true);
        setError(null);
        console.log('TRYING TO PEINT ACCESS STUFF')
        console.log(getAccessTokenSilently)
        const data = await fetchUserData(username, getAccessTokenSilently);
        if (data) {
            setSchedules(data.tables || {});
            setEmployees(data.employees || []);
            setEmployeeData(data.employeeData || {});
            const tableKeys = Object.keys(data.tables || {});
            if (tableKeys.length > 0) {
                const firstTableKey = tableKeys[0];
                setCurrentTable(firstTableKey);

                const initialTable = data.tables[firstTableKey] || {};
                setSchools(initialTable.schools || []);
                setShifts(initialTable.shifts || []);
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
export const addNewTable = (schedules, setSchedules, setCurrentTable, setSchools, setShifts, setSchedule) => {
    const newTableKey = `טבלה ${Object.keys(schedules).length + 1}`;
    const newTable = {
        schools: [` עמודה ${Object.keys(schedules).length + 1}`],
        shifts: ["שורה 1", "שורה 2"],
        schedule: {},
    };

    const updatedSchedules = { ...schedules, [newTableKey]: newTable };
    setSchedules(updatedSchedules);
    setCurrentTable(newTableKey);
    setSchools(newTable.schools);
    setShifts(newTable.shifts);
    setSchedule(newTable.schedule);
};

export const deleteCurrentTable = (currentTable, schedules, setSchedules, setCurrentTable, setSchools, setShifts, setSchedule) => {
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
            setShifts(newCurrentTable.shifts || []);
            setSchedule(newCurrentTable.schedule || {});
        } else {
            setSchools([]);
            setShifts([]);
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
export const handleTableSwitch = (tableKey, schedules, setCurrentTable, setSchools, setShifts, setSchedule) => {
    setCurrentTable(tableKey);

    const tableData = schedules[tableKey] || {};
    setSchools(tableData.schools || []);
    setShifts(tableData.shifts || []);
    setSchedule(tableData.schedule || {});
};

