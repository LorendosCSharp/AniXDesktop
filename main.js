const { app, BrowserWindow, net, globalShortcut } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let nextServer;
const PORT = process.env.PORT || 3000;
const SERVER_URL = `http://localhost:${PORT}`;
const LOADING_FILE = path.join(__dirname, 'public', 'loading.html');
let menuVisibility = false;

function getIconPath() {
    const iconName = process.platform === 'win32' ? 'app.ico'
        : process.platform === 'darwin' ? 'app.icns'
            : 'app.png';
    return path.join(__dirname, 'public', 'icons', iconName);
}

function createWindow() {
    console.log('Creating browser window...');

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

    mainWindow.fullScreen = true
    globalShortcut.register('CommandOrControl+D', () => {
        if (mainWindow) {
            menuVisibility = !menuVisibility;
            mainWindow.setMenuBarVisibility(menuVisibility);
        }
    });


    // First show loading screen
    mainWindow.loadFile(LOADING_FILE)
        .then(() => {
            console.log('Loading screen shown');
            mainWindow.show();

            // Then check server status
            checkServerAndLoadApp();
        })
        .catch(err => {
            console.error('Failed to load loading screen:', err);
        });
}

function checkServerAndLoadApp() {
    const request = net.request(SERVER_URL);
    console.log("trying to do something")
    request.on('response', () => {
        request.abort();
        console.log('Server ready, loading main app...');
        loadMainApp();
    });
    request.on('error', () => {
        request.abort();
        console.log('Server not ready yet, retrying...');
        setTimeout(checkServerAndLoadApp, 500);
    });
    request.end();
}

function loadMainApp() {
    mainWindow.loadURL(SERVER_URL)
        .then(() => {
            console.log('Main app loaded successfully');
        })
        .catch(err => {
            console.error('Failed to load main app:', err);
            // Show error to user or retry
            mainWindow.webContents.send('load-error', err.message);
        });
}

function startNextServer() {
    const command = app.isPackaged ? 'start' : 'dev';
    console.log(`Starting Next.js server: npm run ${command}`);

    nextServer = spawn(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['run', command, '--', '-p', PORT],
        {
            cwd: path.resolve(__dirname),
            shell: true,
            env: { ...process.env, PORT },
            stdio: 'inherit',
        }
    );

    nextServer.on('error', (err) => {
        console.error('Failed to start server:', err);
    });

    nextServer.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
        if (code !== 0) {
            console.error('Server failed to start properly');
        }
    });
}

app.whenReady().then(() => {
    console.log('App is ready');
    createWindow();
    startNextServer();
});

app.on('window-all-closed', () => {
    if (nextServer) {
        console.log('Terminating Next.js server...');
        nextServer.kill();
    }
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});