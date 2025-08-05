export interface Credentials {
    userName: string;
    password: string;
    baseUrl: string;
}
export declare class CredentialsManager {
    private readonly ENV_USERNAME;
    private readonly ENV_PASSWORD;
    private readonly ENV_BASE_URL;
    writeEnvFile(credentials: Credentials, dir?: string): string;
    loadCredentials(): Credentials;
    private loadFromEnvironment;
    setEnvironmentVariables(credentials: Credentials): void;
    validateCredentials(credentials: Credentials): boolean;
    getEnvironmentVariableNames(): {
        userName: string;
        password: string;
        baseUrl: string;
    };
    hasCredentials(): boolean;
    getCurrentEnvironmentValues(): {
        userName: string;
        password: string;
        baseUrl: string;
    };
}
