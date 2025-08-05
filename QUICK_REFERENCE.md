# Tidepool CLI - Quick Reference Guide

## Installation & Setup

```bash
# Install globally
npm install -g tidepool-cli

# Configure credentials (uses secure Credentials object)
tidepool-cli configure --userName "user@tidepool.org" --password "password" --baseUrl "https://api.tidepool.org"
```

## Common CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `configure` | Set up credentials | `tidepool-cli configure -u "user" -p "pass" -b "https://api.tidepool.org"` |
| `dashboard` | Create test dashboard | `tidepool-cli dashboard --below3 10 --below39 8` |
| `dashboard:offset` | Create dashboard with time offset | `tidepool-cli dashboard:offset --below3 5 --below39 5` |
| `list:patients` | List patients by tag | `tidepool-cli list:patients --clinicId "clinic-id"` |
| `search` | Search patients | `tidepool-cli search "diabetes"` |
| `list:clinics` | List available clinics | `tidepool-cli list:clinics` |
| `list:tags` | List available tags | `tidepool-cli list:tags` |
| `delete:list` | Delete patients by tag | `tidepool-cli delete:list --tagId "tag-id"` |
| `suggest` | Get command suggestions | `tidepool-cli suggest` |

## Core API Functions

### Authentication
```typescript
import { CredentialsManager } from './lib/credentials.js';

const manager = new CredentialsManager();
const credentials = manager.loadCredentials();
```

### Patient Management
```typescript
import { createPatient } from './lib/createPatient.js';
import { fetchPatientsByClinicAndTag } from './lib/fetchPatients.js';
import { deletePatient } from './lib/deletePatient.js';

// Create patient
const patientId = await createPatient(credentials, clinicId, payload);

// Get patients
const patients = await fetchPatientsByClinicAndTag(credentials, clinicId, tagId);

// Delete patient
const success = await deletePatient(credentials, patientId);
```

### Dashboard Creation
```typescript
import { createDashboard } from './lib/dashboardScenarioSelector.js';
import { createMedtronicDashboard } from './lib/dashboardScenarioSelector.js';

const tirCounts = {
  "Time below 3.0 mmol/L > 1%": 10,
  "Time below 3.9 mmol/L > 4%": 10,
  "Meeting Targets": 5
};

await createDashboard(tirCounts, 14, clinicId, tagId, credentials);
await createMedtronicDashboard(5, clinicId, tagId, credentials);
```

### Data Upload
```typescript
import { uploadToCustodial } from './lib/uploadToCustodial.js';

// Upload CBG data
await uploadToCustodial(start, end, clinicId, [3.9, 10.1], 75, 288, patientId, credentials);
```

### Time Shifting
```typescript
import { shiftJsonTimes, shiftJsonFile } from './lib/timeShifter.js';

// Shift JSON data
const shiftedData = shiftJsonTimes(jsonData, -5); // EST timezone

// Shift file
await shiftJsonFile('data.json', 'EST', 'shifted-data.json');
```

### Utility Functions
```typescript
import { sleep, calculatePercentageRoundUp } from './lib/Utils.js';

// Sleep
await sleep(5000); // 5 seconds

// Percentage calculation
const result = calculatePercentageRoundUp(25, 100);
// { percentage: 25, exactValue: 25, roundedUp: 25, remainder: 75 }
```

## Data Models

### Credentials
```typescript
interface Credentials {
  userName: string;
  password: string;
  baseUrl: string;
}
```

### Patient
```typescript
interface Patient {
  fullName: string;
  id: string;
}
```

### TIR Counts
```typescript
interface TIRCounts {
  "Time below 3.0 mmol/L > 1%": number;
  "Time below 3.9 mmol/L > 4%": number;
  "Drop in Time in Range > 15%": number;
  "Time in Range < 70%": number;
  "CGM Wear Time <70%": number;
  "Meeting Targets": number;
}
```

## Error Handling Pattern

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

## Common Workflows

### 1. Create Test Dashboard
```typescript
import { CredentialsManager } from './lib/credentials.js';
import { createDashboard } from './lib/dashboardScenarioSelector.js';

const manager = new CredentialsManager();
const credentials = manager.loadCredentials();

const tirCounts = {
  "Time below 3.0 mmol/L > 1%": 5,
  "Time below 3.9 mmol/L > 4%": 5,
  "Meeting Targets": 3
};

await createDashboard(tirCounts, 14, "clinic-id", "tag-id", credentials);
```

### 2. List and Search Patients
```typescript
import { fetchPatientsByClinicAndTag } from './lib/fetchPatients.js';
import { searchPatients } from './lib/patientSearch.js';

// List patients
const patients = await fetchPatientsByClinicAndTag(credentials, clinicId, tagId);
patients?.forEach(patient => {
  console.log(`${patient.fullName}: ${patient.id}`);
});

// Search patients
const searchResults = await searchPatients(credentials, clinicId, tagId, "diabetes");
```

### 3. Time Shift Data Files
```typescript
import { shiftJsonFile } from './lib/timeShifter.js';

// Shift to EST timezone
await shiftJsonFile('patient-data.json', -5);

// Shift to JST timezone
await shiftJsonFile('patient-data.json', 'JST', 'shifted-data.json');
```

## CLI Flag Reference

### Dashboard Command Flags
- `--below3, -a`: Time below 3.0 mmol/L > 1% (default: 10)
- `--below39, -b`: Time below 3.9 mmol/L > 4% (default: 10)
- `--drop, -c`: Drop in Time in Range > 15% (default: 10)
- `--lesstir70, -d`: Time in Range < 70% (default: 10)
- `--lesscgm70, -e`: CGM Wear Time <70% (default: 6)
- `--meetingTargets, -f`: Meeting Targets (default: 5)
- `--clinicId, -g`: Clinic ID (default: '633b559d1d64ad2c9471178b')
- `--tagId, -h`: Tag ID (default: '6841e165edfe663ac4d8bff0')

### Common Flags
- `--clinicId, -g`: Clinic ID
- `--tagId, -h`: Tag ID
- `--userName, -u`: Username for authentication
- `--password, -p`: Password for authentication
- `--baseUrl, -b`: Base URL for API endpoints

## Troubleshooting

### Common Issues

1. **Authentication Error**: Ensure credentials are set using `tidepool-cli configure` (uses Credentials object)
2. **Network Error**: Check API endpoint accessibility
3. **Invalid Parameters**: Verify all required flags are provided
4. **Missing Environment Variables**: Run `tidepool-cli configure --check` to verify setup

### Debug Tips

- All functions use clear, scoped variable names and consistent import naming
- Check environment variables with `tidepool-cli configure --check`
- Validate parameters before API calls
- Use try-catch blocks for error handling

## TypeScript Support

Import types for full TypeScript support:

```typescript
import type {
  Credentials,
  Patient,
  TIRCounts,
  PercentageResultRoundedUp
} from './types.js';
```

## Performance Notes

- API calls are asynchronous - use `await` or `.then()`
- Consider rate limiting for bulk operations
- Use `sleep()` function for delays between operations
- Large datasets may require pagination

## Security Considerations

- Credentials are managed via the Credentials object and stored securely
- No plain-text credential files are stored on disk
- Session tokens are managed automatically
- Use different accounts for development and production
- Validate all input parameters before API calls