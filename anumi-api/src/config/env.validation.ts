import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),

  PORT: Joi.number().port().default(3000),

  DATABASE_URL: Joi.string().required(),

  JWT_SECRET: Joi.string().min(32).required(),

  JWT_EXPIRES_IN: Joi.string().default('1d'),

  FRONTEND_URL: Joi.string().uri().required(),

  MAIL_PROVIDER: Joi.string()
    .valid('console', 'resend', 'smtp')
    .default('console'),

  MAIL_FROM_NAME: Joi.string().required(),

  MAIL_FROM_ADDRESS: Joi.string()
    .email()
    .when('MAIL_PROVIDER', {
      is: Joi.valid('resend', 'smtp'),
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

  RESEND_API_KEY: Joi.string().when('MAIL_PROVIDER', {
    is: 'resend',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  SMTP_HOST: Joi.string().when('MAIL_PROVIDER', {
    is: 'smtp',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  SMTP_PORT: Joi.number().port().when('MAIL_PROVIDER', {
    is: 'smtp',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  SMTP_SECURE: Joi.boolean()
    .truthy('true')
    .falsy('false')
    .when('MAIL_PROVIDER', {
      is: 'smtp',
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),

  SMTP_USER: Joi.string().email().when('MAIL_PROVIDER', {
    is: 'smtp',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  SMTP_PASSWORD: Joi.string().when('MAIL_PROVIDER', {
    is: 'smtp',
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});
