import os
import sys

# Add Backend to path
path = os.path.join(os.path.dirname(__file__), '../Backend')
if path not in sys.path:
    sys.path.append(path)

# Import the WSGI app (Vercel looks for 'app' variable by default)
from Backend.wsgi import application as app
