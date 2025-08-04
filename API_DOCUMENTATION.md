# Tidepool CLI - Comprehensive API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [CLI Commands](#cli-commands)
4. [Core Library APIs](#core-library-apis)
5. [Utility Functions](#utility-functions)
6. [Data Models](#data-models)
7. [Authentication](#authentication)
8. [Examples](#examples)
9. [Error Handling](#error-handling)

## Overview

Tidepool CLI is a command-line interface tool for managing Tidepool data, patients, and dashboards. It provides functionality for creating test patients, uploading data, managing clinics, and generating dashboard scenarios.

### Key Features

- **Patient Management**: Create, list, search, and delete patients
- **Data Upload**: Upload CBG (Continuous Blood Glucose) data to patients
- **Dashboard Creation**: Generate test dashboards with various TIR (Time in Range) scenarios
- **Credential Management**: Secure storage and management of API credentials
- **Time Shifting**: Adjust timestamps in data files for testing purposes

## Installation

```bash
# Install globally
npm install -g tidepool-cli

# Or install locally
npm install tidepool-cli
```

## CLI Commands

### 1. Configure Command

**Command**: `tidepool-cli configure`

**Description**: Configure credentials for the CLI

**Flags**:
- `--userName, -u` (required): Username for authentication
- `--password, -p` (required): Password for authentication  
- `--baseUrl, -b` (required): Base URL for API endpoints

**Examples**:
```bash
tidepool-cli configure --userName "john.doe" --password "your-password" --baseUrl "https://api.example.com"
tidepool-cli configure -u "john.doe" -p "your-password" -b "https://api.example.com"
```

**Usage**:
```typescript
// The command saves credentials to ~/credentials.json
const credentials = {
  userName: "john.doe",
  password: "your-password", 
  baseUrl: "https://api.example.com"
};
```

### 2. Dashboard Command

**Command**: `tidepool-cli dashboard`

**Description**: Create a full dashboard of 51 users with configurable TIR counts

**Flags**:
- `--below3, -a` (default: 10): Time below 3.0 mmol/L > 1%
- `--below39, -b` (default: 10): Time below 3.9 mmol/L > 4%
- `--drop, -c` (default: 10): Drop in Time in Range > 15%
- `--lesstir70, -d` (default: 10): Time in Range < 70%
- `--lesscgm70, -e` (default: 6): CGM Wear Time <70%
- `--meetingTargets, -f` (default: 5): Meeting Targets
- `--clinicId, -g` (default: '633b559d1d64ad2c9471178b'): Clinic ID
- `--tagId, -h` (default: '6841e165edfe663ac4d8bff0'): Tag ID

**Examples**:
```bash
tidepool-cli dashboard
tidepool-cli dashboard --below3 15 --below39 8 --clinicId "custom-clinic-id"
```

### 3. Dashboard Offset Command

**Command**: `tidepool-cli dashboard:offset`

**Description**: Create dashboard with time offset for testing

**Flags**:
- All dashboard flags plus:
- `--offsetTimeMinutes` (required): Time offset in minutes
- `--patientName` (required): Base name for patients

**Examples**:
```bash
tidepool-cli dashboard:offset --offsetTimeMinutes 1440 --patientName "TestPatient"
```

### 4. List Patients Command

**Command**: `tidepool-cli list:patients`

**Description**: List patients by tag ID

**Flags**:
- `--clinicId, -g` (default: '633b559d1d64ad2c9471178b'): Clinic ID
- `--tagId, -h` (default: '6841e165edfe663ac4d8bff0'): Tag ID

**Examples**:
```bash
tidepool-cli list:patients
tidepool-cli list:patients --clinicId "custom-clinic-id" --tagId "custom-tag-id"
```

### 5. Search Command

**Command**: `tidepool-cli search <keyword>`

**Description**: Search for patients by keyword

**Arguments**:
- `keyword` (required): Search term

**Flags**:
- `--clinicId, -g` (default: '633b559d1d64ad2c9471178b'): Clinic ID
- `--tagId, -h` (default: '6841e165edfe663ac4d8bff0'): Tag ID

**Examples**:
```bash
tidepool-cli search "John"
tidepool-cli search "diabetes" --clinicId "custom-clinic-id"
```

### 6. List Clinics Command

**Command**: `tidepool-cli list:clinics`

**Description**: List available clinics

**Examples**:
```bash
tidepool-cli list:clinics
```

### 7. List Tags Command

**Command**: `tidepool-cli list:tags`

**Description**: List available tags

**Examples**:
```bash
tidepool-cli list:tags
```

### 8. Delete List Command

**Command**: `tidepool-cli delete:list`

**Description**: Delete patients by tag ID

**Flags**:
- `--clinicId, -g` (default: '633b559d1d64ad2c9471178b'): Clinic ID
- `--tagId, -h` (default: '6841e165edfe663ac4d8bff0'): Tag ID

**Examples**:
```bash
tidepool-cli delete:list
tidepool-cli delete:list --clinicId "custom-clinic-id" --tagId "custom-tag-id"
```

### 9. Suggest Command

**Command**: `tidepool-cli suggest`

**Description**: Get command suggestions based on history

**Examples**:
```bash
tidepool-cli suggest
```

## Core Library APIs

### Authentication & Credentials

#### `Credentials` Interface
```typescript
interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}
```

#### `CredentialsManager` Class
```typescript
class CredentialsManager {
  constructor();
  
  // Get the path where credentials are stored
  getCredentialsPath(): string;
  
  // Check if credentials file exists
  credentialsExist(): boolean;
  
  // Save credentials to file
  saveCredentials(credentials: Credentials): void;
  
  // Load credentials from file
  loadCredentials(): Credentials;
  
  // Delete credentials file
  deleteCredentials(): void;
}
```

**Usage**:
```typescript
import { CredentialsManager, Credentials } from './lib/credentials.js';

const manager = new CredentialsManager();
const credentials: Credentials = {
  userName: "user@example.com",
  password: "password123",
  baseUrl: "https://api.tidepool.org"
};

manager.saveCredentials(credentials);
const loaded = manager.loadCredentials();
```

### Patient Management

#### `createPatient<T>(username, password, baseUrl, clinicId, payload)`
Creates a new patient in the specified clinic.

**Parameters**:
- `username: string`: API username
- `password: string`: API password  
- `baseUrl: string`: Base API URL
- `clinicId: string`: Clinic ID
- `payload: T`: Patient creation payload

**Returns**: `Promise<string | null>` - Patient ID or null on failure

**Example**:
```typescript
import { createPatient } from './lib/createPatient.js';

const payload = {
  password: "tidepool",
  birthDate: '2000-01-01',
  fullName: "John Doe",
  tags: [],
  connectDexcom: false
};

const patientId = await createPatient(
  "user@example.com",
  "password123", 
  "https://api.tidepool.org",
  "clinic-id",
  payload
);
```

#### `getPatients(creds, clinicId, tagId)`
Retrieves patients by clinic and tag.

**Parameters**:
- `creds: Credentials`: Authentication credentials
- `clinicId: string`: Clinic ID
- `tagId: string`: Tag ID

**Returns**: `Promise<patientsList | null>`

**Example**:
```typescript
import { getPatients } from './lib/getPatients.js';

const patients = await getPatients(credentials, "clinic-id", "tag-id");
if (patients) {
  patients.data.forEach(patient => {
    console.log(`${patient.fullName}: ${patient.id}`);
  });
}
```

#### `deletePatient(username, password, baseUrl, patientId)`
Deletes a patient by ID.

**Parameters**:
- `username: string`: API username
- `password: string`: API password
- `baseUrl: string`: Base API URL  
- `patientId: string`: Patient ID to delete

**Returns**: `Promise<boolean>`

### Data Upload

#### `loginAndCreatePost(username, password, baseUrl, postData, dataSet, userId)`
Authenticates and uploads data to a patient.

**Parameters**:
- `username: string`: API username
- `password: string`: API password
- `baseUrl: string`: Base API URL
- `postData: TPostData1`: Data to upload
- `dataSet: TPostData2`: Dataset metadata
- `userId: string`: Target user ID

**Returns**: `Promise<unknown | null>`

**Example**:
```typescript
import { loginAndCreatePost } from './lib/loginAndUploadData.js';

const result = await loginAndCreatePost(
  "user@example.com",
  "password123",
  "https://api.tidepool.org", 
  postData,
  dataSet,
  "user-id"
);
```

#### `uploadToCustodial(start, end, clinicId, range, tir, count, patientId)`
Uploads CBG data to a patient with specific time range and TIR parameters.

**Parameters**:
- `start: Date`: Start date for data
- `end: Date`: End date for data
- `clinicId: string`: Clinic ID
- `range: number[]`: Blood glucose range [min, max]
- `tir: number`: Time in Range percentage
- `count: number`: Number of data points
- `patientId: string`: Patient ID

**Returns**: `Promise<void>`

### Dashboard Creation

#### `createDashboard(tirCounts, periodLength, clinicId, tagId, creds)`
Creates a comprehensive dashboard with multiple TIR scenarios.

**Parameters**:
- `tirCounts: Record<string, number>`: Counts for each TIR category
- `periodLength: number`: Length of data period in days
- `clinicId: string`: Clinic ID
- `tagId: string`: Tag ID
- `creds: Credentials`: Authentication credentials

**Returns**: `Promise<void>`

**Example**:
```typescript
import { createDashboard } from './lib/selectScenarios.js';

const tirCounts = {
  "Time below 3.0 mmol/L > 1%": 10,
  "Time below 3.9 mmol/L > 4%": 10,
  "Drop in Time in Range > 15%": 10,
  "Time in Range < 70%": 10,
  "CGM Wear Time <70%": 6,
  "Meeting Targets": 5
};

await createDashboard(tirCounts, 14, "clinic-id", "tag-id", credentials);
```

#### `createMedtronicDashboard(tirCounts, clinicId, tagId, creds)`
Creates a dashboard specifically for Medtronic devices.

**Parameters**:
- `tirCounts: number`: Number of patients to create
- `clinicId: string`: Clinic ID
- `tagId: string`: Tag ID
- `creds: Credentials`: Authentication credentials

**Returns**: `Promise<void>`

### Tag Management

#### `addTag(username, password, baseUrl, clinicId, patientIds, tagId)`
Adds a tag to multiple patients.

**Parameters**:
- `username: string`: API username
- `password: string`: API password
- `baseUrl: string`: Base API URL
- `clinicId: string`: Clinic ID
- `patientIds: string[]`: Array of patient IDs
- `tagId: string`: Tag ID to add

**Returns**: `Promise<unknown>`

### Clinic Management

#### `getClinics(creds)`
Retrieves list of available clinics.

**Parameters**:
- `creds: Credentials`: Authentication credentials

**Returns**: `Promise<unknown>`

### Search Functionality

#### `searchPatients(creds, clinicId, tagId, keyword)`
Searches for patients by keyword.

**Parameters**:
- `creds: Credentials`: Authentication credentials
- `clinicId: string`: Clinic ID
- `tagId: string`: Tag ID
- `keyword: string`: Search term

**Returns**: `Promise<unknown>`

## Utility Functions

### Time Shifting

#### `shiftJsonTimes(data, timezoneOffsetHours)`
Shifts all "time" fields in JSON data to align with current time.

**Parameters**:
- `data: any`: JSON data containing time fields
- `timezoneOffsetHours: number` (default: 0): Timezone offset in hours

**Returns**: `any` - Shifted JSON data

**Example**:
```typescript
import { shiftJsonTimes } from './lib/timeShifter.js';

const shiftedData = shiftJsonTimes(jsonData, -5); // EST timezone
```

#### `shiftJsonFile(inputFilePath, timezoneOffset, outputFilePath?)`
Processes a JSON file and shifts all timestamps.

**Parameters**:
- `inputFilePath: string`: Path to input JSON file
- `timezoneOffset: number | string`: Timezone offset or abbreviation
- `outputFilePath?: string`: Optional output file path

**Returns**: `Promise<any>`

**Example**:
```typescript
import { shiftJsonFile } from './lib/timeShifter.js';

await shiftJsonFile('data.json', -5); // EST timezone
await shiftJsonFile('data.json', 'EST', 'shifted-data.json');
```

#### `getTimezoneOffset(timezone)`
Gets timezone offset for common abbreviations.

**Parameters**:
- `timezone: string`: Timezone abbreviation (e.g., 'EST', 'JST')

**Returns**: `number` - Offset in hours

### Array Utilities

#### `resizeAndAdd3D<T>(array2D, array1D)`
Resizes 2D array and creates 3D array by pairing with 1D array.

**Parameters**:
- `array2D: T[][]`: 2D input array
- `array1D: T[]`: 1D reference array

**Returns**: `T[][][]` - 3D array

**Example**:
```typescript
import { resizeAndAdd3D } from './lib/Utils.js';

const array2D = [[1, 2, 3], [4, 5]];
const array1D = [100, 200];
const result = resizeAndAdd3D(array2D, array1D);
// Result: [[[1, 100], [2, 200]], [[4, 100], [5, 200]]]
```

#### `resizeAndAdd3DWithDefault<T>(array2D, array1D, defaultValue)`
Same as `resizeAndAdd3D` but with custom default value for padding.

**Parameters**:
- `array2D: T[][]`: 2D input array
- `array1D: T[]`: 1D reference array
- `defaultValue: T`: Default value for padding

**Returns**: `T[][][]` - 3D array

### Percentage Calculations

#### `calculatePercentageRoundUp(percentage, baseValue?)`
Calculates percentage with rounding up.

**Parameters**:
- `percentage: number`: Percentage value
- `baseValue: number` (default: 288): Base value for calculation

**Returns**: `PercentageResultRoundedUp`

**Example**:
```typescript
import { calculatePercentageRoundUp } from './lib/Utils.js';

const result = calculatePercentageRoundUp(25, 100);
// Result: { percentage: 25, exactValue: 25, roundedUp: 25, remainder: 75 }
```

#### `calculatePercentageRoundDown(percentage, baseValue?)`
Calculates percentage with rounding down.

**Parameters**:
- `percentage: number`: Percentage value
- `baseValue: number` (default: 288): Base value for calculation

**Returns**: `PercentageResultRoundedDown`

### Utility Functions

#### `sleep(ms)`
Creates a promise that resolves after specified milliseconds.

**Parameters**:
- `ms: number`: Milliseconds to sleep

**Returns**: `Promise<void>`

**Example**:
```typescript
import { sleep } from './lib/Utils.js';

await sleep(5000); // Sleep for 5 seconds
```

## Data Models

### Interfaces

#### `Credentials`
```typescript
interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}
```

#### `patientsList`
```typescript
interface patientsList {
  data: { fullName: string; id: string; }[];
}
```

#### `PercentageResultRoundedUp`
```typescript
interface PercentageResultRoundedUp {
  percentage: number;
  exactValue: number;
  roundedUp: number;
  remainder: number;
}
```

#### `PercentageResultRoundedDown`
```typescript
interface PercentageResultRoundedDown {
  percentage: number;
  exactValue: number;
  roundedDown: number;
  remainder: number;
}
```

## Authentication

The CLI uses Basic Authentication with the Tidepool API. Credentials are stored securely in the user's home directory at `~/credentials.json`.

### Authentication Flow

1. **Configure**: First run `tidepool-cli configure` to set up credentials
2. **Automatic Loading**: All commands automatically load credentials from the stored file
3. **Token Management**: The CLI handles session tokens automatically for API requests

### Security Notes

- Credentials are stored in plain text (consider using environment variables for production)
- Session tokens are managed automatically
- Credentials file is stored in user's home directory

## Examples

### Complete Workflow Example

```bash
# 1. Configure credentials
tidepool-cli configure --userName "user@tidepool.org" --password "password" --baseUrl "https://api.tidepool.org"

# 2. Create a dashboard with custom TIR counts
tidepool-cli dashboard --below3 15 --below39 8 --clinicId "my-clinic-id" --tagId "my-tag-id"

# 3. List created patients
tidepool-cli list:patients --clinicId "my-clinic-id" --tagId "my-tag-id"

# 4. Search for specific patients
tidepool-cli search "diabetes" --clinicId "my-clinic-id"

# 5. Clean up by deleting patients
tidepool-cli delete:list --clinicId "my-clinic-id" --tagId "my-tag-id"
```

### Programmatic Usage Example

```typescript
import { CredentialsManager } from './lib/credentials.js';
import { createDashboard } from './lib/selectScenarios.js';
import { getPatients } from './lib/getPatients.js';

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
  const patients = await getPatients(credentials, "clinic-id", "tag-id");
  console.log(`Created ${patients?.data.length || 0} patients`);
}

main().catch(console.error);
```

### Time Shifting Example

```typescript
import { shiftJsonFile } from './lib/timeShifter.js';

// Shift timestamps in a data file to current time
await shiftJsonFile('patient-data.json', -5); // EST timezone

// Or use timezone abbreviation
await shiftJsonFile('patient-data.json', 'EST', 'shifted-data.json');
```

## Error Handling

### Common Error Scenarios

1. **Authentication Errors**: Invalid credentials or expired tokens
2. **Network Errors**: Connection issues or API unavailability
3. **Validation Errors**: Invalid parameters or missing required fields
4. **File System Errors**: Issues with credential storage or data files

### Error Handling Patterns

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

### Debugging Tips

1. **Enable Verbose Logging**: Many functions include console.log statements for debugging
2. **Check Credentials**: Verify credentials are properly configured
3. **Validate Parameters**: Ensure all required parameters are provided
4. **Network Connectivity**: Verify API endpoint accessibility

## Contributing

When contributing to the tidepool-cli project:

1. Follow the existing TypeScript patterns
2. Add proper error handling
3. Include console.log statements for debugging
4. Update this documentation for new APIs
5. Test with various credential configurations

## License

This project is part of the Tidepool ecosystem. Please refer to the project's license file for usage terms. 