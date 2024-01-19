/**
 * Takes the given ics data, and prefixes every event with the prefix given.
 * Then return the new data.
 * @param {string} ics
 * @param {string} prefix
 * @return {string}
 */
export function prefixEvents(ics, prefix) {
    const lines = ics.split('\n');
    for (let c = 0; c < lines.length; c++) {
        let line = lines[c];
        if (line.toUpperCase().startsWith('SUMMARY')) {
            // Take from position 8 since "SUMMARY:" has length 8
            const value = line.substring(8);
            line = `SUMMARY:${prefix} ${value}`;
        }
        lines[c] = line;
    }
    return lines.join('\n');
}
