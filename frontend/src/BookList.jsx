import { useState, useEffect } from 'react';
import { api } from './api';

export default function BookList() {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    setLoading(true);
    setError('');
    try {
      setLibros(await api.listarLibros());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  return (
    <div>
      <div className="section-title">
        <span className="icon">{'\u{1F4DA}'}</span>
        Catálogo de Libros
        <button className="btn btn-outline btn-sm" onClick={cargar} style={{ marginLeft: 'auto' }}>
          {'\u{1F504}'} Recargar
        </button>
      </div>

      {error && <div className="alert alert-error">{'\u{26A0}\u{FE0F}'} {error}</div>}

      {loading ? (
        <div className="empty-state">
          <div className="spinner" />
          <p>Cargando libros...</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Título</th>
                <th>Área de Conocimiento</th>
                <th>Ejemplares</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((l) => (
                <tr key={l.isbn}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{l.isbn}</td>
                  <td><strong>{l.titulo}</strong></td>
                  <td><span className="badge badge-info">{l.area_conocimiento}</span></td>
                  <td>
                    {l.ejemplares_disponibles > 0 ? (
                      <span className="badge badge-success">
                        {'\u{2705}'} {l.ejemplares_disponibles} disp.
                      </span>
                    ) : (
                      <span className="badge badge-error">{'\u{274C}'} Agotado</span>
                    )}
                  </td>
                </tr>
              ))}
              {libros.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <div className="icon">{'\u{1F4D6}'}</div>
                      <p>No hay libros registrados</p>
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
