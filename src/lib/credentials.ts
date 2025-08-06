import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}

export class CredentialsManager {
  private readonly CONFIG_DIR = path.join(os.homedir(), '.tidepool-cli');
  private readonly CREDENTIALS_FILE = path.join(this.CONFIG_DIR, 'credentials.json');

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.CONFIG_DIR)) {
      fs.mkdirSync(this.CONFIG_DIR, { recursive: true });
    }
  }

  saveCredentials(credentials: Credentials): void {
    this.ensureConfigDir();
    fs.writeFileSync(this.CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
  }

  loadCredentials(): Credentials {
    const credentials = this.getCurrentValues();
    if (!credentials.userName || !credentials.password || !credentials.baseUrl) {
      throw new Error(
        'Credentials not found. Please configure using:\n' +
        'tidepool-cli configure --userName <email> --password <password> --baseUrl <url>'
      );
    }
    return credentials;
  }

  validateCredentials(credentials: Credentials): boolean {
    return !!(credentials.userName && credentials.password && credentials.baseUrl);
  }

  hasCredentials(): boolean {
    try {
      if (fs.existsSync(this.CREDENTIALS_FILE)) {
        const content = fs.readFileSync(this.CREDENTIALS_FILE, 'utf8');
        const credentials = JSON.parse(content);
        return this.validateCredentials(credentials);
      }
    } catch (error) {
      console.error('Error checking credentials:', error);
    }
    return false;
  }

  getCurrentValues(): Credentials {
    try {
      if (fs.existsSync(this.CREDENTIALS_FILE)) {
        const content = fs.readFileSync(this.CREDENTIALS_FILE, 'utf8');
        const credentials = JSON.parse(content);
        if (this.validateCredentials(credentials)) {
          return credentials;
        }
      }
    } catch (error) {
      console.error('Error reading credentials:', error);
    }
    return {
      userName: '',
      password: '',
      baseUrl: ''
    };
  }

  deleteCredentials(): void {
    if (fs.existsSync(this.CREDENTIALS_FILE)) {
      fs.unlinkSync(this.CREDENTIALS_FILE);
    }
  }
}