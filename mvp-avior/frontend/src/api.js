const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function api(path, { token, ...options } = {}) {
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok) throw new Error(data?.error || data?.errors?.join(' ') || 'No se pudo completar la solicitud.');
  return data;
}
