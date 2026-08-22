# TripWise AI — Local Setup & Development Guide

## 1. Prerequisites

Ensure you have the following installed on your developer machine:
- **Java**: JDK 21+ (Java 17+ compatible)
- **Maven**: 3.8+
- **Node.js**: v18+ & `npm`
- **MongoDB**: Local MongoDB instance (v6.0+) running on port 27017, or a MongoDB Atlas connection URI
- **Docker & Docker Compose** (Optional, for containerized local setup)

---

## 2. Environment Configuration

Copy the sample `.env.example` file to `.env` in the root directory:

```bash
cp .env.example .env
```

Ensure MongoDB URI is correctly set:
```ini
MONGODB_URI=mongodb://localhost:27017/tripwise_db
JWT_SECRET=your_super_secret_jwt_signing_key_must_be_at_least_256_bits_long
```

---

## 3. Running Backend (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project:
   ```bash
   mvn clean package
   ```
3. Run tests:
   ```bash
   mvn test
   ```
4. Start Spring Boot Application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on **`http://localhost:8080`**.
   - OpenAPI / Swagger UI: `http://localhost:8080/swagger-ui.html`
   - Health check: `http://localhost:8080/actuator/health`

---

## 4. Running Frontend (Vite + React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
   The frontend will open at **`http://localhost:5173`**.

---

## 5. Docker Setup

To run MongoDB, Backend, and Frontend all together with Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- MongoDB: `localhost:27017`
