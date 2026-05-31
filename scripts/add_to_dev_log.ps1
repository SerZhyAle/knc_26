#!/usr/bin/env pwsh
# ============================================================================
# add_to_dev_log.ps1
# ============================================================================
# Purpose: Add a timestamped entry to dev/CHANGELOG.md
# 
# Usage: .\scripts\add_to_dev_log.ps1 "<file_path>" "<component>" "<description>"
#
# Example:
#   .\scripts\add_to_dev_log.ps1 "src/MyClass.cs" "Authentication" "Added OAuth2 support"
#
# Output: Appends row to dev/CHANGELOG.md with current timestamp
# ============================================================================

param(
    [Parameter(Mandatory=$true, Position=0)]
    [string]$FilePath,
    
    [Parameter(Mandatory=$true, Position=1)]
    [string]$Component,
    
    [Parameter(Mandatory=$true, Position=2)]
    [string]$Description
)

# Get the script directory and construct path to CHANGELOG.md
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptDir
$changelogPath = Join-Path $projectRoot "dev" "CHANGELOG.md"

# Validate CHANGELOG.md exists
if (-not (Test-Path $changelogPath)) {
    Write-Error "CHANGELOG.md not found at: $changelogPath"
    exit 1
}

# Generate timestamp in ISO format (YYYY-MM-DD HH:mm:ss)
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Create the new row (Markdown table format)
# Format: | Date | File | Component | Description |
$newRow = "| {0} | {1} | {2} | {3} |" -f $timestamp, $FilePath, $Component, $Description

# Find the insertion point (after the header separator line in the table)
# Read the file and find where to insert the new row
$fileContent = Get-Content $changelogPath -Raw
$lines = $fileContent -split "`r`n"

# Find the index of the "| Date | File | Component | Description |" line
$headerIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match "^\|\s*Date\s*\|\s*File\s*\|\s*Component\s*\|\s*Description\s*\|") {
        $headerIndex = $i
        break
    }
}

if ($headerIndex -eq -1) {
    Write-Error "Could not find table header in CHANGELOG.md"
    exit 1
}

# Find the separator line (next line after header)
$separatorIndex = $headerIndex + 1
if ($separatorIndex -ge $lines.Count -or -not ($lines[$separatorIndex] -match "^\|\s*-+")) {
    Write-Error "Could not find table separator in CHANGELOG.md"
    exit 1
}

# Insert the new row after the separator
$lines = @($lines[0..$separatorIndex]) + @($newRow) + @($lines[($separatorIndex + 1)..($lines.Count - 1)])

# Write back to file
$updatedContent = $lines -join "`r`n"
Set-Content -Path $changelogPath -Value $updatedContent -NoNewline

# Confirm
Write-Host "✓ CHANGELOG.md updated" -ForegroundColor Green
Write-Host "  $newRow"
