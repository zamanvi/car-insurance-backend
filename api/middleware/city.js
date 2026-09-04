// Multi-City Configuration
export const CITY_CONFIG = {
  'nyc': {
    name: 'New York City',
    country: 'USA',
    state: 'NY',
    insuranceProviders: ['Progressive', 'Geico', 'StateFarm', 'Allstate'],
    pirpCourses: ['SafetyAmerica', 'DriveSmartNY', 'NYSDefensiveDriving'],
    taxiLicenseType: 'TLC',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 4,
    pirpSavingsPerYear: 200,
    baseInsurancePremium: 120
  },
  'chicago': {
    name: 'Chicago',
    country: 'USA',
    state: 'IL',
    insuranceProviders: ['Progressive', 'Geico', 'Allstate', 'USAA'],
    pirpCourses: ['DefensiveDrivingCourse', 'ILSafetyClass'],
    taxiLicenseType: 'CDTP',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 3,
    pirpSavingsPerYear: 180,
    baseInsurancePremium: 110
  },
  'dc': {
    name: 'Washington DC',
    country: 'USA',
    state: 'DC',
    insuranceProviders: ['Progressive', 'Geico', 'StateFarm'],
    pirpCourses: ['DCDefensiveDriving', 'SafetyPlus'],
    taxiLicenseType: 'TLC',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 4,
    pirpSavingsPerYear: 190,
    baseInsurancePremium: 115
  },
  'boston': {
    name: 'Boston',
    country: 'USA',
    state: 'MA',
    insuranceProviders: ['Progressive', 'Geico', 'Allstate'],
    pirpCourses: ['DefensiveDrivingMA', 'SafetyClass'],
    taxiLicenseType: 'Medallion',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 3,
    pirpSavingsPerYear: 170,
    baseInsurancePremium: 125
  },
  'la': {
    name: 'Los Angeles',
    country: 'USA',
    state: 'CA',
    insuranceProviders: ['Progressive', 'Geico', 'Allstate', 'USAA'],
    pirpCourses: ['DefensiveDrivingCA', 'SafetyClass'],
    taxiLicenseType: 'Taxi License',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 3,
    pirpSavingsPerYear: 160,
    baseInsurancePremium: 130
  },
  'miami': {
    name: 'Miami',
    country: 'USA',
    state: 'FL',
    insuranceProviders: ['Progressive', 'Geico', 'Allstate'],
    pirpCourses: ['DefensiveDrivingFL', 'SafetyClass'],
    taxiLicenseType: 'Permit',
    maxDmvPoints: 12,
    maxTlcPoints: 5,
    pirpPointsReduction: 3,
    pirpSavingsPerYear: 150,
    baseInsurancePremium: 135
  }
};

// City Middleware - Extract city from request
export const cityMiddleware = (req, res, next) => {
  // Get city from:
  // 1. Query parameter: ?city=nyc
  // 2. Header: X-City: nyc
  // 3. Subdomain: nyc.api.com
  // 4. Default to NYC

  let city =
    req.query.city?.toLowerCase() ||
    req.headers['x-city']?.toLowerCase() ||
    req.hostname.split('.')[0].toLowerCase() ||
    'nyc';

  // Validate city exists in config
  if (!CITY_CONFIG[city]) {
    city = 'nyc'; // Default to NYC if invalid city
  }

  req.city = city;
  req.cityConfig = CITY_CONFIG[city];

  // Add city info to response headers
  res.set('X-City', city);

  next();
};

// Get city config
export const getCityConfig = (city) => {
  return CITY_CONFIG[city?.toLowerCase()] || CITY_CONFIG['nyc'];
};

// Get all available cities
export const getAvailableCities = () => {
  return Object.keys(CITY_CONFIG).map(key => ({
    code: key,
    name: CITY_CONFIG[key].name,
    state: CITY_CONFIG[key].state
  }));
};
