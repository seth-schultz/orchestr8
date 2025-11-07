#!/usr/bin/env python3
"""
Update orchestr8 workflow files to use new .orchestr8 directory structure.

This script safely updates workflow documentation file references to use the
new .orchestr8/docs/{category}/ structure while preserving formatting and
adding setup script initialization where needed.
"""

import os
import re
import sys
from pathlib import Path
from typing import Dict, Tuple

# Mapping of old filenames to (category, new_filename)
FILE_MAPPINGS: Dict[str, Tuple[str, str]] = {
    # Requirements
    "requirements-analysis.md": ("requirements", "analysis.md"),
    "ml-requirements.md": ("requirements", "ml-requirements.md"),
    "project-analysis.md": ("requirements", "project-analysis.md"),
    "security-requirements.md": ("requirements", "security-requirements.md"),

    # Design
    "design-document.md": ("design", "document.md"),
    "ml-architecture.md": ("design", "ml-architecture.md"),
    "architecture.md": ("design", "architecture.md"),
    "workflow-design.md": ("design", "workflow-design.md"),
    "plugin-design.md": ("design", "plugin-design.md"),
    "tech-stack.md": ("design", "tech-stack.md"),
    "plugin-specs.md": ("design", "plugin-specs.md"),
    "cicd-strategy.md": ("design", "cicd-strategy.md"),
    "observability-architecture.md": ("design", "observability-architecture.md"),

    # Quality
    "code-review-report.md": ("quality", "code-review.md"),
    "test-report.md": ("quality", "test-report.md"),
    "style-review-report.md": ("quality", "style-review.md"),
    "logic-review-report.md": ("quality", "logic-review.md"),
    "architecture-review-report.md": ("quality", "architecture-review.md"),
    "skill-test-report.md": ("quality", "skill-test-report.md"),
    "validation-report.md": ("quality", "validation-report.md"),
    "visual-test-report.md": ("quality", "visual-test-report.md"),
    "functional-test-report.md": ("quality", "functional-test-report.md"),

    # Security
    "security-report.md": ("security", "audit.md"),
    "security-audit.md": ("security", "audit.md"),
    "security-audit-report.md": ("security", "audit.md"),
    "security-scope.md": ("security", "scope.md"),
    "asset-inventory.md": ("security", "asset-inventory.md"),
    "threat-model.md": ("security", "threat-model.md"),
    "owasp-review-report.md": ("security", "owasp-review.md"),
    "vulnerability-findings.json": ("security", "findings.json"),
    "compliance-report.md": ("security", "compliance.md"),
    "compliance-gaps.json": ("security", "compliance-gaps.json"),
    "remediation-plan.md": ("security", "remediation-plan.md"),
    "auto-fixes-log.md": ("security", "auto-fixes-log.md"),
    "manual-fixes-required.md": ("security", "manual-fixes-required.md"),
    "security-metrics.json": ("security", "metrics.json"),

    # Performance
    "performance-report.md": ("performance", "analysis.md"),
    "performance-analysis-report.md": ("performance", "analysis.md"),
    "cost-analysis-report.md": ("performance", "cost-analysis.md"),
    "rightsizing-report.md": ("performance", "rightsizing.md"),
    "storage-optimization-report.md": ("performance", "storage-optimization.md"),
    "reserved-capacity-report.md": ("performance", "reserved-capacity.md"),
    "autoscaling-report.md": ("performance", "autoscaling.md"),
    "networking-optimization-report.md": ("performance", "networking-optimization.md"),
    "finops-monitoring-report.md": ("performance", "finops-monitoring.md"),

    # Accessibility
    "accessibility-report.md": ("accessibility", "audit.md"),
    "wcag-audit.md": ("accessibility", "wcag-audit.md"),

    # Deployment
    "deployment-guide.md": ("deployment", "guide.md"),
    "deployment-report.md": ("deployment", "report.md"),
    "commit-message.txt": ("deployment", "commit-message.txt"),
    "rollback-guide.md": ("deployment", "rollback-guide.md"),
    "pre-deployment-code-review.md": ("deployment", "pre-deployment-review.md"),
    "migration-validation-report.md": ("deployment", "migration-validation.md"),

    # Analysis
    "code-analysis.md": ("analysis", "code-analysis.md"),
    "code-analysis-report.md": ("analysis", "code-analysis.md"),
    "migration-strategy.md": ("analysis", "migration-strategy.md"),
    "risk-matrix.md": ("analysis", "risk-matrix.md"),
    "refactoring-plan.md": ("analysis", "refactoring-plan.md"),
    "refactoring-log.md": ("analysis", "refactoring-log.md"),
    "refactoring-summary.md": ("analysis", "refactoring-summary.md"),
    "bug-reproduction.md": ("analysis", "bug-reproduction.md"),
    "root-cause-analysis.md": ("analysis", "root-cause-analysis.md"),
    "bug-fix-docs.md": ("analysis", "bug-fix-docs.md"),

    # Infrastructure
    "deployment-plan.md": ("infrastructure", "deployment-plan.md"),
    "slo-definitions.md": ("infrastructure", "slo-definitions.md"),
}


def update_workflow_file(filepath: Path) -> bool:
    """Update a single workflow file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content

        # Update each file reference
        for old_name, (category, new_name) in FILE_MAPPINGS.items():
            new_path = f".orchestr8/docs/{category}/{new_name}"

            # Pattern 1: Backtick references (documentation)
            content = content.replace(f"`{old_name}`", f"`{new_path}`")

            # Pattern 2: List items with dash and backticks
            content = re.sub(
                rf'^(\s*)-\s*`{re.escape(old_name)}`',
                rf"\1- `{new_path}`",
                content,
                flags=re.MULTILINE
            )

            # Pattern 3: List items without backticks
            content = re.sub(
                rf'^(\s*)-\s+{re.escape(old_name)}(\s|$)',
                rf"\1- {new_path}\2",
                content,
                flags=re.MULTILINE
            )

        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"Error processing {filepath}: {e}", file=sys.stderr)
        return False


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} /path/to/commands", file=sys.stderr)
        sys.exit(1)

    commands_dir = Path(sys.argv[1])

    if not commands_dir.is_dir():
        print(f"Error: Directory not found: {commands_dir}", file=sys.stderr)
        sys.exit(1)

    # Skip add-feature.md (already updated manually)
    files_to_update = [f for f in commands_dir.glob("*.md") if f.name != "add-feature.md"]

    print(f"Updating {len(files_to_update)} workflow files in {commands_dir}\n")

    updated_count = 0
    for filepath in sorted(files_to_update):
        if update_workflow_file(filepath):
            print(f"✓ {filepath.name}")
            updated_count += 1
        else:
            print(f"- {filepath.name}")

    print(f"\n✓ Complete: {updated_count}/{len(files_to_update)} files updated")


if __name__ == "__main__":
    main()
