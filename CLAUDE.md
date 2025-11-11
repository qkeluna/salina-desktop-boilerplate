# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Salina Desktop** is a local-first desktop application built using a **monorepo architecture** with **Domain-Driven Design (DDD)** and **MVVM (Model-View-ViewModel)** patterns. The application provides unified access to notes, file management, transcriptions, AI-powered search, and a centralized dashboard—all with offline-first capabilities.

**Tech Stack:**
- **Electron 39.0** - Desktop framework (main, preload, renderer processes)
- **React 19.2** with React Compiler - Automatic memoization and performance optimizations
- **TypeScript 5.9** - Strict type checking enabled
- **pnpm workspaces** - Monorepo package management
- **Rolldown Vite 7.1** - Rust-based bundler (faster than traditional Vite)
- **TanStack Router 1.134** - Type-safe file-based routing
- **Zustand 5.0** - Lightweight state management (ViewModels)
- **shadcn/ui** - Complete component library (50+ components)
- **Tailwind CSS 4.1** - Utility-first styling
- **SQLite (better-sqlite3)** - Local database with CRDT sync capabilities

## Essential Commands

### Development
```bash
pnpm dev                    # Start Electron desktop app in development mode
pnpm start                  # Alias for dev
pnpm build                  # Build all packages in the monorepo
pnpm lint                   # Lint all packages
pnpm type-check             # TypeScript type checking across all packages
pnpm format                 # Format code with Prettier
pnpm format:check           # Check code formatting
```

### Package-Specific Commands
```bash
pnpm --filter @salina/desktop dev           # Run desktop package only
pnpm --filter @salina/ui build              # Build UI package only
pnpm --filter @salina/ui storybook          # Start Storybook UI component explorer
pnpm --filter @salina/domains-notes test    # Test notes domain only
pnpm -r build                               # Build all packages (recursive)
```

### Storybook Commands
```bash
pnpm --filter @salina/ui storybook          # Start Storybook dev server (http://localhost:6006)
pnpm --filter @salina/ui build-storybook    # Build static Storybook for deployment
```

### Testing
```bash
# Unit tests (Vitest + React Testing Library)
pnpm test                   # Run all unit tests across all packages
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Run tests with interactive UI
pnpm test:coverage          # Run tests with coverage report

# E2E tests (Playwright)
pnpm test:e2e               # Run E2E tests headless
pnpm test:e2e:ui            # Run E2E tests with Playwright UI
pnpm test:e2e:headed        # Run E2E tests with visible browser
```

### Building and Packaging
```bash
pnpm package                # Package the desktop app (creates executable)
pnpm make                   # Create platform-specific distributables
pnpm publish                # Publish the app
```

### Maintenance
```bash
pnpm clean                  # Clean all build artifacts and node_modules
pnpm clean:build            # Clean only build artifacts (.vite, out, dist)
```

### Rebuilding Native Modules
```bash
pnpm --filter @salina/desktop rebuild    # Rebuild Electron native modules (better-sqlite3)
```

## Troubleshooting

### Windows Setup Issues

**Problem:** `better-sqlite3` build errors on Windows

**Root Cause:** Native Node.js modules require C++ build tools

**Solution:**
1. **Install Visual Studio Build Tools 2022** with "Desktop development with C++"
2. **Install Python 3.9+** and add to PATH
3. See [WINDOWS_SETUP.md](WINDOWS_SETUP.md) for complete step-by-step guide

**Quick Fixes:**
```bash
# Option 1: Rebuild native modules
pnpm --filter @salina/desktop rebuild

# Option 2: Clean and reinstall
pnpm clean
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Option 3: Manual electron-rebuild (if postinstall fails)
cd packages/desktop
npx electron-rebuild -f -w better-sqlite3
```

**Common Windows Build Errors:**

1. **`node-gyp` not found:**
   ```cmd
   npm install -g node-gyp
   ```

2. **Python not found:**
   ```cmd
   # Configure npm to use Python
   npm config set python python
   ```

3. **MSBuild not found:**
   ```cmd
   # Configure npm to use Visual Studio 2022
   npm config set msvs_version 2022
   ```

### macOS/Linux Issues

**Permission Errors:**
```bash
sudo chown -R $(whoami) ~/.pnpm-store
sudo chown -R $(whoami) ~/.npm
```

**Xcode Command Line Tools (macOS):**
```bash
xcode-select --install
```

### TypeScript Errors

**After pulling changes:**
```bash
pnpm clean:build
pnpm build
pnpm type-check
```

**Stale route types:**
```bash
pnpm --filter @salina/desktop routes:generate
```

### Port Conflicts

**Port 5173 (Vite) already in use:**
```bash
# macOS/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**Port 6006 (Storybook) already in use:**
```bash
# macOS/Linux
lsof -ti:6006 | xargs kill -9

# Windows
netstat -ano | findstr :6006
taskkill /PID <PID> /F
```

### Dependency Issues

**Pnpm workspace resolution errors:**
```bash
# Clear pnpm cache
pnpm store prune

# Reinstall
pnpm install --force
```

**Peer dependency warnings:**
- These are expected with pnpm workspaces
- The `.npmrc` file has `strict-peer-dependencies=false` to allow this

## Architecture

### Monorepo Structure (pnpm Workspaces)

```
salina-desktop/
├── packages/
│   ├── desktop/              # Electron app (main + renderer)
│   ├── shared/               # Shared utilities, types, hooks, constants
│   ├── ui/                   # Shared UI component library (shadcn/ui)
│   ├── domains/              # Business domains (DDD + MVVM)
│   │   ├── notes/           # Notes management
│   │   ├── files/           # File management
│   │   ├── transcriptions/  # Video/audio transcription
│   │   ├── search/          # AI-powered search & chat
│   │   └── home/            # Dashboard
│   └── infrastructure/       # Cross-cutting concerns
│       ├── database/        # SQLite + migrations
│       ├── sync/            # CRDT sync engine
│       ├── media/           # FFmpeg services
│       ├── ai/              # AI services (Whisper, Transformers.js)
│       ├── python/          # Python bridge for Faster Whisper
│       ├── auth/            # Authentication
│       └── network/         # API client, WebSocket
├── tests/                   # Root-level E2E tests
├── docs/                    # Architecture documentation
├── pnpm-workspace.yaml      # pnpm workspace configuration
├── tsconfig.json            # Root TypeScript configuration (project references)
└── tsconfig.base.json       # Base TypeScript configuration for all packages
```

### Package Dependencies

**Dependency Graph:**
```
@salina/desktop
  ├─→ @salina/shared
  ├─→ @salina/ui
  │     └─→ @salina/shared (peer)
  ├─→ @salina/infrastructure
  │     └─→ @salina/shared
  └─→ @salina/domains-* (notes, files, transcriptions, search, home)
        ├─→ @salina/shared
        ├─→ @salina/ui
        └─→ @salina/infrastructure
```

**Workspace Protocol:** All internal dependencies use `workspace:*` protocol for automatic linking.

### Domain-Driven Design (DDD) + MVVM Pattern

Each domain package follows a consistent MVVM architecture:

```
packages/domains/<domain>/
├── models/         # Domain models (Plain TypeScript interfaces/types)
├── viewmodels/     # ViewModels (Zustand stores for state management)
├── views/          # React components (UI layer)
├── services/       # Business logic (pure functions)
├── repositories/   # Data access layer (SQLite queries)
├── index.ts        # Package entry point
├── package.json    # Package configuration
└── tsconfig.json   # TypeScript configuration
```

**MVVM Responsibilities:**
- **Models** - Data structures, domain entities (e.g., `Note`, `File`, `Transcription`)
- **ViewModels** - State management using Zustand, expose data and actions to Views
- **Views** - React components that consume ViewModels and render UI using `@salina/ui`
- **Services** - Business logic (validation, transformation, orchestration)
- **Repositories** - Data persistence to SQLite, CRDT sync operations

### Electron Process Model

1. **Main Process** (`packages/desktop/src/main/index.ts`):
   - Creates and manages BrowserWindow instances
   - Handles IPC communication with renderer
   - Manages database, file system, Python bridge
   - Provides native OS integrations

2. **Preload Script** (`packages/desktop/src/preload/index.ts`):
   - Runs in isolated context before renderer
   - Exposes secure APIs to renderer via context bridge
   - Bridge between main and renderer processes

3. **Renderer Process** (`packages/desktop/src/renderer/`):
   - React application entry point (main.tsx)
   - TanStack Router for routing
   - Integrates all domain packages
   - Uses @salina/ui components

### Vite Multi-Config Setup

The desktop package uses three separate Vite configurations:

1. **`vite.main.config.mts`** - Main process bundling
2. **`vite.preload.config.mts`** - Preload script bundling
3. **`vite.renderer.config.mts`** - Renderer (React) bundling with:
   - TanStack Router plugin for route generation
   - React SWC for fast refresh
   - Babel plugin for React Compiler
   - Tailwind CSS plugin
   - Path aliases for workspace packages

**Configuration:** `packages/desktop/forge.config.ts` orchestrates all three configs via Electron Forge.

## Package Details

### `packages/desktop`

**Purpose:** Main Electron application that orchestrates all domains.

**Key Files:**
- `src/main/index.ts` - Electron main process entry
- `src/preload/index.ts` - Context bridge for IPC
- `src/renderer/main.tsx` - React renderer entry
- `src/renderer/App.tsx` - Root React component
- `src/renderer/routes/` - TanStack Router file-based routes
- `forge.config.ts` - Electron Forge configuration
- `vite.*.config.mts` - Vite configurations for main/preload/renderer

**Dependencies:** All workspace packages (`@salina/*`)

**Scripts:**
- `pnpm dev` - Start in development mode
- `pnpm package` - Create executable
- `pnpm make` - Create distributables

### `packages/shared`

**Purpose:** Shared utilities, types, constants, and React hooks.

**Exports:**
- `@salina/shared/types` - TypeScript types and interfaces
- `@salina/shared/utils` - Utility functions (e.g., `cn()` for Tailwind class merging)
- `@salina/shared/constants` - Application constants
- `@salina/shared/hooks` - Shared React hooks

**No React components** - UI components belong in `@salina/ui`.

### `packages/ui`

**Purpose:** Shared UI component library (shadcn/ui + Radix UI).

**Key Technologies:**
- shadcn/ui components (50+)
- Radix UI primitives
- Tailwind CSS 4.1
- Class Variance Authority (CVA)
- Lucide React icons

**Exports:**
- All shadcn/ui components (Button, Dialog, Input, Card, etc.)
- Theme system (ThemeProvider, useTheme)
- Tailwind CSS styles (`@salina/ui/styles`)

**Adding Components:**
```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

**Storybook Integration:**
The UI package includes Storybook 8.6.14 for component development and documentation.

**Note:** Version 8.6.14 was chosen as the latest stable release with full ecosystem support. While Storybook 10.0.6 exists, critical packages like `@storybook/test` and `@storybook/blocks` are not yet available for version 10, making 8.6.14 the most production-ready choice.

```bash
# Start Storybook dev server on http://localhost:6006
pnpm --filter @salina/ui storybook

# Build static Storybook for deployment
pnpm --filter @salina/ui build-storybook
```

**Benefits:**
- Develop components in isolation (no Electron overhead)
- Interactive component catalog with 50+ shadcn/ui components
- Visual testing with different states and props
- Living documentation for designers and developers
- Example stories included: Button, Card, Badge

**Story Files:** Located in `packages/ui/stories/` with `.stories.tsx` extension.

### `packages/infrastructure`

**Purpose:** Cross-cutting infrastructure concerns.

**Modules:**
- **database/** - SQLite adapter, migrations, query builder, CRDT fields
- **sync/** - CRDT sync engine, vector clocks, conflict resolution
- **media/** - FFmpeg service, audio/video processing, thumbnail generation
- **ai/** - Whisper bridge (Python), Transformers.js, embedding service
- **python/** - Node-Python bridge, bundled Python runtime
- **auth/** - Authentication service, token management, security
- **network/** - API client, WebSocket client, sync queue

**Key Dependencies:**
- `better-sqlite3` - SQLite bindings
- `zod` - Schema validation

### `packages/domains/*`

**Purpose:** Business domains following DDD + MVVM pattern.

#### `@salina/domains-notes`
- Rich text note editor (BlockNote)
- Note organization with tags
- Local-first with CRDT sync

#### `@salina/domains-files`
- File management and organization
- Metadata and thumbnail generation
- File upload/download

#### `@salina/domains-transcriptions`
- Video/audio transcription using FFmpeg
- Faster Whisper integration (Python)
- Transcription editing and export

#### `@salina/domains-search`
- AI-powered local search (MiniSearch)
- Semantic search with Transformers.js
- Chat interface with local history

#### `@salina/domains-home`
- Unified dashboard
- Quick actions
- Recent activity aggregation

**Common Dependencies:**
- `@salina/shared` - Shared utilities
- `@salina/ui` - UI components
- `@salina/infrastructure` - Database, sync, etc.
- `zustand` - State management (ViewModels)
- `zod` - Schema validation
- `react-hook-form` - Form handling

## Development Patterns

### Import Path Aliases

Use clean imports with workspace package names:
```typescript
// Desktop package (packages/desktop/src/renderer/*)
import { Button } from '@salina/ui/components/button';
import { cn } from '@salina/shared/utils';
import { APP_NAME } from '@salina/shared/constants';
import { useNotesViewModel } from '@salina/domains-notes/viewmodels';

// Within same package
import { Component } from '@/components/Component';
```

### MVVM Pattern Example

**Model** (`packages/domains/notes/models/Note.ts`):
```typescript
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  // CRDT fields
  vectorClock: string;
  siteId: string;
  version: number;
}
```

**ViewModel** (`packages/domains/notes/viewmodels/useNotesViewModel.ts`):
```typescript
import { create } from 'zustand';
import { Note } from '../models/Note';
import { NotesService } from '../services/NotesService';

interface NotesViewModel {
  notes: Note[];
  loading: boolean;
  fetchNotes: () => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export const useNotesViewModel = create<NotesViewModel>((set, get) => ({
  notes: [],
  loading: false,
  fetchNotes: async () => {
    set({ loading: true });
    const notes = await NotesService.getAll();
    set({ notes, loading: false });
  },
  createNote: async (note) => {
    const newNote = await NotesService.create(note);
    set({ notes: [...get().notes, newNote] });
  },
  updateNote: async (id, updates) => {
    await NotesService.update(id, updates);
    const notes = get().notes.map(n => n.id === id ? { ...n, ...updates } : n);
    set({ notes });
  },
  deleteNote: async (id) => {
    await NotesService.delete(id);
    set({ notes: get().notes.filter(n => n.id !== id) });
  },
}));
```

**View** (`packages/domains/notes/views/NotesList.tsx`):
```typescript
import { useEffect } from 'react';
import { Button } from '@salina/ui/components/button';
import { Card } from '@salina/ui/components/card';
import { useNotesViewModel } from '../viewmodels/useNotesViewModel';

export function NotesList() {
  const { notes, loading, fetchNotes, deleteNote } = useNotesViewModel();

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {notes.map(note => (
        <Card key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <Button onClick={() => deleteNote(note.id)}>Delete</Button>
        </Card>
      ))}
    </div>
  );
}
```

**Service** (`packages/domains/notes/services/NotesService.ts`):
```typescript
import { Note } from '../models/Note';
import { NotesRepository } from '../repositories/NotesRepository';

export class NotesService {
  static async getAll(): Promise<Note[]> {
    return NotesRepository.findAll();
  }

  static async create(note: Partial<Note>): Promise<Note> {
    // Business logic: validation, CRDT fields generation, etc.
    const newNote = {
      ...note,
      id: crypto.randomUUID(),
      vectorClock: generateVectorClock(),
      siteId: getDeviceId(),
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return NotesRepository.save(newNote);
  }

  static async update(id: string, updates: Partial<Note>): Promise<void> {
    // Business logic: conflict resolution, version increment, etc.
    return NotesRepository.update(id, updates);
  }

  static async delete(id: string): Promise<void> {
    return NotesRepository.delete(id);
  }
}
```

**Repository** (`packages/domains/notes/repositories/NotesRepository.ts`):
```typescript
import { Database } from '@salina/infrastructure/database';
import { Note } from '../models/Note';

export class NotesRepository {
  static async findAll(): Promise<Note[]> {
    const db = Database.getInstance();
    return db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all();
  }

  static async save(note: Note): Promise<Note> {
    const db = Database.getInstance();
    db.prepare(`
      INSERT INTO notes (id, title, content, tags, vector_clock, site_id, version, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(note.id, note.title, note.content, JSON.stringify(note.tags), note.vectorClock, note.siteId, note.version, note.createdAt, note.updatedAt);
    return note;
  }

  static async update(id: string, updates: Partial<Note>): Promise<void> {
    const db = Database.getInstance();
    // SQL update with CRDT conflict resolution...
  }

  static async delete(id: string): Promise<void> {
    const db = Database.getInstance();
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  }
}
```

### React Compiler Integration

The React Compiler automatically optimizes components:
- **No need for manual `useMemo`, `useCallback`, or `React.memo`**
- Configured via `babel-plugin-react-compiler` in `vite.renderer.config.mts`
- Automatic memoization and re-render optimization

### Type Safety

- **Strict TypeScript** configuration in all packages
- **Project References** for fast incremental builds
- **Workspace Protocol** ensures type consistency across packages
- **Zod schemas** for runtime validation and type inference

### Styling Conventions

- **Tailwind CSS 4.1** for utility-first styling
- **CSS variables** in `packages/ui/styles/globals.css` for theme colors (HSL format)
- **`cn()` utility** from `@salina/shared/utils` to merge Tailwind classes conditionally
- **Responsive design** with Tailwind breakpoints (mobile-first)

## Common Development Tasks

### Adding a New Domain

1. **Create domain package:**
   ```bash
   mkdir -p packages/domains/<domain>/{models,viewmodels,views,services,repositories}
   cd packages/domains/<domain>
   ```

2. **Create package.json:**
   ```json
   {
     "name": "@salina/domains-<domain>",
     "version": "1.0.0",
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "dependencies": {
       "@salina/shared": "workspace:*",
       "@salina/ui": "workspace:*",
       "@salina/infrastructure": "workspace:*",
       "zustand": "^5.0.2",
       "zod": "^3.23.8"
     }
   }
   ```

3. **Create TypeScript config:**
   ```json
   {
     "extends": "../../../tsconfig.base.json",
     "compilerOptions": {
       "outDir": "./dist",
       "rootDir": ".",
       "lib": ["ES2023", "DOM", "DOM.Iterable"],
       "jsx": "react-jsx"
     },
     "references": [
       { "path": "../../shared" },
       { "path": "../../ui" },
       { "path": "../../infrastructure" }
     ]
   }
   ```

4. **Follow MVVM pattern** as shown in examples above.

5. **Add to desktop package dependencies** in `packages/desktop/package.json`:
   ```json
   "@salina/domains-<domain>": "workspace:*"
   ```

6. **Create routes** in `packages/desktop/src/renderer/routes/<domain>.tsx`.

### Adding shadcn/ui Components

```bash
cd packages/ui
npx shadcn@latest add <component-name>
```

Then use in any domain:
```typescript
import { Button } from '@salina/ui/components/button';
```

### Database Migrations

1. **Create migration file:**
   ```bash
   cd packages/infrastructure/database/migrations
   touch 003_add_<feature>.sql
   ```

2. **Write SQL migration:**
   ```sql
   -- Migration: Add <feature>
   CREATE TABLE IF NOT EXISTS <table> (
     id TEXT PRIMARY KEY,
     -- Domain fields
     -- CRDT fields
     vector_clock TEXT,
     site_id TEXT,
     version INTEGER DEFAULT 1,
     -- Sync fields
     sync_status TEXT DEFAULT 'pending',
     last_synced_at DATETIME,
     cloud_id TEXT,
     -- Audit fields
     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Register migration** in `packages/infrastructure/database/migrations/index.ts`.

### Running Single Package Tests

```bash
pnpm --filter @salina/domains-notes test        # Unit tests for notes domain
pnpm --filter @salina/desktop test:e2e          # E2E tests for desktop
```

### Debugging Electron Main Process

DevTools are automatically opened in development mode. Check `packages/desktop/src/main/index.ts`.

## Key Files and Directories

### Configuration Files (Root)
- `pnpm-workspace.yaml` - pnpm workspace configuration
- `tsconfig.json` - Root TypeScript configuration (project references)
- `tsconfig.base.json` - Base TypeScript configuration for all packages
- `package.json` - Root package.json (workspace scripts)
- `eslint.config.mts` - ESLint 9 flat configuration
- `CLAUDE.md` - This file (developer guidance)
- `README.md` - Project documentation

### Package Configurations
- `packages/*/package.json` - Package-specific configuration
- `packages/*/tsconfig.json` - Package-specific TypeScript configuration
- `packages/desktop/forge.config.ts` - Electron Forge configuration
- `packages/desktop/vite.*.config.mts` - Vite configurations
- `packages/desktop/playwright.config.ts` - E2E test configuration
- `packages/desktop/tsr.config.json` - TanStack Router configuration

### Auto-Generated Files (Do Not Edit)
- `packages/desktop/src/renderer/routeTree.gen.ts` - Generated by TanStack Router CLI
- `packages/*/dist/` - Compiled output
- `.vite/`, `out/` - Build artifacts

## Security Considerations

This template follows Electron security best practices:

1. **Context Isolation:** Enabled by default (preload script isolated)
2. **Node Integration:** Disabled in renderer (controlled via Fuses)
3. **ASAR Integrity Validation:** Enabled to prevent tampering
4. **Cookie Encryption:** Enabled for secure session handling
5. **RunAsNode Disabled:** Prevents running arbitrary code with Node.js privileges

**When extending:** Follow the principle of least privilege. Expose only necessary APIs from main process to renderer via preload script.

## Notes

- **pnpm required:** This is a pnpm workspace monorepo. Do not use npm or yarn.
- **Workspace protocol:** All internal dependencies use `workspace:*`.
- **TanStack Router:** Run `pnpm --filter @salina/desktop routes:generate` after modifying routes.
- **React Compiler:** Automatic memoization—avoid manual `useMemo`/`useCallback`.
- **MVVM pattern:** All domains follow this pattern for consistency.
- **DDD principles:** Organize code by business domain, not technical layers.
- **Local-first:** All data stored locally with optional cloud sync (CRDT).

## References

- **Architecture Document:** `docs/architecture_interactive_enhanced.html`
- **Electron Documentation:** https://www.electronjs.org/docs
- **shadcn/ui Documentation:** https://ui.shadcn.com
- **Zustand Documentation:** https://zustand-demo.pmnd.rs
- **TanStack Router:** https://tanstack.com/router
- add all updates to memory