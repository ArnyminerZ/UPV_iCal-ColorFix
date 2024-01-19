import express from 'express';

import {convertMarkdown, fix} from "./parser.mjs";

import packageJson from "../package.json" assert { type: "json" };
import {get} from "./request-utils.mjs";
import {
    intranetUrlBuilder,
    intranetUrlPrefix,
    intranetUrlSuffix,
    poliformatUrlBuilder,
    poliformatUrlPrefix,
    poliformatUrlSuffix
} from "./url-builder.mjs";

const app = express();

/**
 * @callback UrlBuilder
 * @param {{}} params
 * @return {string}
 */

/**
 * Fetches the data from the URL given, fixes it, converts to markdown, and sends the response.
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {UrlBuilder} urlBuilder
 * @returns {Promise<void>}
 */
async function fetchAndRespond(
    request,
    response,
    urlBuilder
) {
    try {
        const url = urlBuilder(request.params);
        const data = await get(url);
        const fixedData = fix(data);
        const markdown = convertMarkdown(fixedData);
        response
            // Set status to success
            .status(200)
            // Set content type to calendar
            .setHeader('Content-Type', 'text/calendar')
            // Send the data
            .send(markdown);
    } catch (e) {
        if (e.hasOwnProperty('statusCode')) {
            const status = e['statusCode'];
            const message = e['statusMessage'] ?? status;
            response.status(status).send(message);
        } else {
            response.status(500).send(e);
        }
    }
}

export default function (port = 80) {
    app.get('/version', (req, res) => {
        res.status(200).send(packageJson.version);
    });

    app.get('/poliformat/:uid', async (request, response) => {
        await fetchAndRespond(request, response, poliformatUrlBuilder);
    });
    app.get('/intranet/:code', async (request, response) => {
        await fetchAndRespond(request, response, intranetUrlBuilder);
    });

    app.get('*', (req, response) => {
        // Take from 1 since all paths start with /
        const path = req.path.substring(1);
        const url = new URL(path);
        if (!url.hostname.includes('upv.es')) {
            response.status(400).send('400 - Invalid request. Forbidden domain');
        } else if (path.length <= 0) {
            response.status(400).send('400 - Invalid request. Empty URL');
        } else if (url.hostname === 'poliformat.upv.es') {
            const uid = path.replace(poliformatUrlPrefix, '').replace(poliformatUrlSuffix, '');
            response.redirect(`/poliformat/${uid}`);
        } else if (url.hostname === 'upv.es' || url.hostname === 'www.upv.es') {
            const code = path.replace(intranetUrlPrefix, '').replace(intranetUrlSuffix, '');
            response.redirect(`/intranet/${code}`);
        } else {
            response.status(400).send('400 - Invalid request. Unknown URL');
        }
    });

    return app.listen(port, () => {
        console.info(`Listening for requests on http://localhost:${port}`);
    });
}
