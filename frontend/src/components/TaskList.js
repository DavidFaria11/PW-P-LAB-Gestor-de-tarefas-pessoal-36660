import { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask } from '../api';

export default function TaskList({ refresh, selectedDate }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ priority: '', status: '' });

  const load = async () => {
    const f = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const data = await getTasks(f);
    if (!Array.isArray(data)) return;

    const filtered = data.filter(t => {
      if (!t.deadline) return false;
      const taskDate = new Date(t.deadline);
      const selected = new Date(selectedDate);

      if (taskDate.toDateString() === selected.toDateString()) return true;

      if (t.recurrence && taskDate <= selected) {
        if (t.recurrence === 'diaria') return true;
        if (t.recurrence === 'semanal') return taskDate.getDay() === selected.getDay();
        if (t.recurrence === 'mensal') return taskDate.getDate() === selected.getDate();
        if (t.recurrence === 'anual') return taskDate.getDate() === selected.getDate() && taskDate.getMonth() === selected.getMonth();
      }

      return false;
    });
    setTasks(filtered);
  };

  useEffect(() => { load(); }, [refresh, filters, selectedDate]);

  const concluir = async (id) => { await updateTask(id, { status: 'concluida' }); load(); };
  const eliminar = async (id) => { await deleteTask(id); load(); };

  return (
    <div>
      <div className="tasks-header">
        <h3>Tarefas do dia</h3>
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
      {tasks.length === 0
        ? <div className="no-tasks"><span>📭</span>Sem tarefas para este dia.</div>
        : tasks.map(task => (
          <div key={task.id} className={`task-card ${task.status}`}>
            <div className="task-card-top">
              <h4>{task.title}</h4>
            </div>
            {task.description && <p>{task.description}</p>}
            <div className="task-meta">
              <span className={`badge ${task.priority}`}>{task.priority}</span>
              <span className={`badge ${task.status}`}>{task.status}</span>
              <span className="badge cat">{task.category}</span>
              {task.time && <span className="badge time">🕐 {task.time}</span>}
              {task.recurrence && <span className="badge rec">🔁 {task.recurrence}</span>}
            </div>
            <div className="task-actions">
              {task.status === 'ativa' && <button className="btn-done" onClick={() => concluir(task.id)}>✔ Concluir</button>}
              <button className="btn-delete" onClick={() => eliminar(task.id)}>🗑 Eliminar</button>
            </div>
          </div>
        ))
      }
    </div>
  );
}