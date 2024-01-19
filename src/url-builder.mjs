import {isUuid} from "uuidv4";

/**
 * @callback UrlBuilder
 * @param {{}} params
 * @return {string}
 */

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
    return `https://poliformat.upv.es/access/calendar/opaq/${uuid}/main.ics`;
}

/**
 * @type {UrlBuilder}
 * @readonly
 */
export let intranetUrlBuilder = (params) => {
    /** @type {string} */
    const code = params.code;

    return `https://www.upv.es/ical/${code}`;
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
