# API Endpoints Reference

## Base URL
```
http://localhost:3000
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "string",
  "password": "string",
  "role": "ADMIN" | "USER" (optional, defaults to USER)
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here"
  }
}
```

## Role Management Endpoints
All role endpoints require authentication. Create, Update, and Delete require ADMIN role.

### Create Role (Admin Only)
```http
POST /roles
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "permissions": ["string"],
  "description": "string"
}
```

### Get All Roles
```http
GET /roles
Authorization: Bearer <token>
```

### Get Role by ID
```http
GET /roles/:id
Authorization: Bearer <token>
```

### Update Role (Admin Only)
```http
PUT /roles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "permissions": ["string"],
  "description": "string"
}
```

### Delete Role (Admin Only)
```http
DELETE /roles/:id
Authorization: Bearer <token>
```

## Dashboard Endpoints

### Admin Dashboard (Admin Only)
```http
GET /dashboard/admin
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": number,
      "totalRoles": number,
      "usersByRole": []
    },
    "recentUsers": [],
    "roles": []
  }
}
```

### User Dashboard
```http
GET /dashboard/user
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "role": "string",
      "createdAt": "date"
    },
    "message": "Welcome back, username!"
  }
}
```

### Statistics
```http
GET /dashboard/stats
Authorization: Bearer <token>

Response (Admin):
{
  "success": true,
  "data": {
    "totalUsers": number,
    "totalRoles": number,
    "adminCount": number,
    "userCount": number
  }
}
```

## Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - No token provided or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## Example Usage with cURL

### Register and Login
```bash
# Register admin
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123","role":"ADMIN"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Manage Roles
```bash
# Create role (use token from login)
curl -X POST http://localhost:3000/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"MANAGER","permissions":["read","write"],"description":"Manager role"}'

# Get all roles
curl -X GET http://localhost:3000/roles \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update role
curl -X PUT http://localhost:3000/roles/ROLE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"permissions":["read","write","delete"]}'

# Delete role
curl -X DELETE http://localhost:3000/roles/ROLE_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Access Dashboard
```bash
# Admin dashboard
curl -X GET http://localhost:3000/dashboard/admin \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# User dashboard
curl -X GET http://localhost:3000/dashboard/user \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get statistics
curl -X GET http://localhost:3000/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```
