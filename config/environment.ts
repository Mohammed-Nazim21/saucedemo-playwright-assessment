import userData from '../data/userData.json';

function isNonEmpty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function resolveEnvironment(
  variables: NodeJS.ProcessEnv = process.env,
  defaults = userData,
) {
  const environment = {
    baseURL: isNonEmpty(variables.BASE_URL) ? variables.BASE_URL : defaults.baseURL,
    username: isNonEmpty(variables.SAUCE_USERNAME) ? variables.SAUCE_USERNAME : defaults.username,
    // Preserve significant whitespace in a non-empty password.
    password: isNonEmpty(variables.SAUCE_PASSWORD) ? variables.SAUCE_PASSWORD : defaults.password,
  };

  const missing = [
    ['BASE_URL', environment.baseURL],
    ['SAUCE_USERNAME', environment.username],
    ['SAUCE_PASSWORD', environment.password],
  ].filter(([, value]) => !isNonEmpty(value)).map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing settings: ${missing.join(', ')}`);
  }

  try {
    const url = new URL(environment.baseURL);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error();
    }
  } catch {
    // Report the setting name only; a URL can also contain credentials.
    throw new Error('Invalid setting: BASE_URL (expected an absolute HTTP(S) URL)');
  }

  return environment;
}
