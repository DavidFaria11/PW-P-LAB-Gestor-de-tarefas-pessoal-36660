import { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask } from '../api';

export default function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ category: '', priority: '', status: '' });

  const load = async () => {
    const f = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const data = await getTasks(f);
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => { load(); }, [refresh, filters]);

  const concluir = async (id) => {
    await updateTask(id, { status: 'concluida' });
    load();
  };

  const eliminar = async (id) => {
    await deleteTask(id);
    load();
  };

  return (
    <div className="task-list">
      <h3>As minhas tarefas</h3>
      <div className="filters">
        <input placeholder="Categoria" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})} />
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
      {tasks.map(task => (
        <div key={task.id} className={`task-card ${task.status}`}>
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <span>Categoria: {task.category}</span>
          <span>Prioridade: {task.priority}</span>
          <span>Estado: {task.status}</span>
          {task.deadline && <span>Prazo: {new Date(task.deadline).toLocaleDateString()}</span>}
          <div className="task-actions">
            {task.status === 'ativa' && <button onClick={() => concluir(task.id)}>✔ Concluir</button>}
            <button onClick={() => eliminar(task.id)}>🗑 Eliminar</button>
          </div>
        </div>
      ))}
      {tasks.length === 0 && <p>Sem tarefas.</p>}
    </div>
  );
}