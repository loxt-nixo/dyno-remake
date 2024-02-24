const global = require('./Logs.js');

module.exports = () => {

    // Crtl + C
    process.on('SIGINT', () => {
        console.log();
        global.error('SIGINT: Closing database and exiting...');
        process.reallyExit(1);
    });

    // Standard crash
    process.on('uncaughtException', (err) => {
        global.error(`UNCAUGHT EXCEPTION: ${err.stack}`);
    });

    // Killed process
    process.on('SIGTERM', () => {
        global.error('SIGTERM: Closing database and exiting...');
        process.reallyExit(1);
    });

    // Standard crash
    process.on('unhandledRejection', (err) => {
        global.error(`UNHANDLED REJECTION: ${err.stack}`);
    });

    // Deprecation warnings
    process.on('warning', (warning) => {
        global.warn(`WARNING: ${warning.name} : ${warning.message}`);
    });

    // Reference errors
    process.on('uncaughtReferenceError', (err) => {
        global.error(err.stack);
    });

};
