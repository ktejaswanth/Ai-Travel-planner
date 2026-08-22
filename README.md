# TripWise AI — AI-Powered Travel Planning Platform

**TripWise AI** is a production-ready, full-stack travel planning platform that empowers travelers to generate personalized trips, manage travel parameters, customize budgets and itineraries, and integrate future AI-driven travel intelligence (Gemini AI, Google Places, Routes, Weather, and Amadeus Flights/Hotels APIs).

---

## 🌟 Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS & Lucide React Icons
- **State Management**: TanStack React Query v5
- **Routing**: React Router DOM v6
- **Form Handling & Validation**: React Hook Form + Zod
- **HTTP Client**: Axios with JWT Interceptors

### Backend
- **Framework**: Java 21+ & Spring Boot 3.x
- **Security**: Spring Security 6 with JWT authentication & BCrypt password hashing
- **Data Access**: Spring Data MongoDB (compatible with MongoDB Atlas)
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI
- **Observability**: Spring Boot Actuator
- **Testing**: JUnit 5 & Mockito

### Database
- **Primary Store**: MongoDB 6+ / MongoDB Atlas

---

## 📁 Repository Structure

```text
Ai Travel Planner/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS Application
│   ├── src/
│   │   ├── components/   # Common UI and layout components
│   │   ├── pages/        # Public, Auth, Dashboard, Create Trip, Details pages
│   │   ├── features/     # Feature-driven business domain modules
│   │   ├── services/     # Axios API services and interceptors
│   │   ├── types/        # TypeScript type interfaces
│   │   └── routes/       # Protected and public route management
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Spring Boot 3.x Java Application
│   ├── src/
│   │   ├── main/java/com/tripwise/
│   │   │   ├── config/       # Spring, Mongo, CORS, Swagger configs
│   │   │   ├── security/     # Spring Security & JWT Filter
│   │   │   ├── common/       # ApiResponse & Global Exception Handler
│   │   │   ├── auth/         # Auth controllers, services, DTOs
│   │   │   ├── user/         # User profile domain
│   │   │   ├── trip/         # Trip & TripPreference domain
│   │   │   └── integrations/ # Pluggable adapters (Google, Weather, Amadeus, Gemini)
│   │   └── resources/
│   │       └── application.yml
│   └── pom.xml
│
├── docs/                 # System documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   └── SETUP.md
│
├── docker-compose.yml    # Container deployment configuration
├── .env.example          # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- JDK 21+
- Maven 3.8+
- Node.js v18+ & `npm`
- MongoDB running locally on port 27017 (or MongoDB Atlas URI)

### Quick Start (Local Development)

1. **Environment Setup**:
   Copy `.env.example` to `.env` in the root directory and update credentials if needed.

2. **Backend**:
   ```bash
   cd backend
   mvn clean spring-boot:run
   ```
   API runs at: `http://localhost:8080`
   Swagger UI: `http://localhost:8080/swagger-ui.html`

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   App runs at: `http://localhost:5173`

4. **Docker Compose**:
   ```bash
   docker-compose up --build
   ```

---

## 🧪 Testing

- **Backend**: Run `mvn test` inside the `backend` directory.
- **Frontend**: Run `npm test` inside the `frontend` directory.

---

## 📄 Documentation Links
- [System Architecture Document](docs/ARCHITECTURE.md)
- [Database Schema & Design](docs/DATABASE.md)
- [REST API Specifications](docs/API.md)
- [Detailed Setup Guide](docs/SETUP.md)
