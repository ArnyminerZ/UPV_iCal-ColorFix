import fs from "node:fs";
import path from "node:path";
import ical from "node-ical";
import {expect} from "chai";

import {__dirname} from "./utils.js";
import {prefixEvents} from "../src/event-modifier.js";

const samplesDir = path.join(__dirname, '..', 'sample');

describe('Test Event Modifiers', function () {
    it('Event prefixing', function () {
        const data = fs.readFileSync(path.join(samplesDir, 'sample-ical.ics')).toString();
        const ics = prefixEvents(data, '🙂');
        console.log('ics:', ics);
        const response = ical.sync.parseICS(ics);
        const events = Object.values(response);
        /** @type {import('node-ical').VEvent} */
        const event = events[0];
        expect(event.summary).to.be.equal('🙂 XXXX');
    });
});
