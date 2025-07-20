// production-server.js
const next = require('next');
const http = require('http');
const log = require('electron-log');
const app = next({ dev: false });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 4257;

app.prepare().then(() => {
    http.createServer((req, res) => {
        handle(req, res);
    }).listen(PORT, () => {
        log.log(`✅ Next.js app ready on http://localhost:${PORT}`);
    });
});
