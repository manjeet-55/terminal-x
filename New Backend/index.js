#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2)); // Required to parse CLI arguments
const goodbye = require('graceful-goodbye');
const pkg = require('./package.json'); // Holds info about the current package

var colors = require('colors/safe');

// Require all necessary files
const Client = require('./includes/client.js');
const Server = require('./includes/server.js');
const { ValidateInput } = require('./includes/validateInput.js');

// Validate every input and throw errors if incorrect input
const validator = new ValidateInput(argv);

// WebSocket server and other related modules
const WebSocket = require('ws');
const os = require('os');
const pty = require('node-pty');

// Function to start WebSocket server
const startWebSocketServer = (port) => {
    const wss = new WebSocket.Server({ port });

    console.log("Socket is up and running...");

    // Determine the shell to use based on the operating system
    const shell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

    wss.on('connection', function(ws) {
        console.log("New session");

        // Spawn a pseudo-terminal process for each WebSocket connection
        const ptyProcess = pty.spawn(shell, [], {
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
                const parsedMessage = JSON.parse(message);

                // Extract the command from the parsed message
                const command = parsedMessage.command;

                if (command) {
                    const processedCommand = commandProcessor(command);
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
            const processedOutput = outputProcessor(rawOutput);
            ws.send(processedOutput);
            console.log("Sent to client:", processedOutput);
        });

        // Handle WebSocket close event
        ws.on('close', function() {
            ptyProcess.kill();
        });
    });

    // Function to process commands (currently just passes through)
    const commandProcessor = function(command) {
        return command;
    };

    // Function to process output (currently just passes through)
    const outputProcessor = function(output) {
        return output;
    };
};

// Set a port live
if (argv.live) {
    startWebSocketServer(argv.live);

    const options = {
        port: argv.live,
        host: argv.host,
        connector: argv.connector,
        public: argv.public,
        service: "Server"
    };
    const server = new Server(options);
    server.start();
    goodbye(async () => {
        await server.destroy();
    });

} else if (argv.connect || argv['_'][0]) { // Establish connection with a peer
    const keyInput = argv.connect || argv['_'][0];
    const options = {
        port: argv.port || 8989,
        host: argv.host || '127.0.0.1',
        connector: argv.connector
    };
    const client = new Client(keyInput, options);
    client.start();
} else { // Default if no correct option is chosen
    console.log(colors.red(`Error: Invalid or Incorrect arguments specified.`));
    process.exit(2);
}
