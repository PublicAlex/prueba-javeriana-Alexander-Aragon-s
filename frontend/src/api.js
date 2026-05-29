const API_BASE = '/api';

async function request(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error || data?.detail || `Error ${res.status}`);
  }
  return data;
}

export const api = {
  listarLibros: () => request('/libros/'),
  consultarDisponibilidad: (isbn) => request(`/libros/${isbn}/disponibilidad/`),
  registrarPrestamo: (body) =>
    request('/prestamos/', { method: 'POST', body: JSON.stringify(body) }),
  devolverPrestamo: (id) =>
    request(`/prestamos/${id}/devolver/`, { method: 'POST' }),
  listarVencidos: () => request('/prestamos/vencidos/'),
};
