const API_URL = 'https://pw-p-lab-gestor-de-tarefas-pessoal.vercel.app/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem('token');
    window.location.reload();
    return {};
  }
  return res.json();
};

export const register = (data) =>
  fetch(`${API_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const login = (data) =>
  fetch(`${API_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());

export const getTasks = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return fetch(`${API_URL}/tasks?${params}`, { headers: headers() }).then(handleResponse);
};

export const createTask = (data) =>
  fetch(`${API_URL}/tasks`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const updateTask = (id, data) =>
  fetch(`${API_URL}/tasks/${id}`, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE', headers: headers() }).then(handleResponse);

export const getStats = () =>
  fetch(`${API_URL}/tasks/stats`, { headers: headers() }).then(handleResponse);