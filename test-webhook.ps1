# Test 1: Check if server is running
Write-Host "=== Test 1: Check Server Health ===" -ForegroundColor Green
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method GET
    Write-Host "✅ Server is running"
    Write-Host $response.Content
} catch {
    Write-Host "❌ Server is not running or not responding"
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 2: Send test webhook to local server
Write-Host "=== Test 2: Send Test Webhook to Local Server ===" -ForegroundColor Green
try {
    $body = @{
        message = @{
            text = "Test response from Botnoi"
        }
    } | ConvertTo-Json
    
    $response = Invoke-WebRequest -Uri "http://localhost:3002/test-webhook" `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body
    
    Write-Host "✅ Test webhook sent successfully"
    Write-Host $response.Content
} catch {
    Write-Host "❌ Failed to send test webhook"
    Write-Host $_.Exception.Message
}
Write-Host ""

# Test 3: Instructions for ngrok
Write-Host "=== Test 3: ngrok Tunnel Status ===" -ForegroundColor Green
Write-Host "Make sure ngrok is running with:"
Write-Host "  ngrok http 3002" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then verify the tunnel is working:"
Write-Host "  Invoke-WebRequest -Uri 'https://7a6f-1-10-142-148.ngrok-free.app/health' -Method GET" -ForegroundColor Yellow
Write-Host ""
Write-Host "Test webhook via ngrok:"
Write-Host "  `$body = @{message=@{text='Test'}} | ConvertTo-Json" -ForegroundColor Yellow
Write-Host "  Invoke-WebRequest -Uri 'https://7a6f-1-10-142-148.ngrok-free.app/webhook' -Method POST -Headers @{'Content-Type'='application/json'} -Body `$body" -ForegroundColor Yellow
