import axios from 'axios'
import { io } from 'socket.io-client'

const api = axios.create()
const sockets = {}

function normalizeError(error) {
  if (error.response) {
    const { status, data } = error.response
    const message = (data && (data.message || data.error)) || error.response.statusText || 'An error occurred'
    const err = new Error(message)
    err.status = status
    err.data = data
    throw err
  } else {
    throw new Error(error.message || 'Network Error')
  }
}

export function initApi(baseUrl) {
  api.defaults.baseURL = baseUrl
}

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

export async function signupUser(data) {
  try {
    const res = await api.post('/auth/signup', data)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function loginUser(data) {
  try {
    const res = await api.post('/auth/login', data)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function resetPassword(email) {
  try {
    const res = await api.post('/auth/reset-password', { email })
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function fetchProjects() {
  try {
    const res = await api.get('/projects')
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function createProject(name, options = {}) {
  try {
    const res = await api.post('/projects', { name, ...options })
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function fetchBlueprint(projectId, blueprintId) {
  try {
    const res = await api.get(`/projects/${projectId}/blueprints/${blueprintId}`)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function generateBlueprint(params) {
  try {
    const res = await api.post('/blueprints/generate', params)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function saveBlueprint(projectId, blueprintData) {
  try {
    const { id, ...rest } = blueprintData
    const res = await api.put(`/projects/${projectId}/blueprints/${id}`, rest)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function getVersionHistory(projectId, blueprintId) {
  try {
    const res = await api.get(`/projects/${projectId}/blueprints/${blueprintId}/versions`)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function rollbackVersion(projectId, blueprintId, versionId) {
  try {
    const res = await api.post(`/projects/${projectId}/blueprints/${blueprintId}/versions/${versionId}/rollback`)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function exportBlueprint(format, options = {}) {
  try {
    const res = await api.post('/blueprints/export', { format, ...options })
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function getUserProfile() {
  try {
    const res = await api.get('/user/profile')
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export async function updateUserSettings(settings) {
  try {
    const res = await api.put('/user/settings', settings)
    return res.data
  } catch (error) {
    normalizeError(error)
  }
}

export function subscribeToCollaboration(sessionId, callbacks = {}) {
  const url = api.defaults.baseURL
  let socket = sockets[sessionId]
  if (!socket) {
    socket = io(url, {
      path: '/collaboration',
      query: { sessionId }
    })
    sockets[sessionId] = socket
  }
  if (callbacks.onConnect) socket.on('connect', callbacks.onConnect)
  if (callbacks.onDisconnect) socket.on('disconnect', callbacks.onDisconnect)
  if (callbacks.onError) socket.on('error', callbacks.onError)
  if (callbacks.onMessage) socket.on('message', callbacks.onMessage)
  if (callbacks.onUpdate) socket.on('update', callbacks.onUpdate)
  return socket
}

export function unsubscribeFromCollaboration(sessionId) {
  const socket = sockets[sessionId]
  if (socket) {
    socket.removeAllListeners()
    socket.disconnect()
    delete sockets[sessionId]
  }
}