/**
 * Fixes the invalid iCal sources that contain the `UPV_BGCOLOR` and `UPV_FGCOLOR` fields.
 * @param {string} original The original string.
 * @returns {string}
 */
export const fix = (original) => original
    // Replace UPV_BGCOLOR by COLOR
    .replaceAll('UPV_BGCOLOR', 'COLOR')
    // Remove fields with UPV_FGCOLOR
    .replaceAll(/UPV_FGCOLOR:#[\d(a-fA-F)]*\r?\n|\r/g, '');
