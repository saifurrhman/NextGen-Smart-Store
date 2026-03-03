
import os
import django
from django.core.mail import send_mail
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.development')
django.setup()

def test_send():
    print("Attempting to send test email...")
    try:
        send_mail(
            'Test Email',
            'This is a test email from the NextGen Smart Store backend script.',
            settings.DEFAULT_FROM_EMAIL,
            ['saifriaz34@gmail.com'], # Sending to the same user as in .env for testing
            fail_silently=False,
        )
        print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    test_send()
