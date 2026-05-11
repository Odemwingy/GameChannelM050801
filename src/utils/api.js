const BASE = '/api/v1'

function getToken() {
  return localStorage.getItem('ife_token') || ''
}

function headers(hasBody) {
  const h = {}
  if (hasBody) h['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

async function request(method, path, body) {
  const url = `${BASE}${path}`
  const opts = { method, headers: headers(!!body) }
  if (body) opts.body = JSON.stringify(body)

  console.log(`[api] ${method} ${url}`)
  const res = await fetch(url, opts)
  const json = await res.json()
  console.log(`[api] ${res.status}:`, json)

  if (!res.ok) {
    const err = new Error(json.message || `HTTP ${res.status}`)
    err.code = json.code
    err.status = res.status
    throw err
  }

  return json.data
}

export function apiGet(path) {
  return request('GET', path)
}

export function apiPost(path, body) {
  return request('POST', path, body)
}

export function apiDelete(path) {
  return request('DELETE', path)
}
