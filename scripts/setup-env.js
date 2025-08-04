#!/usr/bin/env node

/**
 * Setup script for Tidepool CLI environment variables
 * Usage: node scripts/setup-env.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupEnvironment() {
  console.log('🔧 Setting up Tidepool CLI environment variables...\n');
  console.log('🔒 Note: Tidepool CLI now uses environment variables exclusively for security.\n');

  try {
    const username = await question('Enter your Tidepool username/email: ');
    const password = await question('Enter your Tidepool password: ');
    const baseUrl = await question('Enter the base URL (default: https://api.tidepool.org): ') || 'https://api.tidepool.org';

    // Set environment variables for current session
    process.env.TIDEPOOL_USERNAME = username;
    process.env.TIDEPOOL_PASSWORD = password;
    process.env.TIDEPOOL_BASE_URL = baseUrl;

    console.log('\n✅ Environment variables set for current session:');
    console.log(`   TIDEPOOL_USERNAME=${username}`);
    console.log(`   TIDEPOOL_PASSWORD=${'*'.repeat(password.length)}`);
    console.log(`   TIDEPOOL_BASE_URL=${baseUrl}`);

    // Option to set permanently
    const setPermanent = await question('\nDo you want to set these permanently? (y/N): ');
    
    if (setPermanent.toLowerCase() === 'y' || setPermanent.toLowerCase() === 'yes') {
      // For Windows PowerShell
      try {
        execSync(`[Environment]::SetEnvironmentVariable("TIDEPOOL_USERNAME", "${username}", "User")`, { shell: 'powershell' });
        execSync(`[Environment]::SetEnvironmentVariable("TIDEPOOL_PASSWORD", "${password}", "User")`, { shell: 'powershell' });
        execSync(`[Environment]::SetEnvironmentVariable("TIDEPOOL_BASE_URL", "${baseUrl}", "User")`, { shell: 'powershell' });
        
        console.log('✅ Environment variables set permanently!');
        console.log('💡 You may need to restart your terminal for changes to take effect.');
      } catch (error) {
        console.log('⚠️  Failed to set permanent environment variables. You may need to run as administrator.');
        console.log('   You can set them manually using:');
        console.log('   tidepool-cli configure --show-env');
      }
    }

    console.log('\n🎉 Setup complete! You can now use the Tidepool CLI commands.');
    console.log('💡 Test with: tidepool-cli configure --check');

  } catch (error) {
    console.error('❌ Error setting up environment variables:', error.message);
  } finally {
    rl.close();
  }
}

// Run the setup
setupEnvironment(); 