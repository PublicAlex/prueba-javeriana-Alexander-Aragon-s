import { useState } from 'react';
import { api } from './api';

export default function ReturnBook() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setResult(await api.devolverPrestamo(Number(id)));
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="card">
      <h2>Devolver Libro</h2>
      <form onSubmit={submit}>
        <input
          placeholder="ID del préstamo"
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
        <button type="submit">Devolver</button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result success">
          Libro devuelto — Préstamo #{result.id}: {result.estado}
        </div>
      )}
    </div>
  );
}
