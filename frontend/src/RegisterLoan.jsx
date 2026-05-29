import { useState } from 'react';
import { api } from './api';

export default function RegisterLoan() {
  const [form, setForm] = useState({ isbn: '', identificacion_usuario: '', fecha_vencimiento: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setResult(await api.registrarPrestamo(form));
    } catch (e) {
      setError(e.message);
      setResult(null);
    }
  };

  return (
    <div className="card">
      <h2>Registrar Préstamo</h2>
      <form onSubmit={submit}>
        <input name="isbn" placeholder="ISBN" value={form.isbn} onChange={handleChange} required />
        <input name="identificacion_usuario" placeholder="ID Usuario" value={form.identificacion_usuario} onChange={handleChange} required />
        <input name="fecha_vencimiento" type="date" value={form.fecha_vencimiento} onChange={handleChange} required />
        <button type="submit">Registrar</button>
      </form>
      {error && <p className="error">{error}</p>}
      {result && (
        <div className="result success">
          Préstamo #{result.id} registrado — {result.estado}
        </div>
      )}
    </div>
  );
}
