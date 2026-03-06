import os
import sys
import subprocess
import time

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(os.path.dirname(BASE_DIR))

# List of test files to run
TEST_FILES = [f for f in os.listdir(BASE_DIR) if f.startswith("test_") and f.endswith(".py")]
TEST_FILES.sort()

def run_test_file(filename):
    """Runs a single test file as a separate process."""
    print(f"\n--- Running {filename} ---")
    cmd = [sys.executable, filename]
    env = os.environ.copy()
    # Add BASE_DIR to PYTHONPATH so tests can find helpers.py
    env["PYTHONPATH"] = BASE_DIR + os.pathsep + BACKEND_DIR
    
    start_time = time.time()
    process = subprocess.Popen(
        cmd,
        cwd=BASE_DIR,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        env=env
    )
    
    output, _ = process.communicate()
    end_time = time.time()
    
    success = process.returncode == 0
    return success, output, end_time - start_time

def main():
    print("="*70)
    print("  NextGen Smart Store — Vendor Modular Unit Tests (Multi-Process)")
    print("="*70)
    
    results = []
    total_passed = 0
    total_failed = 0
    
    for test_file in TEST_FILES:
        success, output, duration = run_test_file(test_file)
        if success:
            print(f"✅ {test_file} PASSED ({duration:.2f}s)")
            total_passed += 1
        else:
            print(f"❌ {test_file} FAILED ({duration:.2f}s)")
            print("-" * 40)
            print(output)
            print("-" * 40)
            total_failed += 1
            
        results.append((test_file, success, duration))

    print("\n" + "="*70)
    print("  FINAL SUMMARY")
    print("-" * 70)
    for name, success, duration in results:
        status = "✅" if success else "❌"
        print(f"{status} {name:<25} | {duration:>6.2f}s")
    
    print("-" * 70)
    print(f"Total: {len(results)} | Passed: {total_passed} | Failed: {total_failed}")
    if len(results) > 0:
        print(f"Success Rate: {(total_passed / len(results) * 100):.1f}%")
    print("="*70)

if __name__ == "__main__":
    main()
