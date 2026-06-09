import { useState } from 'react';
import { updateTask } from '../api';

export default function EditTaskModal({ task, onClose, onUpdated }) {
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    category: task.category || '',
    priority: task.priority || 'media',
    time: task.time || '',
    recurrence: task.recurrence || '',
    deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
  });
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    try {
      const res = await updateTask(task.id, form);
      if (res.id) {
        onUpdated();
        onClose();
      } else {
        setMsg(res.error || 'Erro ao atualizar tarefa');
      }
    } catch (err) {
      console.error('erro:', err);
      setMsg('Erro de ligação');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>✏️ Editar Tarefa</h3>
        <form className="modal-form" onSubmit={handle}>
          <input
            placeholder="Título"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
          />
          <div className="modal-row">
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
              <option value="">Seleciona categoria</option>
              <option value="casa">🏠 Casa</option>
              <option value="trabalho">💼 Trabalho</option>
              <option value="escola">📚 Escola</option>
              <option value="outro">📌 Outro</option>
            </select>
            <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="baixa">🟢 Baixa</option>
              <option value="media">🟡 Média</option>
              <option value="alta">🔴 Alta</option>
            </select>
          </div>
          <div className="modal-row">
            <input
              type="date"
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
            />
            <input
              type="time"
              value={form.time}
              onChange={e => setForm({...form, time: e.target.value})}
            />
          </div>
          <select value={form.recurrence} onChange={e => setForm({...form, recurrence: e.target.value})}>
            <option value="">🔁 Sem repetição</option>
            <option value="diaria">🔁 Diariamente</option>
            <option value="semanal">🔁 Semanalmente</option>
            <option value="mensal">🔁 Mensalmente</option>
            <option value="anual">🔁 Anualmente</option>
          </select>
          {msg && <p className="msg error">{msg}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-create">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}