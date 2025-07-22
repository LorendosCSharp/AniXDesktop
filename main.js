const { app, BrowserWindow, net, globalShortcut } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const log = require('electron-log');

log.transports.file.format = '{h}:{i}:{s} {text}';
log.transports.file.streamConfig = { encoding: 'utf8' };

let mainWindow;
let nextServer;
const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const LOADING_FILE = path.join(__dirname, 'public', 'loading.html');
let menuVisibility = false;
const http = require('http');

function getIconPath() {
    const iconName = process.platform === 'win32' ? 'app.ico'
        : process.platform === 'darwin' ? 'app.icns'
            : 'app.png';
    return path.join(__dirname, 'public', 'icons', iconName);
}

function createWindow() {
    FLog('Creating browser window...');

    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        show: false,
        frame: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: getIconPath(),
    });

    mainWindow.fullScreen = true;

    globalShortcut.register('CommandOrControl+D', () => {
        if (mainWindow) {
            menuVisibility = !menuVisibility;
            mainWindow.setMenuBarVisibility(menuVisibility);
        }
    });

    // Show loading screen first
    mainWindow.loadFile(LOADING_FILE)
        .then(() => {
            mainWindow.show();
            FLog('Loading screen shown');
            waitForServerAndLoadApp();
        })
        .catch(err => {
            FError('Failed to load loading screen:', err);
        });
}

function waitForServerAndLoadApp() {
    const request = net.request(SERVER_URL);
    request.on('response', () => {
        request.abort();
        FLog('Server ready, loading main app...');
        loadMainApp();
    });
    request.on('error', (e) => {
        request.abort();
        FWarn('Server not ready yet, retrying in 500ms...' + e);
        setTimeout(waitForServerAndLoadApp, 500);
    });
    request.end();
}

function loadMainApp() {
    if (!mainWindow) {
        FError('No main window to load app!');
        return;
    }
    mainWindow.loadURL(SERVER_URL)
        .then(() => {
            FLog('Main app loaded successfully');
        })
        .catch(err => {
            FError('Failed to load main app:', err);
            mainWindow.webContents.send('load-error', err.message);
        });
}
function FLog(logData) {
    log.info(logData)
}
function FError(logData) {
    log.error(logData)
}
function FWarn(logData) {
    log.warn(logData)
}

function isPortInUse(port, callback) {
    const req = http.request({ method: 'HEAD', host: 'localhost', port, timeout: 500 }, (res) => {
        callback(true);
    });

    req.on('error', () => callback(false));
    req.end();
}

function startNextServer() {
    isPortInUse(PORT, (inUse) => {
        if (inUse) {
            FWarn(`Port ${PORT} is already in use. Assuming server is already running.`);
            return;
        }

        const scriptToRun = app.isPackaged ? 'production-server.js' : 'next';
        const args = app.isPackaged ? [] : ['dev', '-p', PORT];
        const nodeBinary = !app.isPackaged ? process.execPath : 'node';

        FLog(`Starting Next.js server: next ${scriptToRun + args}`);

        try {
            nextServer = spawn(
                nodeBinary,
                [scriptToRun, ...args],
                {
                    cwd: path.resolve(__dirname),
                    shell: false,
                    stdio: ['ignore', 'pipe', 'pipe'],
                }
            );
        } catch (error) {
            FError(`Server couldn't start, caused by ${error}`);
        }

        nextServer.stdout.on('data', (data) => {
            FLog(`[Next.js stdout]: ${data.toString()}`);
        });

        nextServer.stderr.on('data', (data) => {
            FError(`[Next.js stderr]: ${data.toString()}`);
        });

        nextServer.on('error', (err) => {
            FError('Failed to start Next.js server:', err);
        });

        nextServer.on('exit', (code) => {
            FLog(`Next.js server process exited with code ${code}`);
            if (code !== 0) {
                FError('Next.js server failed to start properly');
            }
        });
    });
}

function killNextServer() {
    if (nextServer) {
        FLog("Killing Next.js server...");
        try {
            // Try a clean shutdown
            nextServer.kill('SIGTERM');

            // In case that doesn't work, force kill after delay
            setTimeout(() => {
                if (!nextServer.killed) {
                    FWarn("Next.js server didn't close, force killing...");
                    nextServer.kill('SIGKILL');
                }
            }, 3000);
        } catch (e) {
            FError(`Error while killing server: ${e}`);
        }
    }
}

app.whenReady().then(() => {
    FLog('App is ready');
    startNextServer();
    createWindow();
});

app.on('before-quit', () => {
    FLog("App quitting, killing server...");
    killNextServer();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

process.on("SIGINT", () => {
    FLog("SIGINT received");
    killNextServer();
    process.exit(0);
});

process.on("SIGTERM", () => {
    FLog("SIGTERM received");
    killNextServer();
    process.exit(0);
});
