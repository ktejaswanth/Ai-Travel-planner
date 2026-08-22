# TripWise AI — Backend Service

Spring Boot 3 REST API for TripWise AI travel platform.

## Features
- Authentication & User Profile Management (JWT + Spring Security + BCrypt)
- MongoDB Persistence with Spring Data MongoDB
- Trip Management & Preference APIs
- Standardized API response format & Global Exception Handling
- OpenAPI 3 / Swagger Documentation (`/swagger-ui.html`)
- Actuator metrics & Health check (`/actuator/health`)
- External API Client Interfaces (Google Places/Routes, OpenWeather, Amadeus, Gemini)

## Requirements
- Java 21+
- Maven 3.8+
- MongoDB 6+ running locally on port 27017 or Atlas connection string

## Run Application
```bash
mvn spring-boot:run
```
