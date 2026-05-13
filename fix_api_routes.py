import os

FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), 'frontend', 'src'))
print(f"Scanning {FRONTEND_DIR} for double-prefixed API routes...")

count = 0
files_modified = 0

for root, _, files in os.walk(FRONTEND_DIR):
    for file in files:
        if file.endswith(('.js', '.jsx')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Simple string replacements to be 100% safe but catch the bug
            content = content.replace("api.get('/api/v1/", "api.get('/")
            content = content.replace('api.get("/api/v1/', 'api.get("/')
            content = content.replace("api.get(`/api/v1/", "api.get(`/")
            
            content = content.replace("api.post('/api/v1/", "api.post('/")
            content = content.replace('api.post("/api/v1/', 'api.post("/')
            content = content.replace("api.post(`/api/v1/", "api.post(`/")
            
            content = content.replace("api.put('/api/v1/", "api.put('/")
            content = content.replace('api.put("/api/v1/', 'api.put("/')
            content = content.replace("api.put(`/api/v1/", "api.put(`/")
            
            content = content.replace("api.patch('/api/v1/", "api.patch('/")
            content = content.replace('api.patch("/api/v1/', 'api.patch("/')
            content = content.replace("api.patch(`/api/v1/", "api.patch(`/")
            
            content = content.replace("api.delete('/api/v1/", "api.delete('/")
            content = content.replace('api.delete("/api/v1/', 'api.delete("/')
            content = content.replace("api.delete(`/api/v1/", "api.delete(`/")
            
            # Cases where it was inside Promise.all
            content = content.replace("=> api.delete(`/api/v1/", "=> api.delete(`/")
            
            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"Fixed occurrences in {os.path.relpath(filepath, FRONTEND_DIR)}")
                files_modified += 1

print(f"\nDone! Fixed files: {files_modified}")
