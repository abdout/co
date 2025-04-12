# Auth Documentation Auto-Update

This folder contains scripts for automatically updating authentication documentation files.

## Available Scripts

### `update-auth-docs.ts`

This script automatically updates the following files when authentication-related code changes:

- `src/components/auth/README.md`: Documentation for authentication module
- `src/components/auth/ISSUE.md`: Issue tracking for authentication module
- `.cursor/rules/auth.mdc`: Authentication rules for Cursor AI

## How to Use

### Manual Update

Run the script manually when you want to update documentation:

```bash
# Using npm
npm run update-auth-docs

# Using pnpm
pnpm update-auth-docs

# Using yarn
yarn update-auth-docs
```

### Watch Mode

For automatic updates during development, use watch mode:

```bash
# Using npm
npm run update-auth-docs:watch

# Using pnpm
pnpm update-auth-docs:watch

# Using yarn
yarn update-auth-docs:watch
```

This will monitor auth-related files and update documentation whenever changes are made.

### Windows Users

For Windows users, you can also run the batch file from the project root:

```
update-auth-docs.bat
```

### Git Integration

A pre-commit hook has been set up to automatically update the documentation files when committing changes to auth-related files. This ensures that documentation is always up to date with the latest code changes.

## Configuration

You can modify the `update-auth-docs.ts` script to:

- Track additional files or directories
- Update more documentation files
- Change the update behavior

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed: `npm install`
2. Verify that the file paths in the script match your project structure
3. Check that you have write permissions to the documentation files 