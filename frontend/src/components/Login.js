import { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    const res = await login(form);
    if (res.token) {
      localStorage.setItem('token', res.token);
      onLogin();
    } else {
      setMsg(res.error || 'Erro ao fazer login');
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>
      <form onSubmit={handle}>
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
        <button type="submit">Entrar</button>
      </form>
      {msg && <p>{msg}</p>}
      <p>Não tens conta? <span onClick={onSwitch}>Registar</span></p>
    </div>
  );
}