const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

function getToken() {
  return localStorage.getItem('quiz_token')
}

function setToken(token) {
  localStorage.setItem('quiz_token', token)
}

function clearToken() {
  localStorage.removeItem('quiz_token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { ...options.headers }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData) && !(options.body instanceof URLSearchParams)) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (res.status === 401) {
    clearToken()
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || 'Request failed')
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  getToken,
  setToken,
  clearToken,

  register(username, password) {
    return request('/auth/register', {
      method: 'POST',
      body: { username, password },
    })
  },

  login(username, password) {
    const form = new URLSearchParams()
    form.append('username', username)
    form.append('password', password)
    return request('/auth/login', {
      method: 'POST',
      body: form,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  },

  getNotes() {
    return request('/notes/')
  },

  getNote(topicId) {
    return request(`/notes/${topicId}`)
  },

  upsertNote(topicId, content) {
    return request(`/notes/${topicId}`, {
      method: 'PUT',
      body: { content },
    })
  },

  deleteNote(topicId) {
    return request(`/notes/${topicId}`, { method: 'DELETE' })
  },

  getProgress() {
    return request('/progress/')
  },

  toggleProgress(topicId) {
    return request('/progress/toggle', {
      method: 'POST',
      body: { topic_id: topicId },
    })
  },

  getQuestions() {
    return fetch(`${API_BASE}/questions/`).then(r => {
      if (!r.ok) throw new Error('Failed to fetch questions')
      return r.json()
    })
  },

  getTopics() {
    return fetch(`${API_BASE}/topics/`).then(r => {
      if (!r.ok) throw new Error('Failed to fetch topics')
      return r.json()
    })
  },

  submitExam(data) {
    return request('/exams/', {
      method: 'POST',
      body: data,
    })
  },

  getAnsweredQuestionIds() {
    return request('/exams/answered-question-ids')
  },

  getExamHistory() {
    return request('/exams/')
  },

  getExamStats() {
    return request('/exams/stats')
  },

  getExamDetail(attemptId) {
    return request(`/exams/${attemptId}`)
  },

  getWeakQuestions() {
    return request('/exams/weak-questions')
  },

  createSharedExam(data) {
    return request('/shared-exams/', {
      method: 'POST',
      body: data,
    })
  },

  getSharedExams() {
    return request('/shared-exams/')
  },

  getSharedExam(id) {
    return request(`/shared-exams/${id}`)
  },

  getFlashcardStates() {
    return request('/flashcards/states')
  },

  syncFlashcardStates(states) {
    return request('/flashcards/states', {
      method: 'PUT',
      body: { states },
    })
  },
}
