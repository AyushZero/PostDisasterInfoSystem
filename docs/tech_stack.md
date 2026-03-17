# Technology Stack Document

**Project:** Post-Disaster Information and Alert Platform
**Version:** 1.0

---

## Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework for building component-based dashboard |
| **Vite** | Fast build tool and dev server |
| **Leaflet.js** | Interactive map rendering (free, no API key) |
| **react-leaflet** | React bindings for Leaflet.js |
| **OpenStreetMap** | Free map tile provider |
| **Vanilla CSS** | Styling with CSS custom properties, zero dependencies |
| **React Router** | Client-side routing (dashboard, admin) |
| **Axios** | HTTP client for API communication |

## Backend

| Technology | Purpose |
|------------|---------|
| **Python 3.11+** | Backend runtime |
| **FastAPI** | High-performance REST API framework with auto-docs |
| **Uvicorn** | ASGI server for FastAPI |
| **SQLAlchemy** | ORM for database operations |
| **GeoAlchemy2** | PostGIS integration for geospatial queries |
| **Pydantic** | Request/response validation and serialization |
| **python-jose** | JWT token creation and verification |
| **passlib** | Password hashing (bcrypt) |

## Database

| Technology | Purpose |
|------------|---------|
| **PostgreSQL 15** | Primary relational database |
| **PostGIS** | Geospatial data extension for location-based queries |

## Authentication

| Technology | Purpose |
|------------|---------|
| **JWT** | JSON Web Tokens for admin authentication and API security |
| **bcrypt** | Secure password hashing |

## Containerization

| Technology | Purpose |
|------------|---------|
| **Docker** | Package frontend, backend, database, and monitoring services |
| **Docker Compose** | Multi-container local development orchestration |

## CI/CD Pipeline

| Technology | Purpose |
|------------|---------|
| **Jenkins** | Primary CI/CD server with GitHub integration |
| **GitHub Actions** | Alternative CI/CD pipeline |

## Container Orchestration

| Technology | Purpose |
|------------|---------|
| **Kubernetes** | Container orchestration, scaling, and deployment |
| **kubectl** | Kubernetes CLI management |

## Infrastructure as Code

| Technology | Purpose |
|------------|---------|
| **Terraform** | Provision AWS infrastructure (VPC, EKS, ECR) |

## Configuration Management

| Technology | Purpose |
|------------|---------|
| **Ansible** | Configure servers, install runtime dependencies |

## Monitoring

| Technology | Purpose |
|------------|---------|
| **Prometheus** | Metrics collection from application and infrastructure |
| **Grafana** | Visualization dashboards for monitoring |

## Cloud Provider

| Technology | Purpose |
|------------|---------|
| **Amazon Web Services (AWS)** | Infrastructure hosting (EKS, ECR, VPC) |
