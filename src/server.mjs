import express, {response} from 'express';
import { isUuid } from 'uuidv4';

import {convertMarkdown, fix} from "./parser.mjs";

import packageJson from "../package.json" assert { type: "json" };
import {get} from "./request-utils.mjs";

const app = express();

/**
 * Fetches the data from the URL given, fixes it, converts to markdown, and sends the response.
 * @param {string} url
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
async function fetchAndRespond(url, response) {
    try {
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
            const message = e['statusMessage'];
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

    app.get('/poliformat/:uid', async (req, response) => {
        const params = req.params;
        /** @type {string} */
        const uuid = params.uid;

        // Validate the uuid
        if (!isUuid(uuid))
            return response.status(400).send('400 - The given UUID is not valid');

        const url = `https://poliformat.upv.es/access/calendar/opaq/${uuid}/main.ics`;
        await fetchAndRespond(url, response);
    });
    app.get('/intranet/:code', async (req, response) => {
        const params = req.params;
        /** @type {string} */
        const code = params.code;

        const url = `https://www.upv.es/ical/${code}`;
        await fetchAndRespond(url, response);
    });

    app.get('*', (req, response) => {
        // Take from 1 since all paths start with /
        const path = req.path.substring(1);
        if (path.startsWith('https://poliformat.upv.es')) {
            const uid = path.substring(47).replace('/main.ics', '');
            response.redirect(`/poliformat/${uid}`);
        } else if (path.startsWith('https://www.upv.es')) {
            const code = path.substring(24);
            response.redirect(`/intranet/${code}`);
        } else {
            if (path.length <= 0)
                response.status(400).send('400 - Invalid request. Empty URL');
            else
                response.status(400).send('400 - Invalid request. Unknown URL');
        }
    });

    return app.listen(port, () => {
        console.info(`Listening for requests on http://localhost:${port}`);
    });
}
