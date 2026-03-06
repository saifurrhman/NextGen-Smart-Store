import os
import sys
import subprocess
import time

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
INTEGRATION_DIR = os.path.dirname(BASE_DIR)            
BACKEND_DIR = os.path.dirname(os.path.dirname(INTEGRATION_DIR))

# List of test files to run
TEST_FILES = [f for f in os.listdir(BASE_DIR) if f.startswith("test_") and f.endswith(".py")]
TEST_FILES.sort()

def run_test_file(filename):
    """Runs a single test file as a separate process."""
    print(f"\n>>> Running Delivery Integration Test: {filename} <<<")
    cmd = [sys.executable, filename]
    env = os.environ.copy()
    env["PYTHONPATH"] = os.pathsep.join([BASE_DIR, INTEGRATION_DIR, BACKEND_DIR])
    
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
    print("="*80)
    print("  NextGen Smart Store — Delivery INTEGRATION Tests")
    print("  Testing End-to-End Delivery Workflows")
    print("="*80)
    
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
            print("-" * 50)
            print(output)
            print("-" * 50)
            total_failed += 1
            
        results.append((test_file, success, duration))

    print("\n" + "="*80)
    print("  INTEGRATION SUMMARY")
    print("-" * 80)
    for name, success, duration in results:
        status = "✅" if success else "❌"
        print(f"{status} {name:<30} | {duration:>7.2f}s")
    
    print("-" * 80)
    print(f"Total: {len(results)} | Passed: {total_passed} | Failed: {total_failed}")
    if len(results) > 0:
        print(f"Integration Success Rate: {(total_passed / len(results) * 100):.1f}%")
    print("="*80)

if __name__ == "__main__":
    main()
