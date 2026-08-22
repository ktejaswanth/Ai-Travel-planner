# TripWise AI — Database Design & Data Model

## 1. Overview

TripWise AI utilizes MongoDB (compatible with MongoDB Atlas) as its primary document store. To support scalability and clean domain boundaries, entities are stored in independent collections referenced by foreign identifiers (`userId`, `tripId`) rather than embedding all trip data into single monolithic documents.

---

## 2. Collections & Schemas

### 2.1 `users` Collection

Stores registered platform users and credentials.

```json
{
  "_id": "ObjectId('65d0a1b2c3d4e5f678901234')",
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "passwordHash": "$2a$10$e8Z4wK5...",
  "role": "USER",
  "createdAt": "2026-08-22T10:00:00.000Z",
  "updatedAt": "2026-08-22T10:00:00.000Z"
}
```

#### Fields
| Field | Type | Required | Constraints / Notes |
|---|---|---|---|
| `id` | String / ObjectId | Yes | Unique Identifier |
| `name` | String | Yes | Full Name |
| `email` | String | Yes | Unique, indexed, normalized lower-case |
| `passwordHash` | String | Yes | BCrypt hashed password |
| `role` | String | Yes | Enum: `USER`, `ADMIN` |
| `createdAt` | Instant | Yes | Auto timestamp |
| `updatedAt` | Instant | Yes | Auto timestamp |

---

### 2.2 `trips` Collection

Stores high-level trip metadata and travel parameters.

```json
{
  "_id": "ObjectId('65d0a2c3d4e5f67890123456')",
  "userId": "65d0a1b2c3d4e5f678901234",
  "title": "Goa Vacation",
  "origin": "Hyderabad",
  "destination": "Goa",
  "startDate": "2026-09-10",
  "endDate": "2026-09-14",
  "travelers": 2,
  "budget": 30000.0,
  "currency": "INR",
  "status": "PLANNING",
  "createdAt": "2026-08-22T10:15:00.000Z",
  "updatedAt": "2026-08-22T10:15:00.000Z"
}
```

#### Fields
| Field | Type | Required | Constraints / Notes |
|---|---|---|---|
| `id` | String / ObjectId | Yes | Unique Identifier |
| `userId` | String | Yes | Reference to `users.id`, indexed |
| `title` | String | Yes | Descriptive title |
| `origin` | String | Yes | Origin city/location |
| `destination` | String | Yes | Target destination city/country, indexed |
| `startDate` | LocalDate | Yes | Start date (yyyy-MM-dd), indexed |
| `endDate` | LocalDate | Yes | End date (must be >= startDate) |
| `travelers` | Integer | Yes | Count (> 0) |
| `budget` | Double | Yes | Total budget (>= 0) |
| `currency` | String | Yes | Currency code e.g. `INR`, `USD`, `EUR` |
| `status` | String | Yes | Enum: `DRAFT`, `PLANNING`, `READY`, `COMPLETED`, `CANCELLED` |
| `createdAt` | Instant | Yes | Auto timestamp, indexed |
| `updatedAt` | Instant | Yes | Auto timestamp |

---

### 2.3 `trip_preferences` Collection

Stores detailed user preferences for itinerary generation and recommendations.

```json
{
  "_id": "ObjectId('65d0a3d4e5f6789012345678')",
  "tripId": "65d0a2c3d4e5f67890123456",
  "interests": ["BEACH", "FOOD", "PHOTOGRAPHY"],
  "travelStyle": "Balanced",
  "pace": "Moderate",
  "accommodationPreference": "Resort",
  "transportPreference": "Flight & Rental Car",
  "dietaryPreference": "Vegetarian",
  "specialRequirements": "Quiet ocean view room requested"
}
```

#### Fields
| Field | Type | Required | Constraints / Notes |
|---|---|---|---|
| `id` | String / ObjectId | Yes | Unique Identifier |
| `tripId` | String | Yes | Unique reference to `trips.id`, indexed |
| `interests` | List\<String\> | Yes | Enums: `BEACH`, `ADVENTURE`, `NATURE`, `CULTURE`, `HISTORY`, `FOOD`, `NIGHTLIFE`, `SHOPPING`, `PHOTOGRAPHY`, `RELAXATION` |
| `travelStyle` | String | No | e.g. Budget, Luxury, Family, Solo, Balanced |
| `pace` | String | No | e.g. Relaxed, Moderate, Fast-paced |
| `accommodationPreference` | String | No | e.g. Hotel, Hostel, Resort, Apartment |
| `transportPreference` | String | No | e.g. Public Transit, Flight, Driving |
| `dietaryPreference` | String | No | e.g. None, Vegetarian, Vegan, Halal, Gluten-Free |
| `specialRequirements` | String | No | Free-text notes |

---

## 3. Database Indexes

To ensure high performance under query loads, the following compound and single-field indexes are configured:

1. **`users`**:
   - `email` (Unique index)
2. **`trips`**:
   - `userId` (Single index for loading user dashboard trips)
   - `startDate` (Single index for date filtering and sorting)
   - `destination` (Single index for location analytics)
   - `createdAt` (Single index for chronologically sorting trips)
3. **`trip_preferences`**:
   - `tripId` (Unique index for 1:1 trip preference lookup)
