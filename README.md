# AI-Powered Secure Content Moderation Platform

## Overview

This project is a cloud-native polyglot microservices platform for AI-powered text moderation.

Users create posts, and the content is automatically analyzed before being stored.

## Architecture

- Discovery Service: Spring Boot Eureka
- API Gateway: Spring Cloud Gateway
- Content Service: NestJS / Node.js
- Moderation Service: FastAPI / Python
- Database: PostgreSQL
- AI Provider: OpenAI API
- Containerization: Docker + Docker Compose

## Current Flow

```text
Client
  |
API Gateway
  |
Content Service
  |
Moderation Service
  |
OpenAI API
  |
PostgreSQL