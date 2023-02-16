import startServer from '../src/server.mjs';

import ical from 'node-ical';
import {expect} from "chai";

describe('iCal output test', function () {
    let server;
    before('Start server', function () {
        server = startServer(3000);
    });
    it('Check has color', async function () {
        const url = 'http://localhost:3000/https://raw.githubusercontent.com/ArnyminerZ/UPV_iCal-ColorFix/master/sample/sample-invalid-ical.ics';

        const events = await ical.async.fromURL(url);
        for (const event of Object.values(events)) {
            if (event.type !== 'VEVENT') continue;
            // Check that the event has a color
            expect(event.color).to.not.be.null.and.not.be.undefined;
        }
    });
    after('Stop server', function () {
        server?.close();
    });
});
