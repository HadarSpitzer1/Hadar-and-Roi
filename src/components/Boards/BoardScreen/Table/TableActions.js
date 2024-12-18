import { fetchUserData, saveUserData } from "../../../../api";

export const loadTables = async (
    setLoading,
    setError,
    setSchedules,
    setEmployees,
    setCurrentTable,
    setSchools,
    setHours,
    setSchedule,
    username,
    getAccessTokenSilently
) => {
    try {
        setLoading(true);
        setError(null);

        const data = await fetchUserData(username, getAccessTokenSilently);
        if (data) {
            setSchedules(data.tables || {});
            setEmployees(data.employees || []);
            const tableKeys = Object.keys(data.tables || {});
            if (tableKeys.length > 0) {
                const firstTableKey = tableKeys[0];
                setCurrentTable(firstTableKey);

                const initialTable = data.tables[firstTableKey] || {};
                setSchools(initialTable.schools || []);
                setHours(initialTable.hours || []);
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

export const handleSave = async (username, schedules, employees, getAccessTokenSilently) => {
    try {
        await saveUserData(username, schedules, employees, getAccessTokenSilently);
    } catch (err) {
        console.error("Error saving data:", err);
    }
};
export const addNewTable = (schedules, setSchedules, setCurrentTable, setSchools, setHours, setSchedule) => {
    const newTableKey = `table${Object.keys(schedules).length + 1}`;
    const newTable = {
        schools: [`School ${Object.keys(schedules).length + 1}`],
        hours: ["Hour 1", "Hour 2"],
        schedule: {},
    };

    const updatedSchedules = { ...schedules, [newTableKey]: newTable };
    setSchedules(updatedSchedules);
    setCurrentTable(newTableKey);
    setSchools(newTable.schools);
    setHours(newTable.hours);
    setSchedule(newTable.schedule);
};

export const deleteCurrentTable = (currentTable, schedules, setSchedules, setCurrentTable, setSchools, setHours, setSchedule) => {
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
            setHours(newCurrentTable.hours || []);
            setSchedule(newCurrentTable.schedule || {});
        } else {
            setSchools([]);
            setHours([]);
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
export const handleTableSwitch = (tableKey, schedules, setCurrentTable, setSchools, setHours, setSchedule) => {
    setCurrentTable(tableKey);

    const tableData = schedules[tableKey] || {};
    setSchools(tableData.schools || []);
    setHours(tableData.hours || []);
    setSchedule(tableData.schedule || {});
};

