import { useState, useEffect } from 'react';
import { getStats } from '../api';

export default function Stats({ refresh }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getStats().then(data => {
      if (data && !data.error) setStats(data);
    });
  }, [refresh]);

  if (!stats) return null;

  return (
    <div className="stats-bar">
      <div className="stat-pill">
        <div className="num">{stats.total}</div>
        <div className="label">Total</div>
      </div>
      <div className="stat-pill">
        <div className="num">{stats.concluidas}</div>
        <div className="label">Concluídas</div>
      </div>
      <div className="stat-pill">
        <div className="num">{stats.pendentes}</div>
        <div className="label">Pendentes</div>
      </div>
    </div>
  );
}