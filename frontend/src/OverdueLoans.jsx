import { useState } from 'react';
import { api } from './api';

export default function OverdueLoans() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const cargar = async () => {
    try {
      setError('');
      setLoans(await api.listarVencidos());
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="card">
      <h2>Préstamos Vencidos</h2>
      <button onClick={cargar}>Consultar vencidos</button>
      {error && <p className="error">{error}</p>}
      {loaded && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>ISBN</th>
              <th>Usuario</th>
              <th>Préstamo</th>
              <th>Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((l) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.isbn}</td>
                <td>{l.identificacion_usuario}</td>
                <td>{l.fecha_prestamo}</td>
                <td className="error">{l.fecha_vencimiento}</td>
              </tr>
            ))}
            {loans.length === 0 && (
              <tr><td colSpan={5} className="empty">No hay préstamos vencidos</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
