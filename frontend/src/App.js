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

  const handleLogin = () => {
    setToken(localStorage.getItem('token'));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPage('login');
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
    <div className="container">
      <div className="header">
        <h1>Gestor de Tarefas</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Stats refresh={refresh} />
      <TaskForm onCreated={handleCreated} />
      <TaskList refresh={refresh} />
    </div>
  );
}