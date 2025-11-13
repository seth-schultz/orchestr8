---
id: github-cli-essentials
category: skill
tags: [github, gh-cli, github-api, automation, pull-request, issues, actions, github-workflow, cli-tools]
capabilities:
  - Master GitHub CLI for repository operations
  - Automate GitHub workflows with gh commands
  - Manage PRs, issues, and releases via CLI
  - Integrate GitHub CLI into development workflows
  - Script GitHub operations for automation
useWhen:
  - Creating and managing pull requests from terminal
  - Automating GitHub issue management
  - Managing GitHub Actions workflows via CLI
  - Creating releases and tags programmatically
  - Viewing and managing GitHub notifications
  - Cloning and forking repositories quickly
  - Managing repository settings and collaborators
  - Triggering GitHub Actions manually
  - Creating GitHub gists from command line
  - Managing GitHub secrets and variables
  - Automating PR reviews and approvals
  - Integrating GitHub into CI/CD pipelines
  - Bulk operations on issues and PRs
  - Managing GitHub Projects via CLI
  - GitHub SSH key and authentication management
relatedResources:
  - orchestr8://agents/github-workflow-specialist
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-pr-workflow
  - orchestr8://skills/git-workflow
  - orchestr8://skills/cicd-pipeline-optimization
  - orchestr8://patterns/automation-workflows
estimatedTokens: 850
---

# GitHub CLI Essentials

## Installation and Setup

```bash
# Install GitHub CLI
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | \
  sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] \
  https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update && sudo apt install gh

# Windows
winget install --id GitHub.cli

# Authenticate
gh auth login
# Follow interactive prompts to authenticate

# Check authentication status
gh auth status

# Configure default editor
gh config set editor vim

# Set default protocol
gh config set git_protocol ssh

# View configuration
gh config list
```

## Pull Request Management

```bash
# Create PR
gh pr create
gh pr create --title "feat: add new feature" --body "Description"
gh pr create --draft  # Create as draft
gh pr create --web    # Open web interface

# Create PR with template
gh pr create --title "Bug fix" \
  --body "$(cat .github/pull_request_template.md)" \
  --reviewer @octocat,@user2 \
  --assignee @me \
  --label "bug,high-priority" \
  --milestone "v1.0"

# List PRs
gh pr list                    # List open PRs
gh pr list --state all        # All PRs (open, closed, merged)
gh pr list --author @me       # Your PRs
gh pr list --assignee @me     # Assigned to you
gh pr list --label "bug"      # Filter by label
gh pr list --search "api"     # Search PRs

# View PR details
gh pr view 123                # View PR #123
gh pr view --web              # Open in browser
gh pr view --comments         # Include comments

# Checkout PR
gh pr checkout 123            # Checkout PR branch
gh pr checkout https://github.com/owner/repo/pull/123

# PR reviews
gh pr review 123 --approve
gh pr review 123 --approve --body "LGTM!"
gh pr review 123 --request-changes --body "Please fix formatting"
gh pr review 123 --comment --body "Looks good with minor suggestions"

# Merge PR
gh pr merge 123               # Interactive merge
gh pr merge 123 --squash      # Squash merge
gh pr merge 123 --merge       # Merge commit
gh pr merge 123 --rebase      # Rebase merge
gh pr merge 123 --auto        # Auto-merge when checks pass
gh pr merge 123 --delete-branch  # Delete branch after merge

# Update PR
gh pr edit 123 --title "New title"
gh pr edit 123 --body "Updated description"
gh pr edit 123 --add-reviewer @octocat
gh pr edit 123 --add-label "enhancement"

# PR status
gh pr status                  # Show status of relevant PRs
gh pr checks                  # Show CI status
gh pr checks --watch          # Watch checks in real-time

# Close/reopen PR
gh pr close 123
gh pr reopen 123

# Mark PR ready for review
gh pr ready 123

# PR diff
gh pr diff 123
gh pr diff 123 --patch        # Show patch format
```

## Issue Management

```bash
# Create issue
gh issue create
gh issue create --title "Bug report" --body "Details..."
gh issue create --web

# Create with template
gh issue create \
  --title "Bug: Login fails" \
  --body "$(cat .github/ISSUE_TEMPLATE/bug_report.md)" \
  --label "bug" \
  --assignee @me

# List issues
gh issue list
gh issue list --state all
gh issue list --author @me
gh issue list --assignee @me
gh issue list --label "bug,high-priority"
gh issue list --milestone "v2.0"
gh issue list --search "login error"

# View issue
gh issue view 456
gh issue view 456 --web
gh issue view 456 --comments

# Update issue
gh issue edit 456 --title "Updated title"
gh issue edit 456 --body "Updated description"
gh issue edit 456 --add-assignee @user
gh issue edit 456 --add-label "enhancement"
gh issue edit 456 --milestone "v1.0"

# Comment on issue
gh issue comment 456 --body "This is fixed in PR #123"

# Close/reopen issue
gh issue close 456
gh issue close 456 --reason "completed"  # or "not planned"
gh issue reopen 456

# Pin/unpin issue
gh issue pin 456
gh issue unpin 456

# Transfer issue
gh issue transfer 456 other-repo

# Bulk operations with jq
gh issue list --json number,title --jq '.[] | select(.title | contains("bug")) | .number' | \
  xargs -I {} gh issue edit {} --add-label "needs-triage"
```

## Repository Operations

```bash
# Clone repository
gh repo clone owner/repo
gh repo clone owner/repo custom-dir

# Create repository
gh repo create my-project
gh repo create my-project --public
gh repo create my-project --private
gh repo create my-project --source=. --remote=upstream

# Fork repository
gh repo fork owner/repo
gh repo fork owner/repo --clone
gh repo fork --remote=false  # Don't add remote

# View repository
gh repo view
gh repo view owner/repo
gh repo view --web

# Repository settings
gh repo edit --description "New description"
gh repo edit --homepage "https://example.com"
gh repo edit --default-branch main
gh repo edit --enable-issues=false
gh repo edit --enable-wiki=false
gh repo edit --visibility private

# Archive/unarchive repository
gh repo archive owner/repo
gh repo unarchive owner/repo

# Delete repository (use with caution!)
gh repo delete owner/repo --confirm

# List repositories
gh repo list
gh repo list owner
gh repo list --limit 50
gh repo list --language javascript
gh repo list --topic react

# Sync fork
gh repo sync owner/fork
```

## GitHub Actions Workflows

```bash
# List workflows
gh workflow list

# View workflow
gh workflow view workflow-name
gh workflow view workflow-name --web

# Run workflow
gh workflow run workflow-name
gh workflow run workflow-name --ref branch-name
gh workflow run workflow-name -f input1=value1 -f input2=value2

# Enable/disable workflow
gh workflow enable workflow-name
gh workflow disable workflow-name

# List workflow runs
gh run list
gh run list --workflow=test.yml
gh run list --branch=main
gh run list --limit 20

# View run details
gh run view 123456789
gh run view --log          # Show logs
gh run view --log-failed   # Show only failed logs

# Watch run
gh run watch               # Watch latest run
gh run watch 123456789     # Watch specific run

# Download artifacts
gh run download 123456789
gh run download 123456789 --name artifact-name

# Re-run workflow
gh run rerun 123456789
gh run rerun 123456789 --failed  # Re-run only failed jobs

# Cancel run
gh run cancel 123456789

# Delete run
gh run delete 123456789
```

## Release Management

```bash
# Create release
gh release create v1.0.0
gh release create v1.0.0 --title "Version 1.0.0"
gh release create v1.0.0 --notes "Release notes..."
gh release create v1.0.0 --draft
gh release create v1.0.0 --prerelease

# Upload assets
gh release create v1.0.0 dist/*.zip dist/*.tar.gz

# Auto-generate notes
gh release create v1.0.0 --generate-notes

# List releases
gh release list
gh release list --limit 20

# View release
gh release view v1.0.0
gh release view latest
gh release view --web

# Download release assets
gh release download v1.0.0
gh release download v1.0.0 --pattern "*.zip"
gh release download v1.0.0 --archive=zip

# Upload additional assets
gh release upload v1.0.0 additional-file.zip

# Edit release
gh release edit v1.0.0 --title "New title"
gh release edit v1.0.0 --notes "Updated notes"

# Delete release
gh release delete v1.0.0 --yes
```

## Gist Management

```bash
# Create gist
gh gist create file.js
gh gist create file1.js file2.js  # Multiple files
gh gist create --public file.js
gh gist create --desc "Description" file.js
echo "console.log('hello')" | gh gist create --filename script.js

# List gists
gh gist list
gh gist list --public
gh gist list --secret

# View gist
gh gist view abc123
gh gist view --web abc123

# Edit gist
gh gist edit abc123

# Clone gist
gh gist clone abc123

# Delete gist
gh gist delete abc123
```

## Advanced Automation

```bash
# Use GitHub API directly
gh api repos/owner/repo/issues
gh api repos/owner/repo/pulls --jq '.[] | .title'

# Paginated API requests
gh api --paginate repos/owner/repo/issues

# POST request
gh api repos/owner/repo/issues \
  -f title="Issue title" \
  -f body="Issue body"

# Custom scripts with gh
#!/bin/bash
# auto-label-prs.sh
gh pr list --json number,title,labels --jq '.[]' | while read -r pr; do
  number=$(echo "$pr" | jq -r '.number')
  title=$(echo "$pr" | jq -r '.title')

  if [[ $title == feat:* ]]; then
    gh pr edit "$number" --add-label "enhancement"
  elif [[ $title == fix:* ]]; then
    gh pr edit "$number" --add-label "bug"
  fi
done

# Bulk PR operations
#!/bin/bash
# approve-all-dependabot.sh
gh pr list --author "app/dependabot" --json number -q '.[].number' | \
  xargs -I {} gh pr review {} --approve --body "Auto-approved Dependabot PR"

# Create issues from file
cat issues.txt | while read line; do
  gh issue create --title "$line" --label "backlog"
done

# Export issues to CSV
gh issue list --json number,title,state,createdAt,author \
  --jq '.[] | [.number, .title, .state, .createdAt, .author.login] | @csv' > issues.csv
```

## GitHub Secrets and Variables

```bash
# Set repository secret
gh secret set SECRET_NAME < secret-file.txt
echo "secret-value" | gh secret set SECRET_NAME

# List secrets
gh secret list

# Delete secret
gh secret delete SECRET_NAME

# Set environment variable
gh variable set VAR_NAME --body "value"

# List variables
gh variable list

# Delete variable
gh variable delete VAR_NAME
```
