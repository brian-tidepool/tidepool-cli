export class CredentialsManager {
    ENV_USERNAME = 'TIDEPOOL_USERNAME';
    ENV_PASSWORD = 'TIDEPOOL_PASSWORD';
    ENV_BASE_URL = 'TIDEPOOL_BASE_URL';
    /**
     * Load credentials from environment variables only
     */
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
    /**
     * Load credentials from environment variables
     */
    loadFromEnvironment() {
        const userName = process.env[this.ENV_USERNAME];
        const password = process.env[this.ENV_PASSWORD];
        const baseUrl = process.env[this.ENV_BASE_URL];
        if (userName && password && baseUrl) {
            return {
                userName,
                password,
                baseUrl,
            };
        }
        return null;
    }
    /**
     * Set environment variables programmatically
     */
    setEnvironmentVariables(credentials) {
        process.env[this.ENV_USERNAME] = credentials.userName;
        process.env[this.ENV_PASSWORD] = credentials.password;
        process.env[this.ENV_BASE_URL] = credentials.baseUrl;
    }
    /**
     * Validate credentials format
     */
    validateCredentials(credentials) {
        return !!(credentials.userName && credentials.password && credentials.baseUrl);
    }
    /**
     * Get environment variable names for documentation
     */
    getEnvironmentVariableNames() {
        return {
            userName: this.ENV_USERNAME,
            password: this.ENV_PASSWORD,
            baseUrl: this.ENV_BASE_URL,
        };
    }
    /**
     * Check if credentials are available from environment variables
     */
    hasCredentials() {
        return this.loadFromEnvironment() !== null;
    }
    /**
     * Get current environment variable values (for debugging, password masked)
     */
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
