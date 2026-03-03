
import os
import django
import time
from django.core.mail import send_mail
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

def test_send_timer():
    print("Measuring email latency...")
    start = time.time()
    try:
        send_mail(
            'Test Timer',
            'Latency test.',
            settings.DEFAULT_FROM_EMAIL,
            ['saifriaz34@gmail.com'],
            fail_silently=False,
        )
        end = time.time()
        print(f"Email sent successfully in {end - start:.2f} seconds.")
    except Exception as e:
        end = time.time()
        print(f"Email failed in {end - start:.2f} seconds with error: {e}")

if __name__ == "__main__":
    test_send_timer()
