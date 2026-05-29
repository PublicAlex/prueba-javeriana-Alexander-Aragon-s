import { useState, useEffect } from 'react';
import { api } from './api';

export default function BookList() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');

  const cargar = async () => {
    try {
      setError('');
      setLibros(await api.listarLibros());
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div className="card">
      <h2>Libros</h2>
      {error && <p className="error">{error}</p>}
      <button onClick={cargar}>Recargar</button>
      <table>
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Título</th>
            <th>Área</th>
            <th>Ejemplares</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((l) => (
            <tr key={l.isbn}>
              <td>{l.isbn}</td>
              <td>{l.titulo}</td>
              <td>{l.area_conocimiento}</td>
              <td>{l.ejemplares_disponibles}</td>
            </tr>
          ))}
          {libros.length === 0 && (
            <tr><td colSpan={4} className="empty">No hay libros</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
