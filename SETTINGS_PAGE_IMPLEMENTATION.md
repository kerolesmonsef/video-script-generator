# Settings Page Implementation

## Overview
Created a new Settings page with OpenRouter token configuration that saves to Firebase.

## Files Created

### 1. `/src/pages/SettingsPage.jsx`
- **Purpose**: Settings page component with OpenRouter token input
- **Features**:
  - Password-type input field for secure token entry
  - Individual save button beside the input (not a form)
  - Real-time loading state with spinner animation
  - Success/error feedback messages
  - Loads existing token from Firebase on mount
  - Modern, animated UI with gradient backgrounds

### 2. `/src/components/css/SettingsPage.scss`
- **Purpose**: Styling for the settings page
- **Features**:
  - Gradient backgrounds with glassmorphism effect
  - Smooth animations (fadeInUp, spin, shake, slideIn)
  - Responsive design for mobile devices
  - Modern button states (normal, loading, saved)
  - Professional color scheme with purple gradients

## Files Modified

### 1. `/src/services/firebaseService.js`
**Added two new methods:**

#### `setConfig(key, value)`
- Saves a configuration key-value pair to Firebase
- Uses `setDoc` to store config in `config` collection
- Document ID is the key name for easy retrieval
- Includes timestamp tracking

#### `getConfig(key)`
- Retrieves a configuration value by key
- Uses `getDoc` for direct document access
- Returns `null` if config doesn't exist
- Handles Firebase not configured gracefully

**New imports added:**
- `setDoc` - for setting documents with specific IDs
- `getDoc` - for retrieving specific documents

### 2. `/src/App.jsx`
- Added import for `SettingsPage`
- Added route: `/settings` → `<SettingsPage />`

### 3. `/src/components/js/Sidebar.jsx`
- Added `FaCog` (gear icon) import from react-icons
- Added Settings navigation link with gear icon
- Link text: "الإعدادات (Settings)"

## Firebase Structure

### Collection: `config`
Each document represents a configuration key:
```
config/
  └── openRouterToken/
      ├── value: "sk-or-v1-..."
      ├── updatedAt: <timestamp>
      └── createdAt: "2026-02-08T..."
```

## Usage

1. Navigate to Settings page via sidebar (gear icon)
2. Enter OpenRouter API token in the password field
3. Click "Save" button
4. Token is saved to Firebase `config` collection
5. Success message appears confirming save
6. Token persists and loads automatically on next visit

## Future Extensibility

The settings page is designed to accommodate more fields in the future:
- Each field can have its own save button
- No form submission required
- Easy to add new configuration options
- Consistent UI pattern for all settings

## Technical Notes

- **Not a form**: Each input has its own save button for independent saving
- **Password field**: Token is hidden for security
- **Firebase integration**: Uses the new `setConfig`/`getConfig` methods
- **Error handling**: Gracefully handles Firebase not configured
- **Loading states**: Visual feedback during save operations
- **Responsive**: Works on mobile and desktop devices
