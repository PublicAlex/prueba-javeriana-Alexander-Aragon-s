import { useState } from 'react';
import { api } from './api';

export default function BookAvailability() {
  const [isbn, setIsbn] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const consultar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setData(null);
    try {
      setData(await api.consultarDisponibilidad(isbn.trim()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <span className="icon">{'\u{1F50D}'}</span>
        Consultar Disponibilidad
      </div>

      <form onSubmit={consultar}>
        <div className="form-grid">
          <div className="form-group">
            <label>ISBN del libro</label>
            <input
              placeholder="Ej: 9780134685991"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label>&nbsp;</label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '\u{1F50D}'} Consultar
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-error">{'\u{26A0}\u{FE0F}'} {error}</div>}

      {data && (
        <div className="result-card">
          <div className="title">{'\u{1F4D6}'} {data.titulo}</div>
          <div className="meta">ISBN: <strong>{data.isbn}</strong></div>
          <div className="meta">
            Ejemplares disponibles:{' '}
            <span className={`stock-count ${data.ejemplares_disponibles > 0 ? '' : ''}`}>
              {data.ejemplares_disponibles}
            </span>
          </div>
          <div style={{ marginTop: 4 }}>
            {data.disponible ? (
              <span className="badge badge-success">{'\u{2705}'} Disponible para préstamo</span>
            ) : (
              <span className="badge badge-error">{'\u{274C}'} No disponible</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
