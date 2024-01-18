/**
 * Fixes the invalid iCal sources that contain the `UPV_BGCOLOR` and `UPV_FGCOLOR` fields.
 * @param {string} original The original string.
 * @returns {string}
 */
export const fix = (original) => original
    // Replace UPV_BGCOLOR by COLOR
    .replaceAll('UPV_BGCOLOR', 'COLOR')
    // Remove fields with UPV_FGCOLOR
    .replaceAll(/UPV_FGCOLOR:.*\r?\n|\r/g, '');

/**
 * Converts the given content from HTML to Markdown.
 * Supported features:
 * - Bold (`<b></b>`)
 * - Line breaks (`<br/>`)
 * @param {string} original
 * @returns {string}
 */
export const convertMarkdown = (original) => original
    // Replace bold HTML annotations to Markdown
    .replace(/(<b>)|(<\/b>)/gm, '**')
    // Replace HTML line-break annotations to \n
    .replace(/<br\/?>/gm, '\\n');
