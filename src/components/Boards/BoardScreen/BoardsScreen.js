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
    handleAddSlots,
    handleEditSlots,
    handleSlotsLabelChange,
    handleSlotsLabelSave,
    handleDeleteSlots,
    handleSchoolNameSave,
    handleDeleteSchool,
    handleEditSchool,
    handleSchoolNameChange,
    handleAddSubSlot
} from "./Table/EditCells";

const BoardsScreen = ({username, getAccessTokenSilently}) => {
    const {
        schedules,
        setSchedules,
        employees,
        setEmployees,
        managers,
        currentTable,
        setCurrentTable,
        employeeData,
        setEmployeeData,
    } = useBoards();

    const [schools, setSchools] = useState([]);
    const [slots, setSlots] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRenaming, setIsRenaming] = useState(false);
    const [newTableName, setNewTableName] = useState("");
    const [editingSchoolIndex, setEditingSchoolIndex] = useState(null);
    const [newSchoolName, setNewSchoolName] = useState("");
    const [hoveredSchoolIndex, setHoveredSchoolIndex] = useState(null);
    const [editingSlotsIndex, setEditingSlotsIndex] = useState(null);
    const [newSlotsLabel, setNewSlotsLabel] = useState("");
    const [hoveredSlotIndex, setHoveredSlotIndex] = useState(null);

    useEffect(() => {
        if (currentTable && schedules[currentTable]) {
            const tableData = schedules[currentTable];
            setSchools(tableData.schools || []);
            setSlots(tableData.slots || []);
            setSchedule(tableData.schedule || {});
        }
    }, [currentTable, schedules]);
    const {handleSolve, exportToExcel, loading: solving, error: solveError} = useSolveAndExport({
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

    const handleExportToExcel = () => {
        exportToExcel(schools, slots, schedule);
    };

    const handleSaveClick = () => {
        handleSave(username, schedules, employees, getAccessTokenSilently,employeeData);
    };
    const handleTableSwitchClick = (tableKey) => {
        handleTableSwitch(tableKey, schedules, setCurrentTable, setSchools, setSlots, setSchedule);
    };
    const handleSlotsLabelSaveClick = () => {
        handleSlotsLabelSave(
            editingSlotsIndex,
            newSlotsLabel,
            slots,
            setSlots,
            schedules,
            setSchedules,
            currentTable,
            setEditingSlotsIndex,
            setNewSlotsLabel // Pass setNewSlotsLabel here
        );
    };


    const handleAddNewTable = () => {
        addNewTable(schedules, setSchedules, setCurrentTable, setSchools, setSlots, setSchedule);
    };

    const handleDeleteCurrentTable = () => {
        deleteCurrentTable(currentTable, schedules, setSchedules, setCurrentTable, setSchools, setSlots, setSchedule);
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
            setSlots,
            setSchedule,
            setEmployeeData,
            username,
            getAccessTokenSilently
        );
    };

    const handleRenameClick = () => {
        handleRenameTable(newTableName, currentTable, schedules, setSchedules, setCurrentTable, setIsRenaming, setNewTableName);
    };

    const handleTeacherSelectClick = (school, Slots, teacher) => {
        handleTeacherSelect(school, Slots, teacher, schedule, setSchedule, schedules, setSchedules, currentTable);
    };

    const handleAddSchoolClick = () => {
        handleAddSchool(schools, setSchools, schedules, setSchedules, currentTable);
    };

    const handleAddSlotsClick = () => {
        handleAddSlots(slots, setSlots, schedules, setSchedules, currentTable);
    };

    const handleEditSlotsClick = (index) => {
        handleEditSlots(index, slots, setEditingSlotsIndex, setNewSlotsLabel);
    };

    const handleSlotsLabelChangeClick = (value) => {
        handleSlotsLabelChange(value, setNewSlotsLabel);
    };

    const handleDeleteSlotsClick = (index) => {
        handleDeleteSlots(index, slots, setSlots, schedule, setSchedule, schools, schedules, setSchedules, currentTable);
    };
    const handleEditSchoolClick = (index) => {
        handleEditSchool(index, schools, setEditingSchoolIndex, setNewSchoolName);
    };

    const handleSchoolNameSaveClick = (index) => {
        handleSchoolNameSave(index, newSchoolName, schools, setSchools, schedules, setSchedules, currentTable, setEditingSchoolIndex, setNewSchoolName);
    };

    const handleDeleteSchoolClick = (index) => {
        handleDeleteSchool(index, schools, setSchools, schedule, setSchedule, schedules, setSchedules, currentTable);
    };

    const handleAddSubSlotClick = (shiftIndex) => {
        handleAddSubSlot(shiftIndex, slots, setSlots, schedules, setSchedules, currentTable);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLoadTables}
                        className="group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span className="relative flex items-center">
                            <svg 
                                className="w-4 h-4 mr-2 transition-transform group-hover:rotate-180" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            רענן
                        </span>
                    </button>
                    
                    <button
                        onClick={handleSaveClick}
                        className="group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <span className="relative flex items-center">
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            שמור
                        </span>
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
                        className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="relative flex items-center">
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            הוסף לוח
                        </span>
                    </button>
                    <button
                        onClick={() => setIsRenaming(true)}
                        className="group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg shadow-md hover:from-blue-600 hover:to-cyan-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <span className="relative flex items-center">
                            <svg 
                                className="w-3.5 h-3.5 mr-1.5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            שנה שם
                        </span>
                    </button>
                    <button
                        onClick={handleDeleteCurrentTable}
                        className="group relative inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg shadow-md hover:from-rose-600 hover:to-pink-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                        <span className="relative flex items-center">
                            <svg 
                                className="w-3.5 h-3.5 mr-1.5" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            מחק לוח
                        </span>
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
                                hoveredSlotIndex={hoveredSlotIndex}
                                setHoveredSlotIndex={setHoveredSlotIndex}
                                handleAddRow={handleAddSlotsClick}
                            />
                            <TableBody
                                slots={slots}
                                schools={schools}
                                schedule={schedule}
                                conflicts={{}}
                                employees={employees}
                                handleTeacherSelect={handleTeacherSelectClick}
                                handleAddSlots={handleAddSlots}
                                editingSlotsIndex={editingSlotsIndex}
                                newSlotsLabel={newSlotsLabel}
                                handleEditSlots={handleEditSlotsClick}
                                employeeData={employeeData} // Pass employeeData here
                                handleSlotsLabelChange={handleSlotsLabelChangeClick}
                                handleSlotsLabelSave={handleSlotsLabelSaveClick}
                                handleDeleteSlots={handleDeleteSlotsClick}
                                hoveredSlotIndex={hoveredSlotIndex}
                                setHoveredSlotIndex={setHoveredSlotIndex}
                                handleAddRow={handleAddSlotsClick}
                                handleAddSubSlot={handleAddSubSlotClick}
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
            <div className="flex justify-center gap-4 mt-6">
                <button
                    onClick={handleSolve}
                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={solving}
                >
                    <span className="relative flex items-center">
                        {solving ? (
                            <svg 
                                className="animate-spin w-4 h-4 mr-2" 
                                fill="none" 
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        )}
                        {solving ? "...מחשב" : "פתור"}
                    </span>
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
                    </div>
                </button>

                <button
                    onClick={handleExportToExcel}
                    className="group relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out transform bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    <span className="relative flex items-center">
                        <svg 
                            className="w-4 h-4 mr-2" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        ייצא לאקסל
                    </span>
                    <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/50 to-emerald-600/50 transform translate-y-full transition-transform duration-200 ease-in-out group-hover:translate-y-0"></div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default BoardsScreen;