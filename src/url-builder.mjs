import {isUuid} from "uuidv4";

/**
 * @callback UrlBuilder
 * @param {{}} params
 * @return {string}
 */

/** @type {UrlBuilder} */
export const poliformatUrlBuilder = (params) => {
    /** @type {string} */
    const uuid = params.uid;

    // Validate the uuid
    if (!isUuid(uuid)) throw { statusCode: 400, statusMessage: '400 - The given UUID is not valid' };

    // Everything is fine, build the final URL
    return `https://poliformat.upv.es/access/calendar/opaq/${uuid}/main.ics`;
}

/** @type {UrlBuilder} */
export const intranetUrlBuilder = (params) => {
    /** @type {string} */
    const code = params.code;

    return `https://www.upv.es/ical/${code}`;
}
