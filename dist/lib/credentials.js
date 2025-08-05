export class CredentialsManager {
    ENV_USERNAME = 'TIDEPOOL_USERNAME';
    ENV_PASSWORD = 'TIDEPOOL_PASSWORD';
    ENV_BASE_URL = 'TIDEPOOL_BASE_URL';
    writeEnvFile(credentials, dir) {
        const envVars = this.getEnvironmentVariableNames();
        const envContent = `${envVars.userName}=${credentials.userName}\n` +
            `${envVars.password}=${credentials.password}\n` +
            `${envVars.baseUrl}=${credentials.baseUrl}\n`;
        const fs = require('fs');
        const pathLib = require('path');
        const envPath = pathLib.resolve(dir || process.cwd(), '.env');
        fs.writeFileSync(envPath, envContent, { encoding: 'utf8' });
        return envPath;
    }
    loadCredentials() {
        const envCredentials = this.loadFromEnvironment();
        if (!envCredentials) {
            throw new Error('Credentials not found. Please set the following environment variables:\n' +
                `   ${this.ENV_USERNAME}=your-username@example.com\n` +
                `   ${this.ENV_PASSWORD}=your-password\n` +
                `   ${this.ENV_BASE_URL}=https://api.tidepool.org\n\n` +
                'You can also run "tidepool-cli configure --show-env" to see the required variables.');
        }
        return envCredentials;
    }
    loadFromEnvironment() {
        const userName = process.env[this.ENV_USERNAME];
        const password = process.env[this.ENV_PASSWORD];
        const baseUrl = process.env[this.ENV_BASE_URL];
        if (userName && password && baseUrl) {
            return { userName, password, baseUrl };
        }
        return null;
    }
    setEnvironmentVariables(credentials) {
        process.env[this.ENV_USERNAME] = credentials.userName;
        process.env[this.ENV_PASSWORD] = credentials.password;
        process.env[this.ENV_BASE_URL] = credentials.baseUrl;
    }
    validateCredentials(credentials) {
        return !!(credentials.userName && credentials.password && credentials.baseUrl);
    }
    getEnvironmentVariableNames() {
        return {
            userName: this.ENV_USERNAME,
            password: this.ENV_PASSWORD,
            baseUrl: this.ENV_BASE_URL,
        };
    }
    hasCredentials() {
        return this.loadFromEnvironment() !== null;
    }
    getCurrentEnvironmentValues() {
        const userName = process.env[this.ENV_USERNAME] || '';
        const password = process.env[this.ENV_PASSWORD] || '';
        const baseUrl = process.env[this.ENV_BASE_URL] || '';
        return {
            userName,
            password: password ? '***' : '',
            baseUrl,
        };
    }
}
