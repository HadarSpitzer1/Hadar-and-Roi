import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSolveSchedule = ({
                              employees,
                              calculateConstraints,
                              calculatePreferNotToConstraints,
                              schools,
                              shifts,
                              currentTable,
                              schedules,
                              setSchedules,
                              setSchedule,
                          }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for navigation

    const handleSolve = async () => {
        try {
            setLoading(true);
            setError(null);

            const payload = {
                workers: employees,
                unavailable_constraints: calculateConstraints(),
                prefer_not_to:calculatePreferNotToConstraints(),
            };

            const response = await axios.post(
                "https://us-east1-matchbox-443614.cloudfunctions.net/function-1",
                payload
            );

            console.log("Solve Response:", response.data);
            alert("Solve successful! Updating the table...");

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
            setSchedule(newSchedule); // Update the local schedule state

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
