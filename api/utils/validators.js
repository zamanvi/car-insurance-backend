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
  const schema = Joi.object({
    dmvPoints: Joi.number().min(0).max(12).required(),
    tlcPoints: Joi.number().min(0).max(5).required(),
    annualMiles: Joi.number().min(0).required(),
    coverage: Joi.string().required()
  });

  return schema.validate(data);
};

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
