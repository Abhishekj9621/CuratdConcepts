// Centralized API helper for talking to the Curatd Concepts backend.
// In development, CRA's "proxy" field in package.json forwards /api to
// http://localhost:5000, so an empty base URL works locally.
// In production (Vercel), set REACT_APP_API_URL to your deployed Railway URL.

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const TOKEN_KEY = 'curatd_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // No JSON body (e.g. 204) — that's fine.
  }

  if (!response.ok) {
    const message = (data && data.message) || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

// ── Public endpoints ───────────────────────────────────────────────────
export const getListings = () => request('/api/listings');
export const getListing = (id) => request(`/api/listings/${id}`);

// ── Admin auth ──────────────────────────────────────────────────────────
export const adminLogin = (username, password) =>
  request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const adminMe = () => request('/api/admin/me');

// ── Admin listing management (requires auth token) ──────────────────────
export const createListing = (payload) =>
  request('/api/listings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateListing = (id, payload) =>
  request(`/api/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteListing = (id) =>
  request(`/api/listings/${id}`, {
    method: 'DELETE',
  });

// ── Image uploads (multipart/form-data, requires auth token) ────────────
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return request('/api/upload', {
    method: 'POST',
    body: formData,
  });
};

export const uploadImages = (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  return request('/api/upload/multiple', {
    method: 'POST',
    body: formData,
  });
};
