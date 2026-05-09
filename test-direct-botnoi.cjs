const crypto = require('crypto');

// การตั้งค่า
const BOT_ID = '69ff88c4fb3079f00791405c';
const SECRET = 'YOUR_SECRET_KEY';
const URL = 'https://api-gateway.botnoi.ai/webhook/custom/' + BOT_ID;

// ข้อความที่จะส่ง
const payloadObj = {
  bot_id: BOT_ID,
  source: { source_id: 'local_user_001', source_type: 'user' },
  sender: { uid: 'local_user_001', display_name: 'Local Test', profile_img_url: '' },
  message: { mid: 'local_msg_' + Date.now(), type: 'text', text: 'สวัสดี ทดสอบยิงตรงจากเครื่อง!', timestamp: Date.now(), mode: 'normal' }
};

const payload = JSON.stringify(payloadObj);
const timestampSec = Math.floor(Date.now() / 1000).toString();
const signature = 'sha256=' + crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

console.log('Sending payload to Botnoi:');
console.log(payloadObj);
console.log('\nSignature:', signature);

// ยิง Request
fetch(URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Platform-Signature': signature,
    'X-Platform-Timestamp': timestampSec
  },
  body: payload
})
  .then(res => {
    console.log('\n✅ Status Code:', res.status);
    return res.text();
  })
  .then(text => console.log('✅ Response:', text))
  .catch(err => console.error('❌ Error:', err));
