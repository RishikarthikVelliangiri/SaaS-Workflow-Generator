# PowerShell script to test OpenRouter API key connectivity
# Usage: Set environment variable OPENROUTER_API_KEY or run with parameter
#   $env:OPENROUTER_API_KEY = 'sk-...'
#   .\scripts\test_openrouter_key.ps1

param(
  [string]$apiKey = $env:OPENROUTER_API_KEY
)

if (-not $apiKey) {
  $apiKey = Read-Host -Prompt 'Enter your OpenRouter API key (will not be echoed)';
}

if (-not $apiKey) {
  Write-Error 'No API key provided.'
  exit 1
}

$body = @{
  model = 'openai/gpt-4o-mini'
  messages = @(@{ role = 'user'; content = 'Hello — minimal connectivity test' })
} | ConvertTo-Json -Depth 5

$headers = @{
  Authorization = "Bearer $apiKey"
  'Content-Type' = 'application/json'
}

try {
  $response = Invoke-WebRequest -Uri 'https://openrouter.ai/api/v1/chat/completions' -Method Post -Headers $headers -Body $body -UseBasicParsing -ErrorAction Stop
  Write-Host "Status: $($response.StatusCode)"
  Write-Host "Response:`n$($response.Content)"
} catch {
  if ($_.Exception.Response -ne $null) {
    $stream = $_.Exception.Response.GetResponseStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $responseBody = $reader.ReadToEnd()
    $status = $_.Exception.Response.StatusCode.Value__
    Write-Host "Status: $status"
    Write-Host "Response:`n$responseBody"
  } else {
    Write-Error "Request failed: $_"
  }
}
