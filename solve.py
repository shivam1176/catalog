import json
from sympy import symbols

# Function to read and parse JSON data
def read_json(file_path):
    try:
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data
    except Exception as e:
        print(f"Error reading JSON file: {e}")
        return None

# Function to convert a string number from a specified base to decimal
def convert_base(value, base):
    return int(value, base)

# Function to calculate Lagrange interpolation for the constant term (c)
def lagrange_interpolation(points):
    x = symbols('x')
    constant_term = 0

    for i, (xi, yi) in enumerate(points):
        li = 1
        for j, (xj, _) in enumerate(points):
            if i != j:
                li *= (x - xj) / (xi - xj)
        constant_term += yi * li.subs(x, 0)  # Substitute x = 0 to find constant term

    return round(constant_term)  # Round to nearest integer

# Main function to solve the polynomial
def solve_polynomial(file_path):
    data = read_json(file_path)
    if not data:
        return

    n = data['keys']['n']
    k = data['keys']['k']

    points = []
    for i in range(1, n + 1):
        key = str(i)
        if key in data:
            x = int(key)
            base = int(data[key]['base'])
            value = data[key]['value']
            y = convert_base(value, base)
            points.append((x, y))
        else:
            print(f"Warning: Root {key} is missing in JSON data.")

    if len(points) < k:
        print(f"Error: Not enough points (only {len(points)}) to solve for polynomial of degree {k - 1}")
        return

    constant_term = lagrange_interpolation(points)
    print("Calculated constant term (c):", constant_term)

# Run the function with two test cases
print("Test Case 1:")
solve_polynomial('testcase1.json')

print("\nTest Case 2:")
solve_polynomial('testcase2.json')
