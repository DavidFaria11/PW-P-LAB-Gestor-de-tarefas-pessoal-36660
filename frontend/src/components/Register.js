import { useState } from 'react';
import { register } from '../api';

export default function Register({ onSwitch }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    const res = await register(form);
    if (res.userId) {
      setMsg('Conta criada! Podes fazer login.');
    } else {
      setMsg(res.error || 'Erro ao registar');
    }
  };

  return (
    <div className="auth-box">
      <h2>Registar</h2>
      <form onSubmit={handle}>
        <input placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">Registar</button>
      </form>
      {msg && <p>{msg}</p>}
      <p>Já tens conta? <span onClick={onSwitch}>Login</span></p>
    </div>
  );
}