import {isUuid} from "uuidv4";

/**
 * @callback UrlBuilder
 * @param {{}} params
 * @return {string}
 */

export const poliformatUrlPrefix = 'https://poliformat.upv.es/access/calendar/opaq/';
export const poliformatUrlSuffix = '/main.ics';

export const intranetUrlPrefix = 'https://www.upv.es/ical/';
export const intranetUrlSuffix = '';

function buildUrl(prefix, suffix, value) {
    return prefix + value + suffix
}

/**
 * @type {UrlBuilder}
 * @readonly
 */
export let poliformatUrlBuilder = (params) => {
    /** @type {string} */
    const uuid = params.uid;

    // Validate the uuid
    if (!isUuid(uuid)) throw { statusCode: 400, statusMessage: '400 - The given UUID is not valid' };

    // Everything is fine, build the final URL
    return buildUrl(poliformatUrlPrefix, poliformatUrlSuffix, uuid);
}

/**
 * @type {UrlBuilder}
 * @readonly
 */
export let intranetUrlBuilder = (params) => {
    /** @type {string} */
    const code = params.code;

    return buildUrl(intranetUrlPrefix, intranetUrlSuffix, code)
}

/**
 * Updates the Poliformat URL builder to be used.
 * @param {UrlBuilder} fun
 */
export function overwritePoliformat(fun) {
    poliformatUrlBuilder = fun;
}

/**
 * Updates the Intranet URL builder to be used.
 * @param {UrlBuilder} fun
 */
export function overwriteIntranet(fun) {
    intranetUrlBuilder = fun;
}
