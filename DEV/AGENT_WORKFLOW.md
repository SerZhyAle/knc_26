# AGENT WORKFLOW & PROCESS GATES

---

## 5-Step Engineering Cycle

All work follows strict phase separation: **Plan → Review → Execute → Verify**.

### 1. TASK DEFINITION
**Objective**: Clarify and expand the task scope.

- **Actions**:
  - Ask clarifying questions
  - Expand vague requirements
  - Identify constraints and dependencies
  - Confirm scope alignment with user

- **Gate**: DO NOT proceed to research until task is perfectly clarified.

---

### 2. RESEARCH PHASE
**Objective**: Analyze current "AS-IS" state.

- **Actions**:
  - Examine existing code/architecture
  - Look up relevant files, classes, solutions
  - Review dependencies and constraints
  - Gather full context via tools (NO hallucination)

- **Deliverable**: Complete understanding of current state
- **Gate**: Research must be thorough before proposing solutions.

---

### 3. DESIGN & PLANNING
**Objective**: Prepare architecture and execution plan.

- **Actions**:
  - Propose solution with rationale (options vs recommendation)
  - Break into steps: **What? Why? How?**
  - Create execution sequence with priorities and checkboxes
  - Identify risks and mitigations

- **Output Format** (Markdown):
  ```
  ## Proposal
  - **Problem**: [State the issue]
  - **Impact**: [Why it matters]
  - **Options**: [List alternatives with effort/risk/impact]
  - **Recommendation**: [Opinionated choice with reasoning]
  
  ## Execution Plan
  - [ ] Step 1: [Description]
  - [ ] Step 2: [Description]
  - [ ] Step 3: [Description]
  ```

- **Gate**: MUST WAIT for human review and confirmation BEFORE writing code.

---

### 4. IMPLEMENTATION
**Objective**: Execute the approved plan step-by-step.

- **Actions**:
  - Write code iteratively (small, testable chunks)
  - Update progress in implementation artifacts
  - Log all changes via `add_to_dev_log.ps1`
  - Follow coding standards (lint, naming, comments)

- **Principles**:
  - **Correctness > Speed**
  - **Explicit > Clever**
  - **DRY**: No code repetition

- **After Each File Modification**:
  ```powershell
  .\scripts\add_to_dev_log.ps1 "<filepath>" "<component>" "<description>"
  ```

- **Gate**: Each file modification must be logged.

---

### 5. VERIFICATION
**Objective**: Test and validate the solution.

- **Actions**:
  - Test critical paths and edge cases
  - Verify lint/style compliance
  - Analyze complexity (Time/Space, I/O)
  - Create summary of accomplished work
  - Review against original requirements

- **Deliverable**: Verified, tested, documented solution

---

## Task Complexity Classification

### SIMPLE (Low Effort)
- Typos, formatting, renaming
- Logs, comments, simple refactors
- Navigation, search, explanations
- Fixes <50 lines

**Process**: DEFINITION → RESEARCH → IMPLEMENTATION → VERIFICATION  
**Planning**: Minimal, inline notes OK

---

### MEDIUM (Standard Effort)
- New features
- Analysis-heavy bug fixes
- Multi-file changes
- Network/DB integration

**Process**: Full 5-step cycle  
**Planning**: Moderate detail, execution checklist

---

### COMPLEX (High Effort)
- Architecture refactors
- Cross-module changes
- Optimization, critical debugging
- Major infrastructure

**Process**: Full 5-step with risk analysis  
**Planning**: Detailed design doc, risk/mitigation matrix

---

## Recommendation Protocol

When asked for "suggestion", "advice", or "opinion":

1. **Presentation**:
   - Problem & Impact
   - Options (Effort/Risk/Impact matrix)
   - Recommendation (opinionated, risk-focused)

2. **Output**: TEXT answer ONLY (no code)

3. **Exception**: Code ONLY if explicitly asked ("implement", "fix", "write")

---

## Artifact Management

### Persistent Tracking Files
For complex tasks, maintain markdown files:
- `task.md` — Task definition and progress
- `implementation_plan.md` — Detailed execution plan

**Update strictly** to maintain state across sessions.

---

### Logging Changes
**MANDATORY** after every code/config file modification:

```powershell
.\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
```

This appends a timestamped row to `dev/CHANGELOG.md`.  
**NO EXCEPTIONS** — Execute BEFORE moving to next step.

---

## Code Review Checklist

### Architecture
- [ ] Coupling minimal, cohesion high
- [ ] Boundaries clear and enforced
- [ ] Dependency direction correct (outer → inner)

### Code Quality
- [ ] Readable and maintainable
- [ ] Error handling present
- [ ] Technical debt tracked or resolved
- [ ] Comments explain WHY, not WHAT
- [ ] No lint warnings

### Testing
- [ ] Critical paths tested
- [ ] Edge cases covered
- [ ] Performance acceptable

### Documentation
- [ ] Changes logged in CHANGELOG.md
- [ ] Code comments updated
- [ ] README/docs reflect changes

---

## Communication During Workflow

### DEFINITION Phase
- Ask questions
- Confirm understanding
- Get approval to proceed

### RESEARCH Phase
- Share findings
- Ask follow-up questions if needed
- Verify assumptions

### DESIGN Phase
- Present plan
- **WAIT FOR APPROVAL** — DO NOT code yet
- Discuss options and trade-offs

### IMPLEMENTATION Phase
- Provide progress updates
- Ask clarifications if needed
- Confirm approach mid-way (if scope changes)

### VERIFICATION Phase
- Share test results
- Provide final summary
- Mark task complete

---

## Fast-Track for Simple Tasks

For clearly-defined, low-risk tasks (<50 lines, <1 file):

1. **DEFINITION**: Quick confirmation (1 message)
2. **RESEARCH**: Minimal (read relevant file)
3. **PLAN-IMPLEMENT**: Combined (inline notes, code in one go)
4. **VERIFY**: Quick test + confirmation

**Still log changes** via `add_to_dev_log.ps1`.

---

## Q/A

**Q**: When do I write code?  
**A**: After DESIGN phase is approved (gate 3).

**Q**: What if requirements change mid-implementation?  
**A**: Stop, clarify, revise DESIGN, get approval, resume.

**Q**: Do I need to plan for simple typo fixes?  
**A**: No. DEFINITION → IMPLEMENTATION → VERIFY (skip detailed DESIGN).

**Q**: How detailed should the plan be?  
**A**: Match complexity: simple = bullet list, medium = checklist, complex = detailed doc.
