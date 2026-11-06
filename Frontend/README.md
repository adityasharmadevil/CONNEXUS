# VideoCall React frontend

React + Vite frontend for the existing Spring Boot `videocall` project.

## Features

- Login: `POST /api/v1/users/login`
- Registration: `POST /api/v1/users`
- User list: `GET /api/v1/users`
- Logout: `POST /api/v1/users/logout`
- Create/join meeting routes
- ZegoUIKitPrebuilt video meeting UI
- Vite proxy for `/api` to `http://localhost:8080`
- Production build output to `../src/main/resources/static`

## Install and run

From the `frontend` directory:

```bash
npm install
npm run dev
```

React runs at `http://localhost:5173`. Start Spring Boot in a second terminal from the project root:

```bash
./mvnw spring-boot:run
```

## API expectations

The frontend expects the user endpoints and payloads listed above. The response from login and registration should be the created/authenticated user as JSON. Registration should return a safe user object that does not include the password or password hash.

This starter stores the returned user object in `localStorage` to mirror the original app. This is not strong authentication: for production, use server-side sessions or short-lived access tokens, enforce authorization on every protected backend endpoint, and never trust localStorage alone.

## Zego meeting token endpoint (required)

The React meeting screen requests:

`POST /api/v1/meeting/token`

JSON request:

```json
{
  "roomID": "room-id",
  "userID": "stable-user-id",
  "userName": "User name"
}
```

Expected JSON response:

```json
{
  "appID": 123456789,
  "token": "short-lived-Zego-kit-token"
}
```

Implement this endpoint in Spring Boot using Zego's server-side token-generation SDK or documented server-side token generation method. Validate the authenticated user and room permissions, and issue short-lived tokens.

**Security:** Never place your Zego `serverSecret` in React code or in any `VITE_*` variable. Vite variables prefixed with `VITE_` are included in the browser bundle and are public. The old `generateKitTokenForTest(appID, serverSecret, ...)` approach is for testing only and exposes the secret to anyone who can load the frontend.

## Build into Spring Boot static resources

From `frontend`:

```bash
npm run build
```

This writes compiled assets to:

`../src/main/resources/static`

Then, from the project root:

```bash
./mvnw clean package
```

Run the generated JAR from `target/`:

```bash
java -jar target/<your-jar-name>.jar
```

## Notes

- The frontend assumes the API routes start with `/api`; change `vite.config.js` if your backend uses a different route prefix.
- React Router handles `/login`, `/register`, `/dashboard`, and `/meeting`. For refresh/deep-link support in production, configure Spring Boot to forward these client routes to `index.html` while excluding `/api/**` and static assets.
- Confirm the Zego UIKit package version against the current Zego documentation before production use.
