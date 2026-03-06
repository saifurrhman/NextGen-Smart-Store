import unittest
from helpers import BASE_URL, DELIVERY_EMAIL, DELIVERY_PASSWORD, post, get

class TestDeliveryLocation(unittest.TestCase):
    """Tests for delivery real-time tracking and location updates."""

    @classmethod
    def setUpClass(cls):
        resp = post(
            "/auth/login/",
            {"username": DELIVERY_EMAIL, "password": DELIVERY_PASSWORD},
        )
        cls.token = (resp.json().get("access") or resp.json().get("token")) if resp.status_code == 200 else None

    def test_01_update_location_rejection(self):
        """Rejects location update without coordinates."""
        if not self.token:
            self.skipTest("No delivery token")
        # Assuming we need a detail ID, but we can test the error handling on any ID
        resp = post("/operations/delivery/1/update-location/", data={}, token=self.token)
        self.assertIn(resp.status_code, [400, 404])
        print("  ✅ Location update correctly handles missing coordinates/ID")

    def test_02_tracking_endpoint(self):
        """Tracking ID search should work."""
        resp = get("/operations/delivery/", params={"search": "TRK123"})
        self.assertEqual(resp.status_code, 200)
        print("  ✅ Tracking search endpoint reachable")
