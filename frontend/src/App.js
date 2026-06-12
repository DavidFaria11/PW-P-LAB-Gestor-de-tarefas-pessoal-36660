import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Login from './components/Login';
import Register from './components/Register';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Stats from './components/Stats';
import ProfileModal from './components/ProfileModal';
import { getTasks } from './api';
import './App.css';

moment.locale('pt');
const localizer = momentLocalizer(moment);

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [page, setPage] = useState('login');
  const [refresh, setRefresh] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month');
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [showDayPanel, setShowDayPanel] = useState(false);

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

  useEffect(() => {
    if (!token) return;
    getTasks({}).then(data => {
      if (Array.isArray(data)) setAllTasks(data);
    });
  }, [token, refresh]);

  const events = allTasks
    .filter(t => t.deadline)
    .map(t => ({
      id: t.id,
      title: t.title,
      start: new Date(t.deadline),
      end: new Date(t.deadline),
      status: t.status,
      priority: t.priority
    }));

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setShowDayPanel(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedDate(new Date(event.start));
    setShowDayPanel(true);
  };

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
    <div className="app-layout">
      <nav className="navbar">
        <span className="logo">📋 Gestor de Tarefas</span>
        <div className="navbar-actions">
          <button className="btn-profile" onClick={() => setShowProfile(true)}>👤</button>
          <button onClick={handleLogout}>Sair</button>
        </div>
      </nav>

      <div className="main-content">
        <div className="stats-bar-top">
          <Stats refresh={refresh} />
        </div>

        <div className="calendar-wrapper">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            date={calendarDate}
            view={calendarView}
            onNavigate={(date) => setCalendarDate(date)}
            onView={(view) => setCalendarView(view)}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.status === 'concluida' ? '#166534' :
                  event.priority === 'alta' ? '#450a0a' :
                  event.priority === 'media' ? '#431407' : '#1e1b4b',
                color: event.status === 'concluida' ? '#86efac' :
                  event.priority === 'alta' ? '#fca5a5' :
                  event.priority === 'media' ? '#fdba74' : '#a5b4fc',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.8rem',
                padding: '2px 6px'
              }
            })}
            messages={{
              next: '›',
              previous: '‹',
              today: 'Hoje',
              month: 'Mês',
              week: 'Semana',
              day: 'Dia',
              agenda: 'Agenda',
              noEventsInRange: 'Sem tarefas neste período'
            }}
          />
        </div>
      </div>

      {showDayPanel && (
        <div className="day-panel-overlay" onClick={() => setShowDayPanel(false)}>
          <div className="day-panel" onClick={e => e.stopPropagation()}>
            <div className="day-panel-header" style={{ padding: '24px 24px 0' }}>
              <h3>{selectedDate.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
              <button onClick={() => setShowDayPanel(false)}>✕</button>
            </div>
            <div className="day-panel-content">
              <TaskList refresh={refresh} selectedDate={selectedDate} setAllTasks={setAllTasks} />
            </div>
            <div className="day-panel-footer">
              <button className="btn-add-day-bottom" onClick={() => setShowModal(true)}>+ Nova Tarefa</button>
            </div>
          </div>
        </div>
      )}

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