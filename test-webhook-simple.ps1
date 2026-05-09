# Simple Webhook Test

Write-Host "=== Webhook Test ===" -ForegroundColor Green
Write-Host ""

# Test 1: Local webhook
Write-Host "Test 1: Local Webhook" -ForegroundColor Cyan
try {
    $body = @{
        message = @{
            text = "Test response from Botnoi"
        }
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3002/webhook" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Local webhook successful" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Local webhook failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 2: ngrok webhook
Write-Host "Test 2: ngrok Webhook" -ForegroundColor Cyan
$ngrokUrl = "https://c2c9-1-10-142-148.ngrok-free.app"

try {
    $body = @{
        message = @{
            text = "Test response from Botnoi"
        }
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "$ngrokUrl/webhook" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ ngrok webhook successful" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok webhook failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 3: Health check
Write-Host "Test 3: Health Check" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$ngrokUrl/health" `
        -Method GET `
        -UseBasicParsing
    
    Write-Host "✅ Health check successful" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host "Check server logs for webhook reception" -ForegroundColor Yellow
