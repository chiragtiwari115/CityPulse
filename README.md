# CityPulse

CityPulse is a full-stack complaint management platform built with **Next.js 15 + TailwindCSS** on the frontend and **Spring Boot 3 + MySQL** on the backend. Citizens can submit location-aware complaints, upload photos, and track resolution progress. Administrators triage cases, update statuses, and trigger email notifications.

---

## Features

- Email/password authentication with BCrypt + JWT and optional Auth0 social login (Google/Facebook).
- Complaint submission with Google Maps picker, draggable marker, and image upload (stored as LONGBLOB).
- Automated email notifications on submission and status updates via JavaMailSender.
- Citizen dashboard to review complaint history and live status timeline.
- Admin dashboard with filtering, bulk actions, and status updates.

---

## Project Structure

```
CityPulse/
├─ backend/            # Spring Boot application
│  ├─ src/main/java/com/citypulse/...
│  └─ src/main/resources/application.properties
├─ Frontend/           # Next.js 15 application (App Router)
│  ├─ app/
│  ├─ components/
│  └─ lib/
└─ README.md
```

---

## Prerequisites

- Node.js 18+ (recommended 20)
- npm 9+ or pnpm
- Java 17+
- Maven 3.9+
- MySQL 8.x
- Auth0 tenant (for optional OAuth)
- SMTP credentials (Mailtrap, SendGrid, etc.)

---

## Environment Variables

### Backend (`backend/src/main/resources/application.properties`)

You can export these as system environment variables or duplicate the file as `application-local.properties` and substitute values during development.

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/citypulse?useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.jpa.hibernate.ddl-auto=update

# JWT
app.jwt.secret=BASE64_ENCODED_256BIT_SECRET
app.jwt.expiration-ms=3600000

# Mail
spring.mail.host=SMTP_HOST
spring.mail.port=SMTP_PORT
spring.mail.username=SMTP_USERNAME
spring.mail.password=SMTP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Auth0
auth0.domain=dev-2xgho7dwrynbwitj.us.auth0.com
auth0.client-id=Rgvhiktnu7joCnBxkZsG4ZsO7ZXFewZd
auth0.client-secret=UGzfx8QxQAXpU5UdTqo7BXxwo3N3hZfOkpIvD-Y8YflHPe0m6hVd0mSgkGcKhCEa
auth0.callback-url=http://localhost:3000/callback

# CORS
app.cors.allowed-origins=http://localhost:3000
```

> ⚠️ **Important:** generate a secure base64-encoded secret for `app.jwt.secret` (e.g., `openssl rand -base64 32`).

### Frontend (`Frontend/.env.local`)

Create `Frontend/.env.local` with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBppxRHhRHpnKSJ2VHyaSTftrLZWmJr2ec
NEXT_PUBLIC_AUTH0_DOMAIN=dev-2xgho7dwrynbwitj.us.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=Rgvhiktnu7joCnBxkZsG4ZsO7ZXFewZd
NEXT_PUBLIC_AUTH0_CALLBACK_URL=http://localhost:3000/callback
```

---

## Database Setup

```sql
CREATE DATABASE IF NOT EXISTS citypulse;
USE citypulse;

CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'ROLE_USER',
  is_admin BOOLEAN DEFAULT FALSE,
  auth0_provider_id VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE complaints (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  severity VARCHAR(20),
  contact_name VARCHAR(150),
  contact_phone VARCHAR(50),
  contact_email VARCHAR(150),
  address VARCHAR(500),
  latitude DOUBLE,
  longitude DOUBLE,
  image LONGBLOB,
  image_content_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'SUBMITTED',
  status_notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

Seed an admin user:

```sql
INSERT INTO users (username, email, password, role, is_admin)
VALUES ('Admin User', 'admin@citypulse.local', '$2a$10$...', 'ROLE_ADMIN', TRUE);
```

Generate the BCrypt hash (cost 10+) using Spring Boot or an online generator. Example snippet:

```java
System.out.println(new BCryptPasswordEncoder().encode("YourAdminPasswordHere"));
```

---

## Running the Apps

### Backend

```bash
cd backend
mvn spring-boot:run
```

Backend will default to `http://localhost:8080`.

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`.

---

## Auth Flow Overview

1. **Email/Password**
   - `POST /api/auth/register` → returns JWT + user.
   - `POST /api/auth/login` → returns JWT + user.
   - The Next.js app persists the token (in-memory + localStorage) and includes it on API calls.

2. **Auth0 Social Login**
   - User is redirected to Auth0 `/authorize`.
   - Auth0 calls back to `/callback?code=...`.
   - Next.js `/callback` page exchanges the code with `GET /api/auth/auth0/callback`.
   - Spring Boot creates/upserts the user and issues the JWT.

---

## Complaint Lifecycle

1. Citizen submits via `/api/complaints` (multipart form).
2. Spring Boot stores metadata + image (LONGBLOB) and emails reporter.
3. Admin dashboard consumes `/api/admin/complaints` with filters.
4. Status updates via `/api/admin/complaints/{id}/status` trigger follow-up emails.
5. Citizens track progress via `/api/complaints/{id}` and optional `/api/complaints/{id}/image`.

---

## Scripts & Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build for Next.js |
| `mvn spring-boot:run` | Run backend |
| `mvn test` | Execute backend tests |

---

## Testing Checklist

- [ ] Register + login with email/password.
- [ ] Complete an Auth0 social login round-trip.
- [ ] Submit complaint with image and see record in MySQL.
- [ ] Receive submission email (Mailtrap/Gmail).
- [ ] Track complaint ID from citizen view.
- [ ] Update status from admin dashboard and verify notification email.

---

## License

© 2025 CityPulse. All rights reserved.