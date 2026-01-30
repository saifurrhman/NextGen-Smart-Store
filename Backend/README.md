# 🚀 Next-Gen Smart Store - Backend API

AI-powered luxury e-commerce platform with AR/VR capabilities.

## ✨ Features

- ✅ **MongoDB Atlas** - Cloud database ready
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Multi-Vendor Platform** - Support for multiple sellers
- ✅ **AR/VR Ready** - Virtual try-on capabilities
- ✅ **AI Recommendations** - Personalized suggestions
- ✅ **RESTful API** - Complete REST API
- ✅ **Role-Based Access** - Super Admin, Vendors, Customers
- ✅ **File Upload** - Images, AR models, 3D assets

## 📋 Prerequisites

- Python 3.10+
- MongoDB (Local or Atlas)
- Redis (Optional)

## 🛠️ Quick Start

### 1. Setup Virtual Environment

```bash
cd Backend
python -m venv venv

# Activate
source venv/bin/activate  # Mac/Linux
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements/development.txt
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

**For Local MongoDB:**
```env
MONGO_URI=mongodb://localhost:27017/
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Start Server

```bash
python manage.py runserver
```

Server: **http://localhost:8000**

## 📚 API Documentation

- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/
- Admin Panel: http://localhost:8000/admin/

## 🗂️ Project Structure

```
Backend/
├── NextGenSmartStore/      # Django project settings
├── apps/                   # All Django apps (20 apps)
│   ├── users/             # User management
│   ├── products/          # Product catalog
│   ├── orders/            # Order processing
│   ├── cart/              # Shopping cart
│   ├── vendors/           # Vendor management
│   └── ...                # 15 more apps
├── core/                  # Core utilities
├── api/                   # API versioning
├── config/                # Configurations
└── requirements/          # Dependencies
```

## 🔗 Key API Endpoints

### Authentication
- `POST /api/v1/auth/register/` - Register
- `POST /api/v1/auth/login/` - Login
- `POST /api/v1/auth/refresh/` - Refresh token

### Products
- `GET /api/v1/products/` - List products
- `POST /api/v1/products/` - Create product
- `GET /api/v1/products/{id}/` - Product detail

### Orders
- `GET /api/v1/orders/` - List orders
- `POST /api/v1/orders/` - Create order

### Cart
- `GET /api/v1/cart/` - Get cart
- `POST /api/v1/cart/` - Add to cart

## 🗄️ MongoDB Collections

- `users` - User accounts
- `products` - Product catalog
- `orders` - Customer orders
- `cart` - Shopping carts
- `reviews` - Product reviews
- `brands` - Luxury brands
- `categories` - Product categories
- `ar_assets` - AR 3D models

## 🔐 Security

- JWT authentication
- Password hashing (bcrypt)
- CORS configuration
- Rate limiting
- Input validation

## 🧪 Testing

```bash
pytest
pytest --cov=apps
```

## 👥 User Roles

1. **Super Admin** - Full system access
2. **Vendor** - Manage products
3. **Customer** - Browse & buy
4. **Finance Manager** - Financial ops
5. **Marketing Manager** - Campaigns
6. **Content Manager** - Content
7. **Support** - Customer support

## 📞 Support

For issues, check `logs/django.log`

---

**Version:** 1.0  
**Developers:** Saif Ur Rehman, Jaweria Liaqat  
**Supervisor:** Mr. Abdul Rehman
