import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useSolveSchedule = ({
                              employees,
                              calculateConstraints,
                              calculatePreferNotToConstraints,
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
