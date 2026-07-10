#!/usr/bin/env python3
"""A simple command-line calculator."""

import sys


def add(a, b):
    return a + b


def subtract(a, b):
    return a - b


def multiply(a, b):
    return a * b


def divide(a, b):
    if b == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return a / b


OPERATIONS = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
}


def calculate(a, operator, b):
    if operator not in OPERATIONS:
        raise ValueError(f"Unsupported operator: {operator}")
    return OPERATIONS[operator](a, b)


def run_interactive():
    print("Simple Calculator (type 'quit' to exit)")
    print("Usage: <number> <operator> <number>, e.g. 3 + 4")

    while True:
        try:
            expression = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if expression.lower() in ("quit", "exit"):
            break
        if not expression:
            continue

        parts = expression.split()
        if len(parts) != 3:
            print("Error: please use the format <number> <operator> <number>")
            continue

        num1_str, operator, num2_str = parts
        try:
            num1 = float(num1_str)
            num2 = float(num2_str)
            result = calculate(num1, operator, num2)
            print(result)
        except ValueError as e:
            print(f"Error: {e}")
        except ZeroDivisionError as e:
            print(f"Error: {e}")


def main():
    if len(sys.argv) == 4:
        num1_str, operator, num2_str = sys.argv[1:4]
        try:
            num1 = float(num1_str)
            num2 = float(num2_str)
            result = calculate(num1, operator, num2)
            print(result)
        except (ValueError, ZeroDivisionError) as e:
            print(f"Error: {e}")
            sys.exit(1)
    elif len(sys.argv) == 1:
        run_interactive()
    else:
        print("Usage: calculator.py <number> <operator> <number>")
        print("   or: calculator.py  (for interactive mode)")
        sys.exit(1)


if __name__ == "__main__":
    main()
