# Salina Desktop

<p align="center">
  <strong>Local-First Unified UI Platform</strong><br/>
  Built with Electron, React, TypeScript, and Domain-Driven Design
</p>

<p align="center">
  <img src="https://img.shields.io/badge/electron-39.0.0-blue" alt="Electron">
  <img src="https://img.shields.io/badge/react-19.2.0-blue" alt="React">
  <img src="https://img.shields.io/badge/typescript-5.9.3-blue" alt="TypeScript">
  <img src="https://img.shields.io/badge/pnpm-workspace-orange" alt="pnpm workspace">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

## 📖 Overview

Salina Desktop is a modern local-first desktop application that brings together powerful features for notes, file management, transcriptions, search, and more—all while prioritizing offline capabilities, data privacy, and performance.

### Key Features

- **🌐 Local-First Architecture** - All data stored locally with optional cloud sync
- **📝 Notes Management** - Rich text editor with full offline support
- **📁 File Management** - Organize and manage your files with metadata and thumbnails
- **🎙️ Transcriptions** - Video/audio transcription using FFmpeg and Whisper AI
- **🔍 Smart Search** - AI-powered local search with semantic understanding
- **🏠 Unified Dashboard** - Centralized view of all your activities
- **🔒 Privacy-First** - Your data stays on your device
- **⚡ High Performance** - Native desktop performance with Electron

### Architecture

Salina Desktop uses a **monorepo architecture** with **Domain-Driven Design (DDD)** and **MVVM pattern** for scalable, maintainable code organization:

```
salina-desktop/
├── packages/
│   ├── desktop/              # Electron desktop application
│   ├── shared/               # Shared utilities, types, hooks
│   ├── ui/                   # Shared UI component library (shadcn/ui)
│   ├── domains/              # Business domains (DDD)
│   │   ├── notes/           # Notes domain (MVVM)
│   │   ├── files/           # Files domain (MVVM)
│   │   ├── transcriptions/  # Transcriptions domain (MVVM)
│   │   ├── search/          # Search & Chat domain (MVVM)
│   │   └── home/            # Dashboard domain (MVVM)
│   └── infrastructure/       # Cross-cutting concerns
│       ├── database/        # SQLite + migrations
│       ├── sync/            # CRDT sync engine
│       ├── media/           # FFmpeg services
│       ├── ai/              # AI services (Whisper, Transformers.js)
│       ├── auth/            # Authentication
│       └── network/         # API client, WebSocket
└── docs/                    # Documentation
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (required for workspace management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url> salina-desktop
   cd salina-desktop
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development**
   ```bash
   pnpm dev
   ```

The Electron app will launch with hot reload enabled.

## 📦 Available Commands

### Development

```bash
pnpm dev                    # Start desktop app in development mode
pnpm start                  # Alias for dev
pnpm build                  # Build all packages
pnpm lint                   # Lint all packages
pnpm type-check             # TypeScript type checking across all packages
pnpm format                 # Format code with Prettier
pnpm format:check           # Check code formatting
```

### Testing

```bash
pnpm test                   # Run all unit tests
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Run tests with UI
pnpm test:coverage          # Run tests with coverage
pnpm test:e2e               # Run E2E tests (Playwright)
pnpm test:e2e:ui            # Run E2E tests with UI
pnpm test:e2e:headed        # Run E2E tests with visible browser
```

### Build & Package

```bash
pnpm package                # Package the desktop app
pnpm make                   # Create distributable packages
pnpm publish                # Publish the app
```

### Maintenance

```bash
pnpm clean                  # Clean all build artifacts and node_modules
pnpm clean:build            # Clean only build artifacts
```

## 🏗️ Monorepo Structure

### Packages

#### `packages/desktop`
The main Electron application that orchestrates all domains and provides the desktop shell.

**Key Technologies:**
- Electron 39.0
- Electron Forge (build & packaging)
- TanStack Router (type-safe routing)
- TanStack Query (data fetching)

#### `packages/shared`
Shared utilities, types, constants, and React hooks used across all packages.

**Exports:**
- `@salina/shared/types` - TypeScript types and interfaces
- `@salina/shared/utils` - Utility functions
- `@salina/shared/constants` - Application constants
- `@salina/shared/hooks` - Shared React hooks

#### `packages/ui`
Shared UI component library based on shadcn/ui and Radix UI primitives.

**Key Technologies:**
- shadcn/ui components (50+ components)
- Radix UI primitives
- Tailwind CSS 4.1
- Class Variance Authority (CVA)

**Exports:**
- All shadcn/ui components (Button, Dialog, Input, etc.)
- Theme system (light/dark/system modes)
- Tailwind CSS styles

#### `packages/infrastructure`
Infrastructure layer handling cross-cutting concerns.

**Modules:**
- **database/** - SQLite adapter, migrations, query builder
- **sync/** - CRDT sync engine for multi-device sync
- **media/** - FFmpeg service, audio/video processing
- **ai/** - Whisper bridge (Python), Transformers.js
- **auth/** - Authentication and security services
- **network/** - API client, WebSocket, sync queue

#### `packages/domains/*`
Business domains following **MVVM (Model-View-ViewModel)** pattern.

Each domain package structure:
```
packages/domains/<domain>/
├── models/         # Domain models (data structures)
├── viewmodels/     # ViewModels (Zustand stores for state)
├── views/          # React components (UI)
├── services/       # Business logic services
└── repositories/   # Data access layer (SQLite)
```

**Available Domains:**
- `@salina/domains-notes` - Notes management with rich text editing
- `@salina/domains-files` - File management and organization
- `@salina/domains-transcriptions` - Video/audio transcription
- `@salina/domains-search` - AI-powered search and chat
- `@salina/domains-home` - Dashboard and quick actions

## 🎨 Tech Stack

### Core Framework
- **Electron 39.0** - Cross-platform desktop framework
- **React 19.2** - UI library with concurrent features
- **TypeScript 5.9** - Type-safe development
- **Rolldown Vite 7.1** - Rust-based bundler for faster builds

### UI & Styling
- **shadcn/ui** - Complete component library (50+ components)
- **Radix UI** - Accessible component primitives
- **Tailwind CSS 4.1** - Utility-first styling
- **Lucide React** - Beautiful SVG icons (1000+ icons)
- **next-themes** - Advanced theme management

### State & Data Management
- **Zustand 5.0** - Lightweight state management (ViewModels)
- **TanStack Query 5.90** - Server state and data fetching
- **TanStack Router 1.134** - Type-safe routing
- **React Hook Form 7.66** - Performant form handling
- **Zod 4.1** - Schema validation

### Database & Sync
- **SQLite (better-sqlite3)** - Local database
- **CRDT** - Conflict-free replicated data types for sync
- **Vector Clocks** - Lamport timestamps for distributed sync

### Media & AI
- **FFmpeg 8.0** - Video/audio processing
- **Faster Whisper** - High-performance transcription (Python)
- **Transformers.js** - In-browser AI models
- **MiniSearch** - Full-text search indexing

### Testing & Quality
- **Vitest 4.0** - Fast unit testing
- **Playwright 1.56** - End-to-end testing
- **React Testing Library** - Component testing
- **ESLint 9** - Code linting
- **Prettier 3.6** - Code formatting

### Build & Deployment
- **Electron Forge 7.10** - Build toolchain
- **pnpm workspaces** - Monorepo package management
- **GitHub Actions** - CI/CD pipelines

## 📚 Development Guide

### Adding a New Domain

1. **Create domain package structure**
   ```bash
   mkdir -p packages/domains/<domain>/{models,viewmodels,views,services,repositories}
   ```

2. **Create package.json**
   ```json
   {
     "name": "@salina/domains-<domain>",
     "version": "1.0.0",
     "dependencies": {
       "@salina/shared": "workspace:*",
       "@salina/ui": "workspace:*",
       "@salina/infrastructure": "workspace:*",
       "zustand": "^5.0.2"
     }
   }
   ```

3. **Follow MVVM pattern**
   - **Models** - Plain TypeScript interfaces/types
   - **ViewModels** - Zustand stores for state management
   - **Views** - React components using UI library
   - **Services** - Business logic (pure functions)
   - **Repositories** - Data access (SQLite queries)

4. **Add to desktop package**
   ```typescript
   // packages/desktop/src/renderer/routes/<domain>.tsx
   import { DomainView } from '@salina/domains-<domain>/views';
   ```

### Working with the UI Library

Add new shadcn/ui components:
```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

Use components in domains:
```typescript
import { Button } from '@salina/ui/components/button';
import { Dialog } from '@salina/ui/components/dialog';
```

### Database Migrations

Create a new migration:
```bash
cd packages/infrastructure/database/migrations
touch 003_add_<feature>.sql
```

Migration template:
```sql
-- Migration: Add <feature>
CREATE TABLE IF NOT EXISTS <table> (
  id TEXT PRIMARY KEY,
  -- CRDT fields
  vector_clock TEXT,
  site_id TEXT,
  version INTEGER DEFAULT 1,
  -- Audit fields
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Testing Guidelines

**Unit Tests** (Vitest):
```typescript
// packages/domains/<domain>/services/<Service>.test.ts
import { describe, it, expect } from 'vitest';

describe('ServiceName', () => {
  it('should perform action', () => {
    // Test implementation
  });
});
```

**E2E Tests** (Playwright):
```typescript
// packages/desktop/tests/e2e/<feature>.spec.ts
import { test, expect } from '@playwright/test';

test('feature works correctly', async ({ page }) => {
  await page.goto('/feature');
  await expect(page).toHaveTitle(/Salina Desktop/);
});
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in the root:
```env
# Database
DATABASE_PATH=./salina.db

# Sync
SYNC_ENABLED=true
SYNC_ENDPOINT=https://api.example.com/sync

# AI Services
WHISPER_MODEL=base
WHISPER_DEVICE=cpu

# Feature Flags
ENABLE_TRANSCRIPTIONS=true
ENABLE_AI_SEARCH=true
```

### TypeScript Configuration

The monorepo uses TypeScript project references for fast, incremental builds:
- `tsconfig.json` - Root configuration
- `tsconfig.base.json` - Base configuration for all packages
- `packages/*/tsconfig.json` - Package-specific configurations

## 🚢 Building for Production

### Local Build

```bash
# Build all packages
pnpm build

# Package the app
pnpm package

# Create distributables
pnpm make
```

Output will be in `packages/desktop/out/` directory.

### Platform-Specific Builds

**Windows:**
- Squirrel installer (.exe)
- ZIP portable

**macOS:**
- ZIP archive

**Linux:**
- DEB package
- RPM package

### CI/CD (GitHub Actions)

The repository includes workflows for automated builds:

- **Build Workflow** - Triggered on push to main, PRs, and tags
- **Release Workflow** - Manual or tag-based releases

Create a release:
```bash
git tag v1.0.0
git push origin v1.0.0
```

## 📖 Documentation

- **Architecture** - See `docs/architecture_interactive_enhanced.html`
- **CLAUDE.md** - Development guide for AI assistance
- **Migration Guide** - See migration documentation for micro-frontend to monorepo transition

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the MVVM pattern
4. Write tests for your changes
5. Run linting and type checking (`pnpm lint && pnpm type-check`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Style

- Follow TypeScript strict mode
- Use functional components with hooks
- Follow MVVM pattern for domains
- Use Zustand for state management
- Write tests for business logic
- Document complex functions with JSDoc

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [electron-shadcn](https://github.com/rohitsoni007/electron-shadcn) boilerplate
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Architecture inspired by local-first software principles

---

**Happy coding! 🚀**

Built with ❤️ by the Salina Team
