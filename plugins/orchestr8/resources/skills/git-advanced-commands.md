---
id: git-advanced-commands
category: skill
tags: [git, stash, cherry-pick, bisect, reflog, git-advanced, debugging, history-manipulation, worktree]
capabilities:
  - Master Git stash for temporary work storage
  - Use cherry-pick to selectively apply commits
  - Debug with git bisect to find regressions
  - Recover lost commits with reflog
  - Leverage advanced Git operations for complex workflows
useWhen:
  - Temporarily storing uncommitted changes with stash
  - Applying specific commits across branches with cherry-pick
  - Finding bug-introducing commits with bisect
  - Recovering lost or deleted commits with reflog
  - Managing multiple working directories with worktree
  - Debugging complex Git history issues
  - Performing surgical commit operations
  - Investigating when bugs were introduced
  - Recovering from accidental resets or deletions
  - Working on multiple branches simultaneously
  - Analyzing Git object database directly
  - Creating and managing Git patches
  - Understanding Git internals and plumbing commands
  - Optimizing Git repository performance
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://agents/git-troubleshooter
  - orchestr8://skills/git-rebase-merge
  - orchestr8://skills/git-workflow
  - orchestr8://skills/git-pr-workflow
  - orchestr8://patterns/debugging-strategies
estimatedTokens: 880
---

# Git Advanced Commands

## Git Stash Operations

```bash
# Basic stash operations
git stash                    # Stash changes with auto-generated message
git stash save "WIP: feature implementation"  # Stash with custom message
git stash -u                 # Include untracked files
git stash --all              # Include untracked and ignored files
git stash --keep-index       # Stash only unstaged changes

# List and inspect stashes
git stash list
# Output: stash@{0}: WIP on main: abc123 commit message
#         stash@{1}: On feature-branch: def456 other message

git stash show               # Show summary of latest stash
git stash show -p            # Show full diff of latest stash
git stash show stash@{1}     # Show specific stash

# Apply stashes
git stash pop                # Apply latest stash and remove from list
git stash apply              # Apply latest stash but keep in list
git stash apply stash@{2}    # Apply specific stash

# Manage stashes
git stash drop stash@{1}     # Delete specific stash
git stash clear              # Delete all stashes
git stash branch new-branch  # Create branch from stash

# Advanced stash patterns
# Stash only specific files
git stash push -m "partial work" path/to/file1.js path/to/file2.js

# Stash with pathspec
git stash push -- '*.js'     # Stash only JavaScript files

# Interactive stash
git stash -p                 # Selectively stash hunks
# Git will prompt: Stash this hunk [y,n,q,a,d,e,?]?

# Create patch from stash
git stash show -p stash@{0} > stash.patch
git apply stash.patch        # Apply patch later
```

## Cherry-Pick Mastery

```bash
# Basic cherry-pick
git cherry-pick abc123       # Apply single commit

# Cherry-pick multiple commits
git cherry-pick abc123 def456 ghi789

# Cherry-pick range (exclusive start, inclusive end)
git cherry-pick abc123..def456

# Cherry-pick without committing (stage changes only)
git cherry-pick -n abc123
git cherry-pick --no-commit abc123

# Cherry-pick with custom message
git cherry-pick abc123 -e   # Edit commit message

# Cherry-pick and sign-off
git cherry-pick -x abc123   # Add "cherry picked from commit..." note
git cherry-pick -s abc123   # Add Signed-off-by line

# Handle cherry-pick conflicts
git cherry-pick abc123
# CONFLICT occurs
# Fix conflicts
git add resolved-file.js
git cherry-pick --continue

# Abort cherry-pick
git cherry-pick --abort

# Skip current cherry-pick
git cherry-pick --skip

# Cherry-pick merge commit (specify parent)
git cherry-pick -m 1 abc123  # Use first parent as mainline

# Practical use cases
# Hotfix to multiple branches
git checkout release-v1
git cherry-pick hotfix-commit
git checkout release-v2
git cherry-pick hotfix-commit

# Extract commit from wrong branch
git checkout correct-branch
git cherry-pick wrong-branch-commit
git checkout wrong-branch
git reset --hard HEAD~1  # Remove from wrong branch
```

## Git Bisect for Bug Hunting

```bash
# Start bisect session
git bisect start

# Mark current as bad (has bug)
git bisect bad

# Mark old commit as good (no bug)
git bisect good v1.0.0       # Using tag
git bisect good abc123       # Using commit hash

# Git checks out middle commit - test it
npm test  # or manual testing

# Mark as good or bad
git bisect good   # Bug not present, search later commits
git bisect bad    # Bug present, search earlier commits

# Git continues binary search automatically
# Repeat testing and marking until Git finds first bad commit

# End bisect session
git bisect reset             # Return to original branch

# Automated bisect with script
git bisect start HEAD v1.0.0
git bisect run npm test      # Automatically bisects using test exit code
# Exit 0 = good, 125 = untestable, 1-127 (except 125) = bad

# Bisect with custom test script
cat > test-script.sh << 'EOF'
#!/bin/bash
npm install --silent
npm test 2>&1 | grep -q "specific test"
exit $?
EOF
chmod +x test-script.sh
git bisect run ./test-script.sh

# Visualize bisect log
git bisect log
git bisect log > bisect-log.txt  # Save for later

# Replay bisect session
git bisect replay bisect-log.txt

# Skip untestable commits
git bisect skip              # Skip current commit

# Bisect terms customization
git bisect start --term-new=broken --term-old=working
git bisect broken            # Instead of 'bad'
git bisect working           # Instead of 'good'
```

## Reflog: Time Machine for Git

```bash
# View reflog (history of HEAD movements)
git reflog
git reflog show HEAD         # Explicit HEAD reflog
git reflog show main         # Reflog for main branch

# Reflog output format
# abc123 HEAD@{0}: commit: latest commit message
# def456 HEAD@{1}: rebase finished: ...
# ghi789 HEAD@{2}: checkout: moving from main to feature

# Common reflog uses
# Recover deleted branch
git reflog
# Find commit before deletion: abc123 HEAD@{3}
git checkout -b recovered-branch abc123

# Undo bad rebase
git reflog
git reset --hard HEAD@{5}    # Before rebase started

# Recover lost commits
git reflog
git cherry-pick def456       # Recover specific commit

# Find when file was changed
git reflog show --all -- path/to/file.js

# Reflog expire (cleanup)
git reflog expire --expire=30.days refs/heads/main
git reflog expire --expire=now --all  # Expire all immediately

# Recover after hard reset
git reset --hard HEAD~3      # Oops, deleted 3 commits
git reflog                   # Find commits
git reset --hard HEAD@{1}    # Undo the reset

# View reflog with dates
git reflog --date=iso
git reflog --date=relative   # "2 hours ago"

# Reflog for specific time
git show HEAD@{yesterday}
git show HEAD@{2.days.ago}
git show HEAD@{2023-12-01}
```

## Git Worktree (Multiple Working Directories)

```bash
# Create linked worktree
git worktree add ../project-hotfix hotfix-branch
# Creates new working directory at ../project-hotfix
# checked out to hotfix-branch

# Create worktree with new branch
git worktree add ../project-feature -b feature-new

# List worktrees
git worktree list
# /home/user/project        abc123 [main]
# /home/user/project-hotfix def456 [hotfix-branch]

# Remove worktree
git worktree remove ../project-hotfix

# Prune stale worktrees
git worktree prune

# Use case: Work on feature while fixing hotfix
cd ~/project
git worktree add ../project-hotfix -b hotfix/urgent-fix
cd ../project-hotfix
# Fix bug
git add . && git commit -m "fix: urgent security patch"
git push origin hotfix/urgent-fix
cd ~/project
# Continue feature work in main worktree

# Lock worktree
git worktree lock ../project-hotfix  # Prevent pruning
git worktree unlock ../project-hotfix
```

## Advanced Git Plumbing

```bash
# Inspect Git objects
git cat-file -t abc123       # Show object type (commit, tree, blob, tag)
git cat-file -p abc123       # Pretty-print object contents
git cat-file -s abc123       # Show object size

# List tree objects
git ls-tree HEAD             # List files in commit
git ls-tree -r HEAD          # Recursive listing
git ls-tree HEAD path/       # List specific path

# Show file at specific revision
git show HEAD:path/to/file.js

# Create patch files
git format-patch -1 abc123   # Create patch for single commit
git format-patch main..feature  # Patches for commit range
git format-patch --stdout HEAD~3..HEAD > feature.patch

# Apply patches
git am < patch-file.patch    # Apply mbox patch
git apply feature.patch      # Apply diff patch
git apply --check patch.patch  # Test patch without applying

# Clean repository
git clean -n                 # Dry run (show what would be deleted)
git clean -f                 # Remove untracked files
git clean -fd                # Remove untracked files and directories
git clean -fX                # Remove only ignored files
git clean -fx                # Remove untracked and ignored files

# Filter-branch (rewrite history - use git-filter-repo instead)
# Remove file from all history
git filter-branch --tree-filter 'rm -f passwords.txt' HEAD

# Modern alternative: git-filter-repo
git filter-repo --path-glob '*.jpg' --invert-paths  # Remove all JPG files

# Repository maintenance
git gc                       # Garbage collect
git gc --aggressive          # Aggressive optimization
git prune                    # Remove unreachable objects
git fsck                     # File system check
git fsck --full              # Comprehensive check

# Count objects
git count-objects -v         # Show repo statistics

# Archive repository
git archive --format=zip --output=project.zip HEAD
git archive --format=tar.gz --output=project.tar.gz main

# Create bundle (portable Git repo)
git bundle create repo.bundle --all
git bundle verify repo.bundle
git clone repo.bundle cloned-repo
```

## Git Blame and Log Analysis

```bash
# Detailed file history
git log -p path/to/file.js   # Show patches
git log --follow file.js     # Follow renames
git log -S "function_name"   # Search commits that added/removed string
git log -G "regex_pattern"   # Search with regex

# Blame for line-by-line authorship
git blame file.js            # Show who modified each line
git blame -L 10,20 file.js   # Blame specific lines
git blame -C file.js         # Detect moved/copied lines
git blame -w file.js         # Ignore whitespace changes

# Pretty log formats
git log --graph --oneline --all --decorate
git log --pretty=format:"%h - %an, %ar : %s"
git log --since="2 weeks ago" --until="yesterday"
git log --author="John Doe"
```
