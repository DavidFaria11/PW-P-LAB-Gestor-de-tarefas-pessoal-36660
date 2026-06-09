import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default function ProfileModal({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', password: '' });
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/user`, { headers: headers() })
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setForm({ name: data.name, password: '' });
      });
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    const body = {};
    if (form.name !== profile.name) body.name = form.name;
    if (form.password) body.password = form.password;

    if (Object.keys(body).length === 0) {
      setMsg('Nenhuma alteração feita.');
      setMsgType('');
      return;
    }

    const res = await fetch(`${API_URL}/user`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(body)
    }).then(r => r.json());

    if (res.id) {
      setMsg('Perfil atualizado com sucesso!');
      setMsgType('success');
      setProfile(res);
      setForm({ name: res.name, password: '' });
    } else {
      setMsg(res.error || 'Erro ao atualizar');
      setMsgType('error');
    }
  };

  if (!profile) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>👤 Perfil</h3>
        <div className="profile-info">
          <div className="profile-avatar">{profile.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="profile-name">{profile.name}</p>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-since">Membro desde {new Date(profile.createdAt).toLocaleDateString('pt-PT')}</p>
          </div>
        </div>
        <form className="modal-form" onSubmit={handle}>
          <input
            placeholder="Nome"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Nova password (opcional)"
            value={form.password}
            onChange={e => setForm({...form, password: e.target.value})}
          />
          {msg && <p className={`msg ${msgType}`}>{msg}</p>}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Fechar</button>
            <button type="submit" className="btn-create">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}