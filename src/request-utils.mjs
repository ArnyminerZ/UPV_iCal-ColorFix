import https from "https";

/**
 * Makes an HTTP request (must be https) to the given URL.
 * @param {string} url The URL to make the request to.
 * @returns {Promise<string>}
 */
export function get(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {}, response => {
            let data = [];

            response.on('data', chunk => data.push(chunk));
            response.on('error', reject)
            response.on('end', () => {
                const statusCode = response.statusCode;
                if (statusCode > 200 && statusCode < 300)
                    return reject({ statusCode, statusMessage: response.statusMessage });
                const original = data.join('');
                resolve(original);
            });
        });
    });
}
