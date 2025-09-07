# Settings Page Functionality

## Overview

The settings page allows logged-in users to update their profile information, change their password, and manage notification preferences.

## Features

### 1. Profile Information

- **Full Name** (required)
- **Email Address** (read-only, cannot be changed)
- **Phone Number**
- **Nationality** (dropdown selection)
- **Passport Information** (number and expiry date)
- **Address Information** (street, city, country, postal code)

### 2. Security Settings

- **Password Change** with validation:
  - Minimum 6 characters
  - Password confirmation matching
  - Current password verification

### 3. Notification Preferences

- Email notifications
- SMS notifications
- Booking updates
- Price alerts
- Travel reminders

### 4. Account Status

- Email verification status
- Account status
- Member since date
- Last updated date

## Technical Implementation

### Data Storage

- User profile data is stored in Supabase Auth user metadata
- All updates are handled through Supabase Auth API
- Real-time updates with automatic page refresh

### Validation

- Client-side validation for required fields
- Password strength validation
- Form submission prevention when invalid

### Error Handling

- Comprehensive error messages
- Loading states during updates
- Success feedback with auto-dismiss

### Security

- Authentication required to access settings
- Secure password updates through Supabase Auth
- Session validation for all operations

## Usage

1. **Access**: Navigate to `/settings` (requires authentication)
2. **Update Profile**: Fill in the form and click "Save Profile"
3. **Change Password**: Enter new password and confirmation, click "Update Password"
4. **Manage Notifications**: Toggle switches for different notification types

## API Endpoints

- `POST /api/profile/update` - Update user profile (alternative implementation)
- Direct Supabase Auth integration for real-time updates

## User Experience

- **Loading States**: Buttons show loading during operations
- **Success Messages**: Green success notifications with auto-dismiss
- **Error Messages**: Red error notifications with specific error details
- **Form Validation**: Real-time validation with disabled submit when invalid
- **Auto-refresh**: Page refreshes after successful updates to show new data

## Testing

To test the settings functionality:

1. Log in to your account
2. Navigate to `/settings`
3. Update your profile information
4. Click "Save Profile"
5. Verify the success message appears
6. Check that the page refreshes with updated data
7. Test password change functionality
8. Verify notification preferences can be toggled

The settings page provides a complete user management experience with proper validation, error handling, and user feedback.
