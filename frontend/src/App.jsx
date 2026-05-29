import { useState } from 'react';
import BookList from './BookList';
import BookAvailability from './BookAvailability';
import RegisterLoan from './RegisterLoan';
import ReturnBook from './ReturnBook';
import OverdueLoans from './OverdueLoans';
import './App.css';

const TABS = [
  { key: 'libros', label: 'Libros', icon: '\u{1F4DA}' },
  { key: 'disponibilidad', label: 'Disponibilidad', icon: '\u{1F50D}' },
  { key: 'prestar', label: 'Prestar', icon: '\u{2795}' },
  { key: 'devolver', label: 'Devolver', icon: '\u{1F504}' },
  { key: 'vencidos', label: 'Vencidos', icon: '\u{26A0}\u{FE0F}' },
];

const COMPONENTS = {
  libros: BookList,
  disponibilidad: BookAvailability,
  prestar: RegisterLoan,
  devolver: ReturnBook,
  vencidos: OverdueLoans,
};

export default function App() {
  const [tab, setTab] = useState('libros');
  const Component = COMPONENTS[tab];

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <div className="header-icon">{'\u{1F3E2}'}</div>
          <div className="header-title">
            <h1>Biblioteca Javeriana</h1>
            <span>Sistema de Gestión de Préstamos</span>
          </div>
        </div>
        <nav className="header-nav">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`nav-btn${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main-card">
        <div className="card-body">
          <Component key={tab} />
        </div>
      </main>
    </div>
  );
}
