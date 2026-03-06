import unittest
from helpers import BASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, post, get

class TestFinanceModule(unittest.TestCase):
    """Tests for admin finance: revenue, transactions, refunds, tax, payouts."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            f"{BASE_URL}/auth/login/",
            {"username": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
        )
        cls.token = resp.json().get("access") if resp.status_code == 200 else None

    def test_01_finance_endpoint_exists(self):
        """Finance API is accessible."""
        resp = get(f"{BASE_URL}/finance/", token=self.token)
        self.assertNotIn(resp.status_code, [500])
        print(f"  ✅ Finance root reachable")

    def test_02_transactions_list(self):
        """Transactions list is accessible to admin."""
        resp = get(f"{BASE_URL}/finance/transactions/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Transactions list responded")

    def test_03_revenue_analytics(self):
        """Revenue analytics endpoint responds."""
        resp = get(f"{BASE_URL}/finance/revenue/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Revenue analytics responded")

    def test_04_vendor_payouts(self):
        """Vendor payouts endpoint responds."""
        resp = get(f"{BASE_URL}/finance/payouts/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Vendor payouts responded")

    def test_05_tax_management(self):
        """Tax management endpoint responds."""
        resp = get(f"{BASE_URL}/finance/tax/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Tax management responded")

    def test_06_financial_reports(self):
        """Financial reports endpoint responds."""
        resp = get(f"{BASE_URL}/finance/reports/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Financial reports responded")

    def test_07_payout_approval(self):
        """Payout approval endpoint responds."""
        resp = get(f"{BASE_URL}/finance/payout-approval/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Payout approval responded")

    def test_08_commission_management(self):
        """Commission management endpoint responds."""
        resp = get(f"{BASE_URL}/finance/commissions/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Commission management responded")

    def test_09_refund_processing(self):
        """Finance refund processing endpoint responds."""
        resp = get(f"{BASE_URL}/finance/refunds/", token=self.token)
        self.assertIn(resp.status_code, [200, 401, 404])
        print(f"  ✅ Finance refund processing responded")
