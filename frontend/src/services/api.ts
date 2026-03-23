import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: (username: string, preferred_language: string = 'python') => 
    api.post('/auth/login', { username, preferred_language }),
  getMe: (id: number) => api.get(`/auth/me/${id}`),
};

export const problemService = {
  list: () => api.get('/problems'),
  get: (id: number) => api.get(`/problems/${id}`),
};

export const sessionService = {
  start: (user_id: number, problem_id: number, language: string) => 
    api.post('/session/start', { user_id, problem_id, language }),
  getHint: (user_id: number, session_id: number, current_code: string) => 
    api.post('/session/hint', { user_id, session_id, current_code }),
  submit: (user_id: number, session_id: number, code: string) => 
    api.post('/session/submit', { user_id, session_id, code }),
};

export const memoryService = {
  list: (user_id: number) => api.get(`/memory/${user_id}`),
  summary: (user_id: number) => api.get(`/memory/summary/${user_id}`),
};

export default api;
