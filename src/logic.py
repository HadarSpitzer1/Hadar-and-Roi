from z3 import *

# Define variables
s = Solver()
workers = ["A", "B", "C", "D"]
month_length = len(workers)*7
days = [ i for i in range(month_length)]
shifts = {day: {worker: Bool(f"{worker}_{day}") for worker in workers} for day in days}

def worker_w_cannot_in_day_d(w,d,s):
    s.add(Bool(f"{w}_{d}")==False)


# Constraints: Only one worker per shift
for day in days:
    all_workers_in_this_shift = []
    for worker in workers:
        all_workers_in_this_shift.append(Bool(f"{worker}_{day}"))
    amount_of_active_workers_on_this_shift = Sum(all_workers_in_this_shift)
    s.add(amount_of_active_workers_on_this_shift == 1)


# Each worker gets two shifts per week, except when assigned a Friday shift
week_length = 7
for i in range(0, month_length, week_length):
    current_week = days[i:i + week_length]
    for worker in workers:
        all_shifts_of_this_worker_on_this_week = []
        for d in current_week:
            all_shifts_of_this_worker_on_this_week.append(Bool(f"{worker}_{d}"))
        # Sum up all shifts for this worker in the week
            active_shifts_of_this_worker_on_this_week = Sum(all_shifts_of_this_worker_on_this_week)
        # Ensure that the sum is <= 2, or the worker has a shift on Friday (current_week[5])
            s.add(active_shifts_of_this_worker_on_this_week <= If(Bool(f"{worker}_{current_week[5]}") == True, 1,2))


# Each worker has a Friday shift once a month
week_length = 7
for worker in workers:
    all_thursday_shifts_of_this_worker = []
    all_friday_shifts_of_this_worker = []
    all_saturday_shifts_of_this_worker = []
    for i in range(0, month_length, week_length):
        current_week = days[i:i + week_length]
        all_thursday_shifts_of_this_worker.append(Bool(f"{worker}_{current_week[4]}"))
        all_friday_shifts_of_this_worker.append(Bool(f"{worker}_{current_week[5]}"))
        all_saturday_shifts_of_this_worker.append(Bool(f"{worker}_{current_week[6]}"))
    s.add(Sum(all_thursday_shifts_of_this_worker) >= 1 )
    s.add(Sum(all_friday_shifts_of_this_worker) >= 1 )
    s.add(Sum(all_saturday_shifts_of_this_worker) >= 1 )

worker_w_cannot_in_day_d("A",2,s)
worker_w_cannot_in_day_d("A",3,s)
worker_w_cannot_in_day_d("A",4,s)
worker_w_cannot_in_day_d("A",5,s)
worker_w_cannot_in_day_d("A",6,s)
worker_w_cannot_in_day_d("C",0,s)
worker_w_cannot_in_day_d("C",1,s)
worker_w_cannot_in_day_d("C",7,s)
worker_w_cannot_in_day_d("C",14,s)
worker_w_cannot_in_day_d("C",21,s)
# Check if the problem is solvable and display one solution
if s.check() == sat:
    model = s.model()
    schedule = {day: None for day in days}
    for day in days:
        for worker in workers:
            if model[shifts[day][worker]]:
                schedule[day] = worker
else:
    print("No solution exists!")

a = 0