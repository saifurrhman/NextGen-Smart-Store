# 📖 Complete Setup Guide

## Step-by-Step Instructions

### Step 1: Install Python 3.10+

```bash
python --version  # Should be 3.10+
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**
Download: https://www.mongodb.com/try/download/community

**Option B: MongoDB Atlas (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Whitelist IP: 0.0.0.0/0 (for development)

### Step 3: Clone & Setup

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### Step 4: Install Dependencies

```bash
pip install -r requirements/development.txt
```

### Step 5: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGO_DB_NAME=nextgen_smart_store
```

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/
MONGO_DB_NAME=nextgen_smart_store
```

### Step 6: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 7: Create Superuser

```bash
python manage.py createsuperuser
# Enter email, password, first name, last name
```

### Step 8: Start Server

```bash
python manage.py runserver
```

✅ **Backend running at: http://localhost:8000**

### Step 9: Verify Installation

Visit:
- Admin: http://localhost:8000/admin/
- Swagger: http://localhost:8000/swagger/
- API Root: http://localhost:8000/api/v1/

## 🔧 Troubleshooting

### Issue: MongoDB connection failed

**Solution:**
1. Check MongoDB is running (local)
2. Verify MONGO_URI in .env
3. For Atlas: Check IP whitelist
4. Test connection:
```bash
python manage.py shell
>>> from pymongo import MongoClient
>>> client = MongoClient('your-mongo-uri')
>>> client.server_info()
```

### Issue: Module not found

**Solution:**
```bash
pip install -r requirements/development.txt
```

### Issue: Migration errors

**Solution:**
```bash
python manage.py makemigrations
python manage.py migrate --run-syncdb
```

## 🎯 Next Steps

1. ✅ Backend running
2. Connect Frontend
3. Test API endpoints
4. Add sample data
5. Configure AR features

## 📝 MongoDB Atlas Setup (Detailed)

### 1. Create Account
- Go to mongodb.com/cloud/atlas
- Sign up (free)

### 2. Create Cluster
- Choose FREE tier (M0)
- Select region closest to you
- Click "Create Cluster"

### 3. Create Database User
- Database Access → Add New Database User
- Username: admin
- Password: (generate or create)
- Database User Privileges: Read and write to any database

### 4. Whitelist IP
- Network Access → Add IP Address
- Add: 0.0.0.0/0 (allows all - for development only)
- For production: Add specific IPs

### 5. Get Connection String
- Clusters → Connect
- Choose "Connect your application"
- Copy connection string
- Replace <password> with your password
- Add to .env file

### 6. Test Connection

```bash
python manage.py shell
```

```python
from django.conf import settings
print(settings.DATABASES)
```

## 🚀 Production Deployment

For production:
1. Set DEBUG=False
2. Use production.txt requirements
3. Configure ALLOWED_HOSTS
4. Setup HTTPS
5. Use environment variables
6. Enable monitoring

---

**Happy Coding! 🎉**
