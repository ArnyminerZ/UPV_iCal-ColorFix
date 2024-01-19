import startServer from '../src/server.mjs';
import {httpGet, overrideGet, resetGet} from "../src/request-utils.mjs";
import {__dirname} from "./utils.js";

import packageJson from "../package.json" assert { type: "json" };

import {expect} from "chai";
import ical from 'node-ical';
import fs from "node:fs";
import path from "node:path";

const samplesDir = path.join(__dirname, '..', 'sample');

describe('iCal output test', function () {
    let server;
    before('Start server', function () {
        server = startServer(3000);
    });
    it('Check version', async function () {
        const result = await httpGet('http://localhost:3000/version');
        expect(result).to.be.equal(packageJson.version);
    });
    it('Check has color', async function () {
        const data = fs.readFileSync(path.join(samplesDir, 'sample-invalid-ical.ics'));
        overrideGet(() => new Promise((resolve) => resolve(data)));
        const url = 'http://localhost:3000/intranet/1234';

        const ics = await httpGet(url);
        const response = await ical.async.parseICS(ics);
        const events = Object.values(response);
        for (/** @type {import('node-ical').VEvent} */ const event of events) {
            if (event.type !== 'VEVENT') continue;
            // Check that the event has a color
            expect(event.color)
                .to.not.be.null
                .and.not.be.undefined;
        }
    });
    it('Check PoliformaT UUID', async function () {
        const invalidUrl = 'http://localhost:3000/poliformat/1234';
        /** @type {HttpError|null} */
        let error = null;
        try {
            const result = await httpGet(invalidUrl);
            console.info('Result:', result);
        } catch (e) {
            error = e;
        }
        expect(error?.statusCode).to.be.equal(400);
        expect(error?.body).to.be.equal('400 - The given UUID is not valid');
    });
    it('Check prefix', async function () {
        const data = fs.readFileSync(path.join(samplesDir, 'sample-ical.ics')).toString();
        overrideGet(() => new Promise((resolve) => resolve(data)));
        const url = 'http://localhost:3000/intranet/1234?prefix=🙂';

        const ics = await httpGet(url);
        const response = await ical.async.parseICS(ics);
        const events = Object.values(response);
        /** @type {import('node-ical').VEvent} */
        const event = events[0];
        expect(event.summary).to.be.equal('🙂 XXXX');
    });
    afterEach('Reset overwrites', function () {
        resetGet();
    });
    after('Stop server', function () {
        server?.close();
    });
});
