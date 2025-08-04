#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TidepoolWorkflow {
  constructor() {
    this.packageName = 'tidepool-cli';
    this.defaultClinicId = '633b559d1d64ad2c9471178b';
    this.defaultTagId = '6841e165edfe663ac4d8bff0';
    this.version = this.getCurrentVersion();
  }

  getCurrentVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return packageJson.version;
    } catch (error) {
      this.log('Failed to read package.json version', 'error');
      return '1.0.0';
    }
  }

  async bumpVersion() {
    this.log('📦 Bumping version...');
    try {
      // Run npm version patch to bump the version
      const result = execSync('npm version patch --no-git-tag-version', { 
        stdio: 'pipe', 
        encoding: 'utf8' 
      });
      
      // Extract the new version from the output
      const newVersion = result.trim().replace('v', '');
      this.version = newVersion;
      
      this.log(`✅ Version bumped to ${newVersion}`, 'success');
      return newVersion;
    } catch (error) {
      this.log(`❌ Failed to bump version: ${error.message}`, 'error');
      throw error;
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async runCommand(command, description) {
    try {
      this.log(`Starting: ${description}`);
      const result = execSync(command, { stdio: 'inherit', encoding: 'utf8' });
      this.log(`Completed: ${description}`, 'success');
      return result;
    } catch (error) {
      this.log(`Failed: ${description} - ${error.message}`, 'error');
      throw error;
    }
  }

  async build() {
    await this.runCommand('npm run build', 'Building TypeScript code');
  }

  async package() {
    await this.runCommand('npm run pack', 'Packaging application');
  }

  async install() {
    const tarball = `${this.packageName}-${this.version}.tgz`;
    await this.runCommand(`npm install -g ${tarball}`, 'Installing globally');
  }

  async deploy() {
    this.log('🚀 Starting deployment workflow...');
    
    try {
      // Bump version first
      await this.bumpVersion();
      
      // Then build, package, and install
      await this.build();
      await this.package();
      await this.install();
      
      this.log('🎉 Deployment completed successfully!', 'success');
      this.log(`📦 Installed version: ${this.version}`, 'success');
    } catch (error) {
      this.log('💥 Deployment failed!', 'error');
      process.exit(1);
    }
  }

  async testSetup() {
    this.log('🔧 Testing setup...');
    try {
      await this.runCommand('tidepool-cli cliConfigure --showEnv', 'Testing credential configuration');
      this.log('✅ Setup test completed', 'success');
    } catch (error) {
      this.log('⚠️ Setup test failed - this is expected if credentials are not configured', 'error');
    }
  }

  async testDashboard() {
    this.log('📊 Testing dashboard creation...');
    try {
      const command = `tidepool-cli cliDashboard --below3 2 --below39 2 --drop 2 --lesstir70 2 --lesscgm70 1 --meetingTargets 1`;
      await this.runCommand(command, 'Creating test dashboard');
      this.log('✅ Dashboard test completed', 'success');
    } catch (error) {
      this.log('⚠️ Dashboard test failed - check credentials and network', 'error');
    }
  }

  async testList() {
    this.log('📋 Testing patient listing...');
    try {
      const command = `tidepool-cli cliListPatients --clinicId ${this.defaultClinicId} --tagId ${this.defaultTagId}`;
      await this.runCommand(command, 'Listing patients');
      this.log('✅ List test completed', 'success');
    } catch (error) {
      this.log('⚠️ List test failed - check credentials and clinic/tag IDs', 'error');
    }
  }

  async testSearch() {
    this.log('🔍 Testing search functionality...');
    try {
      const command = `tidepool-cli cliSearch --clinicId ${this.defaultClinicId} --tagId ${this.defaultTagId} --searchTerm test`;
      await this.runCommand(command, 'Searching patients');
      this.log('✅ Search test completed', 'success');
    } catch (error) {
      this.log('⚠️ Search test failed - check credentials and search parameters', 'error');
    }
  }

  async testCleanup() {
    this.log('🧹 Testing cleanup functionality...');
    try {
      const command = `tidepool-cli cliDeleteList --clinicId ${this.defaultClinicId} --tagId ${this.defaultTagId}`;
      await this.runCommand(command, 'Cleaning up test data');
      this.log('✅ Cleanup test completed', 'success');
    } catch (error) {
      this.log('⚠️ Cleanup test failed - check credentials and clinic/tag IDs', 'error');
    }
  }

  async runTests() {
    this.log('🧪 Starting test suite...');
    
    try {
      await this.testSetup();
      await this.testDashboard();
      await this.testList();
      await this.testSearch();
      
      this.log('🎉 All tests completed!', 'success');
    } catch (error) {
      this.log('💥 Test suite failed!', 'error');
    }
  }

  async fullWorkflow() {
    this.log('🚀 Starting full workflow: deploy + test...');
    
    try {
      await this.deploy();
      await this.runTests();
      
      this.log('🎉 Full workflow completed successfully!', 'success');
    } catch (error) {
      this.log('💥 Full workflow failed!', 'error');
      process.exit(1);
    }
  }

  async cleanup() {
    this.log('🧹 Starting cleanup workflow...');
    
    try {
      await this.testCleanup();
      this.log('✅ Cleanup completed', 'success');
    } catch (error) {
      this.log('⚠️ Cleanup failed - check credentials', 'error');
    }
  }

  showHelp() {
    console.log(`
🌊 Tidepool CLI Workflow Script

Usage: node scripts/workflow.js [command]

Commands:
  deploy          Build, package, and install the CLI globally (bumps version)
  test            Run all test commands (setup, dashboard, list, search)
  cleanup         Clean up test data
  full            Run full workflow (deploy + test)
  help            Show this help message

Examples:
  node scripts/workflow.js deploy
  node scripts/workflow.js test
  node scripts/workflow.js full
  node scripts/workflow.js cleanup

Environment Variables:
  TIDEPOOL_USERNAME    Your Tidepool username
  TIDEPOOL_PASSWORD    Your Tidepool password  
  TIDEPOOL_BASE_URL    Your Tidepool API base URL

Configuration:
  Run 'tidepool-cli cliConfigure --showEnv' to see environment variable names
  Run 'tidepool-cli cliConfigure -u username -p password -b baseUrl' to save credentials

Current Version: ${this.version}
    `);
  }
}

// Main execution
async function main() {
  const workflow = new TidepoolWorkflow();
  const command = process.argv[2] || 'help';

  switch (command) {
    case 'deploy':
      await workflow.deploy();
      break;
    case 'test':
      await workflow.runTests();
      break;
    case 'cleanup':
      await workflow.cleanup();
      break;
    case 'full':
      await workflow.fullWorkflow();
      break;
    case 'help':
    default:
      workflow.showHelp();
      break;
  }
}

// Run the main function
main().catch(error => {
  console.error('💥 Workflow failed:', error.message);
  process.exit(1);
}); 