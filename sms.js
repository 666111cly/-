// 回信表单提交（发送到手机）
// 注意：需要对接短信API，这里使用云开发/第三方API示例
document.addEventListener('DOMContentLoaded', function() {
  const replyForm = document.getElementById('reply-form');
  if (!replyForm) return;
  
  replyForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const name = document.getElementById('name').value.trim();
    const content = document.getElementById('content').value.trim();
    
    if (!name || !content) {
      alert('请填写完整的回信内容～');
      return;
    }
    
    // ******** 核心：短信发送逻辑 ********
    // 方式1：使用云函数（推荐，如微信云开发、阿里云函数等）
    // 方式2：使用第三方短信API（如Twilio、阿里云短信、腾讯云短信）
    // 以下是示例代码（需替换为实际API）
    sendSMS(name, content);
    
    // 提交成功提示
    alert('你的回信已发送！我收到啦～❤️');
    replyForm.reset();
  });
});

// 发送短信函数（需自行对接API）
function sendSMS(name, content) {
  // 示例：使用Fetch请求短信API
  const smsApiUrl = "https://你的API地址/send-sms"; // 替换为实际API地址
  const phoneNumber = "你的手机号"; // 替换为你的手机号
  
  fetch(smsApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 你的API密钥' // 替换为实际密钥
    },
    body: JSON.stringify({
      to: phoneNumber,
      text: `【新年回信】来自${name}的话：\n${content}`
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('短信发送成功：', data);
  })
  .catch(error => {
    console.error('短信发送失败：', error);
    alert('发送失败，请稍后再试～');
  });
}