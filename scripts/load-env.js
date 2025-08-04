#!/usr/bin/env node

/**
 * Load environment variables from .env file
 * Usage: node scripts/load-env.js
 */

const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file template...');
    const template = `# Tidepool CLI Environment Variables
# Copy this file to .env and fill in your credentials

TIDEPOOL_USERNAME=your-username@example.com
TIDEPOOL_PASSWORD=your-password
TIDEPOOL_BASE_URL=https://api.tidepool.org
`;
    fs.writeFileSync(envPath, template);
    console.log('✅ Created .env template file');
    console.log('💡 Edit the .env file with your actual credentials');
    return;
  }

  console.log('📋 Loading environment variables from .env file...');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=');
      
      if (key && value) {
        process.env[key.trim()] = value.trim();
        console.log(`✅ Loaded: ${key.trim()}=${key.includes('PASSWORD') ? '***' : value.trim()}`);
      }
    }
  });
  
  console.log('🎉 Environment variables loaded successfully!');
}

// Run the loader
loadEnvFile(); 