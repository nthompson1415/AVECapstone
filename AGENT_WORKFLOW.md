# Agent Workflow Documentation

## Pre-Push Hook for Parallel Agents

When working with multiple agents in parallel, a pre-push hook has been set up to prevent pushing stale commits that would overwrite other agents' work.

### Installation

The pre-push hook is located at `hooks/pre-push`. To install it:

```bash
cp hooks/pre-push .git/hooks/pre-push
chmod +x .git/hooks/pre-push
```

Or run the setup script:
```bash
./scripts/setup-hooks.sh
```

### What the Hook Does

The pre-push hook automatically runs before every `git push` and checks:

1. **Uncommitted changes**: Ensures all changes are committed before pushing
2. **Remote sync**: Verifies your local branch is up to date with or ahead of remote
3. **Diverged branches**: Detects if branches have diverged and need syncing

### Error Messages

If the hook detects issues, it will abort the push with one of these messages:

- **"ERROR: Uncommitted changes detected"** - Commit or stash your changes first
- **"ERROR: Local branch is behind remote"** - Run `git pull` first to merge remote changes
- **"ERROR: Branches have diverged"** - Sync with remote using `git pull --rebase` or `git pull`

### Workflow

1. Before making changes: `git pull` to get latest changes
2. Make your edits
3. Commit your changes: `git add . && git commit -m "message"`
4. Push: `git push` (hook will run automatically)
5. If hook fails: Follow the error message instructions, then retry

This ensures that conflicts are detected before they overwrite other agents' work.

