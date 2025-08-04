export interface Credentials {
    userName: string;
    password: string;
    baseUrl: string;
}
export declare class CredentialsManager {
    private readonly ENV_USERNAME;
    private readonly ENV_PASSWORD;
    private readonly ENV_BASE_URL;
    /**
     * Load credentials from environment variables only
     */
    loadCredentials(): Credentials;
    /**
     * Load credentials from environment variables
     */
    private loadFromEnvironment;
    /**
     * Set environment variables programmatically
     */
    setEnvironmentVariables(credentials: Credentials): void;
    /**
     * Validate credentials format
     */
    validateCredentials(credentials: Credentials): boolean;
    /**
     * Get environment variable names for documentation
     */
    getEnvironmentVariableNames(): {
        userName: string;
        password: string;
        baseUrl: string;
    };
    /**
     * Check if credentials are available from environment variables
     */
    hasCredentials(): boolean;
    /**
     * Get current environment variable values (for debugging, password masked)
     */
    getCurrentEnvironmentValues(): {
        userName: string;
        password: string;
        baseUrl: string;
    };
}
