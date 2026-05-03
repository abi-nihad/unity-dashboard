import sys

def check_braces(filename):
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    balance = 0
    line_num = 1
    for char in content:
        if char == '{':
            balance += 1
        elif char == '}':
            balance -= 1
            if balance < 0:
                print(f"Unmatched closing brace at line {line_num}")
                balance = 0
        elif char == '\n':
            line_num += 1
    
    if balance > 0:
        print(f"Unmatched opening brace(s): {balance}")
    elif balance == 0:
        print("Braces are balanced.")

if __name__ == "__main__":
    check_braces('unity-app.js')
