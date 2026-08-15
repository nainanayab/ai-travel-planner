# 🤖 AI Tourism Platform — TDCP Bahawalpur

An AI-powered tourism and travel management platform developed to help travelers **discover tourist destinations, plan trips, manage budgets, explore hotels and transport, make bookings, check weather, save favorite places, and interact with an AI travel assistant** from one platform.

> **Project Status:** Functional MVP / Demo
> This project demonstrates the core architecture and functionality of an AI-powered tourism platform. It is developed as an educational and demonstration project with scope for future production enhancements.

---

## 🌍 Overview

The **AI Tourism Platform** combines tourism services with AI-assisted travel planning to provide users with a centralized travel experience.

Instead of searching separately for destinations, hotels, transport, weather information, budgets, and travel suggestions, users can access these services through one platform.

The current system provides:

* Tourist-place discovery
* Place details and categories
* Search functionality
* User registration and login
* JWT authentication
* User profiles
* Wishlist / favorites
* Reviews
* Tourist-place bookings
* Hotel browsing
* Hotel booking workflow
* Transport browsing
* Transport booking
* AI tourism chat
* AI trip planning
* Inside-city trip planning
* Weather information
* Budget-based trip planning
* Food-cost estimation
* Personalized recommendations
* Trip management
* AI-generated itineraries
* Admin functionality

The overall vision is:

> **Discover → Plan → Budget → Book → Travel**

---

# ✨ Main Features

## 🗺️ Tourist Places

Users can explore tourist destinations through the Places module.

### Features

* Browse tourist places
* Search destinations
* View place details
* View destination categories
* View location information
* View descriptions
* Display destination images
* Book tourist places
* Add places to wishlist
* Submit reviews

The platform currently includes tourism data for destinations such as **Bahawalpur** and can be expanded with additional destinations.

---

# 🏨 Hotel System

The platform includes a hotel module for travelers looking for accommodation.

### Features

* Hotel listing
* Hotel details
* Hotel location
* Hotel description
* Hotel category
* Hotel rating
* Hotel pricing
* Hotel booking workflow

The current hotel system provides the foundation for future improvements such as room management, real-time availability, cancellation, and dynamic pricing.

---

# 🚌 Transport System

The Transport module provides tourism-related transportation services.

### Features

* Transport listings
* Vehicle information
* Transport company information
* Routes
* Departure times
* Arrival times
* Seat availability
* Price per passenger
* Passenger selection
* Automatic total-price calculation
* Transport booking
* Transport booking history

### Example

```text
Price per passenger: Rs. 500
Passengers: 2

Total:
Rs. 1,000
```

The system also supports the concept of **inside-city sightseeing transport**, including the Double Decker Bus used in the city trip-planning experience.

---

# 🤖 AI Travel Assistant

The platform includes an AI-powered tourism assistant using the **Google Gemini API**.

The assistant can be used for tourism-related questions and travel guidance.

Possible assistance includes:

* Destination information
* Tourist attractions
* Travel suggestions
* Trip planning
* Budget planning
* Hotel suggestions
* Transport suggestions
* Weather-related guidance
* General tourism questions

The AI assistant provides a conversational interface alongside the platform's normal tourism services.

---

# 🧠 AI Trip Planner

The AI Trip Planner generates a personalized sightseeing plan based on the user's selected requirements.

Users can select:

* Destination / city
* Number of days
* Travel interest / category

The system then uses available tourism data to generate a trip plan.

### Planning Flow

```text
User
 │
 ├── Destination
 ├── Number of Days
 └── Travel Interest
          │
          ▼
   AI Trip Planner
          │
          ▼
   Available Places
          │
          ▼
 Selected Destinations
          │
          ▼
   Trip Itinerary
```

The generated plan can contain:

* Destination
* Trip duration
* Selected tourist places
* Place categories
* Place descriptions
* Entry-ticket estimates
* Transport information
* Estimated ticket costs
* Day-by-day itinerary

---

# 🏙️ Inside City Trip Planner

The platform provides a dedicated **Inside City** travel-planning experience.

Currently supported city options include:

* Bahawalpur
* Lahore
* Multan

Users can select:

* City
* Trip duration
* Travel interest

The system can then:

1. Check current weather
2. Generate a city trip plan
3. Select suitable tourist places
4. Recommend inside-city transport
5. Estimate ticket costs
6. Generate an itinerary

### Inside City Flow

```text
Select City
     │
     ▼
Check Weather
     │
     ▼
Select Duration
     │
     ▼
Select Travel Interest
     │
     ▼
Generate AI Plan
     │
     ▼
Tourist Places
     │
     ▼
Transport
     │
     ▼
Estimated Cost
     │
     ▼
Day-by-Day Itinerary
```

---

# 🌦️ Weather Integration

Weather information is integrated into the tourism-planning experience.

The current system can display:

* Current temperature
* Feels-like temperature
* Weather condition
* Humidity
* Wind speed
* Rain probability
* Weather indicators

The Inside City planner uses city coordinates to request weather information.

### Weather Flow

```text
Selected City
      │
      ▼
City Coordinates
      │
      ▼
Weather Service
      │
      ▼
Current Weather
      │
 ┌────┼────┬────┐
 ▼    ▼    ▼    ▼
Temp Humidity Wind Rain
```

Future versions can use weather data directly in itinerary optimization and activity recommendations.

---

# 💰 Budget Trip Planner

The platform includes a budget-based trip planning system.

Users can provide:

* Destination
* Number of days
* Number of travelers
* Total budget
* Travel style
* Hotel requirement
* Transport requirement
* Food requirement
* Activities requirement

The system estimates:

```text
Hotel Cost
Transport Cost
Food Cost
Activities Cost
Miscellaneous Cost
----------------------------
Total Trip Cost
Remaining Budget
```

The system can also generate a basic day-by-day itinerary using available tourist places.

---

## 🍴 Food Budgeting

Food is included as part of the budget-planning concept.

The system can estimate daily meal expenses such as:

```text
Breakfast
Lunch
Dinner
```

Food costs can be calculated according to:

* Number of travelers
* Number of days
* Estimated meal cost

This allows the overall trip estimate to include food alongside accommodation, transport, activities, and other expenses.

> **Note:** Food prices in the MVP are estimates and are not intended to represent live restaurant pricing.

---

# ❤️ Wishlist / Favorites

Authenticated users can save tourist destinations for later.

### Features

* Add places to favorites
* View saved places
* Manage wishlist
* Use favorites as part of recommendation logic

---

# ⭐ Reviews

The platform includes a review system for tourist places.

Users can provide feedback about destinations.

The review architecture provides a foundation for future improvements such as:

* Ratings
* Review moderation
* Verified visits
* Review analytics
* AI-assisted recommendations

---

# 👤 User Authentication

The platform includes a complete user account foundation.

### Features

* User registration
* User login
* JWT authentication
* User profile
* Protected endpoints
* Role-based access
* Admin role support

Authenticated users can access services that require user authorization.

---

# 👑 Admin Functionality

The backend contains an administrative module with role-based access support.

The admin architecture can be used for managing:

* Tourist places
* Users
* Hotels
* Transport
* Bookings
* Reviews
* Tourism content

---

# 📅 Booking System

The platform provides booking functionality for multiple tourism services.

## Tourist Place Booking

Users can select:

* Tourist place
* Visit date
* Number of visitors

---

## Hotel Booking

Users can select a hotel and proceed through the hotel booking workflow.

The current system provides the basic booking architecture.

---

## Transport Booking

Users can select:

* Transport service
* Number of passengers

The system automatically calculates the total transport price based on the selected passenger count.

---

# 🧭 Recommendation System

The platform includes a recommendation module based on available user information.

The recommendation system can use:

* User preferences
* Favorite places
* Tourism interests
* Available destinations

This provides the foundation for more advanced AI personalization in future versions.

---

# 🗓️ Trip Management

The backend includes trip-management functionality.

The architecture contains modules for:

* Trips
* Trip stops
* AI-generated trips
* Saving AI-generated trips

This allows generated travel plans to be managed as part of the wider tourism platform.

---

# 🏗️ System Architecture

```text
                         USER
                           │
                           ▼
                 ┌──────────────────┐
                 │ React + Vite     │
                 │    Frontend      │
                 └────────┬─────────┘
                          │
                       REST API
                          │
                          ▼
                 ┌──────────────────┐
                 │ FastAPI Backend  │
                 └────────┬─────────┘
                          │
          ┌───────────────┼────────────────┐
          │               │                │
          ▼               ▼                ▼
   ┌────────────┐  ┌────────────┐  ┌────────────┐
   │ PostgreSQL │  │ Gemini AI  │  │  Weather   │
   │ SQLAlchemy │  │    API     │  │  Service   │
   └────────────┘  └────────────┘  └────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* Vite
* React Router
* Axios
* Bootstrap
* React Icons
* Framer Motion
* React Toastify
* SweetAlert2

## Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic
* JWT Authentication
* Passlib / password hashing

## Database

* PostgreSQL
* SQLAlchemy ORM

## AI

* Google Gemini API

## External Services

* Weather service / Weather API

---

# 📁 Project Structure

```text
AI_TOURISM_PLATFORM/
│
├── backend/
│   │
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │
│   │   └── main.py
│   │
│   ├── static/
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layout/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🔌 Backend Modules

The current FastAPI backend contains modular routers for:

```text
Users
Places
Admin
Preferences
AI Chat
Reviews
Favorites
Bookings
Hotels
Recommendations
Trips
Trip Stops
AI Trips
AI Trip Saving
Weather
Transport
Transport Bookings
Budget Trips
Budget Transport
```

This modular architecture makes it easier to maintain and extend individual tourism services.

---

# 🔗 Main API Routes

Some of the available API routes include:

```text
POST   /register
POST   /login

GET    /places/
GET    /places/{id}

GET    /hotels/
GET    /hotels/{id}

GET    /transports/

POST   /transport-bookings/
GET    /my-transport-bookings

POST   /bookings/
GET    /my-bookings

POST   /chat

POST   /budget-trip/plan

GET    /recommendations/

GET    /weather/

POST   /ai-trip/plan
```

The complete API can be explored through FastAPI Swagger documentation.

```text
http://127.0.0.1:8000/docs
```

---

# ⚙️ Environment Configuration

Create a `.env` file inside the backend directory.

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_tourism

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

WEATHER_API_KEY=YOUR_WEATHER_API_KEY
```

> Never upload real API keys, passwords, JWT secrets, database credentials, or access tokens to GitHub.

---

# 🗄️ PostgreSQL Setup

Create a PostgreSQL database named:

```text
ai_tourism
```

The backend uses PostgreSQL through SQLAlchemy ORM.

Make sure PostgreSQL is running before starting the backend.

---

# 🚀 Run the Project Locally

## 1. Clone Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI_TOURISM_PLATFORM
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows PowerShell:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

The root endpoint returns:

```json
{
  "message": "AI Tourism Platform API is running",
  "status": "success"
}
```

---

# ⚛️ Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend normally runs at:

```text
http://localhost:5173
```

If port `5173` is already in use, Vite may use another available port such as:

```text
http://localhost:5174
```

---

# 🔐 Git Security

Recommended `.gitignore`:

```gitignore
# Environment
.env
.env.*
!.env.example

# Python
__pycache__/
*.py[cod]
.venv/
venv/

# Node
node_modules/
dist/

# IDE
.vscode/
.idea/

# Operating System
.DS_Store
Thumbs.db

# Logs
*.log
```

---

# 📊 Current Project Status

| Module                 | Status            |
| ---------------------- | ----------------- |
| React Frontend         | ✅ Implemented     |
| Vite                   | ✅ Implemented     |
| FastAPI Backend        | ✅ Implemented     |
| PostgreSQL             | ✅ Implemented     |
| SQLAlchemy             | ✅ Implemented     |
| User Registration      | ✅ Implemented     |
| User Login             | ✅ Implemented     |
| JWT Authentication     | ✅ Implemented     |
| Tourist Places         | ✅ Implemented     |
| Place Details          | ✅ Implemented     |
| Wishlist / Favorites   | ✅ Implemented     |
| Reviews                | ✅ Implemented     |
| Place Booking          | ✅ Implemented     |
| Hotels                 | ✅ Implemented     |
| Hotel Booking          | ✅ Implemented     |
| Transport              | ✅ Implemented     |
| Transport Booking      | ✅ Implemented     |
| AI Chat                | ✅ Implemented     |
| AI Trip Planner        | ✅ Implemented     |
| Inside City Planner    | ✅ Implemented     |
| Weather                | ✅ Implemented     |
| Budget Trip Planner    | ✅ Implemented     |
| Food Budget Estimation | ✅ Implemented     |
| Recommendations        | ✅ Implemented     |
| Trip Management        | ✅ Implemented     |
| Admin Module           | ✅ Implemented     |
| Online Payment         | ❌ Not Implemented |

---

# ⚠️ Current Limitations

The project is currently an MVP/demo system.

Some components may use estimated or development-level data, including:

* Estimated food prices
* Estimated ticket prices
* Limited tourism data
* Limited hotel inventory
* Limited transport providers
* Local development URLs
* Local PostgreSQL configuration
* Development-level security configuration
* No live payment gateway
* No guaranteed real-time hotel availability
* No guaranteed real-time transport availability

These limitations are acceptable for the current demonstration stage and can be addressed during future production development.

---

# 🚧 Future Enhancements

## 🧠 Advanced AI Planning

Future improvements may include:

* Fully personalized itineraries
* Advanced route optimization
* Travel-time calculation
* Opening-hours awareness
* Weather-aware planning
* Better budget optimization
* Personalized activity recommendations
* AI-based hotel selection
* AI-based transport selection

---

## 🏨 Advanced Hotel System

Future versions may include:

* Real-time hotel availability
* Room types
* Room capacity
* Dynamic pricing
* Hotel reviews
* Cancellation
* Booking confirmation
* External hotel-provider integration

---

## 🚌 Advanced Transport System

Future versions may include:

* Multiple transport providers
* Real-time seat availability
* Pickup/drop-off locations
* Advanced route optimization
* Dynamic pricing
* Provider management
* Cancellation

---

## 💳 Future Payment Integration

Online payment functionality is **not included in the current MVP/demo version**.

If required in a future production version, the platform can be extended with secure payment functionality for:

* Hotel bookings
* Transport bookings
* Tourist-place bookings
* Booking payment status
* Transaction records
* Payment verification
* Refund processing
* Digital payment receipts

The payment system will be considered as a **future enhancement based on project requirements and deployment needs**.

---

## 🔒 Production Security

Before production deployment, the platform can be further improved with:

* Refresh tokens
* Stronger JWT security
* Rate limiting
* Advanced role-based authorization
* Strict CORS configuration
* API abuse protection
* Secure secret management
* HTTPS
* Security logging
* Monitoring
* Database backups
* Improved error handling

---

## ☁️ Production Deployment

A future deployment architecture may use:

```text
                    Internet
                       │
                       ▼
                React Frontend
                       │
                     HTTPS
                       │
                       ▼
                FastAPI Backend
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      PostgreSQL    Gemini AI    Weather API
```

Potential production technologies may include:

* Cloud hosting
* Managed PostgreSQL
* Docker
* HTTPS
* Domain name
* CI/CD
* Monitoring
* Automated backups
* Environment-based configuration

---

# 🎯 Project Goal

The long-term goal is to create a complete intelligent tourism platform where travelers can manage their journey from discovery to planning and booking.

For example:

```text
"I have Rs. 50,000.

I want to visit Bahawalpur for 4 days
with 3 people.

I prefer historical places.

I need a hotel and transport."
```

The future system can generate:

```text
┌──────────────────────────────────┐
│         AI TRAVEL PLAN           │
├──────────────────────────────────┤
│ Destination                      │
│ Duration                         │
│ Travelers                        │
│ Budget                           │
│                                  │
│ 🏨 Hotel                         │
│ 🚌 Transport                     │
│ 🍴 Food                          │
│ 🎟 Activities                    │
│ 🌦 Weather                       │
│                                  │
│ 📅 Day 1                         │
│ 📅 Day 2                         │
│ 📅 Day 3                         │
│ 📅 Day 4                         │
│                                  │
│ 💰 Total Cost                    │
│ 💵 Remaining Budget              │
└──────────────────────────────────┘
```

---

# 🌟 Project Vision

The final vision of the platform is:

```text
Discover
    ↓
Explore
    ↓
Plan
    ↓
Budget
    ↓
Book
    ↓
Travel
```

The platform aims to provide a centralized and intelligent tourism experience for travelers while supporting tourism destinations and services.

---

# 👩‍💻 Development

This project is currently under active development as an AI-powered tourism platform.

The development approach is:

```text
MVP
 ↓
Feature Completion
 ↓
UI Polish
 ↓
Testing
 ↓
Deployment
 ↓
Production Improvements
```

---

# 🤝 Contributing

For future development:

1. Fork the repository.
2. Create a feature branch.
3. Implement the required changes.
4. Test the frontend and backend.
5. Commit the changes.
6. Push the branch.
7. Create a pull request.

Example:

```bash
git checkout -b feature/new-feature

git add .

git commit -m "Add new tourism feature"

git push origin feature/new-feature
```

---

# 📄 License

This project is currently intended for:

* Educational purposes
* Internship development
* Demonstration
* Research
* Development

A final open-source or commercial license can be selected before production release.

---

# 🙌 Acknowledgements

This project is built using:

* React
* Vite
* FastAPI
* Python
* PostgreSQL
* SQLAlchemy
* Pydantic
* Google Gemini
* Bootstrap
* React Router
* Axios
* React Icons
* Framer Motion

---

# 🌍 AI Tourism Platform

### From Tourism Discovery to Intelligent Trip Planning

**Discover → Plan → Budget → Book → Travel** 🤖🌍

