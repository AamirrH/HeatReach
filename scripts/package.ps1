param([string]$OutputPath = 'release/heatreach-amplify.zip')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$buildPath = Join-Path $projectRoot 'dist'
if (-not (Test-Path -LiteralPath (Join-Path $buildPath 'index.html'))) { throw 'Run npm run build first.' }
$archivePath = [IO.Path]::GetFullPath((Join-Path $projectRoot $OutputPath))
if (-not $archivePath.StartsWith($projectRoot + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'Archive must be inside the project.' }
New-Item -ItemType Directory -Path (Split-Path -Parent $archivePath) -Force | Out-Null
Compress-Archive -Path (Join-Path $buildPath '*') -DestinationPath $archivePath -Force
Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($archivePath)
try { if (-not ($archive.Entries.FullName -contains 'index.html')) { throw 'Invalid archive: index.html must be at the root.' } }
finally { $archive.Dispose() }
Write-Output "Verified Amplify archive: $archivePath"
