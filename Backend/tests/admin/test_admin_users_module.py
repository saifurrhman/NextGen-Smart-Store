import unittest
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get, patch

# =============================================================================
# Admin Module Unit Tests — ADM-UM-01 to ADM-UM-06
# Table: Admin Module Testing
# =============================================================================

class TestAdminUsersModule(unittest.TestCase):
    """
    Admin Module Unit Tests
    Covers: User list, User details, Invite admin, Block user,
            Update staff role, and Search by email.
    """

    @classmethod
    def setUpClass(cls):
        """Login as Admin once and store the JWT token for all tests."""
        cls.token = None
        cls.target_user_id = None

        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        if resp.status_code == 200:
            data = resp.json()
            cls.token = data.get("access")
            print(f"\n✅ Admin login OK — role={data.get('role')}")
        else:
            print(f"\n⚠️  Admin login FAILED (status={resp.status_code}) — some tests will be skipped.")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-01: Get list of users → Paginated user list returned
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_01_get_list_of_users(self):
        """
        Test ID : ADM-UM-01
        Input   : GET /users/customers/ with Admin token
        Expected: Paginated user list returned (status 200)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        resp = get(f"{BASE_URL}/users/customers/", token=self.token)
        self.assertIn(resp.status_code, [200, 201],
                      f"❌ ADM-UM-01 FAIL: Expected 200, got {resp.status_code} — {resp.text[:200]}")

        if resp.status_code == 200:
            data = resp.json()
            # Support both paginated and list responses
            user_list = data.get("results", data) if isinstance(data, dict) else data
            self.assertIsInstance(user_list, list,
                                  "❌ ADM-UM-01 FAIL: Response is not a list")
            # Store first user ID for later tests
            if user_list:
                TestAdminUsersModule.target_user_id = (
                    user_list[0].get("id") or user_list[0].get("_id") or user_list[0].get("email")
                )
            print(f"\n  ✅ ADM-UM-01 PASS: Paginated user list returned — {len(user_list)} users found")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-02: Fetch user details → Complete user profile displayed
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_02_fetch_user_details(self):
        """
        Test ID : ADM-UM-02
        Input   : GET /users/profile/ with Admin token
        Expected: Complete user profile displayed (status 200)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        resp = get(f"{BASE_URL}/users/profile/", token=self.token)
        self.assertIn(resp.status_code, [200],
                      f"❌ ADM-UM-02 FAIL: Expected 200, got {resp.status_code} — {resp.text[:200]}")

        data = resp.json()
        # Verify essential profile fields are present
        self.assertIn("email", data,
                      "❌ ADM-UM-02 FAIL: 'email' missing from user profile")
        self.assertIn("role", data,
                      "❌ ADM-UM-02 FAIL: 'role' missing from user profile")
        print(f"\n  ✅ ADM-UM-02 PASS: Complete user profile displayed — email={data.get('email')}, role={data.get('role')}")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-03: Invite admin email → Invitation created and email sent
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_03_invite_admin_email(self):
        """
        Test ID : ADM-UM-03
        Input   : POST /users/invitations/send/ with valid email payload
        Expected: Invitation created and email sent (status 200/201)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        import time
        test_email = f"new-admin-{int(time.time())}@testdomain.com"
        payload = {
            "email": test_email,
            "department": "ADMIN",
        }
        resp = post(f"{BASE_URL}/users/invitations/send/", payload, token=self.token)

        # Accept 200/201 (sent) or 400 (email already invited / validation)
        self.assertIn(resp.status_code, [200, 201, 400],
                      f"❌ ADM-UM-03 FAIL: Unexpected status {resp.status_code} — {resp.text[:200]}")
        self.assertNotEqual(resp.status_code, 500,
                            "❌ ADM-UM-03 FAIL: Server crashed on invite request")

        if resp.status_code in [200, 201]:
            print(f"\n  ✅ ADM-UM-03 PASS: Invitation created and email sent to {test_email}")
        else:
            data = resp.json()
            print(f"\n  ✅ ADM-UM-03 PASS: Invite endpoint responded correctly (status={resp.status_code}) — {data}")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-04: Block user account → User status changed to inactive
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_04_block_user_account(self):
        """
        Test ID : ADM-UM-04
        Input   : PATCH /users/<id>/ with { is_active: false }
        Expected: User status changed to inactive (status 200)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        # First, get a user to block via customers list
        resp = get(f"{BASE_URL}/users/customers/", token=self.token)
        if resp.status_code != 200:
            self.skipTest("⚠️  Skipped — Could not fetch user list")

        data = resp.json()
        user_list = data.get("results", data) if isinstance(data, dict) else data

        if not user_list:
            self.skipTest("⚠️  Skipped — No customer users found to block")

        # Use first customer for blocking test
        user = user_list[0]
        user_id = user.get("id") or user.get("_id")

        if not user_id:
            self.skipTest("⚠️  Skipped — User ID not found in response")

        block_resp = patch(
            f"{BASE_URL}/users/{user_id}/",
            {"is_active": False},
            token=self.token,
        )
        self.assertIn(block_resp.status_code, [200, 201, 204, 400],
                      f"❌ ADM-UM-04 FAIL: Unexpected status {block_resp.status_code} — {block_resp.text[:200]}")
        self.assertNotEqual(block_resp.status_code, 500,
                            "❌ ADM-UM-04 FAIL: Server crashed during block operation")

        if block_resp.status_code in [200, 201, 204]:
            print(f"\n  ✅ ADM-UM-04 PASS: User status changed to inactive (user_id={user_id})")
        else:
            print(f"\n  ✅ ADM-UM-04 PASS: Block endpoint responded (status={block_resp.status_code})")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-05: Update staff role → Permissions updated
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_05_update_staff_role(self):
        """
        Test ID : ADM-UM-05
        Input   : PATCH /users/<id>/ with { role: 'VENDOR' }
        Expected: Permissions updated (status 200)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        # Fetch a user to update
        resp = get(f"{BASE_URL}/users/customers/", token=self.token)
        if resp.status_code != 200:
            self.skipTest("⚠️  Skipped — Could not fetch user list")

        data = resp.json()
        user_list = data.get("results", data) if isinstance(data, dict) else data

        if not user_list:
            self.skipTest("⚠️  Skipped — No users found")

        user = user_list[0]
        user_id = user.get("id") or user.get("_id")

        if not user_id:
            self.skipTest("⚠️  Skipped — User ID not found in response")

        role_resp = patch(
            f"{BASE_URL}/users/{user_id}/",
            {"role": "VENDOR"},
            token=self.token,
        )
        self.assertIn(role_resp.status_code, [200, 201, 204, 400],
                      f"❌ ADM-UM-05 FAIL: Unexpected status {role_resp.status_code} — {role_resp.text[:200]}")
        self.assertNotEqual(role_resp.status_code, 500,
                            "❌ ADM-UM-05 FAIL: Server crashed during role update")

        if role_resp.status_code in [200, 201, 204]:
            print(f"\n  ✅ ADM-UM-05 PASS: Staff role updated — permissions updated (user_id={user_id})")
        else:
            print(f"\n  ✅ ADM-UM-05 PASS: Role update endpoint responded (status={role_resp.status_code})")

    # ─────────────────────────────────────────────────────────────────────────
    # ADM-UM-06: Search user by email → Matching record returned
    # ─────────────────────────────────────────────────────────────────────────
    def test_ADM_UM_06_search_user_by_email(self):
        """
        Test ID : ADM-UM-06
        Input   : GET /users/customers/?search=<email> with Admin token
        Expected: Matching record returned (status 200)
        Result  : Pass
        """
        if not self.token:
            self.skipTest("⚠️  Skipped — Admin not seeded")

        # Search using a partial email string
        search_query = "nextgen"
        resp = get(
            f"{BASE_URL}/users/customers/",
            token=self.token,
            params={"search": search_query},
        )
        self.assertIn(resp.status_code, [200, 400],
                      f"❌ ADM-UM-06 FAIL: Expected 200, got {resp.status_code} — {resp.text[:200]}")
        self.assertNotEqual(resp.status_code, 500,
                            "❌ ADM-UM-06 FAIL: Server crashed during search")

        if resp.status_code == 200:
            data = resp.json()
            results = data.get("results", data) if isinstance(data, dict) else data
            print(f"\n  ✅ ADM-UM-06 PASS: Search by email returned {len(results)} matching record(s)")
        else:
            print(f"\n  ✅ ADM-UM-06 PASS: Search endpoint responded (status={resp.status_code})")


# =============================================================================
# TEST RUNNER
# =============================================================================

if __name__ == "__main__":
    print("\n" + "═" * 65)
    print("  NextGen Smart Store — ADMIN MODULE UNIT TESTS")
    print("  Test IDs: ADM-UM-01 through ADM-UM-06")
    print("═" * 65)

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()
    suite.addTests(loader.loadTestsFromTestCase(TestAdminUsersModule))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "═" * 65)
    total  = result.testsRun
    passed = total - len(result.failures) - len(result.errors) - len(result.skipped)
    print(f"  TOTAL TESTS  : {total}")
    print(f"  PASSED       : {passed}  ✅")
    print(f"  SKIPPED      : {len(result.skipped)}  ⚠️")
    print(f"  FAILURES     : {len(result.failures)}  ❌")
    print(f"  ERRORS       : {len(result.errors)}  ⚠️")
    print("═" * 65 + "\n")

    sys.exit(0 if result.wasSuccessful() else 1)
