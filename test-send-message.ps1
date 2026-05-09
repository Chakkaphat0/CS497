# Test Send Message to Botnoi

Write-Host "=== Test Send Message to Botnoi ===" -ForegroundColor Green
Write-Host ""

# Configuration
$botId = "69fc494afb3079f00790fcf7"
$signingSecret = "YOUR_SECRET_KEY"
$webhookUrl = "https://api-gateway.botnoi.ai/webhook/custom/$botId"
$backendUrl = "http://localhost:3002/api/send-message"

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "- Bot ID: $botId"
Write-Host "- Webhook URL: $webhookUrl"
Write-Host "- Backend URL: $backendUrl"
Write-Host ""

# Test 1: Send via Backend (Recommended)
Write-Host "Test 1: Send Message via Backend" -ForegroundColor Cyan
try {
    $body = @{
        messageText = "Hello from test script"
        mode = "normal"
        signingSecret = $signingSecret
    } | ConvertTo-Json
    
    Write-Host "Sending: $body" -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $backendUrl `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Message sent successfully" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to send message" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 2: Check Server Logs
Write-Host "Test 2: Check Server Logs" -ForegroundColor Cyan
Write-Host "Look for these messages in server logs:" -ForegroundColor Yellow
Write-Host "  === SENDING TO BOTNOI ===" -ForegroundColor Yellow
Write-Host "  Signature: sha256=..." -ForegroundColor Yellow
Write-Host "  ✅ Message sent successfully to Botnoi" -ForegroundColor Yellow
Write-Host ""

# Test 3: Wait for Response
Write-Host "Test 3: Wait for Response from Botnoi" -ForegroundColor Cyan
Write-Host "Waiting 5 seconds for Botnoi to respond..." -ForegroundColor Yellow
Start-Sleep -Seconds 5
Write-Host "Check server logs for:" -ForegroundColor Yellow
Write-Host "  === WEBHOOK RECEIVED FROM BOTNOI ===" -ForegroundColor Yellow
Write-Host "  Broadcasting to X connected clients" -ForegroundColor Yellow
Write-Host ""

# Test 4: Check Health
Write-Host "Test 4: Check Server Health" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" `
        -Method GET `
        -UseBasicParsing
    
    Write-Host "✅ Server is healthy" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor Green
} catch {
    Write-Host "❌ Server health check failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Check server logs for signature and response" -ForegroundColor Yellow
Write-Host "2. Open http://localhost:5173 to see response in chat" -ForegroundColor Yellow
Write-Host "3. If no response, check Botnoi logs for errors" -ForegroundColor Yellow
