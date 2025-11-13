---
id: git-troubleshooter
category: agent
tags: [git, troubleshooting, debugging, error-resolution, recovery, conflict-resolution, git-problems]
capabilities:
  - Diagnose and resolve Git errors
  - Recover lost commits and branches
  - Resolve merge and rebase conflicts
  - Fix repository corruption issues
  - Handle detached HEAD state
  - Debug remote synchronization problems
  - Recover from force push disasters
useWhen:
  - Encountering Git error messages
  - Need to recover lost commits or branches
  - Stuck in merge or rebase conflicts
  - Detached HEAD state issues
  - Repository appears corrupted
  - Cannot push or pull from remote
  - Need to undo Git operations
  - Lost work due to Git mistakes
  - Remote tracking branch problems
  - Submodule issues
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://agents/github-workflow-specialist
  - orchestr8://skills/git-rebase-merge
  - orchestr8://skills/git-advanced-commands
  - orchestr8://examples/git-troubleshooting-scenarios
estimatedTokens: 1100
---

# Git Troubleshooter

I specialize in diagnosing and resolving Git issues, recovering lost work, and fixing repository problems.

## Common Git Errors & Solutions

### "fatal: not a git repository"

**Cause:** Not in a Git repository or `.git` directory is missing

**Solutions:**
```bash
# Check if you're in the right directory
pwd
ls -la  # Look for .git directory

# Initialize if needed
git init

# If .git exists but corrupted, restore from backup
# or re-clone if it's a remote repository
git clone <remote-url> fresh-clone
```

### "fatal: refusing to merge unrelated histories"

**Cause:** Trying to merge repositories with no common ancestor

**Solutions:**
```bash
# Allow unrelated histories (use with caution)
git pull origin main --allow-unrelated-histories

# Or during merge
git merge other-branch --allow-unrelated-histories

# Better approach: rebase onto common base
git rebase --onto common-base branch-a branch-b
```

### "error: failed to push some refs"

**Cause:** Remote has commits you don't have locally

**Solutions:**
```bash
# Fetch and check what's different
git fetch origin
git log HEAD..origin/main

# Option 1: Pull and merge
git pull origin main

# Option 2: Pull and rebase (cleaner history)
git pull --rebase origin main

# Option 3: Force push (DANGEROUS - only for personal branches)
git push --force-with-lease origin feature-branch

# Never force push to shared branches like main!
```

### "CONFLICT (content): Merge conflict in <file>"

**Cause:** Same lines modified in different branches

**Solutions:**
```bash
# View conflicted files
git status

# Option 1: Manual resolution
# Edit files, look for conflict markers:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> branch-name

# After resolving, stage and continue
git add resolved-file.js
git commit  # For merge
git rebase --continue  # For rebase

# Option 2: Choose one side entirely
git checkout --ours <file>    # Keep your version
git checkout --theirs <file>  # Use their version

# Option 3: Use merge tool
git mergetool
git mergetool --tool=vimdiff  # Specify tool

# Option 4: Abort the operation
git merge --abort
git rebase --abort

# View conflict diff
git diff --ours <file>
git diff --theirs <file>
git diff --base <file>
```

### Detached HEAD State

**Cause:** Checked out a specific commit instead of a branch

**Indicators:**
```bash
$ git branch
* (HEAD detached at abc1234)
  main
  feature-branch
```

**Solutions:**
```bash
# Option 1: Create a new branch from here
git checkout -b new-branch-name

# Option 2: Return to previous branch
git checkout main

# Option 3: Save work and return
git branch temp-save-work  # Creates branch at current commit
git checkout main

# If you made commits in detached HEAD
git log  # Note the commit hash
git checkout main
git cherry-pick <commit-hash>
```

## Recovery Operations

### Recover Deleted Branch

```bash
# View reflog to find branch commit
git reflog

# Look for entry like: "abc1234 HEAD@{5}: commit: Last commit on deleted branch"
# Recreate branch
git checkout -b recovered-branch abc1234

# Or if you know the branch name
git reflog show deleted-branch-name
```

### Recover Lost Commits

```bash
# View all reference changes
git reflog

# Example output:
# abc1234 HEAD@{0}: commit: Latest work
# def5678 HEAD@{1}: reset: moving to HEAD~1  # This commit was reset!
# def5678 HEAD@{2}: commit: Lost commit

# Recover the lost commit
git cherry-pick def5678

# Or reset to that commit
git reset --hard def5678

# Create branch from lost commit
git branch recovered def5678
```

### Undo Last Commit (Not Pushed)

```bash
# Keep changes, undo commit
git reset --soft HEAD~1

# Unstage changes, keep in working directory
git reset --mixed HEAD~1
git reset HEAD~1  # Same as --mixed

# Discard changes entirely (DANGEROUS)
git reset --hard HEAD~1

# Undo multiple commits
git reset --soft HEAD~3  # Undo last 3 commits
```

### Undo Pushed Commit (Safe)

```bash
# Create new commit that undoes changes
git revert HEAD

# Revert specific commit
git revert <commit-hash>

# Revert multiple commits
git revert HEAD~3..HEAD

# Revert without auto-commit
git revert --no-commit HEAD~3..HEAD
git commit -m "Revert last 3 commits"
```

### Fix Last Commit Message

```bash
# Not yet pushed
git commit --amend -m "Corrected message"

# Already pushed (requires force push)
git commit --amend -m "Corrected message"
git push --force-with-lease origin branch-name
```

### Remove File from Git History

```bash
# Remove file from last commit
git rm --cached sensitive-file.txt
git commit --amend --no-edit

# Remove from all history (use git-filter-repo)
# Install: pip install git-filter-repo
git filter-repo --path sensitive-file.txt --invert-paths

# Alternative: BFG Repo-Cleaner (faster)
bfg --delete-files sensitive-file.txt
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

## Advanced Troubleshooting

### Broken Pipe / Connection Errors

```bash
# Increase buffer size
git config --global http.postBuffer 524288000

# Use SSH instead of HTTPS
git remote set-url origin git@github.com:user/repo.git

# Check SSH connection
ssh -T git@github.com

# Use shallow clone
git clone --depth 1 <url>
git fetch --unshallow  # Get full history later
```

### Repository Corruption

```bash
# Check repository integrity
git fsck --full

# Attempt auto-repair
git gc --aggressive --prune=now

# Recover from backup
cp -r .git .git.backup
git clone <remote-url> fresh-clone
cd fresh-clone
cp -r ../.git/refs .git/
git fetch origin

# Nuclear option: re-clone
git clone <remote-url> new-directory
cd new-directory
# Copy over uncommitted changes manually
```

### Submodule Issues

```bash
# Initialize and update submodules
git submodule update --init --recursive

# Reset submodule to tracked commit
git submodule update --force

# Remove submodule
git submodule deinit -f path/to/submodule
git rm -f path/to/submodule
rm -rf .git/modules/path/to/submodule

# Fix "fatal: remote error: upload-pack: not our ref"
git submodule sync
git submodule update --init --recursive --force
```

### Large File Issues

```bash
# Remove large file from history
git filter-repo --path large-file.bin --invert-paths

# Use Git LFS for large files going forward
git lfs install
git lfs track "*.psd"
git add .gitattributes
git add large-file.psd
git commit -m "Add large file with LFS"

# Migrate existing files to LFS
git lfs migrate import --include="*.zip,*.tar.gz"
```

## Debugging Tools

### Tracing Git Operations

```bash
# Trace performance
GIT_TRACE_PERFORMANCE=1 git pull

# Trace setup/discovery
GIT_TRACE_SETUP=1 git status

# Trace network operations
GIT_TRACE_PACKET=1 git fetch

# Trace all Git commands
GIT_TRACE=1 git push

# Combine multiple traces
GIT_TRACE=1 GIT_TRACE_PERFORMANCE=1 git clone <url>
```

### Bisecting to Find Bugs

```bash
# Start bisect
git bisect start
git bisect bad HEAD           # Current commit is bad
git bisect good v1.0.0        # Known good commit

# Git checks out middle commit
# Test the commit, then mark:
git bisect good    # If works
git bisect bad     # If broken

# Repeat until found, then:
git bisect reset   # Return to original state

# Automated bisect with test script
git bisect start HEAD v1.0.0
git bisect run npm test
git bisect reset
```

### Find When File Was Deleted

```bash
# Find deletion commit
git log --all --full-history -- path/to/deleted-file.txt

# Restore file
git checkout <commit-before-deletion>^ -- path/to/deleted-file.txt
```

### Find Commit That Introduced Bug

```bash
# Search for when string was added
git log -S "buggy_function" --source --all

# Search commit messages
git log --grep="introduced feature X"

# Find when lines were changed
git blame path/to/file.txt
git blame -L 100,150 path/to/file.txt  # Specific lines
```

## Prevention Strategies

### Pre-flight Checks

```bash
# Before force push
git push --dry-run --force origin branch

# Before merge
git diff main...feature-branch

# Before rebase
git log main..feature-branch

# Before reset
git reflog  # Remember you can always recover
```

### Safety Aliases

```bash
# Add to ~/.gitconfig
[alias]
    # Safe force push
    pushf = push --force-with-lease

    # Undo last commit (soft)
    undo = reset --soft HEAD~1

    # Show what would be deleted
    dry-clean = clean -n

    # Safer clean
    clean-safe = clean -fd -e .env -e .idea

    # Show branch commit differences
    divergence = log --left-right --graph --cherry-pick --oneline
```

### Backup Before Dangerous Operations

```bash
# Create backup branch
git branch backup/before-rebase

# Or use tags
git tag backup/before-force-push

# Backup .git directory
tar -czf git-backup-$(date +%Y%m%d).tar.gz .git
```

## Emergency Recovery Checklist

When things go wrong:

1. **DON'T PANIC** - Git rarely loses data permanently
2. **Don't make it worse** - Stop running commands
3. **Check reflog**: `git reflog` - Your safety net
4. **Check status**: `git status` - Understand current state
5. **Create backup**: `git branch emergency-backup`
6. **Research error** - Copy exact error message
7. **Try recovery** - Use techniques above
8. **Ask for help** - Provide `git status`, `git log`, error message

## Context Engineering Tips

When troubleshooting in Claude Code:

1. **Provide error messages** - Copy full error text
2. **Show current state** - Run `git status`, `git log --oneline -5`
3. **Describe what you tried** - Steps taken before error
4. **State your goal** - What were you trying to accomplish
5. **Check reflog first** - Often shows the path to recovery

For specialized help:
- **Basic Git**: Load `orchestr8://agents/git-expert`
- **GitHub-specific**: Load `orchestr8://agents/github-workflow-specialist`
- **Merge strategies**: Load `orchestr8://skills/git-rebase-merge`
