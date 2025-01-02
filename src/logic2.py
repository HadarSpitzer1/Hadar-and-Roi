from z3 import Optimize, Int, If, Sum, Implies, Or, sat
from flask import jsonify, make_response

def security(workers, managers, num_days=7, num_slots=15, 
            unavailable_constraints=None, prefer_not_to=None):
    """
    Entry point for scheduling.
    :param workers: list of employee names (strings)
    :param managers: list of manager names (subset of 'workers')
    :param num_days: integer, how many days to schedule
    :param num_slots: integer, how many slots per day
    :param unavailable_constraints: dict(employee -> list of blocked indices)
    :param prefer_not_to: dict(employee -> list of disliked indices) (soft constraints)
    :return: dictionary with schedule OR None if no solution
    """
    schedule_solution = solve_schedule(
        employees=workers,
        num_days=num_days,
        num_slots=num_slots,
        managers=managers,
        unavailable_constraints=unavailable_constraints or {},
        prefer_not_to=prefer_not_to or {}
    )
    return schedule_solution

def solve_schedule(employees, num_days, num_slots, managers,
                  unavailable_constraints, prefer_not_to):
    # Use Optimize() instead of Solver() to handle soft constraints
    opt = Optimize()
    num_employees = len(employees)

    # Create a 2D array of Int variables: schedule[d][s] ∈ [0..num_employees - 1]
    schedule = [
        [Int(f'schedule_{d}_{s}') for s in range(num_slots)]
        for d in range(num_days)
    ]

    # Constrain domain of each schedule variable to valid employee indices
    for d in range(num_days):
        for s in range(num_slots):
            opt.add(schedule[d][s] >= 0, schedule[d][s] < num_employees)

    # Process unavailable constraints
    for e_name, blocked_indices in unavailable_constraints.items():
        if e_name not in employees:
            continue
        e_idx = employees.index(e_name)
        for idx in blocked_indices:
            d = idx // num_slots
            s = idx % num_slots
            if d < num_days and s < num_slots:
                opt.add(schedule[d][s] != e_idx)

    # Define slot groups
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
        opt.add(Sum(total_shifts_for_i) <= 6)

    # 2) One schedule per group per day for each employee
    for d in range(num_days):
        for i in range(num_employees):
            opt.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group1]) <= 1)
            opt.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group2]) <= 1)
            opt.add(Sum([If(schedule[d][s] == i, 1, 0) for s in group3]) <= 1)

    # 3) No double-scheduling in group2
    for d in range(num_days):
        for i in range(num_employees):
            in_group2 = Sum([If(schedule[d][s] == i, 1, 0) for s in group2])
            in_group1 = Sum([If(schedule[d][s] == i, 1, 0) for s in group1])
            in_group3 = Sum([If(schedule[d][s] == i, 1, 0) for s in group3])
            opt.add(Implies(in_group2 >= 1, in_group1 == 0))
            opt.add(Implies(in_group2 >= 1, in_group3 == 0))

    # 4) Manager constraint: each group each day must have at least 1 manager
    for d in range(num_days):
        for grp in (group1, group2, group3):
            opt.add(
                Sum([
                    If(Or([schedule[d][s] == m for m in manager_indices]), 1, 0)
                    for s in grp
                ]) >= 1
            )

    # 5) Process prefer_not_to constraints (soft constraints)
    prefer_not_to_penalties = []
    for e_name, prefer_indices in prefer_not_to.items():
        if e_name not in employees:
            continue
        e_idx = employees.index(e_name)
        for idx in prefer_indices:
            d = idx // num_slots
            s = idx % num_slots
            if d < num_days and s < num_slots:
                penalty_expr = If(schedule[d][s] == e_idx, 1, 0)
                prefer_not_to_penalties.append(penalty_expr)

    # Add the prefer_not_to penalties to the optimization
    if prefer_not_to_penalties:
        total_prefer_not_penalty = Sum(prefer_not_to_penalties)
        opt.minimize(total_prefer_not_penalty)

    # 6) Penalty for multiple shifts per day (soft constraint)
    daily_penalties = []
    for d in range(num_days):
        for i in range(num_employees):
            penalty = Int(f'penalty_{d}_{i}')
            scheduled_count = Sum([If(schedule[d][s] == i, 1, 0) for s in range(num_slots)])
            opt.add(penalty >= scheduled_count - 1)
            opt.add(penalty >= 0)
            daily_penalties.append(penalty)

    # Also minimize the daily scheduling penalties
    if daily_penalties:
        opt.minimize(Sum(daily_penalties))

    # Solve
    check_result = opt.check()
    if check_result != sat:
        return None

    model = opt.model()
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
            key = str(d * num_slots + s)
            result[key] = employees[emp_idx]
    return result

if __name__ == "__main__":
    # Example usage with the new constraints
    import json

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
        "managers": ["Employee1", "Employee2", "Employee3", "Employee4", "Employee5"],
        "unavailable_constraints": {
            "Employee1": [0, 1, 2],  # Employee1 can't work in these slots
            "Employee2": [10, 11, 12]  # Employee2 can't work in these slots
        },
        "prefer_not_to": {
            "Employee3": [20, 21, 22],  # Employee3 prefers not to work in these slots
            "Employee4": [30, 31, 32]  # Employee4 prefers not to work in these slots
        }
    })

    # Deserialize JSON string back into a Python dictionary
    request_data = json.loads(request_json)

    # Extract the data from the JSON object
    workers = request_data.get('workers', [])
    num_days = request_data.get('num_days', 7)
    num_slots = request_data.get('num_slots', 14)
    managers = request_data.get('managers', [])
    unavailable = request_data.get('unavailable_constraints', {})
    prefer_not_to = request_data.get('prefer_not_to', {})

    # Call the security function with the new constraints
    schedule_dict = security(
        workers, 
        managers, 
        num_days=num_days, 
        num_slots=num_slots,
        unavailable_constraints=unavailable,
        prefer_not_to=prefer_not_to
    )
    
    # Output the result
    if schedule_dict is not None:
        print("Found a schedule:")
        print(json.dumps(schedule_dict, indent=4))
    else:
        print("No solution found.")