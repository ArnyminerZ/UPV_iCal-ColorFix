import express from 'express';
import https from 'https';

import {fix} from "./parser.mjs";

const app = express();

const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

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
            let formattedData = fix(data.join(''));
            formattedData = formattedData
                // Replace bold HTML annotations to Markdown
                .replace(/(<b>)|(<\/b>)/gm, '**')
                // Replace HTML line-break annotations to \n
                .replace(/<br\/?>/gm, '\n');
            res.status(response.statusCode).send(formattedData);
        });
    });
});

app.listen(80, () => {
    console.info('Listening for requests on http://localhost:80');
});
