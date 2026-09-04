# 🚕 Multi-City Insurance Calculator Backend

**Production-Ready Backend | Multi-City Support | Vercel Deployment | Admin Panel Included**

Supports: NYC | Chicago | DC | Boston | LA | Miami (& More)

---

## 📁 Features

✅ **Ultra-fast** - Response caching + database indexing
✅ **Zero crashes** - Error handling + rate limiting  
✅ **Admin dashboard** - Real-time monitoring
✅ **Secure** - JWT authentication + input validation
✅ **Scalable** - Connection pooling + compression

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
- Visit: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Copy connection string

### 3. Create .env.local
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/car-insurance
JWT_SECRET=your_secret_key_here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:*
NODE_ENV=development
```

### 4. Test Locally
```bash
npm run dev
```

Access:
- API: http://localhost:3000
- Admin: http://localhost:3000/admin/login.html

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## 📋 API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### PIRP
- `POST /api/pirp/enroll` - Enroll
- `PUT /api/pirp/progress/:id` - Update progress
- `GET /api/pirp/status` - Get status
- `GET /api/pirp/savings` - Get savings

### Insurance
- `POST /api/insurance/get-quotes` - Get quotes
- `POST /api/insurance/save` - Save quote
- `GET /api/insurance/saved` - Get saved

### TLC
- `POST /api/tlc/add-ticket` - Add ticket
- `GET /api/tlc/history` - History
- `GET /api/tlc/penalty-risk` - Risk analysis

### Admin
- `GET /api/admin/stats/users` - User stats
- `GET /api/admin/stats/pirp` - PIRP stats
- `GET /api/admin/stats/quotes` - Quote stats
- `GET /api/admin/stats/tickets` - Ticket stats

---

## 📂 File Structure

```
car-insurance-backend/
├── api/
│   ├── index.js (Main server)
│   ├── config/database.js
│   ├── middleware/ (cache, errorHandler, rateLimiter)
│   ├── models/ (User, PIRPEnrollment, InsuranceQuote, TLCTicket)
│   ├── routes/ (auth, pirp, insurance, tlc, admin)
│   └── utils/validators.js
├── public/admin/ (login.html, index.html)
├── package.json
├── vercel.json
├── .env.local
└── README.md
```

---

## ✨ Performance

- Response time: <100ms (with caching)
- Database: Indexed queries
- Rate limiting: 100 req/15min (general), 50 req/min (API)
- Connection pooling: 10 max connections
- Memory: Optimized with lean queries

---

**Built with ❤️ for NYC TLC Drivers**
