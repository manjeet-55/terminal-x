var WebSocket = require('ws');
var os = require('os');
var pty = require('node-pty');

// WebSocket server setup
var wss = new WebSocket.Server({ port: 6060 });

console.log("Socket is up and running...");

// Determine the shell to use based on the operating system
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';
// Spawn a pseudo-terminal process
var ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 120,
    rows: 80,
    // cwd: process.env.HOME,
    // env: process.env
});

// WebSocket server connection handling
wss.on('connection', function(ws) {
    console.log("New session");

    // Handle incoming commands from the frontend
    ws.on('message', function(command) {
        var processedCommand = commandProcessor(command);
        ptyProcess.write(processedCommand + '\r'); // Added '\r' for Windows compatibility
    });

    // Handle output from the pseudo-terminal process
    ptyProcess.on('data', function(rawOutput) {
        var processedOutput = outputProcessor(rawOutput);
        ws.send(processedOutput);
        console.log("Sent to client:", processedOutput);
    });
});

// Function to process commands (currently just passes through)
var commandProcessor = function(command) {
    return command;
};

// Function to process output (currently just passes through)
var outputProcessor = function(output) {
    return output;
};