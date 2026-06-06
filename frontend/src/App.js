import { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Stats from './components/Stats';
import './App.css';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState('login');
  const [refresh, setRefresh] = useState(0);

  const handleLogin = () => setToken(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleCreated = () => setRefresh(r => r + 1);

  if (!token) {
    return (
      <div className="container">
        {page === 'login'
          ? <Login onLogin={handleLogin} onSwitch={() => setPage('register')} />
          : <Register onSwitch={() => setPage('login')} />
        }
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <span className="logo">📋 Gestor de Tarefas</span>
        <button onClick={handleLogout}>Sair</button>
      </nav>
      <div className="container">
        <Stats refresh={refresh} />
        <TaskForm onCreated={handleCreated} />
        <TaskList refresh={refresh} />
      </div>
    </div>
  );
}