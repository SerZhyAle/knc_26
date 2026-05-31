# BUILD, DEPLOYMENT & OPERATIONS

---

## Purpose

This document covers the build system, deployment process, CI/CD pipelines, environment configurations, and release management.

---

## Build System

### Build Tool

**Tool**: [Specify: Gradle, Maven, npm, pip, etc.]  
**Version**: [Specify]

### Build Command

```bash
# Development build
./gradlew build

# Production build
./gradlew build -Pproduction=true

# Clean build
./gradlew clean build

# Build without tests
./gradlew build -x test
```

---

### Build Phases

1. **Compile**: Source code compilation
2. **Test**: Run unit and integration tests
3. **Package**: Create artifacts (JAR, APK, bundle, etc.)
4. **Verify**: Lint, code quality checks
5. **Assemble**: Create release artifacts

---

## Project Structure (Build-Related)

```
project-root/
├── build/                      # Build outputs (generated)
│   ├── classes/                # Compiled classes
│   ├── libs/                   # Packaged artifacts
│   └── reports/                # Test/coverage reports
│
├── gradle/                     # Build configuration
│   └── libs.versions.toml      # Dependency versions (SOURCE OF TRUTH)
│
├── build.gradle.kts            # Main build file
├── settings.gradle.kts         # Project configuration
│
├── src/
│   ├── main/                   # Production code
│   │   ├── java/
│   │   │   └── [packages]/
│   │   ├── kotlin/
│   │   └── resources/
│   │
│   └── test/                   # Test code
│       ├── java/
│       └── resources/
│
└── temp/                       # Temporary build artifacts (clean regularly)
```

---

## Build Configurations

### Development Build
- Debug symbols enabled
- Assertions enabled
- Optimizations: Minimal
- Size: Larger
- Speed: Slower

**Command**:
```bash
./gradlew build -Ddebug=true
```

---

### Production Build
- Debug symbols stripped
- Assertions disabled
- Optimizations: Maximum
- Size: Minimal
- Speed: Optimized

**Command**:
```bash
./gradlew build -Drelease=true
```

---

### Testing Builds

**Run Tests**:
```bash
./gradlew test
```

**Run Specific Test**:
```bash
./gradlew test --tests MyTestClass
```

**Code Coverage**:
```bash
./gradlew test jacoco  # (if applicable)
```

---

## Build Flavors / Variants

### Flavor Matrix

| Flavor | Purpose | API Endpoint | Database | Features |
|--------|---------|------------|----------|----------|
| **Dev** | Development | localhost:8080 | local/test DB | All debug features |
| **Staging** | Pre-production testing | api-staging.example.com | staging DB | Prod config, debug logging |
| **Production** | Live | api.example.com | prod DB | Minimal logging, optimized |

### Building Specific Flavor

```bash
# Development
./gradlew build -Pflavor=dev

# Staging
./gradlew build -Pflavor=staging

# Production
./gradlew build -Pflavor=production
```

---

## Artifacts & Outputs

### Generated Artifacts

| Artifact | Type | Location | Purpose |
|----------|------|----------|---------|
| JAR | Java Archive | `build/libs/*.jar` | Executable Java app |
| APK | Android | `build/outputs/apk/` | Mobile app |
| Docker Image | Container | Registry | Container deployment |
| Javadoc | Documentation | `build/docs/javadoc/` | API documentation |
| Reports | Reports | `build/reports/` | Test/coverage reports |

---

## Deployment

### Environments

#### Development
- **Deploy Target**: Local machine / Dev server
- **Update Frequency**: Continuous
- **Approval**: None required
- **Automated**: Yes (on commit)

#### Staging
- **Deploy Target**: Staging server (mirrors production)
- **Update Frequency**: Per release candidate
- **Approval**: Code review required
- **Automated**: Yes (on tag/release branch)

#### Production
- **Deploy Target**: Production servers
- **Update Frequency**: Scheduled releases
- **Approval**: Release approval + sign-off
- **Automated**: Automated deployment, manual approval

---

### Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Version bumped (MAJOR.MINOR.PATCH)
- [ ] CHANGELOG updated with release notes
- [ ] Build artifact created
- [ ] Deployment script tested (staging first)
- [ ] Backup of current production (if applicable)
- [ ] Database migrations validated (if applicable)
- [ ] Health checks passing post-deployment

---

## Configuration Management

### Environment Variables

**Development**:
```properties
ENV=development
DEBUG=true
LOG_LEVEL=debug
API_ENDPOINT=http://localhost:8080
```

**Staging**:
```properties
ENV=staging
DEBUG=false
LOG_LEVEL=info
API_ENDPOINT=https://api-staging.example.com
```

**Production**:
```properties
ENV=production
DEBUG=false
LOG_LEVEL=error
API_ENDPOINT=https://api.example.com
```

### Configuration Files

- **Location**: `src/main/resources/` or environment-specific config
- **Naming**: `application.properties` or `application-{profile}.properties`
- **Override**: Environment variables override file-based config

---

## CI/CD Pipeline

### Trigger Events
- **Push to main**: Trigger build + test + staging deployment
- **Pull Request**: Trigger build + test only (no deploy)
- **Tag (vX.Y.Z)**: Trigger build + test + production deployment

### Pipeline Stages

```
Commit
  ↓
[1] Code Checkout
  ↓
[2] Build (Compile + Unit Tests)
  ↓
[3] Code Quality (Lint, Coverage)
  ↓
[4] Integration Tests
  ↓
[5] Build Artifacts
  ↓
[6] Deploy to Staging (if on main)
  ↓
[7] Smoke Tests
  ↓
[8] Deploy to Production (if tagged)
  ↓
Complete
```

### Pipeline Configuration

**File**: `.github/workflows/ci-cd.yml` (GitHub Actions) or `.gitlab-ci.yml` (GitLab)

See [DEV_OPS.md](DEV_OPS.md) for CI/CD specifics.

---

## Versioning & Release Management

### Version Format

Semantic Versioning: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

**Example**: `1.2.3`

### Release Process

1. Create release branch: `release/v1.2.3`
2. Bump version in build files
3. Update CHANGELOG.md with release notes
4. Create PR, get approval
5. Tag commit: `v1.2.3`
6. Push tag (triggers production deployment)
7. Create GitHub Release with notes

---

## Rollback Strategy

### Rollback Procedure

**If production deployment breaks**:

1. **Immediate**: Stop incoming traffic (if possible)
2. **Revert**: Deploy previous stable version
3. **Verify**: Health checks + manual verification
4. **Notify**: Alert team and stakeholders
5. **Investigate**: Root cause analysis (post-incident)
6. **Test**: Thoroughly test fix before re-deploying

**Command** (example):
```bash
./gradlew deploy -Dversion=1.2.2  # Deploy previous version
```

---

## Performance Optimization

### Build Performance

| Optimization | Impact | Implementation |
|--------------|--------|----------------|
| Parallel builds | -30% time | `--parallel` flag |
| Incremental compilation | -50% time | Default in Gradle 5+ |
| Daemon process | -20% time | Gradle daemon enabled |
| Dependency caching | -10% time | CI cache layer |

### Build Command (Optimized)

```bash
./gradlew build --parallel --daemon
```

---

## Monitoring & Health Checks

### Health Check Endpoints

| Endpoint | Purpose | Checks |
|----------|---------|--------|
| `/health` | Application alive | Basic response |
| `/health/live` | Liveness | Can respond to requests |
| `/health/ready` | Readiness | All dependencies initialized |
| `/metrics` | Metrics | CPU, memory, requests |

### Post-Deployment Verification

```bash
# Check if service is responding
curl -s http://api.example.com/health | jq .

# Check logs for errors
kubectl logs -l app=myapp --tail=100

# Check metrics
curl -s http://api.example.com/metrics | grep http
```

---

## Troubleshooting Build Issues

### Issue: Build fails with compilation errors

**Solution**:
1. Check Java version: `java -version`
2. Clean build: `./gradlew clean build`
3. Verify dependencies: `./gradlew dependencies`
4. Check for lint errors: `./gradlew lint`

### Issue: Tests failing in CI but passing locally

**Solution**:
1. Check environment variables in CI
2. Verify test database is initialized
3. Check file permissions
4. Run with: `./gradlew test --info` for detailed output

### Issue: Deployment fails

**Solution**:
1. Verify artifact exists: `ls -la build/libs/`
2. Check server connectivity
3. Verify credentials/SSH keys
4. Check server logs: `tail -f /var/log/app.log`

---

## Documentation & References

See also:
- [ARCHITECTURE.md](ARCHITECTURE.md) — System design
- [TECH_STACK.md](TECH_STACK.md) — Technology details
- [TECH_REQUIREMENTS.md](../dev/TECH_REQUIREMENTS.md) — Versions & constraints
- [PROJECT_OPERATIONS_INDEX.md](../dev/PROJECT_OPERATIONS_INDEX.md) — Quick navigation

---

## Checklist: Before Release

- [ ] All tests passing (unit + integration + E2E)
- [ ] Code review approved
- [ ] CHANGELOG updated with release notes
- [ ] Version bumped in build files
- [ ] Documentation updated
- [ ] Performance regression tested
- [ ] Security scan passed (dependencies, code)
- [ ] Staging deployment successful + smoke tests pass
- [ ] Rollback procedure documented and tested
- [ ] Team notified of deployment timeline

