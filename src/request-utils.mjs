import http from "http";
import https from "https";

/**
 * @callback HttpRequestFunction
 * Makes an HTTP request (must be https) to the given URL.
 * @param {string} url The URL to make the request to.
 * @returns {Promise<string>}
 */

/**
 * @typedef HttpError
 * @property {number} statusCode
 * @property {string} statusMessage
 * @property {string?} body
 */

/**
 * Makes an HTTP request (must be https) to the given URL.
 * The default behavior of the get function.
 * @param {string} url The URL to make the request to.
 * @throws {HttpError} If the server doesn't return a satisfying result.
 * @returns {Promise<string>}
 */
export function httpGet(url) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith("https:") ? https : http;
        protocol.get(url, {}, response => {
            let data = [];

            response.on('data', chunk => data.push(chunk));
            response.on('error', reject)
            response.on('end', () => {
                const statusCode = response.statusCode;
                const result = data.join('');
                if (statusCode >= 200 && statusCode < 300) {
                    resolve(result);
                } else {
                    reject({ statusCode, statusMessage: response.statusMessage, body: result });
                }
            });
        });
    });
}

/**
 * Makes an HTTP request (must be https) to the given URL.
 * @type {HttpRequestFunction}
 */
export let get = httpGet;

/**
 * Overwrites the default behavior of `get`.
 * @param {HttpRequestFunction} fun
 */
export function overrideGet(fun) { get = fun; }

export function resetGet() { get = httpGet; }
