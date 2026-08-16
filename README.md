🤖 AI Tourism Platform — TDCP Bahawalpur

An AI-powered tourism and travel management platform developed to help travelers discover tourist destinations, plan trips, manage budgets, explore hotels and transport, make bookings, check weather, save favorite places, and interact with an AI travel assistant from one platform.

Project Status: Functional MVP / Demonstration Prototype

This project demonstrates the core concept, architecture, and workflow of an AI-powered tourism platform. It is currently developed as an educational, research, internship, and demonstration project. Advanced production features remain part of the future development roadmap.

🌍 Overview

The AI Tourism Platform combines tourism services with AI-assisted travel planning to provide users with a centralized travel experience.

Instead of searching separately for destinations, hotels, transport, weather information, budgets, and travel suggestions, users can access these services through one platform.

The current demonstration provides functionality for:

Tourist-place discovery

Place details and categories

Destination search

User registration and login

JWT authentication

User profiles

Wishlist / favorites

Reviews

Tourist-place bookings

Hotel browsing

Hotel booking workflow

Transport browsing

Transport booking

AI tourism chat

AI-assisted trip planning

Inside-city trip planning

Weather information

Budget-based trip planning

Food-cost estimation

Personalized recommendations

Trip management

AI-generated itineraries

Administrative functionality

The overall platform vision is:

Discover → Plan → Budget → Book → Travel

✨ Main Features

🗺️ Tourist Places

Users can explore tourist destinations through the Places module.

Features

Browse tourist places

Search destinations

View place details

View destination categories

View location information

View descriptions

Display destination images

Book tourist places

Add places to wishlist

Submit reviews

The current demonstration includes tourism data for destinations such as Bahawalpur, Lahore, and Multan, with the architecture designed to support additional destinations.

🏨 Hotel System

The platform includes a hotel module for travelers looking for accommodation.

Features

Hotel listing

Hotel details

Hotel location

Hotel description

Hotel category

Hotel rating

Hotel pricing

Hotel booking workflow

Hotel booking history

The current hotel system provides the foundation for future improvements such as real-time room availability, room management, cancellation, dynamic pricing, and external hotel-provider integration.

🚌 Transport System

The Transport module provides tourism-related transportation services.

Features

Transport listings

Vehicle information

Transport company information

Routes

Departure times

Arrival times

Seat availability

Price per passenger

Passenger selection

Automatic total-price calculation

Transport booking

Transport booking history

Example

Price per passenger: Rs. 500
Passengers: 2

Total:
Rs. 1,000

The system also supports the concept of inside-city sightseeing transport, including the Double Decker Bus used in the city trip-planning experience.

🤖 AI Travel Assistant

The platform includes an AI-powered tourism assistant using the Google Gemini API.

The assistant provides a conversational interface for tourism-related questions and travel guidance.

Possible assistance includes:

Destination information

Tourist attractions

Travel suggestions

Trip planning

Budget planning

Hotel suggestions

Transport suggestions

Weather-related guidance

General tourism questions

The AI assistant works alongside the platform's normal tourism services.

Note: The current AI assistant is part of the demonstration/MVP implementation. More advanced agentic and personalized capabilities are planned for future versions.

🧠 AI Trip Planner

The platform includes an AI-assisted trip planning module that generates a personalized sightseeing plan based on selected requirements.

Users can select:

Destination / city

Number of days

Travel interest / category

The system uses available tourism data to generate a trip plan.

Planning Flow

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

The generated plan can contain:

Destination

Trip duration

Selected tourist places

Place categories

Place descriptions

Entry-ticket estimates

Transport information

Estimated ticket costs

Day-by-day itinerary

🏙️ Inside City Trip Planner

The platform provides a dedicated Inside City travel-planning experience.

Currently supported city options include:

Bahawalpur

Lahore

Multan

Users can select:

City

Trip duration

Travel interest

The system can then:

Check current weather

Generate a city trip plan

Select suitable tourist places

Recommend inside-city transport

Estimate ticket costs

Generate an itinerary

Inside City Flow

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

🌦️ Weather Integration

Weather information is integrated into the tourism-planning experience.

The current system can display information such as:

Current temperature

Feels-like temperature

Weather condition

Humidity

Wind speed

Rain probability

Weather indicators

The Inside City planner uses city information and coordinates to request weather information.

Weather Flow

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

Future versions can use weather data directly in itinerary optimization and activity recommendations.

💰 Budget Trip Planner

The platform includes a budget-based trip planning system.

Users can provide:

Destination

Number of days

Number of travelers

Total budget

Travel style

Hotel requirement

Transport requirement

Food requirement

Activities requirement

The system estimates:

Hotel Cost
Transport Cost
Food Cost
Activities Cost
Miscellaneous Cost
----------------------------
Total Trip Cost
Remaining Budget

The system can also generate a basic day-by-day itinerary using available tourist places.

Note: Budget calculations in the current MVP are demonstration-level estimates and should not be considered live market pricing.

🍴 Food Budgeting

Food is included as part of the budget-planning concept.

The system can estimate daily meal expenses such as:

Breakfast
Lunch
Dinner

Food costs can be calculated according to:

Number of travelers

Number of days

Estimated meal cost

This allows the overall trip estimate to include food alongside accommodation, transport, activities, and other expenses.

Note: Food prices in the MVP are estimated values and are not intended to represent live restaurant pricing.

❤️ Wishlist / Favorites

Authenticated users can save tourist destinations for later.

Features

Add places to favorites

View saved places

Manage wishlist

Use favorites as part of recommendation logic

⭐ Reviews

The platform includes a review system for tourist places.

Users can provide feedback about destinations.

The review architecture provides a foundation for future improvements such as:

Ratings

Review moderation

Verified visits

Review analytics

AI-assisted review analysis

AI-assisted recommendations

👤 User Authentication

The platform includes a complete user-account foundation.

Features

User registration

User login

JWT authentication

User profile

Protected endpoints

Role-based access

Admin role support

Authenticated users can access services that require authorization.

👑 Admin Functionality

The backend contains an administrative module with role-based access support.

The admin architecture can be extended for managing:

Tourist places

Users

Hotels

Transport

Bookings

Reviews

Tourism content

The current admin functionality is part of the MVP/demo architecture and can be expanded significantly for a production administration dashboard.

📅 Booking System

The platform provides booking functionality for multiple tourism services.

Tourist Place Booking

Users can select:

Tourist place

Visit date

Number of visitors

Hotel Booking

Users can select a hotel and proceed through the hotel booking workflow.

The current implementation provides the basic booking architecture.

Real-time hotel inventory, room-level booking, cancellation, and external provider integration are planned for future development.

Transport Booking

Users can select:

Transport service

Number of passengers

The system automatically calculates the total transport price based on the selected passenger count.

🧭 Recommendation System

The platform includes a recommendation module based on available user information.

The recommendation system can use:

User preferences

Favorite places

Tourism interests

Available destinations

This provides a foundation for more advanced AI personalization in future versions.

🗓️ Trip Management

The backend includes trip-management functionality.

The architecture contains modules for:

Trips

Trip stops

AI-generated trips

Saving AI-generated trips

This allows generated travel plans to be managed as part of the wider tourism platform.

🏗️ System Architecture

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
          ┌──────────────┼────────────────┐
          │              │                │
          ▼              ▼                ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ PostgreSQL │ │ Gemini AI  │ │  Weather   │
   │ SQLAlchemy │ │    API     │ │  Service   │
   └────────────┘ └────────────┘ └────────────┘

🛠️ Technology Stack

Frontend

React

Vite

React Router

Axios

Bootstrap

React Icons

Framer Motion

React Toastify

SweetAlert2

Backend

Python

FastAPI

Uvicorn

SQLAlchemy

Pydantic

JWT Authentication

Password hashing

Database

PostgreSQL

SQLAlchemy ORM

AI

Google Gemini API

External Services

Weather API / Weather Service

📁 Project Structure

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
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── scripts/
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

🔌 Backend Modules

The current FastAPI backend contains modular routers and services for:

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

The modular architecture makes it easier to maintain and extend individual tourism services.

🔗 Main API Routes

Some of the available API routes include:

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

The complete API can be explored through FastAPI Swagger documentation after starting the backend:

http://127.0.0.1:8000/docs

⚙️ Environment Configuration

Create a .env file inside the backend directory.

Example:

DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/ai_tourism

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

WEATHER_API_KEY=YOUR_WEATHER_API_KEY

Security: Never upload real API keys, passwords, JWT secrets, database credentials, or access tokens to GitHub.

For team development, use an .env.example file containing placeholder values.

🗄️ PostgreSQL Setup

Create a PostgreSQL database named:

ai_tourism

The backend uses PostgreSQL through SQLAlchemy ORM.

Make sure PostgreSQL is running before starting the backend.

Database migrations are managed through the project's Alembic configuration where applicable.

🚀 Run the Project Locally

1. Clone Repository

git clone https://github.com/nainanayab/ai-travel-planner.git
cd ai-travel-planner

🐍 Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv .venv

Activate it on Windows PowerShell:

.venv\Scripts\Activate.ps1

Install dependencies:

pip install -r requirements.txt

Configure your .env file.

Start FastAPI:

uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000

Swagger documentation:

http://127.0.0.1:8000/docs

⚛️ Frontend Setup

Open another terminal.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Start Vite:

npm run dev

Frontend normally runs at:

http://localhost:5173

If port 5173 is already in use, Vite may automatically use another available port.

🧪 Frontend Production Build

The frontend can be tested with:

npm run build

A successful build confirms that the Vite application can be compiled for production deployment.

The current MVP may still require optimization such as code splitting and bundle-size improvements before large-scale production deployment.

🔐 Git Security

Recommended .gitignore entries include:

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

Never commit:

.env
API keys
Database passwords
JWT secrets
Access tokens
Private credentials
Virtual environments
node_modules
Python __pycache__
Compiled Python files

📊 Current Project Status

Module

Status

React Frontend

✅ Implemented

Vite

✅ Implemented

FastAPI Backend

✅ Implemented

PostgreSQL

✅ Implemented

SQLAlchemy

✅ Implemented

User Registration

✅ Implemented

User Login

✅ Implemented

JWT Authentication

✅ Implemented

Tourist Places

✅ Implemented

Place Details

✅ Implemented

Wishlist / Favorites

✅ Implemented

Reviews

✅ Implemented

Tourist Place Booking

✅ Implemented

Hotels

✅ Implemented

Hotel Booking

✅ Implemented

Transport

✅ Implemented

Transport Booking

✅ Implemented

AI Tourism Assistant

✅ Demo Implemented

AI Trip Planner

✅ Demo Implemented

Inside City Planner

✅ Demo Implemented

Weather

✅ Implemented

Budget Trip Planner

✅ Demo Implemented

Food Budget Estimation

✅ Demo Implemented

Recommendations

✅ Implemented

Trip Management

✅ Implemented

Admin Functionality

✅ Implemented

Online Payment Gateway

🔜 Future Enhancement

Live Hotel Availability

🔜 Future Enhancement

Live Transport Availability

🔜 Future Enhancement

Advanced AI Optimization

🔜 Future Enhancement

Production Deployment

🔜 Future Enhancement

⚠️ Current Limitations

This project is currently a functional MVP / demonstration prototype.

The primary purpose of the current version is to demonstrate the concept, architecture, user experience, tourism workflows, and integration of AI-assisted travel functionality.

The current demonstration may use:

Sample tourism data

Limited hotel inventory

Limited transport data

Estimated food costs

Estimated activity/ticket costs

Development-level weather integration

Development/local API configuration

Limited AI planning logic

Local PostgreSQL configuration

Development-level security configuration

The platform is not currently intended to operate as a fully commercial production booking platform.

The following capabilities are not yet fully production-ready:

Real-time hotel availability

Real-time transport inventory

Online payment processing

Advanced AI itinerary optimization

Large-scale recommendation models

Enterprise-grade monitoring

Production infrastructure

Advanced security hardening

Automated production deployment

These capabilities are planned as future enhancements.

🚧 Future Enhancements

The current system is intentionally developed as an MVP/demo. Future development can extend the platform into a production-grade intelligent tourism ecosystem.

🧠 Advanced AI Tourism Intelligence

Future AI capabilities may include:

Fully personalized itineraries

Multi-destination trip planning

Advanced route optimization

Travel-time calculation

Opening-hours awareness

Weather-aware itinerary optimization

Personalized activity recommendations

AI-powered hotel selection

AI-powered transport selection

Advanced budget optimization

Context-aware tourism assistant

User preference learning

More intelligent destination recommendations

AI-based trip modification

Conversational trip planning

🏨 Advanced Hotel System

Future versions may include:

Real-time hotel availability

Room-level inventory

Room types

Room capacity

Dynamic pricing

Hotel reviews

Cancellation

Booking modification

Booking confirmation

External hotel-provider integration

Hotel availability synchronization

🚌 Advanced Transport System

Future versions may include:

Multiple transport providers

Real-time seat availability

Pickup/drop-off locations

Advanced route optimization

Dynamic pricing

Provider management

Transport cancellation

Rescheduling

Real-time transport updates

💳 Future Payment Integration

Online payment functionality is not included in the current MVP/demo version.

If required in a future production version, the platform can be extended with secure payment functionality for:

Hotel bookings

Transport bookings

Tourist-place bookings

Booking payment status

Transaction records

Payment verification

Refund processing

Digital payment receipts

Payment integration will depend on project requirements, available payment providers, regulatory requirements, and deployment environment.

🔒 Production Security Enhancements

Before production deployment, the platform can be further improved with:

Refresh-token authentication

Strong JWT security

Secure secret management

Rate limiting

Strict CORS configuration

Advanced role-based authorization

API abuse protection

HTTPS

Security logging

Audit logging

Monitoring

Database backups

Improved error handling

Input validation

Production-grade configuration management

☁️ Production Deployment

A future deployment architecture may use:

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
     PostgreSQL     Gemini AI    Weather API

Potential production technologies may include:

Cloud hosting

Managed PostgreSQL

Docker

HTTPS

Domain name

CI/CD

Monitoring

Automated backups

Environment-based configuration

Centralized logging

Container orchestration if required

🎯 Project Goal

The long-term goal is to create a complete intelligent tourism platform where travelers can manage their journey from discovery to planning, budgeting, and booking.

For example:

"I have Rs. 50,000.

I want to visit Bahawalpur for 4 days
with 3 people.

I prefer historical places.

I need a hotel and transport."

A future production version could generate:

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

🌟 Project Vision

The platform's overall vision is:

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

The goal is to provide a centralized and intelligent tourism experience for travelers while supporting tourism destinations and tourism-related services.

🗺️ Development Roadmap

The project can continue through the following development stages:

Current MVP / Demo
        │
        ▼
Feature Completion
        │
        ▼
UI / UX Polish
        │
        ▼
Testing & Validation
        │
        ▼
AI Improvements
        │
        ▼
Payment Integration
        │
        ▼
Real-Time Service Integration
        │
        ▼
Security Hardening
        │
        ▼
Cloud Deployment
        │
        ▼
Production Improvements

👩‍💻 Development

This project is currently under active development as an AI-powered tourism platform.

The current version focuses on demonstrating:

Tourism discovery

AI-assisted travel planning

Budget planning

Hotel services

Transport services

Booking workflows

Weather integration

User management

Personalized tourism experiences

The system is being developed incrementally, with future phases focused on reliability, scalability, security, advanced AI capabilities, and production deployment.

🤝 Contributing

For future development:

Fork the repository.

Create a feature branch.

Implement the required changes.

Test the frontend and backend.

Commit the changes.

Push the branch.

Create a pull request.

Example:

git checkout -b feature/new-feature

git add .

git commit -m "feat: add new tourism feature"

git push origin feature/new-feature

📄 License

This project is currently intended for:

Educational purposes

Internship development

Demonstration

Research

Development

A final open-source or commercial license can be selected before production release.

🙌 Acknowledgements

This project is built using:

React

Vite

FastAPI

Python

PostgreSQL

SQLAlchemy

Pydantic

Google Gemini

Bootstrap

React Router

Axios

React Icons

Framer Motion

🌍 AI Tourism Platform

From Tourism Discovery to Intelligent Trip Planning

Discover → Plan → Budget → Book → Travel 🤖🌍

📌 Project Note

This repository represents the current MVP / demonstration version of the AI Tourism Platform.

The objective of this version is to demonstrate the feasibility of combining tourism services, AI-assisted trip planning, budgeting, weather information, accommodation, transportation, and booking workflows into a unified platform.

Additional production-grade capabilities can be implemented in future development phases.

