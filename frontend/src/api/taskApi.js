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

export async function uploadTaskFile(token, taskId, file, notes) {
  const formData = new FormData();
  formData.append('file', file);
  if (typeof notes === 'string') {
    formData.append('notes', notes);
  }

  const response = await fetch(`${API_BASE}/tasks/${taskId}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  return parseResponse(response);
}
