
export const handleTeacherSelect = (school, hour, teacher, schedule, setSchedule, schedules, setSchedules, currentTable) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[school]) {
        newSchedule[school] = {};
    }
    newSchedule[school][hour] = teacher || undefined;

    setSchedule(newSchedule);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            schedule: newSchedule,
        },
    };

    setSchedules(updatedSchedules);
};

export const handleAddSchool = (schools, setSchools, schedules, setSchedules, currentTable) => {
    const newSchoolName = `עמודה ${schools.length + 1}`;
    const updatedSchools = [...schools, newSchoolName];
    setSchools(updatedSchools);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            schools: updatedSchools,
        },
    };
    setSchedules(updatedSchedules);
};

export const handleAddHour = (hours, setHours, schedules, setSchedules, currentTable) => {
    const newHourName = `שורה  ${hours.length + 1}`;
    const updatedHours = [...hours, newHourName];
    setHours(updatedHours);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            hours: updatedHours,
        },
    };
    setSchedules(updatedSchedules);
};

export const handleEditHour = (index, hours, setEditingHourIndex, setNewHourLabel) => {
    setEditingHourIndex(index);
    setNewHourLabel(hours[index]);
};

export const handleHourLabelChange = (value, setNewHourLabel) => {
    setNewHourLabel(value);
};

export const handleHourLabelSave = (
    index,
    newHourLabel,
    hours,
    setHours,
    schedules,
    setSchedules,
    currentTable,
    setEditingHourIndex,
    setNewHourLabel // Add this parameter
) => {
    const updatedHours = [...hours];
    updatedHours[index] = newHourLabel;
    setHours(updatedHours);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            hours: updatedHours,
        },
    };
    setSchedules(updatedSchedules);

    setEditingHourIndex(null);
    setNewHourLabel(""); // Reset the newHourLabel state
};

export const handleDeleteHour = (index, hours, setHours, schedule, setSchedule, schools, schedules, setSchedules, currentTable) => {
    if (window.confirm("Are you sure you want to delete this hour?")) {
        const updatedHours = hours.filter((_, i) => i !== index);

        const updatedSchedule = { ...schedule };
        schools.forEach((school) => {
            if (updatedSchedule[school]) {
                delete updatedSchedule[school][hours[index]];
            }
        });

        setHours(updatedHours);
        setSchedule(updatedSchedule);

        const updatedSchedules = {
            ...schedules,
            [currentTable]: {
                ...schedules[currentTable],
                hours: updatedHours,
                schedule: updatedSchedule,
            },
        };
        setSchedules(updatedSchedules);
    }
};

export const handleSchoolNameSave = (index, newSchoolName, schools, setSchools, schedules, setSchedules, currentTable, setEditingSchoolIndex, setNewSchoolName) => {
    const updatedSchools = [...schools];
    updatedSchools[index] = newSchoolName;
    setSchools(updatedSchools);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            schools: updatedSchools,
        },
    };
    setSchedules(updatedSchedules);

    setEditingSchoolIndex(null);
    setNewSchoolName("");
};

export const handleDeleteSchool = (index, schools, setSchools, schedule, setSchedule, schedules, setSchedules, currentTable) => {
    if (window.confirm("Are you sure you want to delete this school?")) {
        const updatedSchools = schools.filter((_, i) => i !== index);

        const { [schools[index]]: _, ...updatedSchedule } = schedule;

        setSchools(updatedSchools);
        setSchedule(updatedSchedule);

        const updatedSchedules = {
            ...schedules,
            [currentTable]: {
                ...schedules[currentTable],
                schools: updatedSchools,
                schedule: updatedSchedule,
            },
        };
        setSchedules(updatedSchedules);
    }
};

export const handleEditSchool = (index, schools, setEditingSchoolIndex, setNewSchoolName) => {
    setEditingSchoolIndex(index);
    setNewSchoolName(schools[index]);
};

export const handleSchoolNameChange = (value, setNewSchoolName) => {
    setNewSchoolName(value);
};
