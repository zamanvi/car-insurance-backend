import Joi from 'joi';

export const validateRegister = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).required(),
    phone: Joi.string().min(10)
  });

  return schema.validate(data);
};

export const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  return schema.validate(data);
};

export const validateInsuranceQuote = (data) => {
  // 10 is the real ceiling for both systems: NYC TLC license is revoked
  // at 10+ TLC points (15-month lookback), and NY State's own DMV
  // suspension threshold is also 10 points (24-month period, as of Feb
  // 2026). An active, unrevoked driver realistically cannot exceed 10
  // on either scale -- matches the same bound enforced client-side.
  const schema = Joi.object({
    dmvPoints: Joi.number().min(0).max(10).required(),
    tlcPoints: Joi.number().min(0).max(10).required(),
    vehicleType: Joi.string().valid('Sedan', 'SUV', 'Wheelchair accessible').default('Sedan'),
    yearsLicensed: Joi.number().min(0).max(60).default(0)
  });

  return schema.validate(data);
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
