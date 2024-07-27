var WebSocket = require('ws');
var os = require('os');
var pty = require('node-pty');

// WebSocket server setup
var wss = new WebSocket.Server({ port: 6060 });

console.log("Socket is up and running...");

// Determine the shell to use based on the operating system
var shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

wss.on('connection', function(ws) {
    console.log("New session");

    // Spawn a pseudo-terminal process for each WebSocket connection
    var ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: 120,
        rows: 100,
        cwd: process.env.HOME,
        env: process.env
    });

    // Handle incoming commands from the frontend
    ws.on('message', function(message) {
        try {
            // Parse the incoming message as JSON
            var parsedMessage = JSON.parse(message);

            // Extract the command from the parsed message
            var command = parsedMessage.command;

            if (command) {
                var processedCommand = commandProcessor(command);
                ptyProcess.write(processedCommand + '\r');
            } else {
                console.error("Command not found in message:", parsedMessage);
            }
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });

    // Handle output from the pseudo-terminal process
    ptyProcess.on('data', function(rawOutput) {
        var processedOutput = outputProcessor(rawOutput);
        ws.send(processedOutput);
        console.log("Sent to client:", processedOutput);
    });

    // Handle WebSocket close event
    ws.on('close', function() {
        ptyProcess.kill();
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
