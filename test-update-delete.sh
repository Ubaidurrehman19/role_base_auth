#!/bin/bash

# Additional API Tests for Update and Delete Operations

BASE_URL="http://localhost:3000"

echo "=================================="
echo "Testing Update and Delete APIs"
echo "=================================="
echo ""

# Login as admin
echo "1. Logging in as admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }')

ADMIN_TOKEN=$(echo $ADMIN_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')
echo "Admin Token obtained"
echo ""

# Get all roles to find the MANAGER role ID
echo "2. Getting all roles..."
ROLES_RESPONSE=$(curl -s -X GET "$BASE_URL/roles" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Roles: $ROLES_RESPONSE"
echo ""

# Extract role ID (assuming MANAGER is the first role in the response)
ROLE_ID=$(echo $ROLES_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | sed 's/"_id":"//')
echo "MANAGER Role ID: $ROLE_ID"
echo ""

# Update the role
echo "3. Updating MANAGER role..."
UPDATE_RESPONSE=$(curl -s -X PUT "$BASE_URL/roles/$ROLE_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "description": "Updated: Team manager with full team management permissions",
    "permissions": ["read", "write", "manage_team", "approve_requests"]
  }')
echo "Update Response: $UPDATE_RESPONSE"
echo ""

# Get updated role
echo "4. Getting updated role by ID..."
GET_ROLE=$(curl -s -X GET "$BASE_URL/roles/$ROLE_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Updated Role: $GET_ROLE"
echo ""

# Try to delete a role that has no users
echo "5. Deleting MANAGER role (should succeed - no users assigned)..."
DELETE_RESPONSE=$(curl -s -X DELETE "$BASE_URL/roles/$ROLE_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Delete Response: $DELETE_RESPONSE"
echo ""

# Verify deletion
echo "6. Verifying deletion - getting all roles..."
FINAL_ROLES=$(curl -s -X GET "$BASE_URL/roles" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Final Roles: $FINAL_ROLES"
echo ""

echo "=================================="
echo "Update and Delete Testing Complete!"
echo "=================================="
