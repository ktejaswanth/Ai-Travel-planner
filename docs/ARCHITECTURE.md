# TripWise AI — System Architecture

## 1. System Overview

TripWise AI is a modern travel planning application built on a decoupled, layered client-server architecture. It provides users with personalized trip planning capabilities, itinerary tracking, budget management, and modular extensibility for upcoming AI and third-party travel service integrations.

```text
+-------------------------------------------------------+
|                    React Frontend                     |
|  (TypeScript, Vite, React Router, Tailwind, Query)    |
+-------------------------------------------------------+
                           |
                     HTTP / REST (JSON)
                     JWT Authentication
                           |
+-------------------------------------------------------+
|                 Spring Boot 3 Backend                 |
|                                                       |
|  +-------------------------------------------------+  |
|  |                 REST Controllers                |  |
|  +-------------------------------------------------+  |
|                          |                            |
|  +-------------------------------------------------+  |
|  |                 Service Layer                   |  |
|  +-------------------------------------------------+  |
|             |                            |            |
|  +----------------------+    +---------------------+  |
|  | Repositories (Data)  |    | Integration Adapters|  |
|  +----------------------+    +---------------------+  |
+------------|----------------------------|-------------+
             |                            |
    MongoDB / Atlas             Future External Services
  (User, Trip, Prefs)          (Google, Amadeus, OpenWeather, Gemini)
```

---

## 2. Technical Stack

### Frontend
- **Framework & Language**: React 18+, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS, Lucide React Icons
- **State & Data Fetching**: TanStack React Query v5, Axios
- **Form Validation**: React Hook Form, Zod

### Backend
- **Framework & Language**: Java 21+, Spring Boot 3.x
- **Security**: Spring Security, JWT (JSON Web Tokens), BCrypt
- **Persistence**: Spring Data MongoDB
- **Validation & Tooling**: Bean Validation (Jakarta), Lombok, Spring Boot Actuator
- **API Documentation**: SpringDoc OpenAPI 3 / Swagger UI

### Database
- **Database**: MongoDB 6+ / MongoDB Atlas

---

## 3. Layered Backend Design

```text
React Frontend
   │
   ▼
REST Controller Layer  (Handles HTTP request/response parsing & validation)
   │
   ▼
Service Layer          (Encapsulates domain logic, security checks, and workflows)
   │
   ▼
Repository Layer       (Spring Data MongoDB interfaces for database queries)
   │
   ▼
MongoDB Database       (Document storage)
```

### Modular Directory Layout
The backend uses domain-driven package organization to prevent monolithic service and controller files:
- `com.tripwise.config`: System beans, CORS, MongoDB, and Swagger configuration.
- `com.tripwise.security`: JWT filter, token generator, and Spring Security filters.
- `com.tripwise.common`: Shared response wrappers (`ApiResponse`), error codes, and global exception handlers.
- `com.tripwise.auth`: Authentication endpoints (`/api/auth/*`), service, DTOs.
- `com.tripwise.user`: User profile endpoints (`/api/users/*`), service, models, repositories.
- `com.tripwise.trip`: Trip endpoints (`/api/trips/*`), preference management, models, repositories.
- `com.tripwise.integrations`: Pluggable interfaces and adapters for Google Maps/Places, OpenWeather, Amadeus, and Gemini AI.

---

## 4. Security Architecture

1. **Authentication Flow**:
   - Client sends credentials (`POST /api/auth/login`).
   - Server validates credentials using `BCryptPasswordEncoder` and returns a signed JWT containing `userId`, `email`, and `role`.
   - Client attaches `Authorization: Bearer <token>` header to protected API requests.
2. **Authorization & Data Isolation**:
   - Spring Security `JwtAuthenticationFilter` intercepts requests, validates the signature, and populates `SecurityContextHolder`.
   - Trip APIs enforce strict user ownership checks (`userId` from token matches trip `userId`), preventing cross-user data leakage.

---

## 5. Integration Architecture (Future External Services)

To maintain decoupling, all external integrations follow the Interface-Adapter pattern:

```text
TripService / ItineraryService
          │
          ▼
   [Integration Interface]  (e.g., GooglePlacesClient, GeminiClient)
          │
          ▼
[External API Adapter Implementation]
          │
          ▼
 Third-Party HTTP APIs
```

Integrations are defined as Java interfaces in `com.tripwise.integrations.*` and can be mocked or swapped without altering core domain business logic.
