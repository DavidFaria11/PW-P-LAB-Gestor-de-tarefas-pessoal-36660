import { useState } from 'react';
import { createTask } from '../api';

export default function TaskForm({ onCreated, onClose, selectedDate }) {
  const [form, setForm] = useState({
    title: '', description: '', category: '',
    priority: 'media', time: '', recurrence: '',
    deadline: selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  });
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    const res = await createTask(form);
    if (res.id) {
      onCreated();
      onClose();
    } else {
      setMsg(res.error || 'Erro ao criar tarefa');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>Nova Tarefa</h3>
        <form className="modal-form" onSubmit={handle}>
          <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <textarea placeholder="Descrição (opcional)" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <div className="modal-row">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required>
              <option value="">Seleciona categoria</option>
              <option value="casa">🏠 Casa</option>
              <option value="trabalho">💼 Trabalho</option>
              <option value="escola">📚 Escola</option>
              <option value="outro">📌 Outro</option>
            </select>
            <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option value="baixa">🟢 Baixa</option>
              <option value="media">🟡 Média</option>
              <option value="alta">🔴 Alta</option>
            </select>
          </div>
          <div className="modal-row">
            <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="Hora (opcional)" />
          </div>
          <select value={form.recurrence} onChange={e => setForm({ ...form, recurrence: e.target.value })}>
            <option value="">🔁 Sem repetição</option>
            <option value="diaria">🔁 Diariamente</option>
            <option value="semanal">🔁 Semanalmente</option>
            <option value="mensal">🔁 Mensalmente</option>
            <option value="anual">🔁 Anualmente</option>
          </select>
          {msg && <p className="msg error">{msg}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-create">Criar Tarefa</button>
          </div>
        </form>
      </div>
    </div>
  );
}