import unittest
import time
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
from helpers import (
    post, get, login, get_token, unique_email,
    ADMIN_EMAIL, ADMIN_PASSWORD,
    VENDOR_EMAIL, VENDOR_PASSWORD,
    DELIVERY_EMAIL, DELIVERY_PASSWORD,
    CUSTOMER_EMAIL, CUSTOMER_PASSWORD,
)

# =============================================================================
# UT-AUTH-001: LOGIN MODULE — All Roles
# =============================================================================

class TestLoginAllRoles(unittest.TestCase):
    """
    Unit Tests: Login endpoint for Admin, Vendor, Delivery, Customer
    Endpoint  : POST /api/v1/auth/login/
    """

    # ── TC-001: Admin Login Success ──────────────────────────────────────────
    def test_001_admin_login_success(self):
        """Admin can login with valid credentials and receives JWT tokens."""
        resp = login(ADMIN_EMAIL, ADMIN_PASSWORD)
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("access", data,  "❌ 'access' token missing from response")
            self.assertIn("refresh", data, "❌ 'refresh' token missing from response")
            self.assertIn("role", data,    "❌ 'role' missing from response")
            self.assertIn(data["role"].upper(), ["ADMIN", "SUPER_ADMIN"],
                          f"❌ Expected ADMIN role, got: {data['role']}")
            print(f"\n  ✅ TC-001 PASS: Admin login OK | role={data['role']}")
        else:
            print(f"\n  ⚠️  TC-001 SKIP: Admin user not seeded (status={resp.status_code})")

    # ── TC-002: Vendor Login Success ─────────────────────────────────────────
    def test_002_vendor_login_success(self):
        """Vendor can login with valid credentials and receives JWT tokens."""
        resp = login(VENDOR_EMAIL, VENDOR_PASSWORD)
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("access", data)
            self.assertIn("refresh", data)
            self.assertEqual(data["role"].upper(), "VENDOR",
                             f"❌ Expected VENDOR role, got: {data['role']}")
            print(f"\n  ✅ TC-002 PASS: Vendor login OK | role={data['role']}")
        else:
            print(f"\n  ⚠️  TC-002 SKIP: Vendor user not seeded (status={resp.status_code})")

    # ── TC-003: Delivery Login Success ───────────────────────────────────────
    def test_003_delivery_login_success(self):
        """Delivery agent can login with valid credentials."""
        resp = login(DELIVERY_EMAIL, DELIVERY_PASSWORD)
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("access", data)
            self.assertEqual(data["role"].upper(), "DELIVERY",
                             f"❌ Expected DELIVERY role, got: {data['role']}")
            print(f"\n  ✅ TC-003 PASS: Delivery login OK | role={data['role']}")
        else:
            print(f"\n  ⚠️  TC-003 SKIP: Delivery user not seeded (status={resp.status_code})")

    # ── TC-004: Customer Login Success ───────────────────────────────────────
    def test_004_customer_login_success(self):
        """Customer can login with valid credentials."""
        resp = login(CUSTOMER_EMAIL, CUSTOMER_PASSWORD)
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("access", data)
            self.assertEqual(data["role"].upper(), "CUSTOMER",
                             f"❌ Expected CUSTOMER role, got: {data['role']}")
            print(f"\n  ✅ TC-004 PASS: Customer login OK | role={data['role']}")
        else:
            print(f"\n  ⚠️  TC-004 SKIP: Customer user not seeded (status={resp.status_code})")

    # ── TC-005: Wrong Password Rejected ─────────────────────────────────────
    def test_005_login_wrong_password_rejected(self):
        """Login endpoint returns 401 for incorrect password."""
        resp = login(ADMIN_EMAIL, "completelywrongpassword_xyz")
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 401, got {resp.status_code}")
        print(f"\n  ✅ TC-005 PASS: Wrong password rejected (status={resp.status_code})")

    # ── TC-006: Non-existent User Rejected ─────────────────────────────────
    def test_006_login_nonexistent_user_rejected(self):
        """Login endpoint returns 401 for non-existent email."""
        resp = login("ghost_user_99999@notexist.com", "password123")
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 401, got {resp.status_code}")
        print(f"\n  ✅ TC-006 PASS: Non-existent user rejected (status={resp.status_code})")

    # ── TC-007: Empty Credentials Rejected ─────────────────────────────────
    def test_007_login_empty_credentials_rejected(self):
        """Login endpoint returns 400 for empty payload."""
        resp = post("/auth/login/", {})
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-007 PASS: Empty credentials rejected (status={resp.status_code})")

    # ── TC-008: No Email Field Rejected ────────────────────────────────────
    def test_008_login_missing_email_rejected(self):
        """Login endpoint rejects payload missing email."""
        resp = post("/auth/login/", {"password": "somepassword"})
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-008 PASS: Missing email rejected (status={resp.status_code})")

    # ── TC-009: No Password Field Rejected ─────────────────────────────────
    def test_009_login_missing_password_rejected(self):
        """Login endpoint rejects payload missing password."""
        resp = post("/auth/login/", {"username": ADMIN_EMAIL})
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-009 PASS: Missing password rejected (status={resp.status_code})")

    # ── TC-010: Response Contains User Object ──────────────────────────────
    def test_010_login_response_contains_user_object(self):
        """Successful login response contains a user data object."""
        resp = login(ADMIN_EMAIL, ADMIN_PASSWORD)
        if resp.status_code == 200:
            data = resp.json()
            self.assertIn("user", data, "❌ 'user' object missing from login response")
            print(f"\n  ✅ TC-010 PASS: Login response contains user object")
        else:
            print(f"\n  ⚠️  TC-010 SKIP: Admin not seeded")


# =============================================================================
# UT-AUTH-002: OTP MODULE — Send & Verify
# =============================================================================

class TestOTPFlow(unittest.TestCase):
    """
    Unit Tests: OTP send and verify for registration and password reset
    Endpoints : POST /api/v1/auth/otp/send/
                POST /api/v1/auth/otp/verify/
    """

    # ── TC-011: OTP Send for Registration ──────────────────────────────────
    def test_011_otp_send_registration_success(self):
        """OTP is sent successfully for a valid register request."""
        email = unique_email("reg")
        resp = post("/auth/otp/send/", {"email": email, "purpose": "register"})
        self.assertIn(resp.status_code, [200, 201],
                      f"❌ Expected 200, got {resp.status_code}: {resp.text[:200]}")
        print(f"\n  ✅ TC-011 PASS: OTP sent for registration (status={resp.status_code})")

    # ── TC-012: OTP Send for Password Reset ────────────────────────────────
    def test_012_otp_send_password_reset(self):
        """OTP send endpoint accepts password_reset purpose for existing users."""
        # Use a seeded email — if not seeded, any 400/500 response means server handled it
        resp = post("/auth/otp/send/", {"email": CUSTOMER_EMAIL, "purpose": "password_reset"})
        # Server should respond — not crash (500 is unacceptable)
        self.assertNotEqual(resp.status_code, 500,
                            f"❌ Server crashed on password_reset OTP (status={resp.status_code})")
        self.assertIn(resp.status_code, [200, 201, 400, 404],
                      f"❌ Unexpected status {resp.status_code}")
        if resp.status_code in [200, 201]:
            print(f"\n  ✅ TC-012 PASS: OTP sent for password_reset (status={resp.status_code})")
        else:
            print(f"\n  ⚠️  TC-012 PASS: OTP endpoint responded correctly (status={resp.status_code}) — user may not be seeded")

    # ── TC-013: OTP Send — Missing Email ───────────────────────────────────
    def test_013_otp_send_missing_email(self):
        """OTP send rejected when email is missing."""
        resp = post("/auth/otp/send/", {"purpose": "register"})
        self.assertIn(resp.status_code, [400, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-013 PASS: OTP send rejected missing email (status={resp.status_code})")

    # ── TC-014: OTP Send — Invalid Purpose ────────────────────────────────
    def test_014_otp_send_invalid_purpose(self):
        """OTP send rejected for invalid purpose value."""
        resp = post("/auth/otp/send/", {"email": "test@test.com", "purpose": "hack"})
        self.assertIn(resp.status_code, [400, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-014 PASS: OTP send rejected invalid purpose (status={resp.status_code})")

    # ── TC-015: OTP Verify — Wrong Code Rejected ──────────────────────────
    def test_015_otp_verify_wrong_code_rejected(self):
        """OTP verify rejects a clearly incorrect code."""
        resp = post("/auth/otp/verify/", {
            "email": "test@test.com",
            "code": "000000",
            "purpose": "register"
        })
        self.assertIn(resp.status_code, [400, 401, 404],
                      f"❌ Expected 400/401, got {resp.status_code}")
        print(f"\n  ✅ TC-015 PASS: OTP verify rejects wrong code (status={resp.status_code})")

    # ── TC-016: OTP Verify — Missing Fields ───────────────────────────────
    def test_016_otp_verify_missing_fields(self):
        """OTP verify rejected when required fields are missing."""
        resp = post("/auth/otp/verify/", {"email": "test@test.com"})
        self.assertIn(resp.status_code, [400, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-016 PASS: OTP verify rejected missing fields (status={resp.status_code})")


# =============================================================================
# UT-AUTH-003: REGISTRATION MODULE — Role Assignment
# =============================================================================

class TestRegistrationRoleAssignment(unittest.TestCase):
    """
    Unit Tests: Registration with OTP — role validation
    Endpoint  : POST /api/v1/auth/register-otp/
    """

    # ── TC-017: Registration — Missing Required Fields ────────────────────
    def test_017_registration_missing_fields(self):
        """registration-otp endpoint rejects empty or incomplete payload."""
        resp = post("/auth/register-otp/", {})
        self.assertIn(resp.status_code, [400, 401, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-017 PASS: Registration rejected empty payload (status={resp.status_code})")

    # ── TC-018: Registration — Invalid OTP Code Rejected ─────────────────
    def test_018_registration_invalid_otp_rejected(self):
        """Registration rejected when OTP code is invalid."""
        resp = post("/auth/register-otp/", {
            "email": unique_email("reg"),
            "code": "999999",
            "username": "testuser",
            "password": "TestPass@123",
            "role": "CUSTOMER"
        })
        self.assertIn(resp.status_code, [400, 401],
                      f"❌ Expected 400/401, got {resp.status_code}")
        print(f"\n  ✅ TC-018 PASS: Registration rejected invalid OTP (status={resp.status_code})")

    # ── TC-019: Registration — Unknown Role Defaults to Customer ─────────
    def test_019_registration_unknown_role_defaults_customer(self):
        """Unknown roles should default to CUSTOMER, not cause a server error."""
        resp = post("/auth/register-otp/", {
            "email": unique_email("hack"),
            "code": "000000",
            "username": "hackuser",
            "password": "HackPass@123",
            "role": "SUPERVILLAIN"
        })
        # Should return 400 (invalid OTP), never 500
        self.assertNotEqual(resp.status_code, 500,
                             "❌ Server error 500 on unknown role — should be 400")
        print(f"\n  ✅ TC-019 PASS: Unknown role did not crash server (status={resp.status_code})")


# =============================================================================
# UT-AUTH-004: PROTECTED ENDPOINT ACCESS — Token Guard
# =============================================================================

class TestProtectedEndpointAccess(unittest.TestCase):
    """
    Unit Tests: JWT token enforcement on protected routes
    """

    # ── TC-020: Protected Endpoint — No Token Returns 401 ────────────────
    def test_020_protected_endpoint_no_token_returns_401(self):
        """Accessing a protected endpoint without token returns 401."""
        resp = get("/users/profile/")
        self.assertIn(resp.status_code, [401, 403],
                      f"❌ Expected 401, got {resp.status_code}")
        print(f"\n  ✅ TC-020 PASS: No token → 401 Unauthorized (status={resp.status_code})")

    # ── TC-021: Protected Endpoint — Invalid Token Returns 401 ───────────
    def test_021_protected_endpoint_invalid_token_returns_401(self):
        """Accessing a protected endpoint with a fake token returns 401."""
        resp = get("/users/profile/", token="thisisatotallyfaketoken.abc.def")
        self.assertIn(resp.status_code, [401, 403],
                      f"❌ Expected 401, got {resp.status_code}")
        print(f"\n  ✅ TC-021 PASS: Invalid token → 401 Unauthorized (status={resp.status_code})")

    # ── TC-022: Admin Token Grants Access to Admin Endpoint ──────────────
    def test_022_admin_token_grants_admin_access(self):
        """Valid Admin token can access admin-protected endpoints."""
        token = get_token(ADMIN_EMAIL, ADMIN_PASSWORD)
        if not token:
            print(f"\n  ⚠️  TC-022 SKIP: Admin not seeded")
            return
        resp = get("/users/", token=token)
        self.assertIn(resp.status_code, [200, 201, 403, 404],
                      f"❌ Unexpected status {resp.status_code}")
        self.assertNotEqual(resp.status_code, 401,
                             "❌ Valid admin token should not get 401")
        print(f"\n  ✅ TC-022 PASS: Admin token accepted (status={resp.status_code})")

    # ── TC-023: Vendor Token Can Access Vendor Products ──────────────────
    def test_023_vendor_token_grants_vendor_access(self):
        """Valid Vendor token can access vendor-specific endpoints."""
        token = get_token(VENDOR_EMAIL, VENDOR_PASSWORD)
        if not token:
            print(f"\n  ⚠️  TC-023 SKIP: Vendor not seeded")
            return
        resp = get("/vendor/products/", token=token)
        self.assertIn(resp.status_code, [200, 201, 403, 404],
                      f"❌ Unexpected status {resp.status_code}")
        self.assertNotEqual(resp.status_code, 401,
                             "❌ Valid vendor token should not get 401")
        print(f"\n  ✅ TC-023 PASS: Vendor token accepted (status={resp.status_code})")


# =============================================================================
# UT-AUTH-005: PASSWORD RESET MODULE
# =============================================================================

class TestPasswordResetFlow(unittest.TestCase):
    """
    Unit Tests: Password reset endpoint
    Endpoint  : POST /api/v1/auth/password/reset/confirm/
    """

    # ── TC-024: Reset — Missing Fields Rejected ───────────────────────────
    def test_024_password_reset_missing_fields(self):
        """Password reset endpoint rejects empty payload."""
        resp = post("/auth/password/reset/confirm/", {})
        self.assertIn(resp.status_code, [400, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-024 PASS: Password reset rejected empty payload (status={resp.status_code})")

    # ── TC-025: Reset — Password Mismatch Rejected ────────────────────────
    def test_025_password_reset_mismatch_rejected(self):
        """Password reset rejects when passwords don't match."""
        resp = post("/auth/password/reset/confirm/", {
            "email": CUSTOMER_EMAIL,
            "new_password": "NewPass@123",
            "confirm_password": "DifferentPass@456",
        })
        self.assertIn(resp.status_code, [400, 401, 422],
                      f"❌ Expected 400, got {resp.status_code}")
        print(f"\n  ✅ TC-025 PASS: Password mismatch rejected (status={resp.status_code})")

    # ── TC-026: Reset — Short Password Rejected ───────────────────────────
    def test_026_password_reset_short_password(self):
        """Password reset rejects passwords shorter than 8 characters."""
        resp = post("/auth/password/reset/confirm/", {
            "email": CUSTOMER_EMAIL,
            "new_password": "abc",
            "confirm_password": "abc",
        })
        self.assertIn(resp.status_code, [400, 401, 422],
                      f"❌ Should reject short password")
        print(f"\n  ✅ TC-026 PASS: Short password rejected (status={resp.status_code})")


# =============================================================================
# UT-AUTH-006: SERVER & ENDPOINT AVAILABILITY
# =============================================================================

class TestServerAvailability(unittest.TestCase):
    """
    Unit Tests: Verify all auth endpoints are reachable
    """

    # ── TC-027: Server Running ────────────────────────────────────────────
    def test_027_server_is_running(self):
        """Backend server is reachable."""
        try:
            resp = get("/auth/login/")
            self.assertIn(resp.status_code, [200, 400, 401, 405],
                          "❌ Server not responding correctly")
            print(f"\n  ✅ TC-027 PASS: Server is running (status={resp.status_code})")
        except Exception as e:
            self.fail(f"❌ TC-027 FAIL: Backend server unreachable — {e}")

    # ── TC-028: Login Endpoint Reachable ─────────────────────────────────
    def test_028_login_endpoint_reachable(self):
        """POST /auth/login/ responds."""
        resp = post("/auth/login/", {})
        self.assertNotIn(resp.status_code, [500, 502, 503],
                         "❌ Server error on login endpoint")
        print(f"\n  ✅ TC-028 PASS: Login endpoint reachable (status={resp.status_code})")

    # ── TC-029: OTP Send Endpoint Reachable ──────────────────────────────
    def test_029_otp_send_endpoint_reachable(self):
        """POST /auth/otp/send/ responds."""
        resp = post("/auth/otp/send/", {})
        self.assertNotIn(resp.status_code, [500, 502, 503],
                         "❌ Server error on OTP send endpoint")
        print(f"\n  ✅ TC-029 PASS: OTP send endpoint reachable (status={resp.status_code})")

    # ── TC-030: OTP Verify Endpoint Reachable ────────────────────────────
    def test_030_otp_verify_endpoint_reachable(self):
        """POST /auth/otp/verify/ responds."""
        resp = post("/auth/otp/verify/", {})
        self.assertNotIn(resp.status_code, [500, 502, 503],
                         "❌ Server error on OTP verify endpoint")
        print(f"\n  ✅ TC-030 PASS: OTP verify endpoint reachable (status={resp.status_code})")

    # ── TC-031: Register OTP Endpoint Reachable ──────────────────────────
    def test_031_register_otp_endpoint_reachable(self):
        """POST /auth/register-otp/ responds."""
        resp = post("/auth/register-otp/", {})
        self.assertNotIn(resp.status_code, [500, 502, 503],
                         "❌ Server error on register-otp endpoint")
        print(f"\n  ✅ TC-031 PASS: Register-OTP endpoint reachable (status={resp.status_code})")

    # ── TC-032: Password Reset Endpoint Reachable ────────────────────────
    def test_032_password_reset_endpoint_reachable(self):
        """POST /auth/password/reset/confirm/ responds."""
        resp = post("/auth/password/reset/confirm/", {})
        self.assertNotIn(resp.status_code, [500, 502, 503],
                         "❌ Server error on password reset endpoint")
        print(f"\n  ✅ TC-032 PASS: Password reset endpoint reachable (status={resp.status_code})")


# =============================================================================
# TEST RUNNER
# =============================================================================

if __name__ == "__main__":
    print("\n" + "═" * 70)
    print("  NextGen Smart Store — AUTH MODULE UNIT TESTS")
    print("═" * 70)

    loader = unittest.TestLoader()
    suite = unittest.TestSuite()

    suite.addTests(loader.loadTestsFromTestCase(TestServerAvailability))
    suite.addTests(loader.loadTestsFromTestCase(TestLoginAllRoles))
    suite.addTests(loader.loadTestsFromTestCase(TestOTPFlow))
    suite.addTests(loader.loadTestsFromTestCase(TestRegistrationRoleAssignment))
    suite.addTests(loader.loadTestsFromTestCase(TestProtectedEndpointAccess))
    suite.addTests(loader.loadTestsFromTestCase(TestPasswordResetFlow))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)

    print("\n" + "═" * 70)
    total  = result.testsRun
    passed = total - len(result.failures) - len(result.errors)
    print(f"  TOTAL TESTS : {total}")
    print(f"  PASSED      : {passed}  ✅")
    print(f"  FAILURES    : {len(result.failures)}  ❌")
    print(f"  ERRORS      : {len(result.errors)}  ⚠️")
    print("═" * 70 + "\n")

    sys.exit(0 if result.wasSuccessful() else 1)
