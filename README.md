# Post-Disaster Information and Alert Platform

A full-stack web application for visualizing disaster information on an interactive map, managing emergency resources, and demonstrating modern cloud-native DevOps practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Overview

The platform provides a centralized dashboard that visualizes disaster zones on an interactive map, displays emergency resources (shelters, hospitals, evacuation points), and delivers real-time alerts. Administrators manage disaster data through a secure admin panel.

### Key Features

- 🗺️ **Interactive Map Dashboard** — Leaflet.js + OpenStreetMap with color-coded severity zones
- 🏥 **Emergency Resource Locator** — shelters, hospitals, evacuation points, missing persons centers
- 🚨 **Real-time Alerts** — emergency notifications with severity levels
- 📍 **Location-based** — geolocation access or manual entry
- 🔐 **Admin Dashboard** — secure data management with JWT authentication
- 📊 **Monitoring** — Prometheus + Grafana observability stack

---

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   Frontend  │───▶│   Backend    │────▶│   PostgreSQL   │
│  React+Vite │     │   FastAPI   │     │    + PostGIS    │
│  Leaflet.js │     │   JWT Auth  │     │                 │
└─────────────┘     └─────────────┘     └─────────────────┘
       │                    │
       └────────┬───────────┘
                │
    ┌───────────▼───────────┐
    │   Docker / Kubernetes │
    │   Jenkins CI/CD       │
    │   Terraform (AWS)     │
    │   Ansible             │
    │   Prometheus + Grafana│
    └───────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Leaflet.js, OpenStreetMap, Vanilla CSS |
| Backend | Python, FastAPI, SQLAlchemy, GeoAlchemy2 |
| Database | PostgreSQL 15 + PostGIS |
| Auth | JWT + bcrypt |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes |
| CI/CD | Jenkins, GitHub Actions |
| IaC | Terraform (AWS) |
| Config Mgmt | Ansible |
| Monitoring | Prometheus, Grafana |

---

## Project Structure

```
├── backend/                  # FastAPI backend API
│   ├── app/
│   │   ├── main.py          # App entry point
│   │   ├── config.py        # Environment configuration
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # Database models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── auth.py          # JWT authentication
│   │   └── routers/         # API route handlers
│   ├── seed_data.py         # Sample data loader
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx          # Root component
│   │   ├── index.css        # Design system
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   └── lib/             # API client
│   ├── package.json
│   └── Dockerfile
├── k8s/                      # Kubernetes manifests
├── terraform/                # AWS infrastructure
├── ansible/                  # Server configuration
├── monitoring/               # Prometheus + Grafana configs
├── docs/                     # Project documentation
├── docker-compose.yml        # Local development stack
├── Jenkinsfile              # CI/CD pipeline
└── .github/workflows/       # GitHub Actions
```

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)

### Run with Docker Compose

```bash
# Clone the repository
git clone <repository-url>
cd "Post Disaster Information System"

# Start all services
docker-compose up -d

# Access the application
# Frontend:  http://localhost:5173
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
# Grafana:   http://localhost:3001
```

### Local Development

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Kubernetes Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/

# Verify deployment
kubectl get pods -n disaster-platform
```

---

## DevOps Pipeline

1. **Code Push** → GitHub repository
2. **CI Pipeline** → Jenkins builds & tests
3. **Docker Build** → Container images created
4. **Push to Registry** → Images pushed to AWS ECR
5. **Deploy** → Kubernetes rolling deployment
6. **Monitor** → Prometheus + Grafana observability

---

## Documentation

- [Design Document](docs/design_document.md)
- [Product Requirements](docs/product_requirements.md)
- [System Architecture](docs/system_architecture.md)
- [Technology Stack](docs/tech_stack.md)

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
