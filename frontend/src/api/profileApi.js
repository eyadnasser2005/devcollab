const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => '');

  if (!response.ok) {
    const detail = isJson
      ? body?.message || body?.error || JSON.stringify(body || {})
      : body || response.statusText;
    throw new Error(`API_ERROR_${response.status}: ${detail}`);
  }

  return body;
}

async function request(path, token, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseResponse(response);
}

export function getProfile(token) {
  return request('/profile', token, { method: 'GET' });
}

export function updateProfile(token, payload) {
  return request('/profile', token, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}
