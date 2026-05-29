import { useState } from 'react';
import { api } from './api';

export default function OverdueLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      setLoans(await api.listarVencidos());
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <span className="icon">{'\u{26A0}\u{FE0F}'}</span>
        Préstamos Vencidos
        <button
          className="btn btn-outline btn-sm"
          onClick={cargar}
          disabled={loading}
          style={{ marginLeft: 'auto' }}
        >
          {loading ? <span className="spinner" /> : '\u{1F50D}'} Consultar
        </button>
      </div>

      {error && <div className="alert alert-error">{'\u{26A0}\u{FE0F}'} {error}</div>}

      {!loaded && !loading && (
        <div className="empty-state">
          <div className="icon">{'\u{1F4C5}'}</div>
          <p>Presiona "Consultar" para ver los préstamos vencidos</p>
        </div>
      )}

      {loading && (
        <div className="empty-state">
          <div className="spinner" />
          <p>Buscando préstamos vencidos...</p>
        </div>
      )}

      {loaded && !loading && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ISBN</th>
                <th>Usuario</th>
                <th>Fecha Préstamo</th>
                <th>Vence</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id}>
                  <td><strong>#{l.id}</strong></td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{l.isbn}</td>
                  <td>{l.identificacion_usuario}</td>
                  <td>{l.fecha_prestamo}</td>
                  <td>
                    <span className="badge badge-error">
                      {'\u{26A0}\u{FE0F}'} {l.fecha_vencimiento}
                    </span>
                  </td>
                </tr>
              ))}
              {loans.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="icon">{'\u{2705}'}</div>
                      <p>No hay préstamos vencidos</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
