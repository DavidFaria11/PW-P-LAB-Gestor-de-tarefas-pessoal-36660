import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Stats from './components/Stats';
import ProfileModal from './components/ProfileModal';
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
  const [allTasks, setAllTasks] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogin = () => setToken(localStorage.getItem('token'));
  const handleLogout = () => { localStorage.removeItem('token'); setToken(null); };
  const handleCreated = () => setRefresh(r => r + 1);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!token || allTasks.length === 0) return;

    const check = () => {
      const now = new Date();
      allTasks.forEach(t => {
        if (!t.deadline || t.status !== 'ativa') return;
        const deadline = new Date(t.deadline);
        if (t.time) {
          const [h, m] = t.time.split(':');
          deadline.setHours(Number(h), Number(m), 0, 0);
        } else {
          deadline.setHours(9, 0, 0, 0);
        }
        const diff = deadline - now;
        if (diff > 0 && diff <= 30 * 60 * 1000) {
          if (Notification.permission === 'granted') {
            new Notification('📋 Tarefa próxima!', {
              body: `"${t.title}" está prevista para daqui a pouco.`,
              icon: '/favicon.ico'
            });
          }
        }
      });
    };

    check();
    const interval = setInterval(check, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [allTasks, token]);

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
        <div className="navbar-actions">
          <button className="btn-profile" onClick={() => setShowProfile(true)}>👤</button>
          <button onClick={handleLogout}>Sair</button>
        </div>
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
              const count = allTasks.filter(t => {
                if (!t.deadline || t.status !== 'ativa') return false;
                const taskDate = new Date(t.deadline);
                if (taskDate.toDateString() === d.toDateString()) return true;
                if (t.recurrence && taskDate <= d) {
                  if (t.recurrence === 'diaria') return true;
                  if (t.recurrence === 'semanal' && taskDate.getDay() === d.getDay()) return true;
                  if (t.recurrence === 'mensal' && taskDate.getDate() === d.getDate()) return true;
                  if (t.recurrence === 'anual' && taskDate.getDate() === d.getDate() && taskDate.getMonth() === d.getMonth()) return true;
                }
                return false;
              }).length;
              return (
                <div key={i} className={`week-day ${isActive ? 'active' : ''}`} onClick={() => setSelectedDate(d)}>
                  <span className="day-name">{DAYS[d.getDay()]}</span>
                  <span className="day-num">{d.getDate()}</span>
                  {count > 0 && <span className="day-count">{count}</span>}
                  {isToday && count === 0 && <span className="day-dot" />}
                </div>
              );
            })}
          </div>
        </div>

        <TaskList refresh={refresh} selectedDate={selectedDate} setAllTasks={setAllTasks} />
      </div>

      <button className="fab" onClick={() => setShowModal(true)}>+</button>

      {showModal && (
        <TaskForm
          onCreated={handleCreated}
          onClose={() => setShowModal(false)}
          selectedDate={selectedDate}
        />
      )}

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
}