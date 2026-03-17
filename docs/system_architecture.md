# System Architecture Document

**Project:** Post-Disaster Information and Alert Platform
**Version:** 1.0

---

## 1. Architecture Overview

The system follows a modern cloud-native architecture designed to support scalable deployment, automated DevOps pipelines, and containerized services. The platform consists of a frontend dashboard, backend API services, a relational database, and a monitoring stack deployed within a container orchestration environment.

## 2. High-Level Architecture Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Layer                           │
│                   Web Browser (User)                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Frontend Layer                            │
│           React + Vite (Leaflet.js Map Dashboard)           │
│                    Served via Nginx                          │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API calls
┌──────────────────────────▼──────────────────────────────────┐
│                    Backend Layer                              │
│              FastAPI (Python REST API)                        │
│         JWT Auth │ Data Processing │ CRUD                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                     Data Layer                               │
│           PostgreSQL + PostGIS Extension                     │
│    Disasters │ Zones │ Facilities │ Alerts │ Users           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                        │
│  Kubernetes │ Docker │ Terraform (AWS) │ Ansible            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Monitoring Layer                            │
│            Prometheus │ Grafana Dashboards                   │
└─────────────────────────────────────────────────────────────┘
```

## 3. Frontend Architecture

- **Framework:** React (via Vite build tool)
- **Styling:** Vanilla CSS with CSS custom properties
- **Map:** Leaflet.js with OpenStreetMap tiles (free, no API key)
- **Routing:** React Router for dashboard and admin pages
- **HTTP Client:** Axios for API communication

The frontend communicates with backend APIs to retrieve disaster data, alerts, and facility information.

## 4. Backend Architecture

- **Framework:** Python FastAPI
- **API Style:** RESTful JSON APIs
- **Auth:** JWT (JSON Web Tokens) for admin endpoints
- **ORM:** SQLAlchemy with GeoAlchemy2 for PostGIS support

The backend exposes REST APIs used by the frontend dashboard and admin panel. It handles authentication, data processing, file uploads, and database operations.

## 5. Database Architecture

- **Engine:** PostgreSQL 15+
- **Extension:** PostGIS for geospatial data support
- **Tables:** disasters, zones, facilities, alerts, admin_users

PostGIS enables geospatial queries for location-based services such as disaster zone containment checks and nearby facility searches.

## 6. Container Architecture

Docker containers package each service:
- `frontend` — React app served by Nginx
- `backend` — FastAPI app served by Uvicorn
- `postgres` — PostgreSQL with PostGIS
- `prometheus` — Metrics collection
- `grafana` — Metrics visualization

Containers ensure consistent deployment environments across development and production.

## 7. Container Orchestration

Kubernetes manages container deployment, scaling, and networking:
- **Deployments** manage application replicas
- **Services** expose internal networking
- **Ingress controllers** handle external traffic routing
- **StatefulSets** manage PostgreSQL with persistent volumes

## 8. CI/CD Architecture

- **Source Control:** GitHub repository
- **CI Server:** Jenkins (with GitHub Actions as alternative)
- **Pipeline Stages:** Checkout → Test → Build Docker Images → Push to Registry → Deploy to K8s
- **Registry:** AWS ECR for container images

## 9. Infrastructure Provisioning

Terraform provisions AWS infrastructure:
- VPC with public/private subnets
- EKS cluster for Kubernetes
- ECR repositories for container images
- Security groups and IAM roles

## 10. Configuration Management

Ansible configures servers:
- Install Docker and Docker Compose
- Install Kubernetes tools (kubectl, kubeadm, kubelet)
- Configure monitoring agents (node exporter)

## 11. Monitoring and Observability

- **Prometheus** collects metrics from application containers and infrastructure
- **Grafana** visualizes metrics through pre-built dashboards
- **Alert Rules** notify on high error rates, service downtime, high latency

## 12. Security Considerations

- JWT-based authentication secures admin APIs
- Password hashing with bcrypt
- Kubernetes secrets store sensitive credentials
- Network security groups restrict external access
- CORS configuration limits frontend origins

## 13. Scalability Strategy

- Kubernetes horizontal pod autoscaling for backend API
- Stateless services enable rapid scaling
- Database connection pooling via SQLAlchemy

## 14. Fault Tolerance

- Multiple container replicas ensure service availability
- Kubernetes automatically restarts failed containers
- Health checks and readiness probes
- Persistent volumes for database durability

## 15. Future Architecture Enhancements

- Integration with satellite data feeds
- Event streaming (Kafka) for real-time updates
- Disaster prediction ML models
- Edge deployment for faster response in disaster zones
