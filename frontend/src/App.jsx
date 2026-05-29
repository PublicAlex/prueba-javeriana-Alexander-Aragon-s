import { useState } from 'react';
import BookList from './BookList';
import BookAvailability from './BookAvailability';
import RegisterLoan from './RegisterLoan';
import ReturnBook from './ReturnBook';
import OverdueLoans from './OverdueLoans';
import './App.css';

const TABS = [
  { key: 'libros', label: 'Libros', component: BookList },
  { key: 'disponibilidad', label: 'Disponibilidad', component: BookAvailability },
  { key: 'prestar', label: 'Prestar', component: RegisterLoan },
  { key: 'devolver', label: 'Devolver', component: ReturnBook },
  { key: 'vencidos', label: 'Vencidos', component: OverdueLoans },
];

export default function App() {
  const [tab, setTab] = useState('libros');
  const Component = TABS.find((t) => t.key === tab).component;

  return (
    <div className="app">
      <header>
        <h1>Biblioteca Javeriana</h1>
        <nav>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? 'active' : ''}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <main>
        <Component />
      </main>
    </div>
  );
}
