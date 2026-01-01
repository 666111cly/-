// 全局变量
let fireworksCanvas, fireworksCtx;
let audioPlayer, fireworkAudio;
let wishes = [
  "新年快乐，万事顺遂！",
  "愿你岁岁年年，平安喜乐～",
  "新的一年，闪闪发光✨",
  "朝朝暮暮，沉淀过往，迎来新光",
  "愿日子清透，世事温柔💖",
  "新年新气象，万事皆可期！",
  "年年有我，岁岁有你～",
  "所求皆如愿，所行皆坦途！"
];

// 页面加载完成后执行
window.onload = function() {
  // 初始化烟花画布
  initFireworks();
  // 初始化音频
  initAudio();
  // 初始化祝福语滚动
  initWishes();
  // 持续生成烟花
  setInterval(createFirework, 1500);
};

// 初始化烟花画布
function initFireworks() {
  fireworksCanvas = document.getElementById('fireworks');
  if (!fireworksCanvas) return;
  
  // 设置画布尺寸为窗口大小
  resizeFireworksCanvas();
  window.addEventListener('resize', resizeFireworksCanvas);
  
  fireworksCtx = fireworksCanvas.getContext('2d');
}

// 调整烟花画布尺寸
function resizeFireworksCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}

// 初始化音频
function initAudio() {
  // 背景音乐（黄子弘凡《1520赫兹》）
  audioPlayer = document.getElementById('background-audio');
  if (audioPlayer) {
    // 监听用户交互后播放（浏览器限制）
    document.addEventListener('click', function playAudio() {
      audioPlayer.volume = 0.5;
      audioPlayer.play().catch(err => console.log("音频播放失败：", err));
      document.removeEventListener('click', playAudio);
    }, { once: true });
  }

  // 烟花音效
  fireworkAudio = document.getElementById('firework-audio');
  if (fireworkAudio) {
    fireworkAudio.volume = 0.3;
  }
}

// 初始化祝福语滚动
function initWishes() {
  const wishesContainer = document.querySelector('.wishes');
  if (!wishesContainer) return;
  
  // 填充祝福语
  wishesContainer.innerHTML = '';
  wishes.forEach(wish => {
    const div = document.createElement('div');
    div.className = 'wish-item';
    div.textContent = wish;
    wishesContainer.appendChild(div);
  });
  
  // 复制一份用于无缝滚动
  const clone = wishesContainer.cloneNode(true);
  wishesContainer.appendChild(clone);
}

// 创建烟花
function createFirework() {
  if (!fireworksCtx) return;
  
  // 随机烟花位置
  const x = Math.random() * fireworksCanvas.width;
  const y = Math.random() * fireworksCanvas.height * 0.8;
  
  // 随机颜色
  const colors = ['#ff6b81', '#feca57', '#74b9ff', '#a29bfe', '#00d2d3'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // 发射烟花
  launchFirework(x, y, color);
  
  // 播放烟花音效
  if (fireworkAudio) {
    fireworkAudio.currentTime = 0;
    fireworkAudio.play().catch(err => console.log("烟花音效播放失败：", err));
  }
}

// 发射烟花
function launchFirework(x, y, color) {
  // 烟花粒子数量
  const particleCount = 150;
  const particles = [];
  
  // 创建粒子
  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: 1,
      decay: Math.random() * 0.01 + 0.005,
      color: color
    });
  }
  
  // 绘制粒子动画
  function drawParticles() {
    fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    let alive = false;
    particles.forEach(particle => {
      if (particle.alpha > 0) {
        alive = true;
        
        // 更新粒子位置和透明度
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05; // 重力
        particle.alpha -= particle.decay;
        
        // 绘制粒子
        fireworksCtx.beginPath();
        fireworksCtx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        fireworksCtx.fillStyle = `${color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
        fireworksCtx.fill();
      }
    });
    
    // 如果还有粒子存活，继续绘制
    if (alive) {
      requestAnimationFrame(drawParticles);
    }
  }
  
  drawParticles();
}

// 图片懒加载（适配所有屏幕）
function initImageLazyLoad() {
  const images = document.querySelectorAll('.gallery-img');
  images.forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
    });
    // 初始透明度
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
  });
}

// 初始化图片懒加载（在图片页面调用）
if (document.querySelector('.gallery')) {
  initImageLazyLoad();
}
// 图片放大功能
function initImageModal() {
  // 创建放大遮罩
  const modal = document.createElement('div');
  modal.className = 'img-modal';
  modal.innerHTML = `
    <span class="img-modal-close">&times;</span>
    <img id="modal-img" src="" alt="完整图片">
  `;
  document.body.appendChild(modal);

  // 绑定图片点击事件
  const galleryImgs = document.querySelectorAll('.gallery-img');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.img-modal-close');

  galleryImgs.forEach(img => {
    img.style.cursor = 'zoom-in'; // 鼠标悬浮显示放大图标
    img.addEventListener('click', function() {
      modalImg.src = this.src;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // 禁止页面滚动
    });
  });

  // 关闭放大遮罩
  closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 恢复页面滚动
  });

  // 点击遮罩空白处关闭
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
}

// 在图片页面初始化放大功能
if (document.querySelector('.gallery')) {
  initImageLazyLoad();
  initImageModal(); // 新增这行
}
