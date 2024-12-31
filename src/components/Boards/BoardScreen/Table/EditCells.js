
export const handleTeacherSelect = (school, Slot, teacher, schedule, setSchedule, schedules, setSchedules, currentTable) => {
    const newSchedule = { ...schedule };
    if (!newSchedule[school]) {
        newSchedule[school] = {};
    }
    newSchedule[school][Slot] = teacher || undefined;

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

export const handleAddSlots = (slots, setSlots, schedules, setSchedules, currentTable) => {
    const newSlotName = `שורה  ${slots.length + 1}`;
    const updatedSlots = [...slots, newSlotName];
    setSlots(updatedSlots);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            slots: updatedSlots,
        },
    };
    setSchedules(updatedSchedules);
};

export const handleEditSlots = (index, slots, setEditingSlotIndex, setNewSlotLabel) => {
    setEditingSlotIndex(index);
    setNewSlotLabel(slots[index]);
};

export const handleSlotsLabelChange = (value, setNewSlotLabel) => {
    setNewSlotLabel(value);
};

export const handleSlotsLabelSave = (
    index,
    newSlotLabel,
    slots,
    setSlots,
    schedules,
    setSchedules,
    currentTable,
    setEditingSlotIndex,
    setNewSlotLabel // Add this parameter
) => {
    const updatedSlots = [...slots];
    updatedSlots[index] = newSlotLabel;
    setSlots(updatedSlots);

    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            slots: updatedSlots,
        },
    };
    setSchedules(updatedSchedules);

    setEditingSlotIndex(null);
    setNewSlotLabel(""); // Reset the newSlotLabel state
};

export const handleDeleteSlots = (index, slots, setSlots, schedule, setSchedule, schools, schedules, setSchedules, currentTable) => {
    if (window.confirm("Are you sure you want to delete this Slot?")) {
        const updatedSlots = slots.filter((_, i) => i !== index);

        const updatedSchedule = { ...schedule };
        schools.forEach((school) => {
            if (updatedSchedule[school]) {
                delete updatedSchedule[school][slots[index]];
            }
        });

        setSlots(updatedSlots);
        setSchedule(updatedSchedule);

        const updatedSchedules = {
            ...schedules,
            [currentTable]: {
                ...schedules[currentTable],
                slots: updatedSlots,
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

