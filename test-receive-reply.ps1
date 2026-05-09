# Test Receive Reply from Botnoi

Write-Host "=== Test Receive Reply from Botnoi ===" -ForegroundColor Green
Write-Host ""

# Configuration
$ngrokUrl = "https://c2c9-1-10-142-148.ngrok-free.app"
$webhookUrl = "$ngrokUrl/webhook"
$localWebhookUrl = "http://localhost:3002/webhook"

Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "- ngrok URL: $ngrokUrl"
Write-Host "- Webhook URL: $webhookUrl"
Write-Host "- Local Webhook URL: $localWebhookUrl"
Write-Host ""

# Test 1: Test Local Webhook
Write-Host "Test 1: Test Local Webhook" -ForegroundColor Cyan
try {
    $body = @{
        message = @{
            text = "This is a test reply from Botnoi"
        }
        sender = @{
            display_name = "Botnoi AI"
        }
    } | ConvertTo-Json
    
    Write-Host "Sending test reply to local webhook..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $localWebhookUrl `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ Local webhook test successful" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ Local webhook test failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 2: Test ngrok Webhook
Write-Host "Test 2: Test ngrok Webhook" -ForegroundColor Cyan
try {
    $body = @{
        message = @{
            text = "This is a test reply via ngrok"
        }
        sender = @{
            display_name = "Botnoi AI"
        }
    } | ConvertTo-Json
    
    Write-Host "Sending test reply via ngrok..." -ForegroundColor Yellow
    
    $response = Invoke-WebRequest -Uri $webhookUrl `
        -Method POST `
        -Headers @{"Content-Type"="application/json"} `
        -Body $body `
        -UseBasicParsing
    
    Write-Host "✅ ngrok webhook test successful" -ForegroundColor Green
    Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Green
} catch {
    Write-Host "❌ ngrok webhook test failed" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host ""

# Test 3: Instructions
Write-Host "Test 3: Setup Instructions" -ForegroundColor Cyan
Write-Host "To receive replies from Botnoi:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to Botnoi Management Console" -ForegroundColor Yellow
Write-Host "2. Find Custom Channel settings" -ForegroundColor Yellow
Write-Host "3. Set Transmit Endpoint to:" -ForegroundColor Yellow
Write-Host "   $webhookUrl" -ForegroundColor Cyan
Write-Host "4. Save settings" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Make sure ngrok is running:" -ForegroundColor Yellow
Write-Host "   ngrok http 3002" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Make sure backend server is running:" -ForegroundColor Yellow
Write-Host "   npm run server" -ForegroundColor Cyan
Write-Host ""
Write-Host "7. Make sure frontend is running:" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""

# Test 4: Check Server Logs
Write-Host "Test 4: Check Server Logs" -ForegroundColor Cyan
Write-Host "When Botnoi sends a reply, you should see:" -ForegroundColor Yellow
Write-Host "  === WEBHOOK RECEIVED FROM BOTNOI ===" -ForegroundColor Cyan
Write-Host "  Broadcasting to X connected clients" -ForegroundColor Cyan
Write-Host ""

Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update Transmit Endpoint in Botnoi" -ForegroundColor Yellow
Write-Host "2. Send a message from chat" -ForegroundColor Yellow
Write-Host "3. Wait for Botnoi to reply" -ForegroundColor Yellow
Write-Host "4. Check server logs for webhook reception" -ForegroundColor Yellow
Write-Host "5. Check chat for reply" -ForegroundColor Yellow
