# Data Migration and Phone Verification Guide

## 1. Overview
This migration process was implemented to enforce mandatory phone number verification for all users. It involved a complete system cleanup to ensure all active users have verified phone numbers going forward.

## 2. Migration Process
The migration was performed using the `backend/src/scripts/migration_cleanup.js` script.

### Steps performed:
1.  **Backup**: All existing users, ideas, collaboration requests, conversations, messages, and notifications were backed up into a JSON file located in `backend/backups/`.
2.  **Cleanup**: All records were systematically removed from the database to enforce the new registration requirements.
3.  **Schema Update**: The `User` model was updated to make the `phone` field:
    *   Required (`required: true`)
    *   Unique (`unique: true`)
    *   Validated (E.164 format: `+` followed by 1-3 digits country code and 4-14 digits number).

## 3. New Registration Flow
All new registrations now require SMS verification:
1.  User enters their details and phone number.
2.  User clicks "Send Code".
3.  An OTP is sent via SMS (Mocked in `backend/src/utils/smsProvider.js`).
4.  User enters the 6-digit code.
5.  User clicks "Create Account", which verifies the code on the backend before creating the user record.

## 4. Rollback Procedures
In case of critical issues with the migration, follow these steps to restore data:

### Restore from Backup:
1.  Locate the latest backup file in `backend/backups/backup-YYYY-MM-DDTHH-mm-ss-SSSZ.json`.
2.  Create a restoration script that:
    *   Reads the JSON backup.
    *   Iterates through each collection (users, ideas, etc.).
    *   Uses `insertMany()` to restore records.
    *   *Note*: Restored users will need to update their phone numbers to meet the new format requirements if they don't already.

### Reverting Schema Changes:
1.  Open `backend/src/models/User.js`.
2.  Remove the `validate` constraint and `required: true` from the `phone` field if necessary.
3.  Update `backend/src/controllers/authController.js` to remove the OTP verification check in `registerUser`.

## 5. Verification
The migration and new requirements were verified using:
*   **Unit Tests**: `backend/src/test/phoneRegistration.test.js`
*   **Migration Tests**: `backend/src/test/migration.test.js`

To run tests:
```bash
cd backend
npm test src/test/phoneRegistration.test.js src/test/migration.test.js
```
