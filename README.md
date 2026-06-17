# AI Content Moderation Platform

## Overview

AI Content Moderation Platform is a cloud-native microservices application designed to demonstrate secure content moderation using modern software architecture principles.

The platform allows authenticated users to create posts, stores them in a PostgreSQL database, and uses an AI moderation service to classify content before displaying it to users.

The solution follows microservices principles and is deployed in AWS using Docker containers and Amazon ECS.

---

## Architecture

The platform consists of the following components:

* Angular Frontend
* AWS Cognito (External IAM)
* Spring Cloud Gateway
* Eureka Service Discovery
* Content Service
* Moderation Service
* PostgreSQL Database (AWS RDS)

### Authentication Flow

1. User clicks Login.
2. User authenticates through AWS Cognito.
3. Cognito returns an Authorization Code.
4. API Gateway exchanges the code for a JWT token.
5. Angular stores the JWT.
6. Requests include the JWT in the Authorization header.
7. Spring Security validates the token.

---

## Technologies

### Backend

* Java 21
* Spring Boot
* Spring Cloud Gateway
* Spring Security
* Spring Cloud Netflix Eureka
* Spring Data JPA

### Frontend

* Angular
* TypeScript

### Database

* PostgreSQL
* AWS RDS

### Cloud

* AWS ECS
* AWS ECR
* AWS Cognito

### Containerization

* Docker
* Docker Compose

---

## Microservices

### Eureka Discovery Service

Responsible for service registration and discovery.

Port:

8761

### API Gateway

Single entry point for all backend services.

Responsibilities:

* Routing
* Authentication
* Authorization
* Token exchange

Port:

8080

### Content Service

Responsible for:

* Creating posts
* Reading posts
* Database persistence

Port:

3000

### Moderation Service

Responsible for:

* AI moderation
* Content classification
* Approval / blocking decisions

Port:

8000

---

## Security

Authentication is implemented using AWS Cognito.

Features:

* OAuth2 Authorization Code Flow
* JWT Access Tokens
* External IAM
* Spring Security Resource Server

Protected endpoints:

* GET /api/v1/posts
* POST /api/v1/posts
* POST /api/moderate

---

## AWS Deployment

Services are deployed using Amazon ECS.

Container images are stored in Amazon ECR.

Database is hosted in Amazon RDS PostgreSQL.

Security Groups are used to control network access.

---

## Running Locally

### Backend

docker compose up --build

### Frontend

npm install

ng serve

---

## Future Improvements

* HTTPS
* Load Balancer
* CI/CD Pipeline
* AWS Secrets Manager
* Internal-only Security Groups
* CloudWatch Monitoring

---

## Author
Elena Lupu

Cyber Security Project

Internet Technologies Master's Program
