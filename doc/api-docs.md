
# API Documentation

This document outlines the available APIs in the backend server for the Cloud API project. Each endpoint includes details about the HTTP method, URL, request body, and response structure.

---

## Base URL
```
http://<your-server-domain>/
```

---

## Endpoints

### General Endpoints

#### 1. **Health Check**
- **Method**: `GET`
- **Endpoint**: `/`
- **Description**: Checks if the API is running.
- **Response**:
    ```json
    {
      "message": "API is ready for you"
    }
    ```

---

### Authentication

#### 1. **Register**
- **Method**: `POST`
- **Endpoint**: `/api/v1/register`
- **Description**: Registers a new user.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123",
      "full_name": "John Doe",
      "gender": "Male",
      "birth_day": "1990-01-01"
    }
    ```
- **Response**:
    ```json
    {
      "error": false,
      "message": "Account created successfully",
      "data": {
        "id": "user-id",
        "email": "user@example.com",
        "full_name": "John Doe",
        "gender": "Male",
        "birth_day": "1990-01-01"
      }
    }
    ```

#### 2. **Login**
- **Method**: `POST`
- **Endpoint**: `/api/v1/login`
- **Description**: Logs in a user and returns a token.
- **Request Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
- **Response**:
    ```json
    {
      "error": false,
      "message": "Login successful",
      "data": {
        "token": "jwt-token"
      }
    }
    ```

---

### User Management

#### 1. **Get User Data**
- **Method**: `GET`
- **Endpoint**: `/api/v1/me`
- **Description**: Retrieves the authenticated user's data.
- **Headers**:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
- **Response**:
    ```json
    {
      "error": false,
      "message": "Successfully retrieved user data",
      "data": {
        "id": "user-id",
        "email": "user@example.com",
        "full_name": "John Doe",
        "gender": "Male",
        "birth_day": "1990-01-01",
        "foto_url": "http://example.com/photo.jpg"
      }
    }
    ```

#### 2. **Edit User Profile**
- **Method**: `PATCH`
- **Endpoint**: `/api/v2/me`
- **Description**: Updates the authenticated user's profile.
- **Headers**:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
- **Request Body**:
    ```json
    {
      "full_name": "John Updated",
      "gender": "Male",
      "birth_day": "1990-01-02",
      "password": "newpassword123"
    }
    ```
- **Response**:
    ```json
    {
      "error": false,
      "message": "User data updated successfully",
      "data": {
        "id": "user-id",
        "email": "user@example.com",
        "full_name": "John Updated",
        "gender": "Male",
        "birth_day": "1990-01-02"
      }
    }
    ```

---

### Token Management

#### 1. **Logout**
- **Method**: `DELETE`
- **Endpoint**: `/api/v1/logout`
- **Description**: Logs out a user by invalidating their token.
- **Headers**:
    ```json
    {
      "Authorization": "Bearer <token>"
    }
    ```
- **Response**:
    ```json
    {
      "error": false,
      "message": "Logout successful"
    }
    ```

---

## Error Responses

All endpoints may return the following error responses:

1. **400 Bad Request**:
    ```json
    {
      "error": true,
      "message": "Invalid request"
    }
    ```

2. **401 Unauthorized**:
    ```json
    {
      "error": true,
      "message": "Unauthorized"
    }
    ```

3. **404 Not Found**:
    ```json
    {
      "error": true,
      "message": "Resource not found"
    }
    ```

4. **500 Internal Server Error**:
    ```json
    {
      "error": true,
      "message": "An unexpected error occurred"
    }
    ```

---

## Notes
- Ensure to replace `<token>` with the JWT token received from the login endpoint.
- Replace `<your-server-domain>` with your deployed server's domain.

