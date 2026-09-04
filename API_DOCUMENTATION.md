# 🌍 Multi-City Insurance Calculator API Documentation

---

## Base URL

```
http://localhost:3000  (Development)
https://api.yourdomain.com  (Production)
```

---

## City Support

Send city via **one of these methods**:

### Method 1: Query Parameter
```
GET /api/insurance/get-quotes?city=chicago
```

### Method 2: Header
```
Headers:
X-City: chicago
```

### Method 3: Subdomain
```
https://chicago.api.yourdomain.com/api/insurance/get-quotes
```

**Default City:** NYC (if not specified)

---

## Authentication Endpoints

### 1. Register User

```bash
POST /api/auth/register

Headers:
X-City: chicago
Content-Type: application/json

Body:
{
  "email": "driver@chicago.com",
  "password": "securepassword123",
  "name": "John Driver",
  "phone": "+13125551234"
}

Response:
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "driver@chicago.com",
    "name": "John Driver"
  }
}
```

### 2. Login

```bash
POST /api/auth/login

Headers:
X-City: chicago
Content-Type: application/json

Body:
{
  "email": "driver@chicago.com",
  "password": "securepassword123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "driver@chicago.com",
    "dmvPoints": 2,
    "tlcPoints": 1
  }
}
```

### 3. Get Profile

```bash
GET /api/auth/profile

Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
X-City: chicago

Response:
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "driver@chicago.com",
    "name": "John Driver",
    "city": "chicago",
    "dmvPoints": 2,
    "tlcPoints": 1,
    "createdAt": "2026-09-04T10:00:00Z"
  }
}
```

---

## Insurance Endpoints

### 1. Get Insurance Quotes

```bash
POST /api/insurance/get-quotes

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago
Content-Type: application/json

Body:
{
  "dmvPoints": 2,
  "tlcPoints": 1,
  "annualMiles": 50000,
  "coverage": "Comprehensive"
}

Response:
{
  "success": true,
  "city": "chicago",
  "quotes": [
    {
      "company": "Geico",
      "monthlyPremium": 103,
      "annualPremium": 1236,
      "ratings": 4.3,
      "city": "chicago",
      "affiliateLink": "https://affiliate.geico.com/chicago"
    },
    {
      "company": "Progressive",
      "monthlyPremium": 133,
      "annualPremium": 1596,
      "ratings": 4.5,
      "city": "chicago",
      "affiliateLink": "https://affiliate.progressive.com/chicago"
    }
  ]
}
```

### 2. Save Quote

```bash
POST /api/insurance/save

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago
Content-Type: application/json

Body:
{
  "company": "Geico",
  "monthlyPremium": 103,
  "annualPremium": 1236,
  "coverage": "Comprehensive",
  "ratings": 4.3
}

Response:
{
  "success": true,
  "quote": {
    "id": "507f1f77bcf86cd799439012",
    "company": "Geico",
    "monthlyPremium": 103
  }
}
```

### 3. Get Saved Quotes

```bash
GET /api/insurance/saved

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago

Response:
{
  "success": true,
  "quotes": [
    {
      "id": "507f1f77bcf86cd799439012",
      "company": "Geico",
      "monthlyPremium": 103,
      "quotationDate": "2026-09-04T10:00:00Z"
    }
  ]
}
```

---

## PIRP Endpoints

### 1. Enroll in PIRP Course

```bash
POST /api/pirp/enroll

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago
Content-Type: application/json

Body:
{
  "courseProvider": "DefensiveDrivingCourse"
}

Response:
{
  "success": true,
  "message": "Enrolled successfully",
  "enrollment": {
    "id": "507f1f77bcf86cd799439013",
    "courseProvider": "DefensiveDrivingCourse",
    "progress": 0,
    "isCompleted": false
  }
}
```

### 2. Update Progress

```bash
PUT /api/pirp/progress/507f1f77bcf86cd799439013

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago
Content-Type: application/json

Body:
{
  "hoursCompleted": 3
}

Response:
{
  "success": true,
  "message": "Progress updated",
  "enrollment": {
    "hoursCompleted": 3,
    "progress": 50,
    "isCompleted": false
  }
}
```

### 3. Get PIRP Status

```bash
GET /api/pirp/status

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago

Response:
{
  "success": true,
  "enrollment": {
    "id": "507f1f77bcf86cd799439013",
    "courseProvider": "DefensiveDrivingCourse",
    "progress": 50,
    "isCompleted": false,
    "estimatedSavings": 180
  }
}
```

### 4. Get Savings

```bash
GET /api/pirp/savings

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago

Response:
{
  "success": true,
  "message": "Estimated savings",
  "pointsReduced": 3,
  "annualSavings": 180,
  "monthlySavings": 15,
  "completionDate": "2026-09-20T10:00:00Z"
}
```

---

## TLC Endpoints

### 1. Add Ticket

```bash
POST /api/tlc/add-ticket

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago
Content-Type: application/json

Body:
{
  "violationType": "Speeding 25mph over",
  "dmvPoints": 2,
  "tlcPoints": 3,
  "fineAmount": 150
}

Response:
{
  "success": true,
  "message": "Ticket added",
  "ticket": {
    "id": "507f1f77bcf86cd799439014",
    "violationType": "Speeding 25mph over",
    "riskLevel": "high"
  },
  "warning": "High risk! Consider PIRP course..."
}
```

### 2. Get Ticket History

```bash
GET /api/tlc/history

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago

Response:
{
  "success": true,
  "message": "Ticket history",
  "totalTickets": 2,
  "tickets": [
    {
      "id": "507f1f77bcf86cd799439014",
      "violationType": "Speeding 25mph over",
      "ticketDate": "2026-09-04T10:00:00Z"
    }
  ]
}
```

### 3. Get Penalty Risk

```bash
GET /api/tlc/penalty-risk

Headers:
Authorization: Bearer YOUR_TOKEN
X-City: chicago

Response:
{
  "success": true,
  "message": "Penalty risk analysis",
  "currentPoints": {
    "dmv": 2,
    "tlc": 3
  },
  "totalInsurancePenalty": 155,
  "monthlyPenalty": 4,
  "licenseRisk": "Medium",
  "recommendation": "Enroll in PIRP course..."
}
```

---

## Admin Endpoints

### 1. User Statistics

```bash
GET /api/admin/stats/users

Headers:
Authorization: Bearer ADMIN_TOKEN

Response:
{
  "success": true,
  "totalUsers": 150,
  "recentUsers": [
    {
      "email": "driver@chicago.com",
      "name": "John Driver",
      "city": "chicago",
      "dmvPoints": 2,
      "createdAt": "2026-09-04T10:00:00Z"
    }
  ]
}
```

### 2. PIRP Statistics

```bash
GET /api/admin/stats/pirp

Headers:
Authorization: Bearer ADMIN_TOKEN

Response:
{
  "success": true,
  "totalEnrollments": 45,
  "enrollments": [...]
}
```

### 3. Insurance Statistics

```bash
GET /api/admin/stats/quotes

Headers:
Authorization: Bearer ADMIN_TOKEN

Response:
{
  "success": true,
  "totalQuotes": 200,
  "quotes": [...]
}
```

### 4. TLC Statistics

```bash
GET /api/admin/stats/tickets

Headers:
Authorization: Bearer ADMIN_TOKEN

Response:
{
  "success": true,
  "totalTickets": 75,
  "highRiskTickets": 12
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad request (validation error)
- **401**: Unauthorized (invalid/missing token)
- **409**: Conflict (duplicate email, etc.)
- **500**: Server error

---

## Rate Limiting

- **General**: 100 requests per 15 minutes
- **Authentication**: 5 login attempts per hour
- **API**: 50 requests per minute

---

## City Response Headers

All responses include city info:
```
X-City: chicago
```

This confirms which city processed your request.

---

**End of API Documentation** ✅
