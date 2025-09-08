# ProofMint — Certificate Issuance & Verification Platform

---

## 🛠 Stack

- **Backend:** Node.js, Express, PostgreSQL, Sequelize  

---

## Project Overview

ProofMint is a secure platform that allows authorized users to:

- Upload PDF, image, or DOC files  
- Drag & drop customizable “stamps” (QR Code)  
- Flatten the document into a printable PDF  
- Store it with metadata  

A **public verification page** allows anyone with a credential/ID to check validity and view a preview.  

Features include:

- JWT-based authentication  
- Role-based access control  
- Expiry and revocation  

---

## User Roles & Access

| Role   | Access                                                                 |
|--------|-----------------------------------------------------------------------|
| Admin  | Full access: issue, stamp, list, revoke, manage users and documents   |
| User   | Upload documents, view own documents, stamp if allowed                |
| Public | Only access `/verify` flow                                             |

---

## Journeys

### Issue & Stamp
1. Admin uploads a document  
2. Adds metadata  
3. Adds a QR Code stamp onto the document  
4. Flattens and saves the stamped version  
5. Issues the certificate  

### Verification
1. Public user enters credential or scans QR  
2. System checks validity  
3. Displays document preview  

---

## Backend Features

- **Authentication:** JWT access, password hashing with bcrypt  
- **File Handling:** Multer-based upload, type & size validation  
- **Document Processing:** pdf-lib, sharp, QR code generation  
- **Audit Logs:** Tracks login, create, stamp, render, revoke, verify actions  
- **Rate Limiting:** `/verify` endpoint limited to 20 requests per 10 minutes per IP  
- **Security:** Watermarked public previews, normalized coordinates for stamps  

---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`.

---

### **Auth Routes**

| Method | Endpoint               | Description                  | Auth Required |
|--------|------------------------|------------------------------|---------------|
| POST   | `/auth/signup`         | Register a new user          | No            |
| POST   | `/auth/login`          | Login a user                 | No            |
| POST   | `/auth/logout`         | Logout the user              | Yes           |
| POST   | `/auth/update/password`| Update password              | Yes           |
| POST   | `/auth/forgot/password`| Forgot password              | No            |
| POST   | `/auth/verify/otp`     | Verify OTP                   | No            |
| POST   | `/auth/change/password`| Change password              | No            |

---

### **Admin Routes** (Role: `admin`)

| Method | Endpoint                  | Description                     | Auth Required |
|--------|---------------------------|---------------------------------|---------------|
| GET    | `/admin/`                 | Get all users                   | Yes           |
| DELETE | `/admin/:id`              | Delete a user by ID             | Yes           |
| GET    | `/admin/all/documents`    | Get all documents               | Yes           |
| DELETE | `/admin/delete/document`  | Delete a document by certificateId | Yes        |

---

### **Document Routes** (User-level)

| Method | Endpoint                | Description                             | Auth Required |
|--------|------------------------|-----------------------------------------|---------------|
| GET    | `/documents/`           | Get all documents of logged-in user     | Yes           |
| GET    | `/documents/:id`        | Get a single document by ID             | Yes           |
| POST   | `/documents/verify`     | Verify a document (public verification) | No            |
| PUT    | `/documents/revoke`     | Revoke a document (Admin only)          | Yes           |

---

### **File Upload & Stamp Routes** (User-level)

| Method | Endpoint              | Description                             | Auth Required |
|--------|----------------------|-----------------------------------------|---------------|
| POST   | `/document/upload`    | Upload a document file                  | Yes           |
| POST   | `/document/stamps`    | Upload a stamp / stamp a document       | Yes           |
