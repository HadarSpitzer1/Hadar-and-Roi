from z3 import *
from flask import jsonify, make_response

def security(workers, managers, num_days=7, num_slots=15):
    """
    Entry point for scheduling.
    :param workers: list of employee names (strings)
    :param managers: list of manager names (subset of 'workers')
    :param num_days: integer, how many days to schedule
    :param num_slots: integer, how many slots per day
    :return: dictionary with schedule OR None if no solution
    """
    schedule_solution = solve_schedule(workers, num_days, num_slots, managers)
    return schedule_solution

def solve_schedule(employees, num_days, num_slots, managers):
    solver = Solver()
    num_employees = len(employees)

    # Create a 2D array of Int variables: schedule[d][s] ∈ [0..num_employees - 1]
    schedule = [
        [Int(f'schedule_{d}_{s}') for s in range(num_slots)]
        for d in range(num_days)
    ]

    # Constrain domain of each schedule variable to valid employee indices
    for d in range(num_days):
        for s in range(num_slots):
            solver.add(schedule[d][s] >= 0, schedule[d][s] < num_employees)

    # Define slot groups (adjust these if needed)
    group1 = list(range(0, 6))    # slots 0..5
    group2 = list(range(6, 10))   # slots 6..9
    group3 = list(range(10, 14))  # slots 10..13

    # Build a quick lookup of manager indices
    manager_indices = [employees.index(m) for m in managers if m in employees]

    # 1) Each employee can work at most 6 times total
    for i in range(num_employees):
        total_shifts_for_i = []
        for d in range(num_days):
            for s in range(num_slots):
                total_shifts_for_i.append(If(schedule[d][s] == i, 1, 0))
        solver.add(Sum(total_shifts_for_i) <= 6)

    # 2) One schedule per group per day for each employee (≤ 1 shift in each group per day)
    for d in range(num_days):
        for i in range(num_employees):
            solver.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group1]) <= 1)
            solver.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group2]) <= 1)
            solver.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group3]) <= 1)

    # 3) No double-scheduling in group2 => if an employee is in group2, not in group1 or group3 the same day
    for d in range(num_days):
        for i in range(num_employees):
            in_group2 = Sum([If(schedule[d][s] == i, 1, 0) for s in group2])
            in_group1 = Sum([If(schedule[d][s] == i, 1, 0) for s in group1])
            in_group3 = Sum([If(schedule[d][s] == i, 1, 0) for s in group3])
            solver.add(Implies(in_group2 >= 1, in_group1 == 0))
            solver.add(Implies(in_group2 >= 1, in_group3 == 0))

    # 4) Manager constraint: each group each day must have at least 1 manager
    for d in range(num_days):
        for grp in (group1, group2, group3):
            solver.add(
                Sum([
                    If(Or([schedule[d][s] == m for m in manager_indices]), 1, 0)
                    for s in grp
                ]) >= 1
            )

    # 5) “Preference” no double scheduling per day => define a penalty var
    #    penalty_{d,i} >= (count of how many times i is scheduled that day) - 1
    #    penalty_{d,i} >= 0
    for d in range(num_days):
        for i in range(num_employees):
            penalty = Int(f'penalty_{d}_{i}')
            scheduled_count = Sum([If(schedule[d][s] == i, 1, 0) for s in range(num_slots)])
            solver.add(penalty >= scheduled_count - 1)
            solver.add(penalty >= 0)

    # Solve
    check_result = solver.check()
    
    model = solver.model()
    return build_schedule(model, schedule, employees, num_days, num_slots)
    
def build_schedule(model, schedule, employees, num_days, num_slots):
    """
    Build a Python dictionary with the final schedule assignments.
    Keys are integers: d * num_slots + s, which uniquely represents
    (day d, slot s).
    """
    result = {}
    for d in range(num_days):
        for s in range(num_slots):
            emp_idx = model[schedule[d][s]].as_long()
            # Compute an integer key instead of the "dayD_slotS" string
            key = str(d * num_slots + s)
            result[key] = employees[emp_idx]
    return result




import json

if __name__ == "__main__":
    # Example JSON request payload
    request_json = json.dumps({
        "user": "security",
        "num_days": 7,
        "num_slots": 14,
        "workers": [
            "Employee1", "Employee2", "Employee3", "Employee4", "Employee5",
            "Employee6", "Employee7", "Employee8", "Employee9", "Employee10",
            "Employee11", "Employee12", "Employee13", "Employee14", "Employee15",
            "Employee16", "Employee17", "Employee18", "Employee19", "Employee20",
            "Employee21", "Employee22"
        ],
        "managers": ["Employee1", "Employee2", "Employee3", "Employee4", "Employee5"]
    })

    # Deserialize JSON string back into a Python dictionary
    request_data = json.loads(request_json)

    # Extract the data from the JSON object
    workers = request_data.get('workers', [])
    num_days = request_data.get('num_days', 7)
    num_slots = request_data.get('num_slots', 14)
    managers = request_data.get('managers', [])

    # Call the security function
    schedule_dict = security(workers, managers, num_days=num_days, num_slots=num_slots)
    
    # Output the result
    if schedule_dict is not None:
        print("Found a schedule:")
        # Serialize the result back into JSON format for display
        print(json.dumps(schedule_dict, indent=4))
    else:
        print("No solution found.")
