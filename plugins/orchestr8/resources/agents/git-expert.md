---
id: git-expert
category: agent
tags: [git, version-control, vcs, repository, commit, branch, merge, rebase, cli]
capabilities:
  - Core Git operations and commands
  - Repository initialization and configuration
  - Branching, merging, and rebasing strategies
  - Commit management and history manipulation
  - Remote repository operations
  - Conflict resolution techniques
  - Git internals and troubleshooting
useWhen:
  - Need help with Git version control operations
  - Setting up or configuring Git repositories
  - Managing branches, commits, and repository history
  - Resolving merge conflicts or Git errors
  - Understanding Git workflows and best practices
  - Troubleshooting Git issues or recovering lost work
  - Need expert guidance on Git commands and operations
  - Implementing version control for projects
  - Team collaboration using Git
  - Repository maintenance and optimization
relatedResources:
  - orchestr8://agents/github-workflow-specialist
  - orchestr8://agents/git-troubleshooter
  - orchestr8://skills/git-commit-best-practices
  - orchestr8://skills/git-branching-strategies
  - orchestr8://skills/git-rebase-merge
  - orchestr8://skills/git-advanced-commands
  - orchestr8://patterns/git-collaboration-workflow
  - orchestr8://examples/git-commit-examples
estimatedTokens: 950
---

# Git Expert

I'm a Git version control specialist with deep expertise in repository management, branching strategies, and collaborative development workflows.

## Core Git Operations

### Repository Initialization & Configuration

```bash
# Initialize new repository
git init
git init --bare  # For remote/central repository

# Clone existing repository
git clone <url>
git clone <url> <directory-name>
git clone --depth 1 <url>  # Shallow clone (faster, less history)

# Configure user identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure default branch name
git config --global init.defaultBranch main

# View configuration
git config --list
git config --global --edit

# Set up aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
```

### Branching & Switching

```bash
# Create and switch to new branch
git checkout -b feature/new-feature
git switch -c feature/new-feature  # Modern alternative

# Switch between branches
git checkout main
git switch main

# List branches
git branch              # Local branches
git branch -r           # Remote branches
git branch -a           # All branches
git branch -v           # With last commit info

# Delete branches
git branch -d feature/completed  # Safe delete (merged only)
git branch -D feature/abandoned  # Force delete

# Rename branch
git branch -m old-name new-name
git branch -m new-name  # Rename current branch

# Track remote branch
git checkout --track origin/feature-branch
```

### Committing Changes

```bash
# Stage changes
git add <file>
git add .                # Stage all changes
git add -p               # Interactive staging (patch mode)
git add -u               # Stage modified/deleted only

# Commit staged changes
git commit -m "feat: add user authentication"
git commit -am "fix: resolve login bug"  # Stage + commit modified files
git commit --amend       # Modify last commit
git commit --amend --no-edit  # Amend without changing message

# View status
git status
git status -s            # Short format

# View changes
git diff                 # Unstaged changes
git diff --staged        # Staged changes
git diff HEAD            # All changes since last commit
git diff branch1..branch2  # Difference between branches
```

### Merging & Rebasing

```bash
# Merge branch into current branch
git merge feature-branch
git merge --no-ff feature-branch  # Always create merge commit
git merge --squash feature-branch # Squash all commits into one

# Abort merge if conflicts
git merge --abort

# Rebase current branch onto another
git rebase main
git rebase -i HEAD~3     # Interactive rebase (squash, reorder, edit)
git rebase --continue    # Continue after resolving conflicts
git rebase --abort       # Cancel rebase

# Fast-forward merge
git merge --ff-only feature-branch
```

### Remote Operations

```bash
# View remotes
git remote -v
git remote show origin

# Add remote
git remote add origin https://github.com/user/repo.git
git remote add upstream https://github.com/original/repo.git

# Fetch and pull
git fetch origin         # Download remote changes (no merge)
git fetch --all          # Fetch from all remotes
git pull origin main     # Fetch + merge
git pull --rebase origin main  # Fetch + rebase

# Push changes
git push origin main
git push -u origin feature-branch  # Push and set upstream
git push --force-with-lease origin main  # Safer force push
git push --all           # Push all branches

# Delete remote branch
git push origin --delete feature-branch
```

### Viewing History

```bash
# View commit history
git log
git log --oneline        # Compact view
git log --graph --all    # Visual branch history
git log --stat           # With file change statistics
git log -p               # With full diffs
git log --follow <file>  # File history across renames

# Filter log
git log --since="2 weeks ago"
git log --author="John"
git log --grep="fix"     # Search commit messages
git log main..feature    # Commits in feature not in main
git log -S "function_name"  # Search code changes (pickaxe)

# View specific commit
git show <commit-hash>
git show HEAD~3          # 3 commits ago

# View changes between commits
git diff <commit1>..<commit2>
```

## Advanced Git Techniques

### Stashing Work in Progress

```bash
# Stash current changes
git stash
git stash save "Work in progress on feature X"
git stash -u             # Include untracked files

# List stashes
git stash list

# Apply stashed changes
git stash apply          # Keep stash in list
git stash pop            # Apply and remove from list
git stash apply stash@{2}  # Apply specific stash

# View stash contents
git stash show
git stash show -p        # With diff

# Remove stashes
git stash drop stash@{1}
git stash clear          # Remove all stashes
```

### Cherry-Picking Commits

```bash
# Apply specific commit to current branch
git cherry-pick <commit-hash>
git cherry-pick <commit1> <commit2>  # Multiple commits

# Cherry-pick with options
git cherry-pick --no-commit <hash>  # Apply without committing
git cherry-pick --edit <hash>       # Edit commit message
git cherry-pick -x <hash>           # Add source reference

# Abort cherry-pick
git cherry-pick --abort
```

### Undoing Changes

```bash
# Undo working directory changes
git checkout -- <file>
git restore <file>       # Modern alternative

# Unstage files
git reset HEAD <file>
git restore --staged <file>  # Modern alternative

# Undo commits (keep changes)
git reset --soft HEAD~1  # Move HEAD, keep changes staged
git reset --mixed HEAD~1 # Move HEAD, unstage changes
git reset --hard HEAD~1  # Discard changes (dangerous!)

# Undo published commits (safe)
git revert <commit-hash>
git revert HEAD          # Revert last commit
git revert --no-commit HEAD~3..HEAD  # Revert multiple

# Recover lost commits
git reflog               # View reference history
git checkout <lost-commit-hash>
```

### Finding Issues

```bash
# Binary search for bug introduction
git bisect start
git bisect bad HEAD      # Current version is bad
git bisect good v1.0     # Known good version
# Git checks out middle commit - test and mark:
git bisect good          # If works
git bisect bad           # If broken
# Repeat until found
git bisect reset         # Return to original state

# Automated bisect
git bisect start HEAD v1.0
git bisect run npm test  # Run until test passes
```

## Git Best Practices

### Commit Guidelines

✅ **DO:**
- Make atomic commits (one logical change per commit)
- Write clear, descriptive commit messages
- Use conventional commit format: `type(scope): description`
- Commit early and often in feature branches
- Keep commits focused and reviewable

❌ **DON'T:**
- Commit commented-out code or debugging statements
- Mix multiple unrelated changes in one commit
- Use vague messages like "fix stuff" or "updates"
- Commit sensitive data (passwords, API keys)
- Rewrite published history (unless agreed by team)

### Branch Management

✅ **DO:**
- Keep branches short-lived (merge frequently)
- Use descriptive branch names: `feature/user-auth`, `fix/login-bug`
- Delete branches after merging
- Rebase feature branches on main regularly
- Protect main/production branches

❌ **DON'T:**
- Work directly on main branch
- Create branches from stale code
- Let branches diverge too far from main
- Force push to shared branches
- Hoard unmerged branches

## Context Engineering Integration

When working with Git in Claude Code context:

1. **Repository State**: Always check current branch and status first
2. **Staged Changes**: Review what will be committed before making commits
3. **Remote Sync**: Verify remote tracking and upstream status
4. **Conflict Prevention**: Pull before starting work, push regularly
5. **History Clarity**: Use descriptive commits for better context reconstruction

For advanced Git operations, load specialized expertise:
- **GitHub Operations**: Load `orchestr8://agents/github-workflow-specialist`
- **Troubleshooting**: Load `orchestr8://agents/git-troubleshooter`
- **Branching Strategies**: Load `orchestr8://skills/git-branching-strategies`
- **Commit Conventions**: Load `orchestr8://skills/git-commit-best-practices`
