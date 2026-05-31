# PROJECT OPERATIONS INDEX

**Open this file FIRST for task routing and project navigation.**

---

## Quick Navigation

### By Task Type

| Task | Document | Purpose |
|------|----------|---------|
| Architecture, design, data flow | [ARCHITECTURE.md](../docs/ARCHITECTURE.md) | System design, layers, interactions |
| Build, flavors, flags, scripts, deployment | [DEV_OPS.md](../docs/DEV_OPS.md) | Build process, configurations, releases |
| Libraries, protocols, network, database | [TECH_STACK.md](../docs/TECH_STACK.md) | Technology inventory, versions, constraints |
| Dependencies, requirements, constraints | [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md) | Full requirement list, versions, compatibility |
| Production roadmap, milestones | [ROADMAP.md](ROADMAP.md) | Production milestones and sub-specifications |
| Robotic milestone execution specs | [MILESTONE_TECH_SPECS.md](MILESTONE_TECH_SPECS.md) | Technical execution specs and agent prompts per milestone |
| Post-MVP robotic execution specs | [POST_MVP_TECH_SPECS.md](POST_MVP_TECH_SPECS.md) | Technical execution specs and agent prompts for P1-P3 |
| Workflow, phases, gates, process | [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) | Development workflow, CI/CD, approval gates |
| Changes, modifications, history | [CHANGELOG.md](CHANGELOG.md) | Timestamped log of all modifications |

---

## Source of Truth

- **Dependencies**: Check `gradle/libs.versions.toml` (primary) or `build.gradle.kts` files
- **Configuration**: `.editorconfig`, `settings.gradle.kts`, configuration files

---

## Entry Points

### For New Contributors
1. Read this file (you are here)
2. Review [AGENT_WORKFLOW.md](AGENT_WORKFLOW.md) for process
3. Check [TECH_STACK.md](../docs/TECH_STACK.md) for technology overview
4. Review [ARCHITECTURE.md](../docs/ARCHITECTURE.md) for design

### For Maintenance
1. Check [CHANGELOG.md](CHANGELOG.md) for recent changes
2. Review [DEV_OPS.md](../docs/DEV_OPS.md) for build/deployment
3. Consult [TECH_REQUIREMENTS.md](TECH_REQUIREMENTS.md) for compatibility

---

## Project Structure

```
project-root/
├── dev/                           # Development artifacts
│   ├── PROJECT_OPERATIONS_INDEX.md  # This file
│   ├── AGENT_WORKFLOW.md            # Workflow & gates
│   ├── ROADMAP.md                    # Production milestones
│   ├── MILESTONE_TECH_SPECS.md       # Robotic milestone execution specs
│   ├── POST_MVP_TECH_SPECS.md        # Post-MVP robotic execution specs
│   ├── TECH_REQUIREMENTS.md         # Requirements inventory
│   └── CHANGELOG.md                 # Change log
├── docs/                          # Project documentation
│   ├── ARCHITECTURE.md              # System design
│   ├── DEV_OPS.md                   # Build & deployment
│   └── TECH_STACK.md                # Technology details
├── scripts/                       # Automation scripts
│   └── add_to_dev_log.ps1          # Changelog updater
├── temp/                          # Temporary artifacts
├── universal_copilot_instructions.md # Base rules
└── [Language/Framework specific]  # Project source
```

---

## Key Rules (Abstract from universal_copilot_instructions.md)

- **Separation of Concerns**: UI ≠ Logic ≠ Data
- **Dependency Rule**: Outer → Inner (never reverse)
- **Single Responsibility**: One class, one job
- **Zero Warnings**: Lint compliance is mandatory
- **Root Cleanliness**: Artifacts go to `temp/`
- **Log All Changes**: Use `add_to_dev_log.ps1` after modifications

---

## Status & Links

- **Last Updated**: [Check CHANGELOG.md](CHANGELOG.md)
- **Setup**: [Follow AGENT_WORKFLOW.md](AGENT_WORKFLOW.md)
- **Issues/Questions**: Refer to relevant document above
