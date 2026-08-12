# 🤖 AI Tourism Platform

An AI-powered tourism web platform designed to help travelers **discover destinations, plan trips, estimate budgets, book hotels and transport, and interact with an AI travel assistant** from one platform.

> 🚧 **Project Status:** Demo / MVP
> The current version demonstrates the core architecture and functionality. A production-ready version is planned with improved security, scalability, payments, real-time services, and deployment infrastructure.

---

## 🌍 Overview

The **AI Tourism Platform** combines traditional tourism services with AI-powered trip planning.

Users can:

* Explore tourist destinations
* View destination details
* Search and discover places
* Create accounts and log in
* Save favorite destinations
* Book tourist places
* Browse hotels
* Book hotels
* Browse tourist transport
* Book transport
* View their bookings
* Get AI-powered tourism assistance
* Generate AI-based trip plans
* Generate budget-based trip plans
* Estimate hotel, transport, food, activity, and miscellaneous costs
* View a day-by-day itinerary

The goal is to eventually provide a **complete intelligent travel-planning ecosystem**.

---

# ✨ Current Features

## 🗺️ Tourist Places

* Browse tourist destinations
* View destination information
* Destination categories
* Location information
* Tourist-place details
* Images for selected destinations
* Place booking functionality

---

## 🏨 Hotel System

The demo includes:

* Hotel listing
* Hotel details
* Hotel availability information
* Hotel booking flow
* Hotel-related API endpoints

---

## 🚌 Transport System

The transport module provides:

* Transport listings
* Vehicle information
* Company information
* Routes
* Departure and arrival times
* Seat availability
* Price per passenger
* Transport booking
* Passenger selection
* Automatic total-price calculation
* User transport booking history

Example:

```text
Price per person: Rs. 500
Passengers: 2

Total:
Rs. 1,000
```

---

# 💰 AI Budget Trip Planner

The platform currently includes a budget-based trip planning API.

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

The system calculates estimated:

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

It also generates a basic day-by-day itinerary using available tourist places.

Example:

```text
Destination: Bahawalpur
Duration: 3 days
Travelers: 2
Budget: Rs. 30,000

Estimated Total:
Rs. 32,100

Status:
Over Budget
```

> ⚠️ Budget calculations in the demo are estimates. Production development will replace fixed assumptions with real pricing, availability, dynamic data, and better optimization.

---

# 🤖 AI Travel Assistant

The project includes an AI chat system designed to help users with tourism-related questions.

The AI can be extended to assist with:

* Destination recommendations
* Tourist attractions
* Trip planning
* Budget planning
* Hotels
* Transport
* Weather
* Travel suggestions
* Personalized recommendations

The current implementation uses Google's Gemini API.

---

# 🌦️ Weather Integration

The backend includes weather-service integration for tourism planning.

The future production version will use weather information more deeply in AI trip planning.

For example:

```text
Weather
   ↓
Destination suitability
   ↓
Activity recommendations
   ↓
Daily itinerary
```

---

# ❤️ Wishlist

Authenticated users can:

* Save tourist places
* View saved places
* Manage their wishlist

---

# 👤 User System

The platform includes:

* User registration
* User login
* JWT authentication
* User profiles
* Role-based access
* Admin functionality
* Protected API endpoints

---

# 📅 Booking System

The demo includes booking functionality for:

### Tourist Places

Users can select:

* Tourist place
* Visit date
* Number of visitors

### Transport

Users can select:

* Transport service
* Number of passengers

The system calculates the total transport cost.

### Hotels

Users can select hotels and proceed through the hotel booking flow.

---

# 🧠 Recommendation System

The backend contains a recommendation system based on user information such as:

* Preferences
* Favorites
* Tourism interests

The recommendation engine can be expanded significantly in the production version.

---

# 🏗️ Technology Stack

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

## Database

* PostgreSQL

## AI

* Google Gemini API

## External Services

* Weather API

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
│   │   │
│   │   └── main.py
│   │
│   ├── static/
│   ├── .env
│   └── requirements.txt
│
├── frontend/
│   │
│   ├── src/
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

# 🔌 Main Backend Modules

The backend currently contains modules for:

```text
Users
Places
Preferences
Favorites
Reviews
Bookings
Hotels
Transport
Transport Bookings
Trips
Trip Stops
AI Trips
AI Trip Saving
Recommendations
Weather
AI Chat
Budget Trip Planning
Admin
```

---

# 🚀 Running the Project Locally

## 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI_TOURISM_PLATFORM
```

---

# 🐍 Backend Setup

Go to the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🗄️ PostgreSQL Setup

Create a PostgreSQL database:

```text
ai_tourism
```

The backend expects PostgreSQL to be available locally.

Create a `.env` file inside `backend`:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_tourism

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

WEATHER_API_KEY=YOUR_WEATHER_API_KEY
```

> **Never commit `.env` to GitHub.**

---

# ▶️ Start Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI documentation:

```text
http://127.0.0.1:8000/docs
```

---

# ⚛️ Frontend Setup

Open another terminal.

Go to frontend:

```bash
cd frontend
```

Install packages:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

Depending on your local configuration, Vite may use another available port such as:

```text
http://localhost:5174
```

---

# 🔐 Environment Variables

Never upload API keys, passwords, tokens, or database credentials.

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

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

Create an example environment file:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_tourism
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
WEATHER_API_KEY=YOUR_WEATHER_API_KEY
```

---

# 🔗 Important API Routes

Some of the current backend endpoints include:

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
```

The complete API can be explored through:

```text
/docs
```

---

# 🧮 Budget Planning Architecture

The current demo follows this basic architecture:

```text
User
  │
  ├── Destination
  ├── Days
  ├── Travelers
  ├── Budget
  └── Required Services
          │
          ▼
   Budget Trip API
          │
          ├── Places
          ├── Hotels
          ├── Transport
          ├── Food
          ├── Activities
          └── Miscellaneous
          │
          ▼
    Cost Calculation
          │
          ▼
    Budget Evaluation
          │
          ▼
    Day-by-Day Trip
```

---

# 🚧 Production Roadmap

The current repository is a **demo/MVP**, not the final production system.

The next development phase will significantly improve the platform.

## Phase 1 — Production AI Trip Planner

Planned improvements:

* AI-generated complete itineraries
* Personalized travel plans
* Budget optimization
* Hotel selection based on budget
* Transport selection based on budget
* Food budget optimization
* Activity recommendations
* Weather-aware planning
* Travel-time calculation
* Route optimization
* Day-by-day scheduling

---

## Phase 2 — Intelligent Budget Engine

The budget engine will move from fixed estimates to dynamic calculations.

Instead of:

```text
Food = Rs. 800 × persons × days
```

the production system will consider:

```text
Hotel price
+
Transport price
+
Food estimates
+
Activity prices
+
Travel distance
+
Number of travelers
+
Number of days
+
User preferences
+
Available budget
```

The AI will then optimize the trip to fit the user's budget.

---

# 🏨 Phase 3 — Advanced Hotel System

Planned:

* Real hotel availability
* Room types
* Room capacity
* Check-in/check-out
* Dynamic pricing
* Hotel ratings
* Reviews
* Hotel images
* Booking confirmation
* Cancellation
* Payment integration

---

# 🚌 Phase 4 — Advanced Transport System

Planned:

* Multiple transport providers
* Real-time seat availability
* Route optimization
* Pickup/drop-off locations
* Transport schedules
* Dynamic pricing
* Booking confirmation
* Cancellation
* Provider management

---

# 💳 Phase 5 — Payment System

Planned payment functionality:

* Online payments
* Booking payment status
* Transaction records
* Refunds
* Payment verification
* Booking confirmation

---

# 🧠 Phase 6 — Advanced AI

Future AI capabilities:

```text
User Preferences
       ↓
AI Profile
       ↓
Destination Recommendation
       ↓
Budget Analysis
       ↓
Hotel Selection
       ↓
Transport Selection
       ↓
Activities
       ↓
Weather
       ↓
Route Optimization
       ↓
Complete Trip
```

The goal is for the AI to function as a **personal travel planner**, rather than simply a chatbot.

---

# 🔒 Phase 7 — Production Security

Before production deployment:

* Secure password hashing
* JWT token improvements
* Refresh tokens
* Role-based authorization
* Input validation
* Rate limiting
* API security
* CORS hardening
* Secret management
* Database security
* Error handling
* Logging
* Monitoring

---

# ☁️ Phase 8 — Production Deployment

Planned deployment architecture:

```text
                    Internet
                       │
                       ▼
                 Frontend
                React / Vite
                       │
                       ▼
                 Backend API
                    FastAPI
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
      PostgreSQL                  AI APIs
                                  Gemini
          │
          ▼
      External Services
      Weather / Maps / Payments
```

Production deployment may use:

* Cloud hosting
* Managed PostgreSQL
* HTTPS
* Domain name
* CI/CD
* Docker
* Environment-based configuration
* Monitoring
* Backups

---

# 📌 Current Limitations

This demo version may contain:

* Estimated rather than real-time prices
* Basic itinerary generation
* Limited tourism data
* Limited hotel/transport availability
* Development API configuration
* Local PostgreSQL setup
* Local frontend/backend URLs
* Demo-level authentication
* No production payment gateway

These limitations are intentional because the project is currently being developed incrementally.

---

# 🎯 Project Goal

The long-term goal is to build a complete:

> **AI-powered intelligent tourism and travel management platform**

where a user can simply say:

```text
"I have Rs. 50,000.
I want to visit Bahawalpur for 4 days
with 3 people.
I prefer historical places.
I need a hotel and transport."
```

and the system can generate:

```text
┌──────────────────────────────────┐
│        AI TRAVEL PLAN            │
├──────────────────────────────────┤
│ Destination                      │
│ Duration                         │
│ Travelers                        │
│                                  │
│ 🏨 Hotel                         │
│ 🚌 Transport                    │
│ 🍴 Food                          │
│ 🎟 Activities                   │
│                                  │
│ 📅 Day 1                         │
│ 📅 Day 2                         │
│ 📅 Day 3                         │
│ 📅 Day 4                         │
│                                  │
│ 💰 Total Cost                    │
│ 💵 Remaining Budget              │
│                                  │
│ ✅ Book Everything               │
└──────────────────────────────────┘
```

---

# 👩‍💻 Development

This project is currently under active development.

The architecture is being developed incrementally from:

```text
Demo / MVP
     ↓
Feature Complete
     ↓
Production Architecture
     ↓
Security Hardening
     ↓
Testing
     ↓
Deployment
     ↓
Production Release
```

---

# ⭐ Future Vision

The final platform will aim to provide:

**Discover → Plan → Budget → Book → Travel**

all from a single intelligent tourism platform.

---

## 📄 License

This project is currently intended for educational, demonstration, and development purposes.

A final open-source or commercial license will be determined before production release.

---

## 🙌 Acknowledgements

Built using:

* React
* FastAPI
* PostgreSQL
* SQLAlchemy
* Google Gemini
* Bootstrap
* Vite

---

**AI Tourism Platform — From tourism discovery to intelligent trip planning.** 🤖🌍
