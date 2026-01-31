import os
import sys
import traceback

path = os.path.dirname(os.path.abspath(__file__))
if path not in sys.path:
    sys.path.append(path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'NextGenSmartStore.settings.production')

try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    app = application
except Exception:
    # CATCH ALL STARTUP ERRORS and print to browser
    error_trace = traceback.format_exc()
    
    def application(environ, start_response):
        status = '200 OK'
        output = f"CRITICAL STARTUP ERROR:\n\n{error_trace}".encode('utf-8')
        response_headers = [('Content-type', 'text/plain'),
                            ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]
    
    app = application
