def app(environ, start_response):
    data = b"Hello World! Vercel Zero Config is WORKING!"
    start_response("200 OK", [
        ("Content-Type", "text/plain"),
        ("Content-Length", str(len(data)))
    ])
    return [data]
