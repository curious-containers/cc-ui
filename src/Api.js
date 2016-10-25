import * as http from './http';
import events from './Events.js';
import { host } from './config.js';

const tokenName = 'cc-token';

export const states = {
  CREATED: 0,
  WAITING: 1,
  PROCESSING: 2,
  SUCCESS: 3,
  FAILED: 4,
  CANCELLED: 5,
};

export const stateIDs = ['CREATED', 'WAITING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED'];

export const stateToClass = ['text-info', 'text-info', 'text-info', 'text-success', 'text-error', 'text-info'];

export class Api {

  constructor() {
    this.on = events.on;
    this.host = host || `${window.location.origin}/cc`;

    this.get = (url, options = {}) => http.get(url, Object.assign(options, getAuthHeaders()));
    this.post = (url, options = {}) => http.post(url, Object.assign(options, getAuthHeaders()));
    this.put = (url, options = {}) => http.put(url, Object.assign(options, getAuthHeaders()));
    this.del = (url, options = {}) => http.del(url, Object.assign(options, getAuthHeaders()));
  }

  login(username, password) {
    if (!username || !password) {
      throw new Error('Missing one or more parameter.');
    }

    const headers = getAuthHeaders(`${username}:${password}`);

    return http.get(`${this.host}/token`, headers)
      .then((json) => {
        localStorage.setItem(tokenName, `${username}:${json.token}`);
        return this;
      });
  }

  logout() {
    localStorage.removeItem(tokenName);
    events.emit('sessionEnded');
  }

  checkLogin() {
    return this.get(`${this.host}/`)
      .then(() => true, () => false);
  }

  getTaskGroups(payload) {
    return this.post(`${this.host}/task-groups/query`, { body: JSON.stringify(payload) });
  }

  getTasks(payload) {
    return this.post(`${this.host}/tasks/query`, { body: JSON.stringify(payload) });
  }

  getApplicationContainers(payload) {
    return this.post(`${this.host}/application-containers/query`, { body: JSON.stringify(payload) });
  }

  getDataContainers(payload) {
    return this.post(`${this.host}/data-containers/query`, { body: JSON.stringify(payload) });
  }

}

function getAuthHeaders(credentials) {
  const auth = window.btoa(credentials || localStorage.getItem(tokenName));
  return {
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
  };
}

export const api = new Api(); // Singleton

export default api;
