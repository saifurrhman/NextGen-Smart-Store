import os
import sys
import subprocess
import time

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__)) 
BACKEND_DIR = os.path.dirname(os.path.dirname(BASE_DIR))

def main():
    print("="*80)
    print("  NextGen Smart Store — COMPLETE SYSTEM TESTING")
    print("  Testing End-to-End stakeholder coordination")
    print("="*80)
    
    test_file = os.path.join(BASE_DIR, "test_master_lifecycle.py")
    
    cmd = [sys.executable, test_file]
    env = os.environ.copy()
    # Path needed to find integration helpers
    INTEGRATION_DIR = os.path.join(BACKEND_DIR, "tests", "integration")
    env["PYTHONPATH"] = os.pathsep.join([BACKEND_DIR, INTEGRATION_DIR, BASE_DIR])
    
    start_time = time.time()
    process = subprocess.Popen(
        cmd,
        cwd=BASE_DIR,
        stdout=sys.stdout,
        stderr=sys.stderr,
        text=True,
        env=env
    )
    
    process.wait()
    duration = time.time() - start_time
    
    print("\n" + "="*80)
    if process.returncode == 0:
        print(f"✅ SYSTEM TEST PASSED ({duration:.2f}s)")
        print("Full coordinating cycle across Admin, Vendor, Customer, and Delivery verified.")
    else:
        print(f"❌ SYSTEM TEST FAILED ({duration:.2f}s)")
    print("="*80)

if __name__ == "__main__":
    main()
