import express from 'express';
import https from 'https';

import {fix} from "./parser.mjs";

import packageJson from "../package.json" assert { type: "json" };

const app = express();

const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function (port = 80) {
    app.get('/version', (req, res) => {
        res.status(200).send(packageJson.version);
    });

    app.get('*', (req, res) => {
        // Take from 1 since all paths start with /
        const path = req.path.substring(1);
        if (!path.startsWith('https'))
            return res.status(405).send('405 - https must be used');
        if (!urlPattern.test(path))
            return res.status(400).send('400 - The given path is not an URL');
        https.get(path, {}, response => {
            let data = [];

            response.on('data', chunk => data.push(chunk));
            response.on('end', () => {
                const original = data.join('');
                let formattedData = fix(original);
                formattedData = formattedData
                    // Replace bold HTML annotations to Markdown
                    .replace(/(<b>)|(<\/b>)/gm, '**')
                    // Replace HTML line-break annotations to \n
                    .replace(/<br\/?>/gm, '\\n');
                res.status(response.statusCode).send(formattedData);
            });
        });
    });

    return app.listen(port, () => {
        console.info(`Listening for requests on http://localhost:${port}`);
    });
}
