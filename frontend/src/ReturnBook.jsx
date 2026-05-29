import { useState } from 'react';
import { api } from './api';

export default function ReturnBook() {
  const [id, setId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await api.devolverPrestamo(Number(id)));
      setId('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <span className="icon">{'\u{1F504}'}</span>
        Devolver Libro
      </div>

      <form onSubmit={submit}>
        <div className="form-grid" style={{ gridTemplateColumns: '1fr auto' }}>
          <div className="form-group">
            <label>ID del préstamo</label>
            <input
              placeholder="Ej: 1"
              type="number"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label>&nbsp;</label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '\u{1F504}'} Devolver
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-error">{'\u{26A0}\u{FE0F}'} {error}</div>}

      {result && (
        <div className="alert alert-success">
          {'\u{2705}'} Libro devuelto — Préstamo <strong>#{result.id}</strong>:{' '}
          <span className="badge badge-success">{result.estado}</span>
        </div>
      )}
    </div>
  );
}
