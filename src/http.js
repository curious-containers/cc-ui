/*
  HTTP Helper especially for XNAT

  From https://github.com/github/fetch
 */

import 'whatwg-fetch';
import events from './Events.js';


// HTTP Methods -----------------------------------------------

export function get(input, options = {}) {
  options.method = 'GET';
  return fetch(input, options);
}

export function post(input, options = {}) {
  options.method = 'POST';
  return fetch(input, options);
}

export function put(input, options = {}) {
  options.method = 'PUT';
  return fetch(input, options);
}

export function del(input, options = {}) {
  options.method = 'DELETE';
  return fetch(input, options);
}


// The main fetch function ------------------------------------

const states = {
  CREATED: 0,
  WAITING: 1,
  PROCESSING: 2,
  SUCCESS: 3,
  FAILED: 4,
  CANCELLED: 5,
};

export function fetch(input, options = {}) {
  options.mode = options.mode || 'cors';
  events.emit('request', input);

  return window.fetch(input, options)
    .then(response => {
      switch (response.status) {
        case 200: return response.json();
        case 401: events.emit('sessionEnded'); break;
        default: Promise.reject(response);
      }
      return '{}'; // empty result
    })
    .then(json => {
      if (json.state === states.FAILED) {
        events.emit('error', json.description);
        return Promise.reject(json.description);
      }
      events.emit('response', json);
      return Promise.resolve(json);
    })
    .catch(error => {
      events.emit('error', error);
      return Promise.reject(error);
    });
}
