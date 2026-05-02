const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

// VULNERABILITY: Path traversal in file operations
function readUserFile(userId, filename) {
    const filePath = path.join('/uploads', userId, filename);
    return fs.readFileSync(filePath, 'utf8');
}

// VULNERABILITY: Command injection
function processImage(imagePath, options) {
    const cmd = `convert ${imagePath} ${options} output.png`;
    return execSync(cmd).toString();
}

// VULNERABILITY: Command injection via string concatenation
function pingHost(hostname) {
    return new Promise((resolve, reject) => {
        exec(`ping -c 4 ${hostname}`, (error, stdout, stderr) => {
            if (error) reject(stderr);
            else resolve(stdout);
        });
    });
}

// VULNERABILITY: Unsafe eval
function parseConfig(configString) {
    return eval('(' + configString + ')');
}

// VULNERABILITY: Unsafe JSON parsing with Function constructor
function parseJSON(jsonString) {
    return (new Function('return ' + jsonString))();
}

// VULNERABILITY: Insecure temporary file
function createTempFile(data) {
    const tempPath = '/tmp/app_' + Date.now() + '.tmp';
    fs.writeFileSync(tempPath, data, { mode: 0o777 });
    return tempPath;
}

// VULNERABILITY: XXE-like pattern
function parseUserXML(xmlContent) {
    // Parsing XML without disabling external entities
    const xmlParser = require('xml2js').Parser({
        xmlns: true
    });
    return xmlParser.parseStringPromise(xmlContent);
}

// VULNERABILITY: SSRF
const axios = require('axios');
async function fetchURL(url) {
    const response = await axios.get(url);
    return response.data;
}

// VULNERABILITY: Unsafe regex
function validateInput(input) {
    const regex = /^(a+)+$/;
    return regex.test(input);
}

module.exports = {
    readUserFile,
    processImage,
    pingHost,
    parseConfig,
    parseJSON,
    createTempFile,
    parseUserXML,
    fetchURL,
    validateInput
};
