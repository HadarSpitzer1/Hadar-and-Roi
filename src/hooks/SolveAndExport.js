// src/hooks/SolveAndExport.js

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const useSolveAndExport = ({ employees, employeeData, schools, shifts, currentTable, schedules, setSchedules, setSchedule, managers }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation
    // const { period } = useBoards(); // Load period from BoardsContext
    const [period, setPeriod] = useState(() => {
        const savedPeriod = localStorage.getItem("period");
        console.log(savedPeriod);
        return savedPeriod || "שבועי"; // Default to "שבועי"
    });

    const calculateConstraints = () => {
        const unavailableConstraints = {};

        employees.forEach((employee) => {
            const markedCells = employeeData[employee] || {};
            unavailableConstraints[employee] = Object.keys(markedCells)
                .filter((key) => markedCells[key])
                .map((key) => parseInt(key, 10))
                .filter((key) => !isNaN(key));
        });

        return unavailableConstraints;
    };

    const calculatePreferNotToConstraints = () => {
        const preferNotToConstraints = {};

        employees.forEach((employee) => {
            const markedCells = employeeData[employee] || {};
            const filteredKeys = Object.keys(markedCells)
                .filter((key) => markedCells[key] === "-")
                .map((key) => parseInt(key, 10))
                .filter((key) => !isNaN(key));

            if (filteredKeys.length > 0) {
                preferNotToConstraints[employee] = filteredKeys;
            }
        });

        return preferNotToConstraints;
    };

    const handleSolve = async () => {
        try {
            setLoading(true);
            setError(null);

            const organization = period.trim() === "שבועי" ? "security" : "vizo";
            const payload = {
                user: organization,
                workers: employees,
                unavailable_constraints: calculateConstraints(),
                prefer_not_to: calculatePreferNotToConstraints(),
            };
            if (managers && managers.length > 0) {
                payload.managers = managers;
            }
            const response = await axios.post(
                "https://us-east1-matchbox-443614.cloudfunctions.net/function-1",
                payload
            );

            console.log("Solve Response:", response.data);

            const rawSchedule = response.data.schedule;
            const newSchedule = {};

            const numOfSchools = schools.length;
            const numOfShifts = shifts.length;

            for (const i in rawSchedule) {
                const index = parseInt(i, 10);
                const shiftIndex = Math.floor(index / numOfSchools);
                const schoolIndex = index % numOfSchools;

                if (shiftIndex < numOfShifts && schoolIndex < numOfSchools) {
                    const shift = shifts[shiftIndex];
                    const school = schools[schoolIndex];
                    const teacher = rawSchedule[i];

                    if (!newSchedule[school]) {
                        newSchedule[school] = {};
                    }
                    newSchedule[school][shift] = teacher;
                }
            }

            const updatedSchedules = {
                ...schedules,
                [currentTable]: {
                    ...schedules[currentTable],
                    schedule: newSchedule,
                },
            };

            setSchedules(updatedSchedules);
            setSchedule(newSchedule);

            navigate("/");
        } catch (err) {
            console.error("Error solving constraints:", err);
            setError("Failed to solve constraints. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = (schools, shifts, schedule) => {
        const workbook = XLSX.utils.book_new();
        const tableData = [];

        // Add the first row with school names
        tableData.push([" ", ...schools]);

        // Build each row based on shifts
        for (const shift of shifts) {
            const row = [shift];
            for (const school of schools) {
                row.push(schedule[school]?.[shift] || "");
            }
            tableData.push(row);
        }

        const worksheet = XLSX.utils.aoa_to_sheet(tableData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
        XLSX.writeFile(workbook, "schedule.xlsx");
    };

    return { handleSolve, exportToExcel, loading, error };
};

export default useSolveAndExport;
