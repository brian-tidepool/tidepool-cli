import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

export interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}

export class CredentialsManager {
  private readonly ENV_USERNAME = 'TIDEPOOL_USERNAME';
  private readonly ENV_PASSWORD = 'TIDEPOOL_PASSWORD';
  private readonly ENV_BASE_URL = 'TIDEPOOL_BASE_URL';

  /**
   * Load credentials from environment variables only
   */
  loadCredentials(): Credentials {
    const envCredentials = this.loadFromEnvironment();
    if (!envCredentials) {
      throw new Error(
        'Credentials not found. Please set the following environment variables:\n' +
        `   ${this.ENV_USERNAME}=your-username@example.com\n` +
        `   ${this.ENV_PASSWORD}=your-password\n` +
        `   ${this.ENV_BASE_URL}=https://api.tidepool.org\n\n` +
        'You can also run "tidepool-cli configure --show-env" to see the required variables.'
      );
    }
    return envCredentials;
  }

  /**
   * Load credentials from environment variables
   */
  private loadFromEnvironment(): Credentials | null {
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
  setEnvironmentVariables(credentials: Credentials): void {
    process.env[this.ENV_USERNAME] = credentials.userName;
    process.env[this.ENV_PASSWORD] = credentials.password;
    process.env[this.ENV_BASE_URL] = credentials.baseUrl;
  }

  /**
   * Validate credentials format
   */
  validateCredentials(credentials: Credentials): boolean {
    return !!(credentials.userName && credentials.password && credentials.baseUrl);
  }

  /**
   * Get environment variable names for documentation
   */
  getEnvironmentVariableNames(): { userName: string; password: string; baseUrl: string } {
    return {
      userName: this.ENV_USERNAME,
      password: this.ENV_PASSWORD,
      baseUrl: this.ENV_BASE_URL,
    };
  }

  /**
   * Check if credentials are available from environment variables
   */
  hasCredentials(): boolean {
    return this.loadFromEnvironment() !== null;
  }

  /**
   * Get current environment variable values (for debugging, password masked)
   */
  getCurrentEnvironmentValues(): { userName: string; password: string; baseUrl: string } {
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