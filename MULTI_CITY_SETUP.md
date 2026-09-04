# 🌍 Multi-City Insurance Calculator Setup

**Single Backend | Multiple City Apps**

---

## Supported Cities

```
✅ NYC (New York City)
✅ Chicago (Illinois)
✅ DC (Washington DC)
✅ Boston (Massachusetts)
✅ LA (Los Angeles)
✅ Miami (Florida)
```

---

## How It Works

### 1. City Detection

City is detected from (in order):
1. Query parameter: `?city=chicago`
2. Header: `X-City: chicago`
3. Subdomain: `chicago.api.com`
4. Default: `nyc`

### 2. City-Specific Configuration

Each city has:
- ✅ Insurance providers list
- ✅ PIRP courses
- ✅ Taxi license type
- ✅ DMV rules
- ✅ Base insurance premiums
- ✅ Point reduction benefits

### 3. Database Storage

Users are stored with `city` field:
```javascript
{
  email: "driver@example.com",
  name: "John",
  city: "chicago",  // City field
  dmvPoints: 2,
  tlcPoints: 1
}
```

---

## API Usage by City

### Request with City Query
```bash
# NYC (default)
curl http://localhost:3000/api/insurance/get-quotes

# Chicago
curl http://localhost:3000/api/insurance/get-quotes?city=chicago

# DC
curl http://localhost:3000/api/insurance/get-quotes?city=dc
```

### Request with Header
```bash
curl -H "X-City: chicago" http://localhost:3000/api/auth/register
```

### Response
```json
{
  "success": true,
  "city": "chicago",
  "quotes": [
    {
      "company": "Geico",
      "monthlyPremium": 85,
      "city": "chicago"
    }
  ]
}
```

---

## Mobile App Integration

### Android Setup (Kotlin)

```kotlin
// Set city for all requests
val okHttpClient = OkHttpClient.Builder()
  .addInterceptor { chain ->
    val request = chain.request().newBuilder()
      .addHeader("X-City", "chicago")  // Set city here
      .build()
    chain.proceed(request)
  }
  .build()

val retrofit = Retrofit.Builder()
  .client(okHttpClient)
  .baseUrl("https://api.yourdomain.com/")
  .build()
```

### React Native Setup

```javascript
// Set city in API client
const apiClient = axios.create({
  baseURL: 'https://api.yourdomain.com/',
  headers: {
    'X-City': 'chicago'  // Set city here
  }
});

// Or use query parameter
apiClient.get('/api/insurance/get-quotes?city=chicago');
```

---

## City Configuration

### Adding a New City

1. Add to `api/middleware/city.js`:
```javascript
'denver': {
  name: 'Denver',
  country: 'USA',
  state: 'CO',
  insuranceProviders: ['Progressive', 'Geico', 'Allstate'],
  pirpCourses: ['DefensiveDrivingCO'],
  taxiLicenseType: 'Medallion',
  maxDmvPoints: 12,
  maxTlcPoints: 5,
  pirpPointsReduction: 3,
  pirpSavingsPerYear: 140,
  baseInsurancePremium: 105
}
```

2. Add to User model enum:
```javascript
city: {
  type: String,
  enum: ['nyc', 'chicago', 'dc', 'boston', 'la', 'miami', 'denver'],
  default: 'nyc'
}
```

3. Add rates to `api/routes/insurance.js`:
```javascript
'denver': {
  'Progressive': { base: 110, ratings: 4.5 },
  'Geico': { base: 85, ratings: 4.3 },
  'Allstate': { base: 120, ratings: 4.2 }
}
```

---

## Admin Dashboard Multi-City

Admin dashboard shows stats for all cities:
- Total users by city
- PIRP enrollments by city
- Insurance quotes by city
- TLC tickets by city

---

## Deployment by City

### Option 1: One Backend, Multiple App Frontends

```
Backend (Single)
│
├── NYC App Frontend
├── Chicago App Frontend
├── DC App Frontend
└── LA App Frontend
```

Each app sends `X-City` header to same backend.

### Option 2: Same Backend URL, Different Subdomains

```
NYC: https://nyc.api.com
Chicago: https://chicago.api.com
DC: https://dc.api.com
LA: https://la.api.com

All route to same backend (via DNS)
```

---

## City-Specific Insurance Rates

Current rates (baseInsurancePremium):
- NYC: $120/month
- Chicago: $110/month
- DC: $115/month
- Boston: $125/month
- LA: $130/month
- Miami: $135/month

Adjust in `api/routes/insurance.js` CITY_INSURANCE_RATES.

---

## Environment Variables

```
# Backend can serve all cities
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/insurance-multi-city
JWT_SECRET=your_secret_key
NODE_ENV=production

# Optional: Set default city (fallback)
DEFAULT_CITY=nyc
```

---

## Database Queries by City

```javascript
// Get Chicago users
db.users.find({ city: 'chicago' })

// Get DC PIRP enrollments
db.pirpenrollments.find({ userId: ObjectId(...), $where: "this.city == 'dc'" })

// Get LA insurance quotes
db.insurancequotes.find({ city: 'la' })
```

---

## Testing Multi-City

```bash
# Test NYC
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-City: nyc" \
  -d '{"email":"driver@nyc.com","password":"pass","name":"NYC Driver"}'

# Test Chicago
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-City: chicago" \
  -d '{"email":"driver@chicago.com","password":"pass","name":"Chicago Driver"}'

# Get quotes for Chicago
curl http://localhost:3000/api/insurance/get-quotes?city=chicago \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Summary

✅ **One backend** serves all cities
✅ **City detection** via header/query/subdomain
✅ **City-specific** insurance rates, PIRP courses, DMV rules
✅ **Easy to scale** - add new cities without backend changes
✅ **Multi-tenant** data storage by city
✅ **Independent apps** for each city

---

**Backend Customized for Multiple Cities!** 🌍✨
