# Check Setup for Receiving Replies

Write-Host "=== Botnoi Reply Setup Checker ===" -ForegroundColor Green
Write-Host ""

$checks = @{
    "ngrok running" = $false
    "server running" = $false
    "frontend running" = $false
    "ngrok health" = $false
    "server health" = $false
}

# Check 1: ngrok running
Write-Host "Check 1: ngrok Tunnel" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://c2c9-1-10-142-148.ngrok-free.app/health" `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 5
    
    Write-Host "✅ ngrok tunnel is active" -ForegroundColor Green
    $checks["ngrok running"] = $true
} catch {
    Write-Host "❌ ngrok tunnel is NOT active" -ForegroundColor Red
    Write-Host "   Run: ngrok http 3002" -ForegroundColor Yellow
}
Write-Host ""

# Check 2: Server running
Write-Host "Check 2: Express Server" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 5
    
    $data = $response.Content | ConvertFrom-Json
    Write-Host "✅ Server is running" -ForegroundColor Green
    Write-Host "   Connected clients: $($data.connectedClients)" -ForegroundColor Green
    $checks["server running"] = $true
} catch {
    Write-Host "❌ Server is NOT running" -ForegroundColor Red
    Write-Host "   Run: npm run server" -ForegroundColor Yellow
}
Write-Host ""

# Check 3: Frontend running
Write-Host "Check 3: React Frontend" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" `
        -Method GET `
        -UseBasicParsing `
        -TimeoutSec 5
    
    Write-Host "✅ Frontend is running" -ForegroundColor Green
    Write-Host "   Open: http://localhost:5173" -ForegroundColor Green
    $checks["frontend running"] = $true
} catch {
    Write-Host "❌ Frontend is NOT running" -ForegroundColor Red
    Write-Host "   Run: npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Check 4: Botnoi Settings
Write-Host "Check 4: Botnoi Settings" -ForegroundColor Cyan
Write-Host "Verify in Botnoi Management Console:" -ForegroundColor Yellow
Write-Host "  Transmit Endpoint: https://c2c9-1-10-142-148.ngrok-free.app/webhook" -ForegroundColor Yellow
Write-Host "  Inbound webhook URL: https://api-gateway.botnoi.ai/webhook/custom/69fc494afb3079f00790fcf7" -ForegroundColor Yellow
Write-Host ""

# Check 5: Test Message
Write-Host "Check 5: Send Test Message" -ForegroundColor Cyan
Write-Host "Run: powershell -ExecutionPolicy Bypass -File test-send-message.ps1" -ForegroundColor Yellow
Write-Host ""

# Summary
Write-Host "=== Summary ===" -ForegroundColor Green
$allGood = $true
foreach ($check in $checks.GetEnumerator()) {
    if ($check.Value) {
        Write-Host "✅ $($check.Key)" -ForegroundColor Green
    } else {
        Write-Host "❌ $($check.Key)" -ForegroundColor Red
        $allGood = $false
    }
}
Write-Host ""

if ($allGood) {
    Write-Host "✅ All systems ready! You can now receive replies from Botnoi" -ForegroundColor Green
} else {
    Write-Host "❌ Some systems are not ready. Fix the issues above." -ForegroundColor Red
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Fix any failed checks above" -ForegroundColor Yellow
Write-Host "2. Send a test message" -ForegroundColor Yellow
Write-Host "3. Check server logs for response" -ForegroundColor Yellow
Write-Host "4. Response should appear in chat" -ForegroundColor Yellow
