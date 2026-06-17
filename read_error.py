import sys

def read_log(path):
    print(f"Reading {path}:")
    try:
        with open(path, 'r', encoding='utf-16') as f:
            content = f.read()
            print("Read with UTF-16 successfully.")
            return content
    except Exception as e1:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
                print("Read with UTF-8 successfully.")
                return content
        except Exception as e2:
            try:
                with open(path, 'r', encoding='latin1') as f:
                    content = f.read()
                    print("Read with Latin1 successfully.")
                    return content
            except Exception as e3:
                return f"Errors: utf16={e1}, utf8={e2}, latin1={e3}"

if __name__ == '__main__':
    # Print last 1000 characters of error.txt and approve_error.txt
    import os
    for filename in ['error.txt', 'approve_error.txt']:
        if os.path.exists(filename):
            txt = read_log(filename)
            print("-" * 40)
            print(txt[-2000:])
            print("=" * 40)
        else:
            print(f"{filename} does not exist")
