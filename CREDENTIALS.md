# Credential Management

This document explains how to securely manage credentials for the Tidepool CLI.

## Overview

The Tidepool CLI uses **environment variables exclusively** for credential management. This approach provides better security by avoiding credential storage in files.

## Environment Variables (Required)

Set these environment variables to use the CLI:

```bash
export TIDEPOOL_USERNAME="your-username@example.com"
export TIDEPOOL_PASSWORD="your-password"
export TIDEPOOL_BASE_URL="https://api.tidepool.org"
```

### Windows (PowerShell)
```powershell
$env:TIDEPOOL_USERNAME="your-username@example.com"
$env:TIDEPOOL_PASSWORD="your-password"
$env:TIDEPOOL_BASE_URL="https://api.tidepool.org"
```

### Windows (Command Prompt)
```cmd
set TIDEPOOL_USERNAME=your-username@example.com
set TIDEPOOL_PASSWORD=your-password
set TIDEPOOL_BASE_URL=https://api.tidepool.org
```

## Configuration Commands

### Show Environment Variable Names
```bash
tidepool-cli configure --show-env
```

### Set Environment Variables for Current Session
```bash
tidepool-cli configure --set-env --userName "your-username@example.com" --password "your-password" --baseUrl "https://api.tidepool.org"
```

### Check Current Environment Variable Status
```bash
tidepool-cli configure --check
```

### Set Environment Variables for Current Session (Short Form)
```bash
tidepool-cli configure -s -u "your-username@example.com" -p "your-password" -b "https://api.tidepool.org"
```

## Security Best Practices

### For Production Environments
1. **Use Environment Variables**: Never store credentials in files for production
2. **Use Secret Management**: Use tools like AWS Secrets Manager, Azure Key Vault, or HashiCorp Vault
3. **Rotate Credentials**: Regularly rotate passwords and API keys
4. **Limit Access**: Use least-privilege access principles
5. **Use Different Accounts**: Use separate accounts for development and production

### For Development Environments
1. **Use Session Variables**: Set environment variables for current development sessions
2. **Don't Commit Credentials**: Ensure credential files are in `.gitignore`
3. **Use Different Accounts**: Use separate accounts for development and production

## Troubleshooting

### "Credentials not found" Error
1. Check if environment variables are set: `echo $TIDEPOOL_USERNAME`
2. Run `tidepool-cli configure --check` to see current status
3. Run `tidepool-cli configure --show-env` to see required environment variables

### "Invalid credentials format" Error
1. Ensure all required fields are provided
2. Check that credentials are not empty strings
3. Verify the base URL format (should start with `https://`)

## Migration from File-based Credentials

If you have existing file-based credentials:

1. **Remove credential files**: Delete any existing credential files
2. **Set environment variables**: Use the methods above to set environment variables
3. **Test thoroughly**: Ensure credentials are loaded correctly
4. **Update scripts**: Update any scripts that relied on file-based credentials

## Example Usage

Once environment variables are set, you can run the Tidepool CLI commands:

```bash
# These will now work without additional credential flags
tidepool-cli dashboard
tidepool-cli list-patients
tidepool-cli search
```

The CLI will automatically detect and use the environment variables you've set.

## Programmatic Usage

You can also set environment variables programmatically in your code:

```typescript
import { CredentialsManager } from './credentials.js';

const credentialsManager = new CredentialsManager();

// Set environment variables programmatically
credentialsManager.setEnvironmentVariables({
  userName: "your-username@example.com",
  password: "your-password", 
  baseUrl: "https://api.tidepool.org"
});

// Now use the CLI - environment variables will be automatically detected
``` 