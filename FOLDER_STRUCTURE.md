# Vidacure Web - Folder Structure

This document explains the improved folder structure for the Vidacure web application.

## Overview

The project has been restructured to follow React best practices with proper separation of concerns:

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Alert, etc.)
│   └── layout/         # Layout components (Header, Footer, etc.)
├── pages/              # Page components (different views)
├── hooks/              # Custom React hooks
├── services/           # API services and business logic
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── lib/                # Shared utilities and re-exports
├── assets/             # Static assets
├── App.tsx             # Main App component
├── main.tsx            # Application entry point
├── index.css           # Global styles
└── config.ts           # Configuration file
```

## Folder Descriptions

### `/components`
Reusable UI components organized by purpose:
- `ui/` - Basic UI components like buttons, alerts, loading spinners
- `layout/` - Layout-related components like headers, footers, main layout

### `/pages`
Top-level page components representing different views:
- `LoginPage.tsx` - Authentication page
- `DashboardPage.tsx` - Main dashboard after login

### `/hooks`
Custom React hooks for shared stateful logic:
- `useAuth.ts` - Authentication state management

### `/services`
API services and business logic:
- `api.ts` - Axios configuration and API client
- `auth.ts` - Authentication service methods

### `/utils`
Pure utility functions:
- `device.ts` - Device detection utilities
- `cookies.ts` - Cookie management utilities

### `/types`
TypeScript type definitions:
- `auth.ts` - Authentication-related types
- `index.ts` - Main types export

### `/constants`
Application constants and configuration re-exports

### `/lib`
Shared utilities and common re-exports for easy importing

## Benefits of This Structure

1. **Separation of Concerns**: Each folder has a specific purpose
2. **Reusability**: Components and utilities are easily reusable
3. **Maintainability**: Easy to find and modify specific functionality
4. **Scalability**: Structure can grow with the application
5. **Type Safety**: Proper TypeScript organization
6. **Testing**: Easy to test individual components and services

## Import Examples

```typescript
// Import UI components
import { Button, Alert } from '../components/ui';

// Import layout components
import { MainLayout } from '../components/layout';

// Import hooks
import { useAuth } from '../hooks';

// Import services
import { AuthService } from '../services';

// Import utilities
import { getClientType, getCookie } from '../utils';

// Import types
import type { User, AuthState } from '../types';
```

## Migration Notes

The original `App.tsx` file has been refactored to:
- Use the custom `useAuth` hook for state management
- Import modular components instead of inline code
- Maintain the same functionality with better organization

All existing functionality has been preserved while improving code organization and maintainability.
