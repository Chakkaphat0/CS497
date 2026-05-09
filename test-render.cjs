// URL ของ Render Backend ของเรา
const RENDER_URL = 'https://cs497-botnoi-backend.onrender.com/api/send-message';

// ข้อความที่ต้องการให้ Backend ของเราส่งต่อไปหา Botnoi
const payloadObj = {
  messageText: 'สวัสดี ทดสอบผ่าน Render!',
  mode: 'normal'
};

console.log('Sending message to Render Backend...');
console.log('URL:', RENDER_URL);
console.log('Payload:', payloadObj);

// ส่งคำสั่งยิงไปที่ Render
fetch(RENDER_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(payloadObj)
})
  .then(res => {
    console.log('\n✅ Render Status Code:', res.status);
    return res.json();
  })
  .then(data => {
    console.log('✅ Render Response:', data);
    console.log('\n💡 หมายเหตุ: ถ้าระบบขึ้นว่า Message sent to Botnoi แสดงว่า Render รับคำสั่งแล้วเอาไปเข้ารหัสส่งต่อให้ Botnoi สำเร็จครับ!');
  })
  .catch(err => console.error('❌ Error:', err));
