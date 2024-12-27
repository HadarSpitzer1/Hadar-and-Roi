import React, {useEffect, useState} from "react";
import {useBoards} from "../BoardsContext";
import useSolveAndExport from "../../../hooks/SolveAndExport";
import {FaSyncAlt, FaSave, FaPlus, FaPen, FaTrash, FaFileExcel} from "react-icons/fa";
import TableHeader from "./Table/TableHeader";
import TableBody from "./Table/TableBody";
import {
    loadTables,
    handleSave,
    addNewTable,
    deleteCurrentTable,
    handleRenameTable,
    handleTableSwitch
} from "./Table/TableActions";
import {
    handleTeacherSelect,
    handleAddSchool,
    handleAddHour,
    handleEditHour,
    handleHourLabelChange,
    handleHourLabelSave,
    handleDeleteHour,
    handleSchoolNameSave,
    handleDeleteSchool,
    handleEditSchool,
    handleSchoolNameChange
} from "./Table/EditCells";

const BoardsScreen = ({username, getAccessTokenSilently}) => {
    const {
        schedules,
        setSchedules,
        employees,
        setEmployees,
        managers,
        setManagers,
        currentTable,
        setCurrentTable,
        employeeData,
        setEmployeeData,
    } = useBoards();

    const [schools, setSchools] = useState([]);
    const [hours, setHours] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTableName, setNewTableName] = useState("");
    const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
    const [newSchoolName, setNewSchoolName] = useState("");
    const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);
    const [editingHourIndex, setEditingHourIndex] = useState(null);
    const [newHourLabel, setNewHourLabel] = useState("");
    const [hoveredHourIndex, setHoveredHourIndex] = useState(null);

    useEffect(() => {
        if (currentTable && schedules[currentTable]) {
            const tableData = schedules[currentTable];
            setSchools(tableData.schools || []);
            setHours(tableData.hours || []);
            setSchedule(tableData.schedule || {});
        }
    }, [currentTable, schedules]);
    const {handleSolve, exportToExcel, loading: solving, error: solveError} = useSolveAndExport({
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

    const handleExportToExcel = () => {
        exportToExcel(schools, hours, schedule);
    };

    const handleSaveClick = () => {
        handleSave(username, schedules, employees, getAccessTokenSilently,employeeData);
    };
    const handleTableSwitchClick = (tableKey) => {
        handleTableSwitch(tableKey, schedules, setCurrentTable, setSchools, setHours, setSchedule);
    };
    const handleHourLabelSaveClick = () => {
        handleHourLabelSave(
            editingHourIndex,
            newHourLabel,
            hours,
            setHours,
            schedules,
            setSchedules,
            currentTable,
            setEditingHourIndex,
            setNewHourLabel // Pass setNewHourLabel here
        );
    };


    const handleAddNewTable = () => {
        addNewTable(schedules, setSchedules, setCurrentTable, setSchools, setHours, setSchedule);
    };

    const handleDeleteCurrentTable = () => {
        deleteCurrentTable(currentTable, schedules, setSchedules, setCurrentTable, setSchools, setHours, setSchedule);
    };
    const handleLoadTables = () => {
        console.log(" IAM TRYING TO PRINT GETACCESSTOKEN")
        console.log(getAccessTokenSilently)
        loadTables(
            setLoading,
            setError,
            setSchedules,
            setEmployees,
            setCurrentTable,
            setSchools,
            setHours,
            setSchedule,
            setEmployeeData,
            username,
            getAccessTokenSilently
        );
    };

    const handleRenameClick = () => {
        handleRenameTable(newTableName, currentTable, schedules, setSchedules, setCurrentTable, setIsRenaming, setNewTableName);
    };

    const handleTeacherSelectClick = (school, hour, teacher) => {
        handleTeacherSelect(school, hour, teacher, schedule, setSchedule, schedules, setSchedules, currentTable);
    };

    const handleAddSchoolClick = () => {
        handleAddSchool(schools, setSchools, schedules, setSchedules, currentTable);
    };

    const handleAddHourClick = () => {
        handleAddHour(hours, setHours, schedules, setSchedules, currentTable);
    };

    const handleEditHourClick = (index) => {
        handleEditHour(index, hours, setEditingHourIndex, setNewHourLabel);
    };

    const handleHourLabelChangeClick = (value) => {
        handleHourLabelChange(value, setNewHourLabel);
    };

    const handleDeleteHourClick = (index) => {
        handleDeleteHour(index, hours, setHours, schedule, setSchedule, schools, schedules, setSchedules, currentTable);
    };    const handleEditSchoolClick = (index) => {
        handleEditSchool(index, schools, setEditingSchoolIndex, setNewSchoolName);
    };

    const handleSchoolNameSaveClick = (index) => {
        handleSchoolNameSave(index, newSchoolName, schools, setSchools, schedules, setSchedules, currentTable, setEditingSchoolIndex, setNewSchoolName);
    };

    const handleDeleteSchoolClick = (index) => {
        handleDeleteSchool(index, schools, setSchools, schedule, setSchedule, schedules, setSchedules, currentTable);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLoadTables}
                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                        title="Refresh"
                    >
                        <FaSyncAlt/>
                    </button>
                    <button
                        onClick={handleSaveClick}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600"
                        title="Save"
                    >
                        <FaSave/>
                    </button>
                </div>
                <select
                    value={currentTable || ""}
                    onChange={(e) => handleTableSwitchClick(e.target.value)}
                    className="px-4 py-2 bg-white dark:bg-gray-700 text-black dark:text-white border dark:border-gray-600 rounded-lg shadow-md"
                >
                    {Object.keys(schedules).map((tableKey) => (
                        <option key={tableKey} value={tableKey}>
                            {tableKey}
                        </option>
                    ))}
                </select>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleAddNewTable}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                        title="Add New Table"
                    >
                        <FaPlus/>
                    </button>
                    <button
                        onClick={() => setIsRenaming(true)}
                        className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
                        title="Rename Table"
                    >
                        <FaPen/>
                    </button>
                    <button
                        onClick={handleDeleteCurrentTable}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Delete Table"
                    >
                        <FaTrash/>
                    </button>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
            {!loading && Object.keys(schedules).length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    No tables available. Click "Add New Table" to create one.
                </div>
            )}
            {!loading && Object.keys(schedules).length > 0 && (
                <div>
                    <div
                        className="overflow-x-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-lg">
                        <table className="w-full" dir="rtl">
                            <TableHeader
                                schools={schools}
                                editingSchoolIndex={editingSchoolIndex}
                                newSchoolName={newSchoolName}
                                handleEditSchool={(index) => handleEditSchool(index, schools, setEditingSchoolIndex, setNewSchoolName)}
                                handleSchoolNameChange={(value) => handleSchoolNameChange(value, setNewSchoolName)}
                                handleSchoolNameSave={handleSchoolNameSaveClick}
                                handleAddSchool={handleAddSchoolClick}
                                handleDeleteSchool={handleDeleteSchoolClick}
                                hoveredSchoolIndex={hoveredSchoolIndex}
                                setHoveredSchoolIndex={setHoveredSchoolIndex}
                                hoveredHourIndex={hoveredHourIndex}
                                setHoveredHourIndex={setHoveredHourIndex}
                                handleAddRow={handleAddHourClick}
                            />
                            <TableBody
                                hours={hours}
                                schools={schools}
                                schedule={schedule}
                                conflicts={{}}
                                employees={employees}
                                handleTeacherSelect={handleTeacherSelectClick}
                                handleAddHour={handleAddHour}
                                editingHourIndex={editingHourIndex}
                                newHourLabel={newHourLabel}
                                handleEditHour={handleEditHourClick}
                                employeeData={employeeData} // Pass employeeData here
                                handleHourLabelChange={handleHourLabelChangeClick}
                                handleHourLabelSave={handleHourLabelSaveClick}
                                handleDeleteHour={handleDeleteHourClick}
                                hoveredHourIndex={hoveredHourIndex}
                                setHoveredHourIndex={setHoveredHourIndex}
                                handleAddRow={handleAddHourClick}
                            />
                        </table>
                    </div>
                </div>
            )}

            {isRenaming && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4 shadow-lg">
                        <h2 className="text-lg font-bold dark:text-gray-100">Rename Table</h2>
                        <input
                            type="text"
                            value={newTableName}
                            onChange={(e) => setNewTableName(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 border dark:border-gray-600 rounded-lg dark:text-white"
                            placeholder="Enter new table name"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={handleRenameClick}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setIsRenaming(false)}
                                className="px-4 py-2 bg-gray-300 text-black rounded-lg shadow-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex justify-center mt-6">
                <div className="text-center">
                    <button
                        onClick={handleSolve}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        {solving ? "Solving..." : "Solve"}
                    </button>
                    {solveError && <div className="text-red-500 mt-2">{solveError}</div>}
                    <button
                        onClick={handleExportToExcel}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors mt-4 ml-4"
                    >
                        <FaFileExcel className="inline-block mr-2"/> Export to Excel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BoardsScreen;