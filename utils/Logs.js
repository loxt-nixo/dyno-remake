const { inspect } = require('node:util');

const color = {
    red: '\x1b[31m',
    orange: '\x1b[38;5;202m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
}

function getTimestamp() {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function parse(message) {
    const properties = inspect(message, { depth: 3 });

    const regex = /^\s*["'`](.*)["'`]\s*\+?$/gm;

    const response = [];
    for (const line of properties.split('\n')) {
        response.push( line.replace(regex, '$1') );
    }

    return response.join('\n');
}

function info(message) {
    console.log(`${color.yellow}[${getTimestamp()}]${color.reset} ${parse(message)}`);
}

function warn(message) {
    console.log(`${color.orange}[${getTimestamp()}]${color.reset} ${parse(message)}`);
}

function error(message) {
    console.log(`${color.red}[${getTimestamp()}] ${parse(message)}${color.reset}`);
}

function success(message) {
    console.log(`${color.green}[${getTimestamp()}]${color.reset} ${parse(message)}`);
}

function debug(message) {
    console.log(`${color.blue}[${getTimestamp()}]${color.reset} ${parse(message)}`);
}

module.exports = { getTimestamp, info, warn, error, success, debug, color};