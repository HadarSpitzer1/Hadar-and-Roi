import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSolveSchedule = ({
                              employees,
                              employeeData,
                              schools,
                              hours,
                              currentTable,
                              schedules,
                              setSchedules,
                              setSchedule,
                          }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    // Define calculateConstraints inside the hook
    const calculateConstraints = () => {
        const unavailableConstraints = {};

        employees.forEach((employee) => {
            const markedCells = employeeData[employee] || {};
            unavailableConstraints[employee] = Object.keys(markedCells)
                .filter((key) => markedCells[key])
                .map((key) => parseInt(key, 10))
                .filter((key) => !isNaN(key)); // Ensure valid integers only
        });

        return unavailableConstraints;
    };

    // Define calculatePreferNotToConstraints inside the hook
    const calculatePreferNotToConstraints = () => {
        const preferNotToConstraints = {};

        employees.forEach((employee) => {
            const markedCells = employeeData[employee] || {};
            const filteredKeys = Object.keys(markedCells)
                .filter((key) => markedCells[key] === "-") // Only include "-" (prefer not to)
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

            // Navigate to BoardsScreen after solving
            navigate("/");
        } catch (err) {
            console.error("Error solving constraints:", err);
            setError("Failed to solve constraints. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return { handleSolve, loading, error };
};

export default useSolveSchedule;
