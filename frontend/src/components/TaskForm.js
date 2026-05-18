import { useState } from 'react';
import { createTask } from '../api';

export default function TaskForm({ onCreated }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'media', deadline: '' });
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    const res = await createTask(form);
    if (res.id) {
      setMsg('Tarefa criada!');
      setForm({ title: '', description: '', category: '', priority: 'media', deadline: '' });
      onCreated();
    } else {
      setMsg(res.error || 'Erro ao criar tarefa');
    }
  };

  return (
    <div className="task-form">
      <h3>Nova Tarefa</h3>
      <form onSubmit={handle}>
        <input placeholder="Título" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
        <input placeholder="Descrição" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        <input placeholder="Categoria" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
        <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
        </select>
        <input type="date" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})} />
        <button type="submit">Criar</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}