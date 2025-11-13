---
id: git-rebase-merge
category: skill
tags: [git, rebase, merge, conflict-resolution, interactive-rebase, git-history, squash, cherry-pick]
capabilities:
  - Master rebase vs merge decision-making
  - Perform interactive rebasing for clean history
  - Resolve merge and rebase conflicts effectively
  - Squash and organize commits strategically
useWhen:
  - Deciding between rebase and merge strategies
  - Performing interactive rebase to clean commit history
  - Resolving complex merge conflicts
  - Squashing multiple commits before merging
  - Reordering commits with interactive rebase
  - Fixing commit messages in history
  - Maintaining linear Git history
  - Handling rebase conflicts during PR updates
  - Integrating upstream changes into feature branches
  - Preparing clean commit history for code review
  - Understanding when to use fast-forward merges
  - Avoiding common rebase pitfalls
  - Rebasing vs merging for team collaboration
  - Managing commit history in monorepos
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://agents/git-troubleshooter
  - orchestr8://skills/git-pr-workflow
  - orchestr8://skills/git-advanced-commands
  - orchestr8://skills/git-workflow
  - orchestr8://skills/git-branching-strategies
estimatedTokens: 820
---

# Git Rebase vs Merge Strategy

## When to Rebase vs Merge

```bash
# ✅ USE REBASE FOR:
# - Updating feature branch with latest main
# - Cleaning up local commits before pushing
# - Maintaining linear project history
# - Personal/WIP branches not yet shared

git checkout feature-branch
git fetch origin
git rebase origin/main  # Clean, linear history

# ✅ USE MERGE FOR:
# - Integrating completed feature branches
# - Preserving context of parallel development
# - Public/shared branches (never rebase shared history!)
# - When team policy requires merge commits

git checkout main
git merge --no-ff feature-branch  # Creates merge commit

# GOLDEN RULE: Never rebase commits pushed to shared branches
# that others may have based work on!
```

## Interactive Rebase Mastery

```bash
# Interactive rebase last 5 commits
git rebase -i HEAD~5

# Interactive rebase from specific commit
git rebase -i abc123^  # Rebase from commit abc123

# Interactive rebase from main
git rebase -i main

# Rebase editor commands:
# pick   = use commit as-is
# reword = use commit, but edit message
# edit   = use commit, but stop for amending
# squash = combine with previous commit, edit message
# fixup  = like squash, but discard commit message
# drop   = remove commit
# exec   = run shell command

# Example interactive rebase session:
pick f7f3f6d feat: add user authentication
reword 310154e feat: add password validation  # Fix typo in message
squash a5f4a0d fix: handle edge case  # Combine with prev
fixup c3e9fcd fix: typo  # Combine, discard message
pick e2c4a3b test: add auth tests
exec npm test  # Run tests after this commit
drop 5c8e5ab debug: temporary logging  # Remove debug code

# After saving, Git will:
# 1. Stop at 'reword' to edit message
# 2. Combine 'squash' commits and prompt for new message
# 3. Auto-combine 'fixup' commits
# 4. Stop at 'edit' for manual changes
# 5. Execute shell commands at 'exec'
# 6. Skip 'drop' commits
```

## Rebase Workflow Patterns

```bash
# Pattern 1: Keep feature branch up-to-date
git checkout feature-branch
git fetch origin
git rebase origin/main

# Pattern 2: Squash work-in-progress commits
git rebase -i HEAD~3  # Squash last 3 commits
# Use 'fixup' for all but first commit

# Pattern 3: Rebase with autosquash (requires setup)
git config --global rebase.autosquash true

# Make WIP commits with fixup/squash prefixes
git commit -m "feat: add feature"
git commit -m "fixup! feat: add feature"  # Auto-squashed
git commit -m "squash! feat: add feature"  # Auto-squashed with message

git rebase -i --autosquash main  # Automatically arranges fixup/squash

# Pattern 4: Split a commit
git rebase -i HEAD~1
# Change 'pick' to 'edit'
git reset HEAD^  # Unstage all changes
git add file1.js
git commit -m "feat: implement part 1"
git add file2.js
git commit -m "feat: implement part 2"
git rebase --continue

# Pattern 5: Reorder commits
git rebase -i HEAD~5
# Simply reorder the pick lines in editor
```

## Conflict Resolution

```bash
# During merge conflict
git merge feature-branch
# CONFLICT in file.js
git status  # Shows conflicted files

# Open file.js, find conflict markers:
<<<<<<< HEAD (Current Change)
const value = "main branch version";
=======
const value = "feature branch version";
>>>>>>> feature-branch (Incoming Change)

# Resolve by editing to desired state:
const value = "merged version combining both";

git add file.js
git commit  # Complete the merge

# During rebase conflict
git rebase main
# CONFLICT in file.js

# Resolve conflict (same as above)
git add file.js
git rebase --continue  # Continue rebase

# Abort if needed
git rebase --abort  # Cancel and return to pre-rebase state
git merge --abort   # Cancel merge

# Skip commit during rebase
git rebase --skip  # Skip current commit (rarely needed)

# Use merge tools
git mergetool  # Launch configured merge tool
git config --global merge.tool vimdiff  # Configure merge tool

# Accept one side entirely
git checkout --ours file.js    # Keep current branch version
git checkout --theirs file.js  # Take incoming branch version
git add file.js
git rebase --continue
```

## Advanced Rebase Techniques

```bash
# Rebase onto different base
git rebase --onto main feature-base feature-branch
# Takes commits from feature-branch that aren't in feature-base
# and replays them onto main

# Example: Moving feature branch to different base
#   Before: main---A---B---C feature-base---D---E feature-branch
#   After:  main---A---B---C---D'---E' feature-branch
git rebase --onto main feature-base feature-branch

# Preserve merge commits during rebase
git rebase --preserve-merges main  # Deprecated, use --rebase-merges
git rebase --rebase-merges main    # Modern approach

# Interactive rebase with exec for validation
git rebase -i main --exec "npm test"
# Runs tests after each commit, stops if any fail

# Continue rebase after fixing tests
npm run fix-tests
git add .
git commit --amend
git rebase --continue

# Rebase with custom strategy
git rebase -X theirs main  # Prefer incoming changes on conflict
git rebase -X ours main    # Prefer current branch on conflict
```

## Cleaning Commit History

```bash
# Clean up commits before PR
git checkout feature-branch

# View commits since branching
git log --oneline main..HEAD

# Interactive rebase to squash WIP commits
git rebase -i main

# Example cleanup:
pick a1b2c3d feat: implement user auth
fixup d4e5f6g WIP: debugging
fixup g7h8i9j fix typo
pick j0k1l2m test: add auth tests
reword m3n4o5p feat: add profile page
fixup p6q7r8s fix lint errors

# Result: Clean, logical commits perfect for review

# Split overly large commit
git rebase -i main
# Mark commit as 'edit'
git reset HEAD^
git add src/auth/
git commit -m "feat(auth): implement authentication"
git add src/profile/
git commit -m "feat(profile): implement user profile"
git rebase --continue

# Reorder commits logically
git rebase -i main
# Rearrange so tests follow implementation
pick a1b2c3d feat: add feature X
pick e8f9g0h feat: add feature Y
pick j1k2l3m test: add feature X tests
pick p4q5r6s test: add feature Y tests
# Reorder to:
pick a1b2c3d feat: add feature X
pick j1k2l3m test: add feature X tests
pick e8f9g0h feat: add feature Y
pick p4q5r6s test: add feature Y tests
```

## Merge Strategies Comparison

```bash
# Fast-Forward Merge (default if possible)
git merge feature-branch
# No merge commit created if linear history

# No Fast-Forward (always create merge commit)
git merge --no-ff feature-branch
# Preserves branch context, useful for features

# Squash Merge (combines all commits)
git merge --squash feature-branch
git commit -m "feat: implement user authentication

Complete implementation including:
- JWT token generation
- Password hashing with bcrypt
- Session management
- OAuth2 integration"

# Recursive Strategy (default)
git merge -s recursive feature-branch

# Octopus Merge (multiple branches)
git merge branch1 branch2 branch3  # For release branches

# Ours/Theirs Strategy
git merge -X ours feature-branch    # Prefer current branch
git merge -X theirs feature-branch  # Prefer incoming branch
```

## Rebase Safety and Recovery

```bash
# Safety: Force-with-lease instead of force
git push --force-with-lease origin feature-branch
# Prevents overwriting if remote changed

# Recovery: Using reflog
git reflog  # View all ref changes
# Find pre-rebase state
git reset --hard HEAD@{5}  # Return to earlier state

# Create backup branch before risky rebase
git branch backup-feature-branch
git rebase main
# If problems: git reset --hard backup-feature-branch

# Test rebase without changing branch
git rebase --interactive --autosquash main --dry-run
```
