import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Stats from './components/Stats';
import './App.css';

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getWeekDays(baseDate) {
  const day = baseDate.getDay();
  const week = [];
  for (let i = -day; i < 7 - day; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i);
    week.push(d);
  }
  return week;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState('login');
  const [refresh, setRefresh] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekBase, setWeekBase] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleLogin = () => setToken(localStorage.getItem('token'));
  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); };
  const handleCreated = () => setRefresh(r => r + 1);

  const prevWeek = () => {
    const d = new Date(weekBase);
    d.setDate(d.getDate() - 7);
    setWeekBase(d);
  };

  const nextWeek = () => {
    const d = new Date(weekBase);
    d.setDate(d.getDate() + 7);
    setWeekBase(d);
  };

  const handlePickerChange = (date) => {
    setSelectedDate(date);
    setWeekBase(date);
    setShowPicker(false);
  };

  const weekDays = getWeekDays(weekBase);
  const today = new Date();

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

        <div className="week-calendar">
          <div className="calendar-header">
            <button className="cal-nav" onClick={prevWeek}>‹</button>
            <button className="cal-title" onClick={() => setShowPicker(!showPicker)}>
              📅 {weekBase.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}
            </button>
            <button className="cal-nav" onClick={nextWeek}>›</button>
          </div>

          {showPicker && (
            <div className="picker-wrapper">
              <DatePicker
                selected={selectedDate}
                onChange={handlePickerChange}
                inline
                locale="pt"
              />
            </div>
          )}

          <div className="week-days">
            {weekDays.map((d, i) => {
              const isActive = d.toDateString() === selectedDate.toDateString();
              const isToday = d.toDateString() === today.toDateString();
              return (
                <div key={i} className={`week-day ${isActive ? 'active' : ''}`} onClick={() => setSelectedDate(d)}>
                  <span className="day-name">{DAYS[d.getDay()]}</span>
                  <span className="day-num">{d.getDate()}</span>
                  {isToday && <span className="day-dot" />}
                </div>
              );
            })}
          </div>
        </div>

        <TaskList refresh={refresh} selectedDate={selectedDate} />
      </div>

      <button className="fab" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <TaskForm
          onCreated={handleCreated}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}