const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_-]+$/;
const URL_RE = /^https?:\/\/.+/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email) && email.length <= 254;
}

export function isValidUsername(username: string): boolean {
  return USERNAME_RE.test(username) && username.length >= 2 && username.length <= 30;
}

export function isValidUrl(url: string): boolean {
  return URL_RE.test(url) && url.length <= 500;
}

export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

export function isValidLatitude(lat: number): boolean {
  return !isNaN(lat) && lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: number): boolean {
  return !isNaN(lng) && lng >= -180 && lng <= 180;
}

const VALID_REGIONS = new Set([
  // England
  "North East",
  "North West",
  "Yorkshire and the Humber",
  "East Midlands",
  "West Midlands",
  "East of England",
  "London",
  "South East",
  "South West",
  // Scotland
  "Highlands & Islands",
  "North East Scotland",
  "Central Belt",
  "South Scotland",
  // Wales
  "North Wales",
  "Mid Wales",
  "South West Wales",
  "South East Wales",
  // Northern Ireland
  "Northern Ireland",
]);

export function isValidRegion(region: string): boolean {
  return VALID_REGIONS.has(region);
}

/**
 * Validates password strength.
 * Requires 8-72 chars, at least one uppercase, one lowercase, and one digit.
 */
export function validatePassword(password: string): string | null {
  if (typeof password !== "string") return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (password.length > 72) return "Password must be no more than 72 characters";
  if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return null;
}
