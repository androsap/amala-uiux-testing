/*
 * Dev-only proxy (dipakai `react-scripts start`).
 * Karena REACT_APP_API_ENDPOINT sekarang kosong (URL API jadi relatif), dev server
 * perlu meneruskan /amala, /api, /lms ke API gateway supaya request tidak nyasar
 * ke index.html. Di staging/production hal ini ditangani oleh nginx, bukan file ini.
 *
 * Override target: REACT_APP_API_PROXY_TARGET=https://host npm run start:staging
 */
const hpm = require('http-proxy-middleware');
const createProxy = hpm.createProxyMiddleware || hpm;

const TARGET =
    process.env.REACT_APP_API_PROXY_TARGET ||
    'https://amala-api-pdt.garuda-indonesia.com';

module.exports = function (app) {
    app.use(
        ['/amala', '/api', '/lms'],
        createProxy({
            target: TARGET,
            changeOrigin: true,
            secure: false,
        })
    );
};
