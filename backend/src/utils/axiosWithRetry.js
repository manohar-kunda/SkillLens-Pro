/**
 * -------------------------------------------------------
 * File: axiosWithRetry.js
 * Purpose: A resilient wrapper providing asynchronous retry policies
 * with exponential backoffs for network requests.
 *
 * Responsibilities:
 * - Executes Axios functions with a configurable attempt loop
 * - Handles 502/503 Render service cold starts and ECONNRESET timeouts
 * - Computes incremental delays to avoid overloading remote hosts
 *
 * Dependencies:
 * - axios
 *
 * Author: Manohar Kunda
 * -------------------------------------------------------
 */

const axios = require('axios');

/**
 * Wraps an axios call with exponential backoff retry logic.
 * Specifically handles 502 Bad Gateway from Render free-tier cold-starts.
 * 
 * @param {Function} axiosFn - async function that returns an axios promise
 * @param {number} [retries=3] - max number of retries
 * @param {number} [delayMs=5000] - initial delay in ms between retries (doubles each attempt)
 * @returns {Promise<any>} - The response of the Axios call
 * @throws {AxiosError} - If all retry attempts are exhausted
 */
const axiosWithRetry = async (axiosFn, retries = 3, delayMs = 5000) => {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await axiosFn();
        } catch (err) {
            const status = err.response?.status;
            // Retry on 502 (cold-start), 503 (unavailable), or ECONNRESET
            const isRetryable = status === 502 || status === 503 || err.code === 'ECONNRESET' || err.code === 'ECONNREFUSED';
            lastError = err;

            if (!isRetryable || attempt === retries) {
                throw err;
            }

            const waitMs = delayMs * attempt; // 5s, 10s, 15s
            console.log(`[AI Service] Attempt ${attempt} failed (${status || err.code}). Retrying in ${waitMs / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, waitMs));
        }
    }
    throw lastError;
};

module.exports = axiosWithRetry;
