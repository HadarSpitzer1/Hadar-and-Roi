
export const handleTeacherSelect = (school, shift, teacher, schedule, setSchedule, schedules, setSchedules, currentTable) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[school]) {
        newSchedule[school] = {};
    }
    newSchedule[school][shift] = teacher || undefined;

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

export const handleAddShift = (shifts, setShifts, schedules, setSchedules, currentTable) => {
    const newShiftName = `שורה  ${shifts.length + 1}`;
    const updatedShifts = [...shifts, newShiftName];
    setShifts(updatedShifts);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            shifts: updatedShifts,
        },
    };
    setSchedules(updatedSchedules);
};

export const handleEditShift = (index, shifts, setEditingShiftIndex, setNewShiftLabel) => {
    setEditingShiftIndex(index);
    setNewShiftLabel(shifts[index]);
};

export const handleShiftLabelChange = (value, setNewShiftLabel) => {
    setNewShiftLabel(value);
};

export const handleShiftLabelSave = (
    index,
    newShiftLabel,
    shifts,
    setShifts,
    schedules,
    setSchedules,
    currentTable,
    setEditingShiftIndex,
    setNewShiftLabel // Add this parameter
) => {
    const updatedShifts = [...shifts];
    updatedShifts[index] = newShiftLabel;
    setShifts(updatedShifts);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            shifts: updatedShifts,
        },
    };
    setSchedules(updatedSchedules);

    setEditingShiftIndex(null);
    setNewShiftLabel(""); // Reset the newShiftLabel state
};

export const handleDeleteShift = (index, shifts, setShifts, schedule, setSchedule, schools, schedules, setSchedules, currentTable) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
        const updatedShifts = shifts.filter((_, i) => i !== index);

        const updatedSchedule = { ...schedule };
        schools.forEach((school) => {
            if (updatedSchedule[school]) {
                delete updatedSchedule[school][shifts[index]];
            }
        });

        setShifts(updatedShifts);
        setSchedule(updatedSchedule);

        const updatedSchedules = {
            ...schedules,
            [currentTable]: {
                ...schedules[currentTable],
                shifts: updatedShifts,
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

