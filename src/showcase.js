'use strict'

export const GIT_URL = 'https://git.trapti.tech'
const PUBLIC_DOMAIN = '.trap.show'

const colors = {
  'Succeeded': 'success',
  'running': 'success',
  'static serving': 'info',
  'deploying': 'warning'
}
export const statusColor = (prefix, status) => [prefix, colors[status] || 'danger'].join('-')

export const printPort = expose => {
  if (!expose) {
    expose = []
  }
  if (!Array.isArray(expose)) {
    expose = [expose]
  }
  if (!expose.length) {
    return '-'
  }
  return expose.map(e => `${e}/tcp`).join(', ')
}

export const printHostname = app => {
  const name = app.repo.toLowerCase().split('/').reverse().join('.') + PUBLIC_DOMAIN
  if (app.branch !== 'master') {
    return `${app.branch}.${name}`
  }
  return name
}

const qs = obj =>
  Object.entries(obj)
  .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(v)).join('&')

export const API = (api, query) =>
  fetch(`/api/${api}?${qs(query)}`, {credentials: 'include'})
  .then(resp => Promise.all([
    resp.ok,
    /json/i.test(resp.headers.get('content-type')) ? resp.json() : resp.text()
  ]))
