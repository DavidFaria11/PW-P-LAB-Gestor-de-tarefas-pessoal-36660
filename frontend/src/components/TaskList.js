import { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask } from '../api';
import EditTaskModal from './EditTaskModal';

export default function TaskList({ refresh, selectedDate, setAllTasks }) {
  const [tasks, setTasks] = useState({ atrasadas: [], hoje: [], futuras: [] });
  const [filters, setFilters] = useState({ priority: '', status: '' });
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState('');

  const load = async () => {
    const data = await getTasks({});
    if (!Array.isArray(data)) return;
    if (setAllTasks) setAllTasks(data);

    const filtered = data.filter(t => {
      if (!t.deadline) return false;
      const taskDate = new Date(t.deadline);
      const selected = new Date(selectedDate);

      let matches = false;
      if (taskDate.toDateString() === selected.toDateString()) matches = true;
      if (t.recurrence && taskDate <= selected) {
        if (t.recurrence === 'diaria') matches = true;
        if (t.recurrence === 'semanal' && taskDate.getDay() === selected.getDay()) matches = true;
        if (t.recurrence === 'mensal' && taskDate.getDate() === selected.getDate()) matches = true;
        if (t.recurrence === 'anual' && taskDate.getDate() === selected.getDate() && taskDate.getMonth() === selected.getMonth()) matches = true;
      }
      if (!matches) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    const today = new Date();
    const atrasadas = filtered.filter(t => {
      const d = new Date(t.deadline);
      return d < today && d.toDateString() !== today.toDateString() && t.status === 'ativa';
    });
    const hojeT = filtered.filter(t => {
      const d = new Date(t.deadline);
      return d.toDateString() === today.toDateString() || t.recurrence;
    });
    const futuras = filtered.filter(t => {
      const d = new Date(t.deadline);
      return d > today && d.toDateString() !== today.toDateString() && !t.recurrence;
    });

    const sortByTime = (arr) => arr.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });

    setTasks({
      atrasadas: sortByTime(atrasadas),
      hoje: sortByTime(hojeT),
      futuras: sortByTime(futuras)
    });
  };

  useEffect(() => { load(); }, [refresh, filters, selectedDate, search]);

  const eliminar = async (id) => {
    if (window.confirm('Tens a certeza que queres eliminar esta tarefa?')) {
      await deleteTask(id);
      load();
    }
  };

  const renderCard = (task) => (
    <div key={task.id} className={`task-card ${task.status}`}>
      <div className="task-card-top">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.status === 'concluida'}
          onChange={async (e) => {
            e.stopPropagation();
            if (task.status === 'ativa') {
              await updateTask(task.id, { status: 'concluida' });
            } else {
              await updateTask(task.id, { status: 'ativa' });
            }
            load();
          }}
          onClick={e => e.stopPropagation()}
        />
        <h4 style={{ textDecoration: task.status === 'concluida' ? 'line-through' : 'none', opacity: task.status === 'concluida' ? 0.5 : 1 }}>
          {task.title}
        </h4>
        <button className="btn-edit-small" onClick={(e) => { e.stopPropagation(); setEditTask(task); }}>✏️</button>
        <button className="btn-delete-small" onClick={(e) => { e.stopPropagation(); eliminar(task.id); }}>🗑</button>
      </div>
      {task.description && <p>{task.description}</p>}
      <div className="task-meta">
        <span className={`badge ${task.priority}`}>{task.priority}</span>
        <span className="badge cat">{task.category}</span>
        {task.time && <span className="badge time">🕐 {task.time}</span>}
        {task.recurrence && <span className="badge rec">🔁 {task.recurrence}</span>}
      </div>
    </div>
  );

  const total = [...tasks.atrasadas, ...tasks.hoje, ...tasks.futuras];
  const concluidas = total.filter(t => t.status === 'concluida').length;

  return (
    <div>
      <div className="tasks-header">
        <h3>Tarefas do dia</h3>
        {total.length > 0 && <span className="progress-label">{concluidas}/{total.length}</span>}
      </div>

      {total.length > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(concluidas / total.length) * 100}%` }} />
        </div>
      )}

      <div className="search-row">
        <input
          placeholder="Pesquisar tarefas..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters-row">
        <select value={filters.priority} onChange={e => setFilters({...filters, priority: e.target.value})}>
          <option value="">Todas as prioridades</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
          <option value="">Todos os estados</option>
          <option value="ativa">Ativa</option>
          <option value="concluida">Concluída</option>
        </select>
      </div>

      {total.length === 0 && <div className="no-tasks"><span>📭</span>Sem tarefas para este dia.</div>}

      {tasks.atrasadas.length > 0 && (
        <div className="task-group">
          <div className="group-label atrasadas">⚠️ Atrasadas</div>
          {tasks.atrasadas.map(renderCard)}
        </div>
      )}

      {tasks.hoje.length > 0 && (
        <div className="task-group">
          <div className="group-label hoje">📅 Hoje</div>
          {tasks.hoje.map(renderCard)}
        </div>
      )}

      {tasks.futuras.length > 0 && (
        <div className="task-group">
          <div className="group-label futuras">🔮 Futuras</div>
          {tasks.futuras.map(renderCard)}
        </div>
      )}

      {editTask && (
        <EditTaskModal
          task={editTask}
          onClose={() => setEditTask(null)}
          onUpdated={() => { load(); setEditTask(null); }}
        />
      )}
    </div>
  );
}