# ShopFlow E-commerce - System Architecture Overview

## Executive Summary

ShopFlow is a full-stack e-commerce platform built with React frontend and Node.js backend, designed for scalability, performance, and developer experience.

## High-Level Architecture

### ASCII System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SHOPFLOW ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────┐
    │  Mobile  │     │  Browser │     │  Admin   │
    │   App    │     │  Client  │     │  Portal  │
    └────┬─────┘     └────┬─────┘     └────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │     CloudFront CDN    │
              │   (Static Assets)     │
              └───────────┬───────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Application Load    │
              │      Balancer         │
              └───────────┬───────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌─────────┐     ┌─────────┐     ┌─────────┐
    │ API Pod │     │ API Pod │     │ API Pod │
    │  (ECS)  │     │  (ECS)  │     │  (ECS)  │
    └────┬────┘     └────┬────┘     └────┬────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
    ┌─────────────────────┼─────────────────────┐
    │                     │                     │
    ▼                     ▼                     ▼
┌─────────┐        ┌───────────┐        ┌───────────┐
│PostgreSQL│        │   Redis   │        │    SQS    │
│  (RDS)  │        │  Cache    │        │  Queue    │
└─────────┘        └───────────┘        └───────────┘
                                               │
                                               ▼
                                        ┌───────────┐
                                        │  Worker   │
                                        │  Service  │
                                        └───────────┘
```

### Mermaid Architecture Diagram

```mermaid
graph TB
    subgraph Clients["Client Layer"]
        Browser[Browser Client]
        Mobile[Mobile App]
        Admin[Admin Portal]
    end

    subgraph CDN["Content Delivery"]
        CloudFront[CloudFront CDN]
    end

    subgraph LoadBalancer["Load Balancing"]
        ALB[Application Load Balancer]
    end

    subgraph API["API Layer - ECS Fargate"]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance 3]
    end

    subgraph Services["Service Layer"]
        AuthService[Auth Service]
        ProductService[Product Service]
        CartService[Cart Service]
        OrderService[Order Service]
        PaymentService[Payment Service]
        NotificationService[Notification Service]
    end

    subgraph Data["Data Layer"]
        PostgreSQL[(PostgreSQL RDS)]
        Redis[(Redis ElastiCache)]
        S3[(S3 Storage)]
    end

    subgraph Queue["Message Queue"]
        SQS[Amazon SQS]
        Worker[Worker Service]
    end

    Browser --> CloudFront
    Mobile --> CloudFront
    Admin --> CloudFront
    CloudFront --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3

    API1 --> AuthService
    API1 --> ProductService
    API1 --> CartService
    API2 --> OrderService
    API2 --> PaymentService
    API3 --> NotificationService

    AuthService --> PostgreSQL
    AuthService --> Redis
    ProductService --> PostgreSQL
    ProductService --> Redis
    CartService --> Redis
    OrderService --> PostgreSQL
    OrderService --> SQS
    PaymentService --> PostgreSQL
    NotificationService --> SQS

    SQS --> Worker
    Worker --> PostgreSQL
```

## Component Overview

### Frontend (React)
- **Framework**: React 18 with TypeScript
- **State Management**: React Query + Zustand
- **Styling**: Tailwind CSS + Headless UI
- **Build Tool**: Vite

### Backend (Node.js)
- **Framework**: Express.js with TypeScript
- **ORM**: Prisma
- **Authentication**: Passport.js + JWT
- **Validation**: Zod

### Database
- **Primary**: PostgreSQL 15 (RDS)
- **Cache**: Redis 7 (ElastiCache)
- **Search**: PostgreSQL Full-Text Search

### Infrastructure
- **Container**: Docker + ECS Fargate
- **CDN**: CloudFront
- **Storage**: S3
- **Queue**: SQS

## Data Flow

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Request │───▶│   CDN   │───▶│   ALB   │───▶│   API   │───▶│ Service │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └────┬────┘
                                                                  │
    ┌─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Cache  │◀──▶│   DB    │◀──▶│  Queue  │
└─────────┘    └─────────┘    └─────────┘
```

## Scalability Considerations

| Component | Scaling Strategy | Max Capacity |
|-----------|-----------------|--------------|
| API | Horizontal (ECS) | 20 instances |
| Database | Vertical + Read Replicas | 64 vCPU |
| Cache | Cluster Mode | 6 nodes |
| CDN | Global Edge | Unlimited |

## Security Layers

1. **Edge**: CloudFront WAF
2. **Network**: VPC + Security Groups
3. **Application**: JWT + Rate Limiting
4. **Data**: Encryption at rest + in transit
