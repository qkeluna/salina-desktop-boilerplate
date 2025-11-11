# Windows Setup Guide for Salina Desktop

This guide will help you set up the development environment for Salina Desktop on Windows.

## Prerequisites

### 1. Node.js (Required)
- **Version:** 18.0.0 or higher
- **Download:** https://nodejs.org/en/download/
- **Verify installation:**
  ```cmd
  node --version
  npm --version
  ```

### 2. pnpm (Required)
- **Version:** 8.0.0 or higher
- **Install globally:**
  ```cmd
  npm install -g pnpm@8.15.0
  ```
- **Verify installation:**
  ```cmd
  pnpm --version
  ```

### 3. Windows Build Tools (Required for better-sqlite3)

The project uses `better-sqlite3`, a native Node.js module that requires compilation on Windows. You need C++ build tools installed.

#### Option A: Automated Installation (Recommended)

Run PowerShell as Administrator and execute:
```powershell
npm install -g windows-build-tools
```

This will install:
- Python 3.x
- Visual Studio Build Tools

**Note:** This process takes 5-15 minutes and requires an internet connection.

#### Option B: Manual Installation

1. **Install Visual Studio Build Tools 2022:**
   - Download from: https://visualstudio.microsoft.com/downloads/
   - Scroll down to "All Downloads" → "Tools for Visual Studio"
   - Download "Build Tools for Visual Studio 2022"
   - During installation, select:
     - ✅ Desktop development with C++
     - ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
     - ✅ Windows SDK

2. **Install Python:**
   - Download Python 3.9+ from: https://www.python.org/downloads/
   - ✅ Check "Add Python to PATH" during installation
   - Verify: `python --version`

3. **Configure npm to use the tools:**
   ```cmd
   npm config set msvs_version 2022
   npm config set python python
   ```

### 4. Git (Required)
- **Download:** https://git-scm.com/download/win
- **Recommended:** Use Git Bash for Unix-like commands

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd salina-desktop
```

### 2. Install Dependencies

```bash
pnpm install
```

**If you encounter the `better-sqlite3` error:**

```
Error: node-gyp failed to rebuild 'better-sqlite3'
```

**Solutions:**

#### Solution 1: Rebuild Native Modules
```bash
# Navigate to the desktop package
cd packages/desktop

# Rebuild electron native modules
npx electron-rebuild -f -w better-sqlite3

# Go back to root
cd ../..
```

#### Solution 2: Clean and Reinstall
```bash
# Clean everything
pnpm clean

# Remove node_modules
rmdir /s /q node_modules
rmdir /s /q packages\desktop\node_modules
rmdir /s /q packages\infrastructure\node_modules

# Remove pnpm lock
del pnpm-lock.yaml

# Reinstall
pnpm install
```

#### Solution 3: Force Rebuild After Install
```bash
# Install with rebuild
pnpm install
pnpm --filter @salina/desktop exec electron-rebuild
```

### 3. Verify Installation

```bash
# Check if all packages built successfully
pnpm build

# Try starting the app
pnpm dev
```

## Common Issues and Troubleshooting

### Issue 1: `node-gyp` Not Found

**Error:**
```
'node-gyp' is not recognized as an internal or external command
```

**Solution:**
```cmd
npm install -g node-gyp
node-gyp --version
```

### Issue 2: Python Not Found

**Error:**
```
gyp ERR! find Python - "python" is not in PATH
```

**Solution:**
1. Install Python 3.9+ from python.org
2. Add Python to PATH
3. Configure npm:
   ```cmd
   npm config set python python
   ```

### Issue 3: MSBuild Not Found

**Error:**
```
gyp ERR! find VS - msvs_version not set from command line or npm config
```

**Solution:**
1. Install Visual Studio Build Tools 2022 (see Prerequisites)
2. Configure npm:
   ```cmd
   npm config set msvs_version 2022
   ```

### Issue 4: Permission Denied

**Error:**
```
EPERM: operation not permitted
```

**Solution:**
- Close all applications (VSCode, terminals, file explorer)
- Run terminal as Administrator
- Try installation again

### Issue 5: Long Path Names

**Error:**
```
ENAMETOOLONG: name too long
```

**Solution:**
1. Enable long paths in Windows:
   ```cmd
   # Run PowerShell as Administrator
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```
2. Enable in Git:
   ```bash
   git config --system core.longpaths true
   ```
3. Clone repo closer to root (e.g., `C:\dev\salina-desktop`)

### Issue 6: Antivirus Blocking

Some antivirus software (Windows Defender, McAfee) may block node-gyp operations.

**Solution:**
- Temporarily disable antivirus during installation
- Add exceptions for:
  - Node.js installation directory
  - Project directory
  - `%APPDATA%\npm`
  - `%LOCALAPPDATA%\pnpm`

## Development Workflow

### Starting the App

```bash
# Start development server
pnpm dev
```

This will:
1. Compile TypeScript files
2. Start Vite dev server
3. Launch Electron app with hot reload

### Building the App

```bash
# Build all packages
pnpm build

# Package the desktop app
pnpm package

# Create distributable (Windows .exe installer)
pnpm make
```

### Running Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# E2E tests with UI
pnpm test:e2e:ui
```

## IDE Setup (Visual Studio Code)

### Recommended Extensions
- ESLint
- Prettier - Code formatter
- TypeScript Vue Plugin (Volar)
- Tailwind CSS IntelliSense
- SQLite Viewer

### Workspace Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

## Performance Optimization

### 1. Exclude Directories from Windows Defender

Add these directories to Windows Defender exclusions for faster builds:
- Project root directory
- `node_modules`
- `%APPDATA%\npm`
- `%LOCALAPPDATA%\pnpm`

**How to exclude:**
1. Open Windows Security
2. Virus & threat protection
3. Manage settings
4. Exclusions → Add an exclusion → Folder

### 2. Use SSD

Install the project on an SSD drive for significantly faster:
- Dependency installation
- Build times
- Hot reload

## Getting Help

If you encounter issues not covered here:

1. **Check Node.js and pnpm versions:**
   ```bash
   node --version  # Should be >= 18.0.0
   pnpm --version  # Should be >= 8.0.0
   ```

2. **Check build tools:**
   ```cmd
   node-gyp --version
   python --version
   ```

3. **Review detailed error logs:**
   ```bash
   # Install with verbose logging
   pnpm install --loglevel=verbose
   ```

4. **Search GitHub Issues:**
   - better-sqlite3: https://github.com/WiseLibs/better-sqlite3/issues
   - Electron Forge: https://github.com/electron/forge/issues

5. **Contact the team:**
   - Open an issue in the project repository
   - Check the main README.md for contact information

## Summary Checklist

Before starting development, ensure:

- ✅ Node.js 18+ installed
- ✅ pnpm 8+ installed globally
- ✅ Visual Studio Build Tools 2022 installed with C++
- ✅ Python 3.9+ installed and in PATH
- ✅ Git installed
- ✅ npm configured for build tools (`msvs_version`, `python`)
- ✅ Windows Defender exclusions added (optional, for performance)
- ✅ Project cloned
- ✅ Dependencies installed without errors (`pnpm install`)
- ✅ App starts successfully (`pnpm dev`)

---

**Built with ❤️ by the Salina Team**
