# 🚀 Car Insurance Backend - Credentials & Setup (LIVE PRODUCTION)

**Status:** ✅ DEPLOYED & LIVE ON RAILWAY

---

## 🎯 LIVE BACKEND URL

```
https://car-insurance-backend-production-a1ec.up.railway.app
```

### Test Endpoint
```
https://car-insurance-backend-production-a1ec.up.railway.app/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "Backend is running",
  "timestamp": "2026-09-05T..."
}
```

---

## 📦 Hosting Platform: Railway.app

**Project Name:** car-insurance-backend  
**Status:** Online & Active  
**Region:** US West  
**Replicas:** 1

**Railway URL:** https://railway.app/project/3ef58b80-d326-4f81-9120-2a144bb49513

---

## 🔐 Environment Variables (Railway)

```
MONGODB_URI=mongodb+srv://norozzaman996_db_user:wWM1lJ9MO14SS0Qv@cluster0.myovhlj.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_change_this_12345678901234
NODE_ENV=production
```

---

## 📊 MongoDB Atlas Database

**Cluster:** Cluster0  
**Username:** norozzaman996_db_user  
**Password:** wWM1lJ9MO14SS0Qv  
**Database URL:** mongodb+srv://norozzaman996_db_user:wWM1lJ9MO14SS0Qv@cluster0.myovhlj.mongodb.net/?appName=Cluster0  
**Connection String (with database):**
```
mongodb+srv://norozzaman996_db_user:wWM1lJ9MO14SS0Qv@cluster0.myovhlj.mongodb.net/car-insurance?appName=Cluster0
```

**MongoDB Atlas URL:** https://cloud.mongodb.com/v2/66c1bfac89c4efdbf62f99d6

---

## 🐙 GitHub Repository

**Repo:** https://github.com/zamanvi/car-insurance-backend  
**Branch:** master  
**Status:** All commits synced with Railway  

**Clone Command:**
```bash
git clone https://github.com/zamanvi/car-insurance-backend.git
```

---

## 🏗️ API Architecture

### Supported Cities
- NYC (nyc)
- Chicago (chicago)
- DC (dc)
- Boston (boston)
- LA (la)
- Miami (miami)

### City Detection Methods
1. Query parameter: `?city=nyc`
2. Header: `X-City: nyc`
3. Subdomain: `nyc.car-insurance-backend-production-a1ec.up.railway.app`
4. Default: NYC (if not specified)

### Key Endpoints
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/insurance/get-quotes` - Get insurance quotes for a city
- `POST /api/admin/login` - Admin dashboard login

---

## 📱 Mobile App Integration

### Android/React Native Implementation

```javascript
const BACKEND_URL = "https://car-insurance-backend-production-a1ec.up.railway.app";

// Example: Get insurance quotes for NYC
fetch(`${BACKEND_URL}/api/insurance/get-quotes`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-City": "nyc"  // or use query param ?city=nyc
  },
  body: JSON.stringify({
    age: 25,
    drivingRecord: "clean",
    dmvPoints: 0
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Apps to Build
1. Car Insurance Calculator NYC
2. Car Insurance Calculator Chicago
3. Car Insurance Calculator DC
4. Car Insurance Calculator Boston
5. Car Insurance Calculator LA
6. Car Insurance Calculator Miami

---

## 🔄 Deployment Workflow

### Local Development
```bash
cd car-insurance-backend
npm install
npm run dev
```

### Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin master
```

### Railway Auto-Deploy
- Railway automatically deploys when you push to master
- Deployment logs available at: https://railway.app/project/3ef58b80-d326-4f81-9120-2a144bb49513/service/ea3ffb2b-5e88-45fa-91c9-b5e75c9ea32a/deployments

---

## ⚠️ Important Notes

1. **Database Backups:** MongoDB Atlas handles automatic backups
2. **Rate Limiting:** API has rate limiting (100 req/15min general, 50 req/min for API)
3. **CORS:** Configured to accept requests from authorized origins
4. **JWT Tokens:** Used for API authentication - store securely in mobile apps
5. **Admin Panel:** Available at `/public/admin/login.html` (basic auth)

---

## 📝 Last Updated
- **Date:** 2026-09-05
- **Status:** ✅ LIVE ON RAILWAY
- **Vercel Status:** ❌ Not used (failed deployment) - SWITCHED TO RAILWAY

---

## 🎯 Next Steps

1. ✅ Backend LIVE on Railway
2. 📱 Build Android apps for each city (6 apps total)
3. 🔗 Integrate apps with this backend URL
4. 📊 Monitor performance via Railway dashboard
5. 🚀 Deploy apps to Google Play Store

---

**Questions? Refer to:**
- API_DOCUMENTATION.md (complete endpoint reference)
- MULTI_CITY_SETUP.md (city setup guide)
- README.md (project overview)
