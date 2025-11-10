#!/usr/bin/env python3

import re
import json
import subprocess
import sys
from pathlib import Path
from typing import Dict, List, Tuple
import time

def extract_actions_from_workflow(filepath: Path) -> List[Tuple[str, str, str]]:
    """Extract action references with SHA from workflow file."""
    actions = []
    
    with open(filepath, 'r') as f:
        content = f.read()
        
    # Pattern: uses: owner/repo@sha # version
    pattern = r'uses:\s+([^@\s]+)@([0-9a-f]{40})\s*(?:#\s*(.*))?'
    
    for match in re.finditer(pattern, content):
        action = match.group(1)
        sha = match.group(2)
        version_comment = match.group(3).strip() if match.group(3) else ""
        actions.append((action, sha, version_comment))
    
    return actions

def verify_sha(owner: str, repo: str, sha: str) -> bool:
    """Verify SHA exists in GitHub repository."""
    cmd = [
        'curl', '-s', '-o', '/dev/null', '-w', '%{http_code}',
        f'https://api.github.com/repos/{owner}/{repo}/git/commits/{sha}'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout.strip() == '200'

def get_sha_for_tag(owner: str, repo: str, tag: str) -> str:
    """Get SHA for a given tag."""
    cmd = [
        'curl', '-s',
        f'https://api.github.com/repos/{owner}/{repo}/git/ref/tags/{tag}'
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        data = json.loads(result.stdout)
        return data.get('object', {}).get('sha', '')
    except:
        return ''

def main():
    print("=" * 70)
    print("COMPREHENSIVE SHA VERIFICATION REPORT")
    print("=" * 70)
    print()
    
    # Find all workflow files
    workflows_dir = Path('.github/workflows')
    workflow_files = list(workflows_dir.glob('*.yml'))
    
    print(f"Found {len(workflow_files)} workflow files")
    print()
    
    # Collect all actions
    all_actions = {}
    for workflow in workflow_files:
        actions = extract_actions_from_workflow(workflow)
        for action, sha, version in actions:
            if action not in all_actions:
                all_actions[action] = {
                    'sha': sha,
                    'version': version,
                    'files': []
                }
            all_actions[action]['files'].append(str(workflow))
    
    print(f"Found {len(all_actions)} unique action references")
    print()
    print("=" * 70)
    print("VERIFYING SHAs")
    print("=" * 70)
    print()
    
    valid_count = 0
    invalid_count = 0
    invalid_actions = []
    
    for action, info in sorted(all_actions.items()):
        sha = info['sha']
        version = info['version']
        files = info['files']
        
        # Parse action
        parts = action.split('/')
        if len(parts) < 2:
            continue
            
        owner = parts[0]
        repo = parts[1]
        
        print(f"Checking: {action}")
        print(f"  SHA: {sha}")
        if version:
            print(f"  Version: {version}")
        print(f"  Used in: {len(files)} file(s)")
        
        # Verify SHA
        is_valid = verify_sha(owner, repo, sha)
        
        if is_valid:
            print(f"  ✓ VALID")
            valid_count += 1
        else:
            print(f"  ✗ INVALID")
            invalid_count += 1
            
            # Try to find correct SHA
            correct_sha = ''
            if version:
                print(f"  → Attempting to find correct SHA for {version}...")
                correct_sha = get_sha_for_tag(owner, repo, version)
                if correct_sha:
                    print(f"  → Found: {correct_sha}")
                else:
                    print(f"  → Not found for tag {version}")
            
            invalid_actions.append({
                'action': action,
                'owner': owner,
                'repo': repo,
                'current_sha': sha,
                'version': version,
                'correct_sha': correct_sha,
                'files': files
            })
        
        print()
        time.sleep(0.5)  # Rate limiting
    
    # Summary
    print("=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print()
    print(f"Total actions checked: {len(all_actions)}")
    print(f"✓ Valid SHAs: {valid_count}")
    print(f"✗ Invalid SHAs: {invalid_count}")
    print()
    
    if invalid_actions:
        print("=" * 70)
        print("ACTIONS REQUIRING FIXES")
        print("=" * 70)
        print()
        
        for item in invalid_actions:
            print(f"Action: {item['action']}")
            print(f"  Owner/Repo: {item['owner']}/{item['repo']}")
            print(f"  Current SHA: {item['current_sha']}")
            print(f"  Version: {item['version'] or 'UNKNOWN'}")
            if item['correct_sha']:
                print(f"  Correct SHA: {item['correct_sha']}")
            else:
                print(f"  Correct SHA: NEEDS MANUAL LOOKUP")
            print(f"  Files affected:")
            for f in item['files']:
                print(f"    - {f}")
            print()
        
        # Save results to JSON
        with open('/tmp/invalid_shas.json', 'w') as f:
            json.dump(invalid_actions, f, indent=2)
        print(f"Invalid SHAs saved to: /tmp/invalid_shas.json")
        print()
        
        return 1
    
    return 0

if __name__ == '__main__':
    sys.exit(main())
