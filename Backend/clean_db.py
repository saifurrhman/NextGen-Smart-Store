import os
from dotenv import load_dotenv
from pymongo import MongoClient

def clean_duplicates():
    # Load env pointing to MongoDB Atlas
    load_dotenv('.env')
    uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    client = MongoClient(uri)
    db = client[os.getenv('MONGO_DB_NAME', 'nextgen_smart_store')]
    users_col = db['users_user']
    
    email_to_find = 'saifurrehman7726@gmail.com'
    # Fetch all users
    all_users = list(users_col.find({}))
    
    # Filter by python string matching to avoid MongoDB type/case issues
    users = [u for u in all_users if u.get('email') and email_to_find.lower() in u.get('email').lower()]
    
    print(f"Found {len(users)} users matching email {email_to_find}")
    
    if len(users) > 1:
        # Sort to keep the one with a filled password or latest
        users.sort(key=lambda x: len(x.get('password', '')), reverse=True)
        kept_id = users[0]['_id']
        print(f"Keeping user with _id: {kept_id}")
        
        for u in users[1:]:
            print(f"Deleting duplicate user with _id: {u['_id']}")
            users_col.delete_one({'_id': u['_id']})
            
        print("Duplicates removed via PyMongo.")
    else:
        print("No duplicates found to remove.")

clean_duplicates()
