// 0 (success): The process completed successfully.
// 1 (general error): The process encountered an error or failed to complete.
// 2 (invalid argument): The process received an invalid argument.
// 3 (fatal error): The process encountered a fatal error.
// 4 (internal error): The process encountered an internal error.
// 5 (unknown error): The process encountered an unknown error.

var colors = require('colors/safe');

// ValidateInput class definition
class ValidateInput {
    // Constructor
    constructor(args) {
        this.validateInput(args);
    }

    // Function to validate input
    validateInput(args) {

        // Handle server and client
        // Server and client are not supported at the same time
        if (args.live && (args.connect || args['_'][0])) {
            console.log(colors.red("Error: You can't start a server and client at the same time. Kindly check and fix your inputs"));
            process.exit(2);
        }

        // 64 length string is considered a key not a connector
        if (args.connector && args.connector.length === 64) {
            console.log(colors.red("Error: --connector can not be of length 64, any string with length 64 is considered a public connection string internally"));
            process.exit(2);
        }

        // Restrict connector length to be at least 32 char long
        if (args.connector && args.connector.length < 32 && !args.force) {
            console.log(colors.red("Error: Custom connection strings should have a minimum length of 32 chars for security purposes. If you still wish to proceed use --force"));
            process.exit(2);
        }

        // Can't use two keys, can we?
        if (args.connect && args['_'][0]) {
            console.log(colors.red("Error: Lmao, are you trying to use two connection strings at once? "));
            process.exit(2);
        }

        // Throw error if specified connector is empty
        if (args.connector && typeof (args.connector) === "boolean") {
            console.log(colors.red("Error: You have specified an empty connection string."));
            process.exit(2);
        }

        // Port should be a number
        if (args.live && typeof (args.live) != "number") {
            console.log(colors.red(`Error: Given port is not a valid number.`));
            process.exit(2);
        }
        // Port should be a number
        // This if else because empty strings are falsy values, can also be replaced with args.hasOwnProperty("port")
        if (args.port) {
            if (typeof(args.port) !== "number") {
                console.log(colors.red(`Error: Given port is not a valid number.`));
                process.exit(2);
            }
        } else if (args.port === "") {
            console.log(colors.red(`Error: Given port is not a valid number.`));
            process.exit(2);
        }

        // Connection can not be public and use connector at the same time
        if (args.public && args.connector) {
            console.log(colors.red(`Error: --connector is not supported when the connection is public. Connection strings are generated randomly in public mode.`));
            process.exit(2);
        }
     

    }
}

module.exports = {ValidateInput};
