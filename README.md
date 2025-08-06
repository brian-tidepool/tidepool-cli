# Tidepool CLI

A comprehensive command-line interface tool for managing Tidepool data, patients, and dashboards. This tool provides functionality for creating test patients, uploading data, managing clinics, and generating dashboard scenarios.

## 📚 Documentation

- **[API Documentation](API_DOCUMENTATION.md)** - Comprehensive documentation for all public APIs, functions, and components
- **[Quick Reference Guide](QUICK_REFERENCE.md)** - Fast reference for common operations and workflows
- **[TypeScript Definitions](types.d.ts)** - Complete type definitions for TypeScript support

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm run workflow-deploy
```

### Configuration

```bash
# Set up your credentials
# Saves credentials in a file locally
# All commands use a Credentials object for authentication

tidepool-cli cliConfigure --userName "user@tidepool.org" --password "password" --baseUrl "https://api.tidepool.org"
```

### Basic Usage

```bash
# Get help for command usage
tidepool-cli cliListPatients --help

# Get command history
tidepool-cli suggest cliListPatients 

# List clinics
tidepool-cli cliListClinics

# List tags
tidepool-cli cliListTags -g 633b559d1d64ad2c9471178b

# Search for patients
tidepool-cli cliSearch "test" --clinicId=633b559d1d64ad2c9471178b --tagId=6841e165edfe663ac4d8bff0 

# Create a dashboard 
tidepool-cli cliDashboard --clinicId=633b559d1d64ad2c9471178b --tagId=6841e165edfe663ac4d8bff0 --below3=1 --below39=1 --drop=1 --lesstir70=1 --lesscgm70=1 --meetingTargets=1

#Create a dashboard where the last data point is offset by minutes
tidepool-cli cliDashboardOffset --clinicId=633b559d1d64ad2c9471178b --tagId=6841e165edfe663ac4d8bff0 --below3=1 --below39=1 --drop=1 --lesstir70=1 --lesscgm70=1 --meetingTargets=1 --offset=1440

#Delete users by tag id in a clinic
tidepool-cli cliDeleteList --clinicId=633b559d1d64ad2c9471178b --tagId=6841e165edfe663ac4d8bff0

```

## 🎯 Key Features

- **Patient Management**: Create, list, search, and delete patients
- **Data Upload**: Upload CBG (Continuous Blood Glucose) data to patients
- **Dashboard Creation**: Generate test dashboards with various TIR (Time in Range) scenarios
- **Credential Management**: Secure storage and management of API credentials using a Credentials object
- **Time Shifting**: Adjust timestamps in data files for testing purposes
- **TypeScript Support**: Full type definitions for development
- **Consistent Imports**: All local modules use consistent and standard import naming
- **BaseCommand**: All commands (except configure) extend a shared BaseCommand for credential and flag handling

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `cliConfigure` | Configure credentials for the CLI |
| `cliDashboard` | Create a full dashboard of test users |
| `cliDashboardOffset` | Create dashboard with time offset |
| `cliListPatients` | List patients by tag ID |
| `cliSearch` | Search for patients by keyword |
| `cliListClinics` | List available clinics |
| `cliListTags` | List available tags |
| `cliDeleteList` | Delete patients by tag ID |
| `suggest` | Get command suggestions based on history |

## 🔧 Development

### Prerequisites

- Node.js >= 12.0.0
- TypeScript
- npm or yarn

### Setup Development Environment

```bash
# Clone the repository
git clone <repository-url>
cd tidepool-cli

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev
```

### Project Structure

```
tidepool-cli/
├── src/
│   ├── commands/          # CLI command implementations (all extend BaseCommand)
│   ├── lib/              # Core library functions (with consistent import naming)
│   ├── base-command.ts   # Base command class (handles credentials and flags)
│   └── index.ts          # Main entry point
├── lib/                  # Compiled JavaScript output
├── bin/                  # CLI executable scripts
├── types.d.ts           # TypeScript declarations
├── API_DOCUMENTATION.md # Comprehensive API docs
├── QUICK_REFERENCE.md   # Quick reference guide
└── README.md            # This file
```

### Core Components

- **BaseCommand**: Abstract base class for all CLI commands (except configure)
- **CredentialsManager**: Handles authentication credential storage and loading
- **Patient Management**: Functions for creating, listing, and deleting patients (all use Credentials object)
- **Dashboard Creation**: Functions for generating test dashboards
- **Data Upload**: Functions for uploading CBG and other data
- **Time Shifting**: Utilities for adjusting timestamps in data files
- **Utility Functions**: Helper functions for common operations (with clear, scoped variable names)

## 🔌 API Usage

### Programmatic Usage

```typescript
import { CredentialsManager } from './lib/credentials.js';
import { createDashboard } from './lib/dashboardScenarioSelector.js';
import { fetchPatientsByClinicAndTag } from './lib/fetchPatients.js';

async function main() {
  // Load credentials
  const manager = new CredentialsManager();
  const credentials = manager.loadCredentials();
  
  // Create dashboard
  const tirCounts = {
    "Time below 3.0 mmol/L > 1%": 5,
    "Time below 3.9 mmol/L > 4%": 5,
    "Meeting Targets": 3
  };
  
  await createDashboard(tirCounts, 14, "clinic-id", "tag-id", credentials);
  
  // List patients
  const patients = await fetchPatientsByClinicAndTag(credentials, "clinic-id", "tag-id");
  console.log(`Created ${patients?.length || 0} patients`);
}

main().catch(console.error);
```

### TypeScript Support

```typescript
import type {
  Credentials,
  Patient,
  TIRCounts
} from './types.js';

// Full type safety for all operations
const credentials: Credentials = {
  userName: "user@example.com",
  password: "password123",
  baseUrl: "https://api.tidepool.org"
};
```

## 🛠️ Error Handling

The CLI includes comprehensive error handling:

```typescript
try {
  const result = await someApiCall(credentials, params);
  if (result) {
    console.log('Success:', result);
  } else {
    console.error('API call returned null');
  }
} catch (error) {
  if (error instanceof Error) {
    console.error('Error:', error.message);
  } else {
    console.error('Unknown error:', error);
  }
}
```

## 🔒 Security

- Credentials are stored securely in the user's home directory
- Session tokens are managed automatically
- All API calls use proper authentication via the Credentials object
- Input validation is performed on all parameters

## 📊 Data Models

### Core Interfaces

```typescript
interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}

interface Patient {
  fullName: string;
  id: string;
}

interface TIRCounts {
  "Time below 3.0 mmol/L > 1%": number;
  "Time below 3.9 mmol/L > 4%": number;
  "Drop in Time in Range > 15%": number;
  "Time in Range < 70%": number;
  "CGM Wear Time <70%": number;
  "Meeting Targets": number;
}
```

## 🧪 Testing

The CLI includes utilities for creating test scenarios:

- **Dashboard Creation**: Generate test patients with various TIR scenarios
- **Data Upload**: Upload realistic CBG data to test patients
- **Time Shifting**: Adjust timestamps for testing different time periods
- **Bulk Operations**: Create and manage multiple test patients efficiently

## 🤝 Contributing

When contributing to the tidepool-cli project:

1. Follow the existing TypeScript patterns
2. Add proper error handling
3. Use clear, scoped variable names and consistent import naming
4. Update documentation for new APIs
5. Test with various credential configurations
6. Ensure all functions are properly typed

## 📝 License

This project is part of the Tidepool ecosystem. Please refer to the project's license file for usage terms.

## 🆘 Support

For issues and questions:

1. Check the [API Documentation](API_DOCUMENTATION.md) for detailed information
2. Refer to the [Quick Reference Guide](QUICK_REFERENCE.md) for common operations
3. Review the TypeScript definitions in [types.d.ts](types.d.ts)
4. Check the troubleshooting section in the quick reference guide

## 📈 Performance

- All API calls are asynchronous for better performance
- Built-in rate limiting and error handling
- Efficient data structures for large datasets
- Memory-conscious operations for bulk processing

---

**Note**: This CLI tool is designed for testing and development purposes. Use appropriate credentials and follow security best practices in production environments.