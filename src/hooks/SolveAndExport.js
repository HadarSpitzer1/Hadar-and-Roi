// src/hooks/SolveAndExport.js

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const useSolveAndExport = ({ employees, employeeData, schools, hours, currentTable, schedules, setSchedules, setSchedule }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

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

            const payload = {
                workers: employees,
                unavailable_constraints: calculateConstraints(),
                prefer_not_to: calculatePreferNotToConstraints(),
            };

            const response = await axios.post(
                "https://us-east1-matchbox-443614.cloudfunctions.net/function-1",
                payload
            );

            console.log("Solve Response:", response.data);

            const rawSchedule = response.data.schedule;
            const newSchedule = {};

            const numOfSchools = schools.length;
            const numOfHours = hours.length;

            for (const i in rawSchedule) {
                const index = parseInt(i, 10);
                const hourIndex = Math.floor(index / numOfSchools);
                const schoolIndex = index % numOfSchools;

                if (hourIndex < numOfHours && schoolIndex < numOfSchools) {
                    const hour = hours[hourIndex];
                    const school = schools[schoolIndex];
                    const teacher = rawSchedule[i];

                    if (!newSchedule[school]) {
                        newSchedule[school] = {};
                    }
                    newSchedule[school][hour] = teacher;
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

    const exportToExcel = (schools, hours, schedule) => {
        const workbook = XLSX.utils.book_new();
        const tableData = [];

        // Add the first row with school names
        tableData.push([" ", ...schools]);

        // Build each row based on hours
        for (const hour of hours) {
            const row = [hour];
            for (const school of schools) {
                row.push(schedule[school]?.[hour] || "");
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
