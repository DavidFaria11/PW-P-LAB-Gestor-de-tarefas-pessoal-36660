import { useState, useEffect } from 'react';
import { getStats } from '../api';

export default function Stats({ refresh }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(setStats);
  }, [refresh]);

  if (!stats) return null;

  return (
    <div className="stats">
      <h3>Estatísticas</h3>
      <p>Total: <strong>{stats.total}</strong></p>
      <p>Concluídas: <strong>{stats.concluidas}</strong></p>
      <p>Pendentes: <strong>{stats.pendentes}</strong></p>
      <h4>Por categoria:</h4>
      {Object.entries(stats.porCategoria).map(([cat, count]) => (
        <p key={cat}>{cat}: <strong>{count}</strong></p>
      ))}
    </div>
  );
}