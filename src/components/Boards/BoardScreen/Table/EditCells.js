export const handleTeacherSelect = (school, slot, teacher, schedule, setSchedule, schedules, setSchedules, currentTable) => {
    // Create a deep copy of the schedule
    const newSchedule = JSON.parse(JSON.stringify(schedule));
    
    // Initialize the school object if it doesn't exist
    if (!newSchedule[school]) {
        newSchedule[school] = {};
    }
    
    // Set the teacher for this specific slot
    newSchedule[school][slot] = teacher || undefined;

    // If the slot is empty and there's no other data for this school, clean up
    if (!teacher && Object.keys(newSchedule[school]).length === 0) {
        delete newSchedule[school];
    }

    // Update local state
    setSchedule(newSchedule);

    // Update global state
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
    if (!currentTable || !schedules[currentTable]) return;

    // Get the current table's schools array
    const currentSchools = Array.isArray(schedules[currentTable].schools) 
        ? [...schedules[currentTable].schools] 
        : [];
    
    // Create new school name based on current table's schools length
    const newSchoolName = `עמודה ${currentSchools.length + 1}`;
    
    // Create updated schools array
    const updatedSchools = [...currentSchools, newSchoolName];
    
    // Update local state with a new array
    setSchools([...updatedSchools]);

    // Update schedules state
    const updatedSchedules = {
        ...schedules,
        [currentTable]: {
            ...schedules[currentTable],
            schools: [...updatedSchools], // Create new array
            slots: schedules[currentTable].slots ? [...schedules[currentTable].slots] : [],
            schedule: schedules[currentTable].schedule ? {...schedules[currentTable].schedule} : {}
        }
    };
    
    setSchedules(updatedSchedules);
};

export const handleAddSlots = (slots, setSlots, schedules, setSchedules, currentTable) => {
    const newShift = {
        shift: `משמרת ${slots.length + 1}`,
        slots: ['תא 1'] // Initialize with one default slot
    };
    
    // Initialize slots array if it's undefined
    const updatedSlots = slots ? [...slots, newShift] : [newShift];
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
    if (!currentTable || !schedules[currentTable]) return;
    
    if (window.confirm("Are you sure you want to delete this school?")) {
        // Create new arrays/objects to avoid reference issues
        const updatedSchools = schools.filter((_, i) => i !== index);
        const schoolToDelete = schools[index];
        const updatedSchedule = {...schedule};
        delete updatedSchedule[schoolToDelete];

        setSchools([...updatedSchools]);
        setSchedule({...updatedSchedule});

        const updatedSchedules = {
            ...schedules,
            [currentTable]: {
                ...schedules[currentTable],
                schools: [...updatedSchools],
                schedule: {...updatedSchedule}
            }
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

export const handleAddSubSlot = (shiftIndex, slots, setSlots, schedules, setSchedules, currentTable) => {
    // Initialize slots array if it's undefined
    if (!slots) {
        slots = [];
    }
    
    const updatedSlots = [...slots];
    if (!updatedSlots[shiftIndex]) {
        updatedSlots[shiftIndex] = {
            shift: `משמרת ${shiftIndex + 1}`,
            slots: []
        };
    }
    
    updatedSlots[shiftIndex] = {
        ...updatedSlots[shiftIndex],
        slots: [...(updatedSlots[shiftIndex].slots || []), `תא ${(updatedSlots[shiftIndex].slots || []).length + 1}`]
    };
    
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

