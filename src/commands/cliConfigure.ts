import { Command, Flags } from '@oclif/core';
import { CredentialsManager, Credentials } from '../lib/credentials.js';

export default class Configure extends Command {
  static description = 'Configure credentials for the Tidepool CLI';

  static examples = [
    '<%= config.bin %> <%= command.id %> --userName "john.doe@example.com" --password "your-password" --baseUrl "https://api.tidepool.org"',
    '<%= config.bin %> <%= command.id %> -u "john.doe@example.com" -p "your-password" -b "https://api.tidepool.org"',
    '<%= config.bin %> <%= command.id %> --showConfig',
    '<%= config.bin %> <%= command.id %> --reset',
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
    userName: Flags.string({ 
      description: 'Username/email for authentication',
      required: false,
      char: 'u'
    }),
    password: Flags.string({ 
      description: 'Password for authentication',
      required: false,
      char: 'p'
    }),
    baseUrl: Flags.string({ 
      description: 'Base URL for API endpoints',
      required: false,
      char: 'b'
    }),
    showConfig: Flags.boolean({
      description: 'Show current configuration',
      char: 'c'
    }),
    reset: Flags.boolean({
      description: 'Reset stored credentials',
      char: 'r'
    })
  };

  private credentialsManager = new CredentialsManager();

  async run(): Promise<void> {
    const { flags } = await this.parse(Configure);

    if (flags.reset) {
      this.credentialsManager.deleteCredentials();
      this.log('✅ Credentials have been reset');
      return;
    }

    if (flags.showConfig) {
      const currentValues = this.credentialsManager.getCurrentValues();
      const hasCredentials = this.credentialsManager.hasCredentials();
      
      this.log('🔍 Current Configuration:');
      this.log(`   Username: ${currentValues.userName || 'Not set'}`);
      this.log(`   Password: ${currentValues.password || 'Not set'}`);
      this.log(`   Base URL: ${currentValues.baseUrl || 'Not set'}`);
      
      if (hasCredentials) {
        this.log('\n✅ Credentials are properly configured!');
      } else {
        this.log('\n❌ Missing credentials. Use the following command to configure:');
        this.log('   tidepool-cli configure --userName <email> --password <password> --baseUrl <url>');
      }
      return;
    }

    // If no flags are provided, show help
    if (!flags.userName && !flags.password && !flags.baseUrl) {
      this.log('🔧 Configure Tidepool CLI credentials\n');
      this.log('📋 Available options:');
      this.log('   --userName, -u    Set username/email');
      this.log('   --password, -p    Set password');
      this.log('   --baseUrl, -b     Set API base URL');
      this.log('   --showConfig, -c  Show current configuration');
      this.log('   --reset, -r       Reset stored credentials');
      return;
    }

    // Validate that all required flags are provided
    if (!flags.userName || !flags.password || !flags.baseUrl) {
      this.error('❌ All credentials are required: --userName, --password, --baseUrl');
      return;
    }

    const credentials: Credentials = {
      userName: flags.userName,
      password: flags.password,
      baseUrl: flags.baseUrl,
    };

    // Validate credentials format
    if (!this.credentialsManager.validateCredentials(credentials)) {
      this.error('❌ Invalid credentials format. All fields must be non-empty.');
      return;
    }

    try {
      this.credentialsManager.saveCredentials(credentials);
      this.log('✅ Credentials saved successfully:');
      this.log(`   Username: ${credentials.userName}`);
      this.log(`   Password: ${'*'.repeat(credentials.password.length)}`);
      this.log(`   Base URL: ${credentials.baseUrl}`);
    } catch (error) {
      this.error(`❌ Failed to save credentials: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
