// Superadmin login helper
export async function loginSuperadmin(data) {
  const res = await fetch(`${API_BASE_URL}/api/auth/superadmin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}
import { API_BASE_URL } from './config';


export async function registerUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}


export async function loginUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  return res.json();
}


export async function getCurrentUser(token) {
  const res = await fetch(`${API_BASE_URL}/api/auth/current-user`, {
    headers: { 'Authorization': `Bearer ${token}` },
    credentials: 'include',
  });
  return res.json();
}

// Add more helpers as needed (logout, refresh-token, etc)