type SecretMap = Record<string, string>;

function parseJsonEnv(name: string): SecretMap {
  const raw = process.env[name];

  if (!raw) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as SecretMap;
    }

    return {};
  } catch {
    return {};
  }
}

function setDefaultEnv(name: string, value: string): void {
  if (!process.env[name] || process.env[name] === '') {
    process.env[name] = value;
  }
}

function setEnvFromSecret(
  envName: string,
  secret: SecretMap,
  secretKey: string = envName,
): void {
  if (secret[secretKey] && secret[secretKey] !== '') {
    process.env[envName] = secret[secretKey];
  }
}

export function loadExternalSecrets(): void {
  const jwt = parseJsonEnv('uat_auth_jwt_secret');
  const mongo = parseJsonEnv('uat_mongodb');
  const stripe = parseJsonEnv('uat_stripe_api_key');
  const google = parseJsonEnv('uat_google_client');
  const twilio = parseJsonEnv('uat_twilio');
  const ses = parseJsonEnv('uat_ses');
  const maps = parseJsonEnv('uat_google_maps');

  setDefaultEnv('PORT', '4000');
  setDefaultEnv('CORS_ORIGIN', 'http://localhost:3000');
  setDefaultEnv(
    'GOOGLE_CALLBACK_URL',
    'http://localhost:4000/api/auth/google/callback',
  );

  setDefaultEnv('JWT_SECRET', 'placeholder');
  setDefaultEnv('JWT_ALGORITHM', 'HS256');
  setDefaultEnv('JWT_EXPIRE_TIME', '3600');
  setDefaultEnv('CSRF_SECRET', 'placeholder');

  setDefaultEnv('STRIPE_PUBLISHABLE_KEY', 'placeholder');
  setDefaultEnv('STRIPE_SECRET_KEY', 'placeholder');
  setDefaultEnv('STRIPE_WEBHOOK_SECRET', 'placeholder');

  setDefaultEnv('TWILIO_ACCOUNT_SID', 'ACxxxxxxxx');
  setDefaultEnv('TWILIO_AUTH_TOKEN', 'xxxxxxxx');

  setDefaultEnv('SES_FROM', 'shangguming@gmail.com');
  setDefaultEnv('SMTP_HOST', 'email-smtp.ap-southeast-2.amazonaws.com');
  setDefaultEnv('SMTP_PORT', '587');
  setDefaultEnv('SMTP_USER', 'xxxxxxxx');
  setDefaultEnv('SMTP_PASS', 'xxxxxxxx');

  setDefaultEnv('GOOGLE_CLIENT_ID', 'xxxxxxxx.apps.googleusercontent.com');
  setDefaultEnv('GOOGLE_CLIENT_SECRET', 'xxxxxxxx');
  setDefaultEnv('GOOGLE_MAPS_API_KEY', 'xxxxxxxx');

  setDefaultEnv('MONGODB_URI', 'mongodb://localhost:27017/dispatch-ai');
  setDefaultEnv('REDIS_HOST', 'redis');
  setDefaultEnv('REDIS_PORT', '6379');

  setEnvFromSecret('JWT_SECRET', jwt);
  setEnvFromSecret('JWT_ALGORITHM', jwt);
  setEnvFromSecret('JWT_EXPIRE_TIME', jwt);
  setEnvFromSecret('CSRF_SECRET', jwt);

  setEnvFromSecret('MONGODB_URI', mongo);

  setEnvFromSecret('STRIPE_PUBLISHABLE_KEY', stripe);
  setEnvFromSecret('STRIPE_SECRET_KEY', stripe);
  setEnvFromSecret('STRIPE_WEBHOOK_SECRET', stripe);

  setEnvFromSecret('GOOGLE_CLIENT_ID', google);
  setEnvFromSecret('GOOGLE_CLIENT_SECRET', google);

  setEnvFromSecret('TWILIO_ACCOUNT_SID', twilio);
  setEnvFromSecret('TWILIO_AUTH_TOKEN', twilio);

  setEnvFromSecret('SES_FROM', ses);
  setEnvFromSecret('SMTP_HOST', ses);
  setEnvFromSecret('SMTP_PORT', ses);
  setEnvFromSecret('SMTP_USER', ses);
  setEnvFromSecret('SMTP_PASS', ses);

  setEnvFromSecret('GOOGLE_MAPS_API_KEY', maps);
}
