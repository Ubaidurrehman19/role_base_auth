#!/bin/bash

# API Test Script for Role Management and Dashboard APIs
# This script tests all the endpoints we created

BASE_URL="http://localhost:3000"

echo "=================================="
echo "API Testing Script"
echo "=================================="
echo ""

# Step 1: Register an admin user
echo "1. Registering admin user..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "ADMIN"
  }')
echo "Response: $ADMIN_RESPONSE"
echo ""

# Step 2: Register a regular user
echo "2. Registering regular user..."
USER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "user123",
    "role": "USER"
  }')
echo "Response: $USER_RESPONSE"
echo ""

# Step 3: Login as admin
echo "3. Logging in as admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')
echo "Response: $ADMIN_LOGIN"

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo "Admin Token: $ADMIN_TOKEN"
echo ""

# Step 4: Login as user
echo "4. Logging in as regular user..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "user123"
  }')
echo "Response: $USER_LOGIN"

USER_TOKEN=$(echo $USER_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo "User Token: $USER_TOKEN"
echo ""

# Step 5: Create a new role (Admin only)
echo "5. Creating new role 'MANAGER' (as admin)..."
CREATE_ROLE=$(curl -s -X POST "$BASE_URL/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "MANAGER",
    "permissions": ["read", "write", "manage_team"],
    "description": "Team manager with extended permissions"
  }')
echo "Response: $CREATE_ROLE"
echo ""

# Step 6: Get all roles
echo "6. Getting all roles (as authenticated user)..."
GET_ROLES=$(curl -s -X GET "$BASE_URL/roles" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "Response: $GET_ROLES"
echo ""

# Step 7: Try to create role as user (should fail)
echo "7. Trying to create role as regular user (should fail)..."
FAIL_CREATE=$(curl -s -X POST "$BASE_URL/roles" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "name": "UNAUTHORIZED",
    "permissions": ["none"]
  }')
echo "Response: $FAIL_CREATE"
echo ""

# Step 8: Access admin dashboard
echo "8. Accessing admin dashboard (as admin)..."
ADMIN_DASH=$(curl -s -X GET "$BASE_URL/dashboard/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $ADMIN_DASH"
echo ""

# Step 9: Try to access admin dashboard as user (should fail)
echo "9. Trying to access admin dashboard as user (should fail)..."
FAIL_ADMIN_DASH=$(curl -s -X GET "$BASE_URL/dashboard/admin" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "Response: $FAIL_ADMIN_DASH"
echo ""

# Step 10: Access user dashboard
echo "10. Accessing user dashboard (as regular user)..."
USER_DASH=$(curl -s -X GET "$BASE_URL/dashboard/user" \
  -H "Authorization: Bearer $USER_TOKEN")
echo "Response: $USER_DASH"
echo ""

# Step 11: Get statistics
echo "11. Getting statistics (as admin)..."
STATS=$(curl -s -X GET "$BASE_URL/dashboard/stats" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Response: $STATS"
echo ""

echo "=================================="
echo "Testing Complete!"
echo "=================================="
