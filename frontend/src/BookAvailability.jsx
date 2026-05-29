import { useState } from 'react';
import { api } from './api';

export default function BookAvailability() {
  const [isbn, setIsbn] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const consultar = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setData(await api.consultarDisponibilidad(isbn.trim()));
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  };

  return (
    <div className="card">
      <h2>Consultar Disponibilidad</h2>
      <form onSubmit={consultar}>
        <input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          required
        />
        <button type="submit">Consultar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {data && (
        <div className="result">
          <p><strong>{data.titulo}</strong></p>
          <p>Ejemplares disponibles: {data.ejemplares_disponibles}</p>
          <p className={data.disponible ? 'success' : 'error'}>
            {data.disponible ? '✓ Disponible' : '✗ No disponible'}
          </p>
        </div>
      )}
    </div>
  );
}
