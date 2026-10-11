param(
  [Parameter(Mandatory=$true)][string]$Profile,
  [string]$Region = 'ap-south-1',
  [string]$AppId,
  [string]$Branch = 'production'
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
function Invoke-AwsJson {
  param([string[]]$Arguments)
  $output = & aws @Arguments --profile $Profile --region $Region --output json --no-cli-pager
  if ($LASTEXITCODE -ne 0) { throw 'AWS command failed. Check profile, permissions, region and session expiry.' }
  return ($output | ConvertFrom-Json)
}
# Check identity before any write. Never print credentials or signed upload URLs.
$identity = Invoke-AwsJson -Arguments @('sts', 'get-caller-identity')
if ($identity.Arn -match ':root$') { throw 'Root deployment prohibited. Use an authorized IAM Identity Center or IAM role profile.' }
$zip = Join-Path $projectRoot 'release/heatreach-amplify.zip'
if (-not (Test-Path -LiteralPath $zip)) { throw 'Run npm run build and npm run package first.' }
if (-not $AppId) {
  $app = Invoke-AwsJson -Arguments @('amplify', 'create-app', '--name', 'HeatReach', '--platform', 'WEB')
  $AppId = $app.app.appId
  Write-Output "Created Amplify app $AppId. Keep this ID for subsequent deployments."
}
$branches = Invoke-AwsJson -Arguments @('amplify', 'list-branches', '--app-id', $AppId)
if (-not ($branches.branches.branchName -contains $Branch)) {
  $null = Invoke-AwsJson -Arguments @('amplify', 'create-branch', '--app-id', $AppId, '--branch-name', $Branch, '--stage', 'PRODUCTION')
}
$deployment = Invoke-AwsJson -Arguments @('amplify', 'create-deployment', '--app-id', $AppId, '--branch-name', $Branch)
$null = Invoke-WebRequest -Uri $deployment.zipUploadUrl -Method Put -InFile $zip -ContentType 'application/zip'
$null = Invoke-AwsJson -Arguments @('amplify', 'start-deployment', '--app-id', $AppId, '--branch-name', $Branch, '--job-id', $deployment.jobId)
Write-Output "Started deployment. App: $AppId, branch: $Branch, job: $($deployment.jobId)."
for ($attempt = 0; $attempt -lt 40; $attempt++) {
  $job = Invoke-AwsJson -Arguments @('amplify', 'get-job', '--app-id', $AppId, '--branch-name', $Branch, '--job-id', $deployment.jobId)
  $status = $job.job.summary.status
  if ($status -eq 'SUCCEED') {
    $app = Invoke-AwsJson -Arguments @('amplify', 'get-app', '--app-id', $AppId)
    $url = "https://$Branch.$($app.app.defaultDomain)"
    $response = Invoke-WebRequest -Uri $url -Method Get
    if ($response.StatusCode -ne 200) { throw 'Deployment succeeded but public URL did not return HTTP 200.' }
    Write-Output "AWS reports success and HTTP check passed: $url"
    Write-Output 'Now verify the complete planning workflow in a private browser and record deployment evidence.'
    return
  }
  if ($status -in @('FAILED', 'CANCELLED')) { throw "Amplify deployment ended: $status" }
  Start-Sleep -Seconds 10
}
throw "Deployment still pending. Inspect Amplify app $AppId job $($deployment.jobId); do not create another app."
