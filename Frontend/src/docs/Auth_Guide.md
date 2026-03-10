# NextGen Smart Store - Authentication Guide

Welcome to the NextGen Smart Store authentication system. This guide explains how to access your account or register as a new member across all roles.

## 1. Role-Based Portals
NextGen uses standardized portals for each user role to ensure a direct and personalized entry point.

- **Shopping Portal**: [Login](/customer/login) | [Partner Join](/customer/register)
- **Vendor Portal**: [Login](/vendor/login) | [Partner Join](/vendor/register)
- **Delivery Portal**: [Login](/delivery/login) | [Partner Join](/delivery/register)
- **Admin Portal**: [Login](/admin/login)

---

## 2. Registration Flow
1. **Enter Details**: Provide your email, username, and role-specific information (e.g., Business Name for Vendors).
2. **Secure Password**: Create a strong password (minimum 8 characters).
3. **OTP Verification**: A 6-digit verification code will be sent to your registered email address.
4. **Finalize**: Enter the code within 60 seconds to secure your identity.

---

## 3. Login & Session Management
- **Automatic Redirect**: After a successful login, you will be automatically redirected to your role-specific dashboard.
- **Persistent Session**: Your session is securely stored. You won't need to log in again unless you sign out or clear your browser data.
- **Two-Factor Ready**: For sensitive roles (Admin/Vendor), multi-factor verification may be required periodically.

---

## 4. Password Recovery
If you lose access to your account:
1. Go to the **Login** page and click **Forgot Password**.
2. Enter your registered email address.
3. Verify your identity using the **Recovery Token** sent to your email.
4. Set a **New Password** to restore access immediately.

---

## 5. Security Best Practices
- **Official Terminal**: Always ensure you are on `localhost:5173` (or the official production domain).
- **Communication**: NextGen will never ask for your password via email or chat.
- **Log Out**: For shared computers, always sign out from the dashboard menu.

---
© 2026 NextGen Smart Store. Innovation First.
