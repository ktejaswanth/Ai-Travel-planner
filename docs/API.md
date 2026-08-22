# TripWise AI — REST API Documentation

## 1. Overview & Standard Specification

All API endpoints reside under the `/api` prefix and return standard JSON responses.

### 1.1 Success Response Structure
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### 1.2 Error Response Structure
```json
{
  "success": false,
  "message": "Error description message",
  "errorCode": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | DUPLICATE_RESOURCE | INTERNAL_ERROR",
  "timestamp": "2026-08-22T10:18:00Z"
}
```

### 1.3 Authentication Header
Protected endpoints require HTTP Header:
`Authorization: Bearer <JWT_TOKEN>`

---

## 2. Authentication Endpoints

### 2.1 Register User
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "65d0a1b2c3d4e5f678901234",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "USER",
      "createdAt": "2026-08-22T10:00:00Z"
    }
  }
}
```

---

### 2.2 Login User
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword123!"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": {
      "id": "65d0a1b2c3d4e5f678901234",
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "role": "USER",
      "createdAt": "2026-08-22T10:00:00Z"
    }
  }
}
```

---

### 2.3 Get Current Authenticated User
- **Method**: `GET`
- **URL**: `/api/auth/me`
- **Auth Required**: Yes (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "message": "Current user profile retrieved",
  "data": {
    "id": "65d0a1b2c3d4e5f678901234",
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "USER",
    "createdAt": "2026-08-22T10:00:00Z"
  }
}
```

---

## 3. User Management Endpoints

### 3.1 Get Profile
- **Method**: `GET`
- **URL**: `/api/users/me`
- **Auth Required**: Yes

### 3.2 Update Profile
- **Method**: `PUT`
- **URL**: `/api/users/me`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
```

---

## 4. Trip Management Endpoints

### 4.1 Create Trip with Preferences
- **Method**: `POST`
- **URL**: `/api/trips`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "title": "Goa Vacation",
  "origin": "Hyderabad",
  "destination": "Goa",
  "startDate": "2026-09-10",
  "endDate": "2026-09-14",
  "travelers": 2,
  "budget": 30000.0,
  "currency": "INR",
  "preferences": {
    "interests": ["BEACH", "FOOD", "PHOTOGRAPHY"],
    "travelStyle": "Balanced",
    "pace": "Moderate",
    "accommodationPreference": "Resort",
    "transportPreference": "Flight & Rental Car",
    "dietaryPreference": "Vegetarian",
    "specialRequirements": "Quiet view"
  }
}
```

---

### 4.2 Get User Trips
- **Method**: `GET`
- **URL**: `/api/trips`
- **Auth Required**: Yes

---

### 4.3 Get Single Trip Details
- **Method**: `GET`
- **URL**: `/api/trips/{tripId}`
- **Auth Required**: Yes (Enforces ownership check)

---

### 4.4 Update Trip
- **Method**: `PUT`
- **URL**: `/api/trips/{tripId}`
- **Auth Required**: Yes (Enforces ownership check)

---

### 4.5 Delete Trip
- **Method**: `DELETE`
- **URL**: `/api/trips/{tripId}`
- **Auth Required**: Yes (Enforces ownership check)
