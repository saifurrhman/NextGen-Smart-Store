def application(environ, start_response):
    status = '200 OK'
    output = b'Hello World! Vercel Python is working.'
    response_headers = [('Content-type', 'text/plain'), # plain text
                        ('Content-Length', str(len(output)))]
    start_response(status, response_headers)
    return [output]
