import os

APPS_DIR = r'D:\Semester\New folder\NextGen-Smart-Store\Backend\apps'

if not os.path.exists(APPS_DIR):
    print(f"Apps directory not found at {APPS_DIR}")
    exit(1)

for app_name in os.listdir(APPS_DIR):
    app_path = os.path.join(APPS_DIR, app_name)
    if os.path.isdir(app_path):
        urls_path = os.path.join(app_path, 'urls.py')
        
        # Only touch existing files
        if os.path.exists(urls_path):
            try:
                with open(urls_path, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                
                if not content:
                    print(f"Fixing empty urls.py in {app_name}")
                    with open(urls_path, 'w', encoding='utf-8') as f:
                        f.write("from django.urls import path\n\nurlpatterns = []\n")
            except Exception as e:
                print(f"Error processing {urls_path}: {e}")
