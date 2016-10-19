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

export function fetch(input, options = {}) {
  options.mode = options.mode || 'cors';
  events.emit('request', input);

  return window.fetch(input, options)
    .then(response => response.json())
    .then(checkStatus);
}


// Private Methods --------------------------------------------

const states = {
  CREATED: 0,
  WAITING: 1,
  PROCESSING: 2,
  SUCCESS: 3,
  FAILED: 4,
  CANCELLED: 5,
};

function checkStatus(response) {
  if (response.description === 'User not authorized.') {
    events.emit('sessionEnded');
  }

  if (response.state === states.FAILED) {
    events.emit('error', response.description);
    return Promise.reject(response.description);
  }

  events.emit('response', response);
  return Promise.resolve(response);

}
