// @flow
require("isomorphic-fetch");

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
const parseJSON = async response => response.json();

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) return response;

  const error: Error & { response?: Response } = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
const request = async (url: string, options?: RequestOptions) =>
  fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);

type DelayedRequest<T> = string => Promise<T>;
const delayedRequest: DelayedRequest<*> = async url =>
  new Promise(resolve => setTimeout(() => resolve(request(url)), 250));

module.exports = { request, delayedRequest };