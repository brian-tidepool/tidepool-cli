import { Command, Flags } from '@oclif/core';
import { CredentialsManager, Credentials } from '../lib/credentials.js';

export default class Configure extends Command {
  static description = 'Configure credentials for the Tidepool CLI';

  static examples = [
    '<%= config.bin %> <%= command.id %> --userName "john.doe@example.com" --password "your-password" --baseUrl "https://api.tidepool.org"',
    '<%= config.bin %> <%= command.id %> -u "john.doe@example.com" -p "your-password" -b "https://api.tidepool.org"',
    '<%= config.bin %> <%= command.id %> --show-env',
    '<%= config.bin %> <%= command.id %> --set-env',
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
    showEnv: Flags.boolean({
      description: 'Show environment variable names for configuration',
      char: 'e'
    }),
    setEnv: Flags.boolean({
      description: 'Set environment variables for current session',
      char: 's'
    }),
    check: Flags.boolean({
      description: 'Check current environment variable status',
      char: 'c'
    }),
  };

  private credentialsManager = new CredentialsManager();

  async run(): Promise<void> {
    const { flags } = await this.parse(Configure);

    // Show environment variable names
    if (flags.showEnv) {
      const envVars = this.credentialsManager.getEnvironmentVariableNames();
      this.log('📋 Environment Variables:');
      this.log(`   ${envVars.userName}=your-username@example.com`);
      this.log(`   ${envVars.password}=your-password`);
      this.log(`   ${envVars.baseUrl}=https://api.tidepool.org`);
      this.log('\n💡 You can set these environment variables instead of using this command.');
      this.log('🔒 Environment variables are more secure than storing credentials in files.');
      return;
    }

    // Check current environment variable status
    if (flags.check) {
      const currentValues = this.credentialsManager.getCurrentEnvironmentValues();
      const hasCredentials = this.credentialsManager.hasCredentials();
      
      this.log('🔍 Current Environment Variable Status:');
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().userName}: ${currentValues.userName || 'Not set'}`);
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().password}: ${currentValues.password || 'Not set'}`);
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().baseUrl}: ${currentValues.baseUrl || 'Not set'}`);
      
      if (hasCredentials) {
        this.log('\n✅ All credentials are properly configured via environment variables!');
      } else {
        this.log('\n❌ Missing environment variables. Use --show-env to see required variables.');
      }
      return;
    }

    // Persist environment variables in a .env file in the project root
    if (flags.setEnv) {
      if (!flags.userName || !flags.password || !flags.baseUrl) {
        this.error('❌ All credentials are required for --set-env: --userName, --password, --baseUrl');
        this.log('\n💡 Use --show-env to see environment variable options.');
        return;
      }

      const credentials: Credentials = {
        userName: flags.userName,
        password: flags.password,
        baseUrl: flags.baseUrl,
      };

      if (!this.credentialsManager.validateCredentials(credentials)) {
        this.error('❌ Invalid credentials format. All fields must be non-empty.');
        return;
      }

      // Write to .env file in project root using CredentialsManager
      try {
        const envPath = this.credentialsManager.writeEnvFile(credentials);
        this.log('✅ .env file created/updated in your project root with your credentials.');
        this.log('');
        this.log('To load these variables in your shell:');
        this.log('  # For Windows CMD:');
        this.log('  for /f "delims==" %i in (".env") do set %i');
        this.log('');
        this.log('  # For PowerShell:');
        this.log('  Get-Content .env | foreach { $name, $value = $_ -split "=", 2; Set-Item -Path env:$name -Value $value }');
        this.log('');
        this.log('  # For bash (WSL, Git Bash, etc):');
        this.log('  export $(grep -v "^#" .env | xargs)');
        this.log('');
        this.log('💡 For permanent setup, add these variables to your system environment variables or shell profile.');
      } catch (error) {
        this.error(`❌ Failed to write .env file: ${error instanceof Error ? error.message : String(error)}`);
      }
      return;
    }

    // Legacy support - show help for environment variable setup
    if (!flags.userName && !flags.password && !flags.baseUrl) {
      this.log('🔧 Tidepool CLI now uses environment variables for credential management.');
      this.log('   This is more secure than storing credentials in files.\n');
      this.log('📋 Available options:');
      this.log('   --show-env     Show required environment variable names');
      this.log('   --set-env      Set environment variables for current session');
      this.log('   --check        Check current environment variable status');
      this.log('\n💡 For permanent setup, set these environment variables:');
      this.log('   TIDEPOOL_USERNAME=your-username@example.com');
      this.log('   TIDEPOOL_PASSWORD=your-password');
      this.log('   TIDEPOOL_BASE_URL=https://api.tidepool.org');
      return;
    }

    // Validate that all required flags are provided
    if (!flags.userName || !flags.password || !flags.baseUrl) {
      this.error('❌ All credentials are required: --userName, --password, --baseUrl');
      this.log('\n💡 Use --show-env to see environment variable options.');
      this.log('   Use --set-env to set environment variables for current session.');
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

    // Set environment variables for current session
    try {
      this.credentialsManager.setEnvironmentVariables(credentials);
      this.log('✅ Credentials set as environment variables for current session:');
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().userName}=${credentials.userName}`);
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().password}=${'*'.repeat(credentials.password.length)}`);
      this.log(`   ${this.credentialsManager.getEnvironmentVariableNames().baseUrl}=${credentials.baseUrl}`);
      this.log('\n💡 These variables are only set for the current session.');
      this.log('   For permanent setup, set them in your shell profile or use system environment variables.');
    } catch (error) {
      this.error(`❌ Failed to set credentials: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
