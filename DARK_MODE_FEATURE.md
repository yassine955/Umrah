# Dark Mode Feature

## Overview

Added a comprehensive dark mode toggle to the Umrah Dashboard, allowing users to switch between light, dark, and system themes.

## Features

### 1. Theme Toggle Component

- **Location**: Next to profile image in navbar
- **Options**: Light, Dark, System (follows OS preference)
- **Icons**: Sun/Moon icons with smooth transitions
- **Dropdown Menu**: Clean interface for theme selection

### 2. Theme Provider

- **Context**: React context for theme management
- **Persistence**: Saves preference to localStorage
- **System Detection**: Automatically detects OS theme preference
- **Real-time Updates**: Instant theme switching

### 3. Dark Mode Styles

- **CSS Variables**: Complete dark mode color scheme
- **Component Support**: All shadcn/ui components support dark mode
- **Smooth Transitions**: Animated theme switching
- **Accessibility**: Proper contrast ratios maintained

## Technical Implementation

### Theme Provider (`src/components/theme-provider.tsx`)

```typescript
type Theme = "dark" | "light" | "system";

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});
```

### Theme Toggle (`src/components/theme-toggle.tsx`)

- **Dropdown Menu**: Clean selection interface
- **Icon Animation**: Smooth sun/moon transitions
- **Accessibility**: Screen reader support

### CSS Variables

- **Light Mode**: Bright, clean color scheme
- **Dark Mode**: Dark backgrounds with light text
- **Automatic**: Components automatically adapt

## User Experience

### Theme Options

1. **Light Mode**: Traditional bright interface
2. **Dark Mode**: Dark interface for low-light usage
3. **System**: Automatically follows OS preference

### Visual Design

- **Toggle Button**: Clean icon button in navbar
- **Dropdown Menu**: Easy theme selection
- **Smooth Transitions**: Animated theme switching
- **Consistent**: All pages and components support dark mode

### Persistence

- **localStorage**: Theme preference saved locally
- **Session Persistence**: Maintains theme across browser sessions
- **Default**: System preference on first visit

## Usage

### For Users

1. **Click Theme Toggle**: Sun/moon icon in navbar
2. **Select Theme**: Choose Light, Dark, or System
3. **Instant Switch**: Theme changes immediately
4. **Persistent**: Preference saved automatically

### For Developers

```typescript
import { useTheme } from "@/components/theme-provider";

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme("dark")}>Switch to Dark</button>
    </div>
  );
}
```

## Benefits

### User Experience

- **Eye Comfort**: Dark mode reduces eye strain
- **Battery Saving**: Dark pixels use less power on OLED screens
- **Personal Preference**: Users can choose their preferred theme
- **System Integration**: Follows OS theme automatically

### Technical Benefits

- **CSS Variables**: Easy theme customization
- **Component Support**: All UI components work in both themes
- **Performance**: No runtime theme calculations
- **Accessibility**: Proper contrast ratios maintained

## Implementation Details

### Provider Setup

```typescript
// In providers.tsx
<ThemeProvider defaultTheme="system" storageKey="umrah-theme">
  <QueryClientProvider client={queryClient}>
    <SupabaseContext.Provider value={{ user, session, loading }}>
      {children}
    </SupabaseContext.Provider>
  </QueryClientProvider>
</ThemeProvider>
```

### CSS Variables

- **Light**: `--background: oklch(0.9900 0 0)`
- **Dark**: `--background: oklch(0 0 0)`
- **Automatic**: Components use `bg-background` class

### Theme Detection

- **System**: `window.matchMedia("(prefers-color-scheme: dark)")`
- **Manual**: User selection via dropdown
- **Persistence**: localStorage with fallback to system

## Future Enhancements

- **Custom Themes**: User-defined color schemes
- **Scheduled Themes**: Auto-switch based on time
- **Component Themes**: Individual component theme overrides
- **Theme Animations**: More sophisticated transition effects

The dark mode feature provides a modern, accessible, and user-friendly theme switching experience! 🌙☀️
