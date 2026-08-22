Absolutely. Copy everything below directly into your `README.md`.

````markdown
# ✈️ TripWise AI — AI-Powered Travel Planning Platform

TripWise AI is a full-stack AI-powered travel planning platform that helps users create, manage, and personalize trips from a single application.

Users can create trips based on their destination, travel dates, budget, number of travelers, and personal preferences. The platform is designed to provide personalized itineraries, travel recommendations, weather information, places and attractions, flight information, hotel information, budget planning, packing assistance, and AI-powered travel support.

The project combines a React + TypeScript frontend, Java Spring Boot backend, MongoDB database, JWT authentication, and an extensible external API integration architecture.

---

## 🌟 Key Features

### 🧳 Trip Management

- Create new trips
- Specify destination and origin
- Select travel dates
- Set number of travelers
- Define trip budget
- Configure travel preferences
- View saved trips
- View detailed trip information

### 👤 Authentication & User Management

- User registration
- User login
- JWT-based authentication
- Spring Security
- BCrypt password hashing
- Protected application routes
- User profile management

### 🗓️ Trip Planning

The application provides dedicated modules for:

- Personalized itinerary planning
- Places and attractions
- Weather information
- Flight information
- Hotel information
- Budget planning
- Packing lists
- AI travel assistance

### 🤖 AI Travel Intelligence

The backend includes an extensible Gemini integration layer designed for AI-powered travel functionality such as:

- Personalized itinerary generation
- Travel recommendations
- Trip replanning
- AI travel assistant
- Context-aware travel suggestions

AI interactions and trip replanning information can also be stored using dedicated backend models and repositories.

### 📍 Places & Attractions

The application includes a dedicated Places module for:

- Tourist attractions
- Restaurants
- Points of interest
- Place search
- Destination-based recommendations

The integration architecture can be extended with services such as Google Places and Geoapify.

### 🌤️ Weather

The project includes a dedicated Weather module and OpenWeather integration interface for providing destination weather information.

### ✈️ Flights

The project includes a dedicated Flight module and flight-search persistence layer.

The integration architecture supports external flight-data providers such as Amadeus and can be extended with Aviationstack.

### 🏨 Hotels

The project includes a dedicated Hotel module and hotel-search persistence layer for accommodation-related functionality.

### 💰 Budget Management

The project contains dedicated budget and expense modules for managing:

- Trip budgets
- Individual expenses
- Estimated travel costs
- Budget breakdowns
- Remaining budget

### 🎒 Packing

The Packing module provides functionality for creating and managing travel packing checklists.

### 📊 Audit & AI Interaction Tracking

The backend includes modules for:

- Audit logging
- AI interaction records
- Trip replanning events

These provide a foundation for tracking important system and AI-related activity.

---

# 🏗️ Architecture

```text
                         ┌───────────────────────┐
                         │        User           │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   React Frontend      │
                         │ TypeScript + Vite     │
                         │ Tailwind CSS          │
                         └───────────┬───────────┘
                                     │
                                  REST API
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │   Spring Boot API     │
                         │       Java 21         │
                         └───────────┬───────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
   │ Authentication   │      │ Trip Management │      │ AI & External   │
   │ JWT + Security   │      │ & Preferences   │      │ Integrations    │
   └─────────────────┘      └─────────────────┘      └────────┬────────┘
                                                               │
                    ┌──────────────────────────────────────────┤
                    │              │              │             │
                    ▼              ▼              ▼             ▼
                 Gemini        Google APIs    OpenWeather    Flight APIs
                    │              │              │             │
                    └──────────────┴──────────────┴─────────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │       MongoDB         │
                         │  Local / MongoDB Atlas│
                         └───────────────────────┘
````

---

# 💻 Technology Stack

## Frontend

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| React 18             | User interface                |
| TypeScript           | Type-safe development         |
| Vite                 | Development and build tooling |
| Tailwind CSS         | Styling                       |
| Lucide React         | Icons                         |
| React Router DOM     | Application routing           |
| TanStack React Query | Server-state management       |
| Axios                | HTTP communication            |
| React Hook Form      | Form handling                 |
| Zod                  | Form validation               |
| Vitest               | Frontend testing              |

## Backend

| Technology           | Purpose                          |
| -------------------- | -------------------------------- |
| Java 21+             | Backend development              |
| Spring Boot 3.x      | REST API framework               |
| Spring Web           | REST endpoints                   |
| Spring Security      | Authentication and authorization |
| JWT                  | Stateless authentication         |
| BCrypt               | Password hashing                 |
| Spring Data MongoDB  | Database access                  |
| Spring Validation    | Request validation               |
| Spring Boot Actuator | Health and monitoring            |
| SpringDoc OpenAPI    | API documentation                |
| JUnit 5              | Testing                          |
| Mockito              | Mock-based testing               |

## Database

MongoDB is used as the primary database.

The application can use MongoDB locally or MongoDB Atlas.

---

# 📁 Project Structure

```text
Ai-Travel-planner/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   │
│   │   ├── context/
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── features/
│   │   │   └── auth/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── trips/
│   │   │
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/
│   │               └── tripwise/
│   │
│   │                   ├── ai/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── audit/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── auth/
│   │                   │   ├── controller/
│   │                   │   ├── dto/
│   │                   │   ├── model/
│   │                   │   └── service/
│   │                   │
│   │                   ├── budget/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── common/
│   │                   │   ├── dto/
│   │                   │   └── exception/
│   │                   │
│   │                   ├── config/
│   │                   │
│   │                   ├── flight/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── hotel/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── integrations/
│   │                   │   ├── amadeus/
│   │                   │   ├── gemini/
│   │                   │   ├── google/
│   │                   │   └── weather/
│   │                   │
│   │                   ├── itinerary/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── packing/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   ├── place/
│   │                   │   ├── controller/
│   │                   │   ├── dto/
│   │                   │   ├── model/
│   │                   │   ├── repository/
│   │                   │   └── service/
│   │                   │
│   │                   ├── security/
│   │                   │
│   │                   ├── trip/
│   │                   │   ├── controller/
│   │                   │   ├── dto/
│   │                   │   ├── model/
│   │                   │   ├── repository/
│   │                   │   └── service/
│   │                   │
│   │                   ├── user/
│   │                   │   ├── controller/
│   │                   │   ├── dto/
│   │                   │   ├── model/
│   │                   │   ├── repository/
│   │                   │   └── service/
│   │                   │
│   │                   ├── weather/
│   │                   │   ├── model/
│   │                   │   └── repository/
│   │                   │
│   │                   └── TripWiseApplication.java
│
├── docs/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── pom.xml
└── README.md
```

---

# 🔐 Authentication

TripWise AI uses JWT-based authentication with Spring Security.

```text
User
 │
 ▼
Register / Login
 │
 ▼
Spring Security
 │
 ▼
BCrypt Password Verification
 │
 ▼
JWT Token
 │
 ▼
React Frontend
 │
 ▼
Protected API Request
 │
 ▼
JWT Authentication Filter
 │
 ▼
Protected Backend Resource
```

Passwords are securely hashed using BCrypt and are never stored as plain text.

---

# 🔌 External API Integrations

TripWise AI uses an extensible integration architecture so that external services can be added without changing the core application.

## 🤖 Gemini AI

Used/planned for:

* AI itinerary generation
* Travel recommendations
* AI travel assistant
* Trip replanning
* Personalized suggestions

## 📍 Google Maps / Places

Used/planned for:

* Maps
* Locations
* Places
* Points of interest
* Routes

## 🌍 Geoapify

Can be used for:

* Restaurants
* Tourist attractions
* Places
* Points of interest
* Location-based recommendations

## 🌤️ OpenWeather

Used/planned for:

* Current weather
* Weather forecasts
* Destination conditions
* Weather-aware trip planning

## ✈️ Aviationstack

Can be used for:

* Flight information
* Flight status
* Airline information
* Airport information

## ✈️ Amadeus

The backend architecture also contains Amadeus integration interfaces for:

* Flight search
* Hotel search

---

# 🔑 Environment Variables

Create a local `.env` file based on `.env.example`.

Example:

```env
MONGODB_URI=mongodb://localhost:27017/tripwise_db

JWT_SECRET=your-secret-key

GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=

GEOAPIFY_API_KEY=

OPENWEATHER_API_KEY=

AVIATIONSTACK_API_KEY=

AMADEUS_CLIENT_ID=
AMADEUS_CLIENT_SECRET=

GEMINI_API_KEY=
```

### ⚠️ Security

Never commit real API keys, passwords, JWT secrets, or database credentials to GitHub.

Use:

```text
.env
```

for local secrets and:

```text
.env.example
```

for placeholder values.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* JDK 21+
* Maven 3.8+
* Node.js 18+
* npm
* MongoDB 6+ or MongoDB Atlas

---

## 1. Clone the Repository

```bash
git clone https://github.com/ktejaswanth/Ai-Travel-planner.git
cd Ai-Travel-planner
```

---

## 2. Configure Environment Variables

Create your local environment configuration from `.env.example`.

Add your API keys and database configuration locally.

Do not commit your actual secrets.

---

## 3. Start MongoDB

For local MongoDB:

```text
mongodb://localhost:27017/tripwise_db
```

Or use MongoDB Atlas and configure the connection URI.

---

## 4. Start the Backend

Open a terminal:

```bash
cd backend
mvn clean spring-boot:run
```

Backend API:

```text
http://localhost:8080
```

Swagger UI:

```text
http://localhost:8080/swagger-ui.html
```

Actuator health:

```text
http://localhost:8080/actuator/health
```

---

## 5. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🐳 Run with Docker

The project also includes Docker Compose.

Run:

```bash
docker-compose up --build
```

To stop the containers:

```bash
docker-compose down
```

---

# 🧪 Testing

## Backend

From the backend directory:

```bash
mvn test
```

## Frontend

From the frontend directory:

```bash
npm test
```

## Frontend Build

```bash
npm run build
```

## Frontend Lint

```bash
npm run lint
```

---

# 📚 API Documentation

The backend uses SpringDoc OpenAPI.

After starting the backend, open:

```text
http://localhost:8080/swagger-ui.html
```

The API is organized around modules including:

```text
Authentication
Users
Trips
Places
```

Additional domain modules include:

```text
Itinerary
Budget
Expenses
Flights
Hotels
Weather
Packing
AI Interactions
Audit Logs
Trip Replanning
```

---

# 🎨 Light & Dark Mode

TripWise AI supports light and dark themes through a dedicated theme context.

```text
ThemeContext
     │
     ├── Light Mode
     │
     └── Dark Mode
```

The theme preference can be persisted locally so that users can retain their selected appearance.

---

# 🔄 Application Flow

```text
                    User
                     │
                     ▼
             React Web Application
                     │
              Authentication
                     │
                     ▼
                Dashboard
                     │
                     ▼
                Create Trip
                     │
                     ▼
              Trip Preferences
                     │
                     ▼
              Spring Boot API
                     │
          ┌──────────┼──────────┐
          │          │          │
          ▼          ▼          ▼
       MongoDB   External APIs   AI
          │          │          │
          │          │          │
          └──────────┼──────────┘
                     ▼
             Personalized Trip
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
   Itinerary      Budget     Recommendations
        │            │            │
        └────────────┼────────────┘
                     ▼
               Trip Dashboard
```

---

# 🛣️ Future Enhancements

Planned and extensible features include:

* Gemini-powered itinerary generation
* AI travel assistant
* Geoapify Places integration
* Google Maps integration
* Google Routes integration
* OpenWeather-powered recommendations
* Aviationstack flight data
* Enhanced hotel search
* Dynamic budget optimization
* Weather-aware itinerary planning
* Personalized activity recommendations
* AI-powered trip replanning
* Real-time travel information

---

# 🏆 Hackathon Value Proposition

TripWise AI addresses a common travel-planning problem: travelers often need to switch between multiple applications to manage destinations, itineraries, maps, weather, flights, accommodation, budgets, and packing.

TripWise AI brings these capabilities together into a single platform.

The system combines:

```text
User Preferences
       +
Travel Data
       +
AI Intelligence
       +
Budget Planning
       ↓
Personalized Travel Experience
```

### Core Idea

> **Real-world travel data + AI personalization + budget-aware planning = one intelligent travel companion.**

---

# 🔮 Future Vision

TripWise AI is designed to evolve into an intelligent travel companion that can continuously understand a user's preferences, budget, destination, weather, activities, and travel conditions.

The modular architecture makes it possible to add new travel-data providers and AI capabilities without rebuilding the entire application.

---

# 📄 License

This project is developed as an academic/hackathon project.

```
```

## 📄 Documentation Links
- [System Architecture Document](docs/ARCHITECTURE.md)
- [Database Schema & Design](docs/DATABASE.md)
- [REST API Specifications](docs/API.md)
- [Detailed Setup Guide](docs/SETUP.md)
