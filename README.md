
# Connexus 🎥

Connexus is a modern, full-stack video calling and team collaboration web application. It combines a secure, high-performance Spring Boot backend with a responsive React frontend to enable seamless real-time communication, user management, and instant room creation.

---

## 🚀 Tech Stack

### Backend
* **Java 17+** / **Spring Boot**
* **Spring Security** (OAuth2 Resource Server / JWT Authentication)
* **Spring Data JPA** & **Hibernate**
* **Supabase PostgreSQL Database**
* **Lombok** & **Jakarta Validation**

### Frontend
* **React** (with React Router)
* **Vite** (Build tool and development server)
* **Modern CSS / Responsive Layouts**

---

## ✨ Features

* **Secure Authentication & Authorization:** JWT-based stateless authentication supporting user registration, login, logout, and token propagation via HTTP headers.
* **Instant Video Rooms:** Generate unique room IDs or join existing sessions instantly.
* **User Status & Directory:** Real-time visibility of registered users and their active/inactive status.
* **Environment Configuration:** Fully externalized sensitive configurations using `.env` templates for secure deployments.

---

## 🛠️ Getting Started & Setup

### 1. Backend Setup (`CONNEXUS_BACKEND`)

1. Clone the repository and navigate to the backend directory.
2. Create a `.env` file based on your configuration requirements (referencing Supabase database credentials and JWT secret keys):
   ```env
   SUPABASE_DB_URL=jdbc:postgresql://<your-supabase-host>:5432/postgres?sslmode=require
   SUPABASE_DB_USERNAME=postgres
   SUPABASE_DB_PASSWORD=your_database_password
   JWT_SECRET_KEY=your_secure_jwt_secret_key
   ```
3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file if needed to specify your API base URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/users/register` | Register a new user account | Public |
| `POST` | `/api/v1/users/login` | Authenticate user and return JWT | Public |
| `POST` | `/api/v1/users/logout` | Invalidate user session / set inactive | Authenticated |
| `GET` | `/api/v1/users` | Retrieve list of all registered users | Authenticated |

---

## 📄 License

This project is open-source and available under the MIT License.
