from z3 import *

# Define the number of employees and time slots
num_employees = 22  # Example number of employees
num_days = 7
num_slots = 14

# Create a Z3 solver
solver = Solver()

# Create a 2D list of boolean variables for scheduling
schedule = [[ [Bool(f'employee_{i}_day_{d}_slot_{s}') for s in range(num_slots)] for i in range(num_employees)] for d in range(num_days)]

# Define the list of managers (example: employees 0, 1, and 2 are managers)
managers = [0, 1, 2,3,4,5,6]  # Adjust this list based on your actual manager IDs

def exactly_one_employee_per_slot(solver, schedule, num_days, num_slots, num_employees):
    for d in range(num_days):
        for s in range(num_slots):
            solver.add(Sum([If(schedule[d][i][s], 1, 0) for i in range(num_employees)]) == 1)

def add_one_schedule_per_group_per_day(solver, schedule, num_days, num_employees):
    for d in range(num_days):
        for i in range(num_employees):
            # Group 1: Slots 0-5
            solver.add(Sum([If(schedule[d][i][s], 1, 0) for s in range(6)]) <= 1)
            # Group 2: Slots 6-9
            solver.add(Sum([If(schedule[d][i][s], 1, 0) for s in range(6, 10)]) <= 1)
            # Group 3: Slots 10-13
            solver.add(Sum([If(schedule[d][i][s], 1, 0) for s in range(10, 14)]) <= 1)

def add_max_six_times_per_employee(solver, schedule, num_days, num_slots, num_employees):
    for i in range(num_employees):
        solver.add(Sum([If(schedule[d][i][s], 1, 0) for d in range(num_days) for s in range(num_slots)]) <= 6)

def add_no_double_scheduling_in_group_two(solver, schedule, num_days, num_employees):
    for d in range(num_days):
        for i in range(num_employees):
            # If scheduled in group 2 (slots 6-9), they cannot be scheduled in other groups
            solver.add(Implies(Sum([If(schedule[d][i][s], 1, 0) for s in range(6, 10)]) >= 1,
                                Sum([If(schedule[d][i][s], 1, 0) for s in range(0, 6)]) == 0))
            solver.add(Implies(Sum([If(schedule[d][i][s], 1, 0) for s in range(6, 10)]) >= 1,
                                Sum([If(schedule[d][i][s], 1, 0) for s in range(10, 14)]) == 0))

def add_manager_constraint(solver, schedule, num_days, num_employees):
    for d in range(num_days):
        # Ensure at least one manager is scheduled in each group for each day
        for group_start in [0, 6, 10]:  # Starting slots for each group
            # Adjust the end range to avoid IndexError
            end_slot = min(group_start + 5, num_slots)  # Ensure we don't exceed num_slots
            solver.add(Sum([If(schedule[d][m][s], 1, 0) for m in managers for s in range(group_start, end_slot)]) >= 1)

def add_preference_no_double_scheduling_per_day(solver, schedule, num_days, num_employees):
    for d in range(num_days):
        for i in range(num_employees):
            # Create a penalty variable for double scheduling
            penalty = Int(f'penalty_{d}_{i}')
            # Add a constraint that counts the number of slots scheduled for the employee
            scheduled_count = Sum([If(schedule[d][i][s], 1, 0) for s in range(num_slots)])
            # The penalty is 1 if the employee is scheduled more than once
            solver.add(penalty >= scheduled_count - 1)
            solver.add(penalty >= 0)  # Penalty cannot be negative

            # Optionally, you can add a soft constraint to minimize the total penalty
            # This would require a separate objective function if using a solver that supports it

# Call the constraint functions
exactly_one_employee_per_slot(solver, schedule, num_days, num_slots, num_employees)
add_one_schedule_per_group_per_day(solver, schedule, num_days, num_employees)
add_max_six_times_per_employee(solver, schedule, num_days, num_slots, num_employees)
add_no_double_scheduling_in_group_two(solver, schedule, num_days, num_employees)
add_manager_constraint(solver, schedule, num_days, num_employees)
add_preference_no_double_scheduling_per_day(solver, schedule, num_days, num_employees)

def print_schedule(schedule_table, num_days, num_slots):
    # Define the width for employee names and padding
    employee_width = 6
    padding = 2

    # Print the schedule table
   
    print()  # New line after header
    for d in range(num_days):
        print("-" * employee_width + "|", end='')  # Adjust separator length
    print()  # New line after header separator

    for s in range(num_slots):
        print(f"| Slot {s:<2} |", end='')
        for d in range(num_days):
            # Use a fixed width for the output, e.g., 20 characters with padding
            employee_list = schedule_table[s][d].strip(', ') if schedule_table[s][d] else 'Free'
            print(f" {employee_list:<{employee_width}} |", end='')  # Adjust padding here
        print()  # New line after each slot


        # Add a larger separation after the 6th row
        if s == 5 or s==9:  # After the 6th row (index 5)
            print("\n" + "-" * 70 + "\n")  # Larger separation line

# Check if the solution exists
if solver.check() == sat:
    model = solver.model()
    # Create a table to hold the schedule
    schedule_table = [['' for _ in range(num_days)] for _ in range(num_slots)]
    
    # Populate the schedule table
    for d in range(num_days):
        for s in range(num_slots):
            for i in range(num_employees):
                if model.evaluate(schedule[d][i][s]):
                    schedule_table[s][d] += f'  {i}, '

    # Call the print function
    print_schedule(schedule_table, num_days, num_slots)
else:
    print("No solution found.")
