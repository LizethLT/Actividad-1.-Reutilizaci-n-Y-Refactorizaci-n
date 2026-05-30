/*  apiClient.js — Refactorización: Extract Constant + Extract Function
export const BASE_URL = 'http://localhost:3001/api';

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return response.json();
}*/

 
export const BASE_URL = 'http://localhost:3001/api';

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  return response.json();
}

