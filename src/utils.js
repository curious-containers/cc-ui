/*
  HTTP Helper especially for XNAT

  From https://github.com/github/fetch
 */

import _ from 'lodash';


// Parameter --------------------------------------------------

// From http://www.2ality.com/2016/05/six-nifty-es6-tricks.html
export function mandatory() {
  throw new Error('Missing parameter');
}


// Collection Handling ----------------------------------------

/**
 * Returns and object with renamed keys
 * @param  {Object} object  Original object
 * @param  {Object} map    Map with the renamings
 * @return {Object}      new objects
 *
 * `rename({a:1, b:2}, {b:'c'}) -> {a:1, c:2}`
 */
export function rename(object = {}, map = {}) {
  return _.mapKeys(object, (value, key) => map[key] || key);
  // with renaming
  // return _.mapKeys(object, (value, key) => (object[map[key]] ? `${map[key]}_${key}` : map[key]) || key);
}


// Time -------------------------------------------------------

// Format dd/mm/yy, e.g. 01/01/14
export function getFormattedDate() {
  const date = new Date();
  const day = (date.getDate() < 10 ? '0' : '') + date.getDate();
  const month = (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1);
  const year = date.getYear() - 100;
  return `${day}/${month}/${year}`;
}

export function fromMongoDate(timestamp) {
  if (!timestamp) return '/';
  return new Date(timestamp * 1000).toLocaleString();
}


// Text -------------------------------------------------------

const elem = window.document.createElement('textarea');
export function decodeHtmlEntities(html) {
  elem.innerHTML = html;
  return elem.value;
}


// Enums -------------------------------------------------------
// From https://gist.github.com/oriSomething/16a16d8ea12573307dc6

export function enumNumber(...params) {
  return Object.freeze(_.mapValues(_.invert(params), Number));
}

export function enumString(...params) {
  return Object.freeze(_.mapKeys(params));
}
