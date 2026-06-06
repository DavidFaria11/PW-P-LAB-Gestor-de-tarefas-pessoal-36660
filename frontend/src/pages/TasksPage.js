import { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import Stats from '../components/Stats';

export default function TasksPage() {
  const [refresh, setRefresh] = useState(0);

  const handleCreated = () => setRefresh(r => r + 1);

  return (
    <div>
      <Stats refresh={refresh} />
      <TaskForm onCreated={handleCreated} />
      <TaskList refresh={refresh} />
    </div>
  );
}