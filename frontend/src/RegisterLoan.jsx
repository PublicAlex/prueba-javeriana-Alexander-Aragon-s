import { useState } from 'react';
import { api } from './api';

export default function RegisterLoan() {
  const [form, setForm] = useState({
    isbn: '',
    identificacion_usuario: '',
    fecha_vencimiento: '',
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      setResult(await api.registrarPrestamo(form));
      setForm({ isbn: '', identificacion_usuario: '', fecha_vencimiento: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="section-title">
        <span className="icon">{'\u{2795}'}</span>
        Registrar Préstamo
      </div>

      <form onSubmit={submit}>
        <div className="form-grid">
          <div className="form-group">
            <label>ISBN del libro</label>
            <input
              name="isbn"
              placeholder="9780134685991"
              value={form.isbn}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Identificación del usuario</label>
            <input
              name="identificacion_usuario"
              placeholder="Ej: 202012345"
              value={form.identificacion_usuario}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de vencimiento</label>
            <input
              name="fecha_vencimiento"
              type="date"
              value={form.fecha_vencimiento}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group" style={{ justifyContent: 'flex-end' }}>
            <label>&nbsp;</label>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="spinner" /> : '\u{1F4E6}'} Registrar
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-error">{'\u{26A0}\u{FE0F}'} {error}</div>}

      {result && (
        <div className="alert alert-success">
          {'\u{2705}'} Préstamo <strong>#{result.id}</strong> registrado exitosamente —{' '}
          <span className="badge badge-success">{result.estado}</span>
        </div>
      )}
    </div>
  );
}
