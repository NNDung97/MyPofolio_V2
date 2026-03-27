/**
 * ARCTIC NIGHT PORTFOLIO
 * Dynamic Asset Loader + Starfield + GSAP Parallax
 * 
 * Features:
 * - Automatic asset loading from folders with keyword-based behavior
 * - Procedural starfield canvas
 * - GSAP ScrollTrigger parallax system
 * - Atmospheric animations
 * - Performance optimized (60fps)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // CONFIGURATION
  // ========================================

  const config = {
    assetPath: './assets',
    maxStars: 200,
    cloudDriftDuration: 45,
    auroraAnimationDuration: 10,
    moonGlowDuration: 6,
  };

  // Depth multipliers for parallax based on keywords
  const depthMap = {
    'sky': 0,
    'aurora': 0.05,
    'stars': 0.08,
    'mountain-back': 0.25,
    'mountain-mid': 0.5,
    'mountain-mid-2': 0.5,
    'water': 0.7,
    'penguin': 0.85,
    'foreground': 1,
    'back': 0.4,
    'mid': 0.6,
    'front': 0.8,
  };

  // ========================================
  // DYNAMIC ASSET LOADING SYSTEM
  // ========================================

  /**
   * Get depth multiplier based on filename
   */
  function getDepthMultiplier(filename) {
    // Check for numeric suffix (e.g., -1, -2)
    const numMatch = filename.match(/-(\d+)/);
    let baseDepth = 0.5; // Default middle depth

    // Check for keyword matches (in order of specificity)
    for (const [keyword, depth] of Object.entries(depthMap)) {
      if (filename.toLowerCase().includes(keyword)) {
        baseDepth = depth;
        break;
      }
    }

    // Adjust by numeric suffix
    if (numMatch) {
      const num = parseInt(numMatch[1]);
      baseDepth += (num * 0.05); // Each number adds 0.05 to depth
      baseDepth = Math.min(baseDepth, 1); // Cap at 1
    }

    return baseDepth;
  }

  /**
   * Get z-index based on depth (higher depth = higher z-index)
   */
  function getZIndex(depth, baseIndex = 10) {
    return Math.round(baseIndex + (depth * 100));
  }

  /**
   * Create layer element for an image
   */
  function createLayerElement(filename, folder, depth) {
    const layer = document.createElement('div');
    layer.className = 'dynamic-layer';
    layer.setAttribute('data-keyword', filename.toLowerCase());
    layer.setAttribute('data-depth', depth);
    layer.style.zIndex = getZIndex(depth);

    const img = document.createElement('img');
    img.src = `./assets/${folder}/${filename}`;
    img.alt = `${folder} - ${filename}`;

    layer.appendChild(img);
    return layer;
  }

  /**
   * Load assets with actual asset filenames mapped to correct depths
   */
  async function loadAssetsFromFolder() {
    try {
      const layersContainer = document.getElementById('dynamic-layers');

      // Actual assets with optimized depth values for arctic landscape
      const assetLayers = [
        { filename: 'sky_with_aurora.png', depth: 0, keyword: 'aurora' },
        // { filename: 'far_moutain_1.png', depth: 0.25, keyword: 'mountain-back' },
        { filename: 'far_moutain_2.png', depth: 0, keyword: 'mountain-back' },
        { filename: 'side_ice_moutain_1.png', depth: 0.5, keyword: 'mountain-mid-right' },
        { filename: 'side_ice_moutain_2.png', depth: 0.55, keyword: 'mountain-mid-left' },
        { filename: 'water_surface.png', depth: 0.25, keyword: 'water' },
        { filename: 'penguin.png', depth: 0.8, keyword: 'penguin-foreground' }
      ];

      assetLayers.forEach(asset => {
        const layer = document.createElement('div');
        layer.className = 'dynamic-layer';
        layer.setAttribute('data-keyword', asset.keyword);
        layer.setAttribute('data-depth', asset.depth);
        layer.style.zIndex = getZIndex(asset.depth);

        const img = document.createElement('img');
        img.src = `./assets/${asset.filename}`;
        img.alt = asset.filename;

        layer.appendChild(img);
        layersContainer.appendChild(layer);
      });

      // Sort layers by z-index for proper rendering order
      const layers = Array.from(layersContainer.children);
      layers.sort((a, b) => {
        return parseInt(a.style.zIndex) - parseInt(b.style.zIndex);
      });

      // Re-append in sorted order
      layersContainer.innerHTML = '';
      layers.forEach(layer => {
        layersContainer.appendChild(layer);
      });
    } catch (error) {
      console.error('Error loading assets:', error);
    }
  }

  /**
   * Initialize all dynamic asset layers
   */
  async function initializeDynamicLayers() {
    await loadAssetsFromFolder();
  }

  // ========================================
  // STARFIELD CANVAS SYSTEM
  // ========================================

  class Starfield {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.stars = [];
      this.meteors = []; // Danh sách quản lý nhiều sao băng nếu cần
      this.scrollOffset = 0;
      this.animationFrameId = null;
      this.frameCount = 0;
      // this.nextMeteorFrame = 0;
      this.isFirstMeteor = true;
      this.nextMeteorFrame = 30; // Bắt đầu sao băng sớm hơn để có hiệu ứng ngay khi load
      //khai báo vị trí chuột
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetX = 0;
      this.targetY = 0;

      this.resize();
      this.init();
      this.startAnimation();

      window.addEventListener('resize', () => this.handleResize());
      window.addEventListener('scroll', () => this.updateScrollOffset());
      // Lắng nghe di chuyển chuột
      window.addEventListener('mousemove', (e) => {
        // Tính toán độ lệch từ tâm màn hình (-0.5 đến 0.5)
        this.targetX = (e.clientX / window.innerWidth) - 0.5;
        this.targetY = (e.clientY / window.innerHeight) - 0.5;
      });
    }

    init() {
      this.generateStars();
      this.activeMeteor = new MeteorEffect();

      // ÉP SAO BĂNG CHẠY NGAY LẬP TỨC KHI VỪA LOAD
      this.activeMeteor.reset(this.canvas.width, this.canvas.height);
    }

    resize() {
      const hero = document.querySelector('.hero') || { clientWidth: window.innerWidth, clientHeight: window.innerHeight };
      this.canvas.width = hero.clientWidth;
      this.canvas.height = hero.clientHeight;
    }

    handleResize() {
      const oldW = this.canvas.width;
      const oldH = this.canvas.height;
      this.resize();

      // Điều chỉnh vị trí sao theo tỷ lệ màn hình mới
      this.stars.forEach(star => {
        star.x = (star.x / oldW) * this.canvas.width;
        star.y = (star.y / oldH) * this.canvas.height;
      });
    }

    generateStars() {
      this.stars = [];
      // Sử dụng config nếu có, nếu không mặc định 150 sao
      const count = (typeof config !== 'undefined' && config.maxStars) ?
        Math.min(config.maxStars, Math.floor(this.canvas.width / 2)) : 150;

      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          z: Math.random() * 0.5 + 0.1, // Độ sâu: càng nhỏ càng ở xa, ít di chuyển
          radius: Math.random() * 1.5 + 0.5,
          glowSize: Math.random() * 4 + 2,
          alpha: Math.random(),
          speed: Math.random() * 0.008 + 0.001,
          direction: Math.random() > 0.5 ? 1 : -1
        });
      }
    }

    updateScrollOffset() {
      this.scrollOffset = window.scrollY * 0.05;
    }

    drawGlow(x, y, size, alpha) {
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.3})`);
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    render() {
      // Tạo hiệu ứng mượt (Easing) cho tọa độ chuột
      this.mouseX += (this.targetX - this.mouseX) * 0.15;
      this.mouseY += (this.targetY - this.mouseY) * 0.15;
      // Vẽ nền Gradient theo chiều dọc (Sky deep blue to black)
      const bgGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      bgGradient.addColorStop(0, '#1A2A44');
      bgGradient.addColorStop(0.45, '#0D1626');
      bgGradient.addColorStop(1, '#000000');
      this.ctx.fillStyle = bgGradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Vẽ sao (Stars)
      for (let star of this.stars) {
        // const displayY = star.y + this.scrollOffset;
        const parallaxX = star.x + (this.mouseX * 50 * star.z);
        const parallaxY = (star.y + this.scrollOffset) + (this.mouseY * 50 * star.z);

        // Hiệu ứng Glow cho sao lớn/sáng
        if (star.radius > 1.2 || star.alpha > 0.7) {
          // this.drawGlow(star.x, displayY, star.glowSize, star.alpha);
          this.drawGlow(parallaxX, parallaxY, star.glowSize, star.alpha);
        }

        this.ctx.beginPath();
        // this.ctx.arc(star.x, displayY, star.radius, 0, Math.PI * 2);
        this.ctx.arc(parallaxX, parallaxY, star.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        this.ctx.fill();

        // Cập nhật trạng thái nhấp nháy (Twinkle)
        star.alpha += star.speed * star.direction;
        if (star.alpha >= 1 || star.alpha <= 0) {
          star.direction *= -1;
          star.alpha = Math.max(0, Math.min(1, star.alpha));
        }
      }

      // Xử lý sao băng (Meteor)
      if (this.activeMeteor.active) {
        this.activeMeteor.update(this.canvas.width, this.canvas.height);
        this.activeMeteor.draw(this.ctx);
      } else {
        this.frameCount++;
        if (this.frameCount >= this.nextMeteorFrame) {
          // this.activeMeteor.reset(this.canvas.width, this.canvas.height);
          // // this.nextMeteorFrame = this.frameCount + Math.random() * 240 + 360; 
          // // nextMeteorFrame = frameCount + Math.random() * 240 + 360; (Nghỉ 6-10 giây)
          // this.nextMeteorFrame = this.frameCount + Math.random() * 60 + 180; // Nghỉ 3-6 giây để tăng tần suất sao băng, phù hợp với khung cảnh Bắc Cực nhiều sao hơn
          // Truyền biến đánh dấu vào hàm reset
          this.activeMeteor.reset(this.canvas.width, this.canvas.height, this.isFirstMeteor);

          // Sau khi bắn phát đầu, tắt biến đánh dấu đi
          this.isFirstMeteor = false;

          // Thiết lập thời gian chờ cho các lần ngẫu nhiên tiếp theo
          this.nextMeteorFrame = this.frameCount + Math.random() * 60 + 180;
        }
      }
    }

    startAnimation() {
      const animate = () => {
        this.render();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    }

    destroy() {
      if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }
  }

  // Lớp logic hiệu ứng Sao Băng (Meteor logic tách biệt)
  class MeteorEffect {
    constructor() {
      this.active = false;
    }

    reset(width, height, isFirstTime = false) {
      this.active = true;
      this.alpha = 1;

      if (isFirstTime) {
        // ÉP GÓC RƠI: Bắt đầu từ góc trên bên phải
        this.x = width * 0.9;
        this.y = height * 0.1;

        // HƯỚNG VỀ GIỮA: Điểm đến là khu vực tiêu đề (giữa màn hình)
        const targetX = width * 0.4; // Bay về phía trái một chút
        const targetY = height * 0.5; // Xuống giữa màn hình

        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.speed = 7; // Phát đầu tiên cho bay nhanh, dứt khoát
        this.speedX = Math.cos(angle) * this.speed;
        this.speedY = Math.sin(angle) * this.speed;
      } else {
        // LOGIC NGẪU NHIÊN NHƯ CŨ (Cho các lần sau)
        this.x = Math.random() * (width / 2) + (width / 2);
        this.y = Math.random() * (height / 2);
        const targetX = Math.random() * (width / 2);
        const targetY = Math.random() * (height / 2) + (height / 2);
        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.speed = Math.random() * 5 + 3;
        this.speedX = Math.cos(angle) * this.speed;
        this.speedY = Math.sin(angle) * this.speed;
      }

      this.size = Math.random() * 1.5 + 1;
      this.initialTailLength = isFirstTime ? 200 : (Math.random() * 80 + 120);
      this.color = `173, 255, 150`; // Màu xanh cực quang như đã thống nhất ở Ảnh 2
    }

    update(width, height) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.008;
      this.tailLength = this.initialTailLength * this.alpha;

      if (this.alpha <= 0 || this.x < -200 || this.y > height + 200) {
        this.active = false;
      }
    }

    draw(ctx) {
      const tailEndX = this.x - this.speedX * this.tailLength;
      const tailEndY = this.y - this.speedY * this.tailLength;

      // 1. Vẽ đuôi chính (Main Trail)
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(this.x, this.y, tailEndX, tailEndY);
      gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha * 0.8})`);
      gradient.addColorStop(1, `rgba(${this.color}, 0)`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.size * 2;
      ctx.lineCap = 'round';
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailEndX, tailEndY);
      ctx.stroke();

      // 2. Vẽ quầng sáng ở đầu sao băng (Head Glow)
      const glowRadius = this.size * 15;
      const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.8})`);
      glowGradient.addColorStop(1, `rgba(${this.color}, 0)`);
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Nhân sao băng (Core)
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ========================================
  // GSAP PARALLAX SYSTEM
  // ========================================

  function initializeParallax() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    // ===== AURORA (background - very subtle) =====
    gsap.to('[data-keyword*="aurora"]', {
      y: 120,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });


    // ===== MOUNTAIN BACK (deep background) =====
    gsap.to('[data-keyword*="mountain-back"]', {
      y: 250,
      ease: "none",
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    // ===== MOUNTAIN MID RIGHT =====
    gsap.to('[data-keyword*="mountain-mid-right"]', {
      x: 100,
      y: 260,
      scale: 1.05,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });


    // ===== MOUNTAIN MID LEFT =====
    gsap.to('[data-keyword*="mountain-mid-left"]', {
      x: -80,
      y: 300,
      scale: 1.05,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });


    // ===== WATER (foreground mid) =====
    gsap.to('[data-keyword*="water"]', {
      y: 120,
      // y:200,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });


    // ===== PENGUIN (foreground - moves most) =====
    gsap.to('[data-keyword*="penguin-foreground"]', {
      y: 420,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });


    // ===== MOON (very subtle drift) =====
    gsap.to('[data-keyword*="moon"]', {
      y: 80,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6
      }
    });

    // Parallax for starfield with reduced movement
    const starfield = document.getElementById('starfield');
    if (starfield) {
      gsap.to(starfield, {
        y: 80,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          ease: 'power1.inOut',
        },
      });
    }

    // Parallax for sky background
    const sky = document.querySelector('.sky');
    if (sky) {
      gsap.to(sky, {
        y: 50,
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          ease: 'power1.inOut',
        },
      });
    }
  }

  // ========================================
  // HERO CONTENT ANIMATION
  // ========================================

  function animateHeroContent() {
    const heroContent = document.querySelector('.hero-content');
    const title = document.querySelector('.hero-title');
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const button = document.querySelector('.cta-button');

    const timeline = gsap.timeline();

    timeline
      .to(heroContent, {
        opacity: 1,
        duration: 1,
      }, 0.2)
      .to(title, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.4)
      .to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.6)
      .to(description, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 0.8)
      .to(button, {
        opacity: 1,
        y: 0,
        duration: 0.8,
      }, 1);
  }

  // ========================================
  // CONTENT SECTIONS ANIMATION
  // ========================================

  function animateContentSections() {
    const sections = document.querySelectorAll('.section');
    const projectCards = document.querySelectorAll('.project-card');
    const socialLinks = document.querySelectorAll('.social-link');

    sections.forEach((section, index) => {
      gsap.to(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
      });
    });

    projectCards.forEach((card, index) => {
      gsap.to(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
      });
    });

    socialLinks.forEach((link, index) => {
      gsap.to(link, {
        scrollTrigger: {
          trigger: link,
          start: 'top 90%',
          once: true,
        },
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.08,
      });
    });
  }

  // ========================================
  // CTA BUTTON INTERACTION
  // ========================================

  function initializeButtonInteraction() {
    const button = document.querySelector('.cta-button');
    if (button) {
      button.addEventListener('click', () => {
        gsap.to(window, {
          duration: 1.5,
          // scrollTo: '.projects',
          scrollTo: '#career-contacts',
          ease: 'power2.inOut',
        });
      });
    }
  }

  // ========================================
  // PROJECT CARD HOVER EFFECTS
  // ========================================

  function initializeCardHoverEffects() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function () {
        gsap.to(this, {
          duration: 0.3,
          y: -8,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', function () {
        gsap.to(this, {
          duration: 0.3,
          y: 0,
          ease: 'power2.out',
        });
      });
    });
  }

  // ========================================
  // INITIALIZATION
  // ========================================

  async function init() {
    try {
      // Load dynamic assets
      await initializeDynamicLayers();

      // Initialize starfield
      const starfield = new Starfield('starfield');
      window.starfieldInstance = starfield; // Store for cleanup if needed

      // Initialize parallax
      initializeParallax();

      // Animate hero content
      animateHeroContent();

      // Animate content sections
      animateContentSections();

      // Initialize button interaction
      initializeButtonInteraction();

      // Initialize card hover effects
      initializeCardHoverEffects();

      console.log('✨ Arctic Night Portfolio initialized successfully');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  // Start when DOM is ready
  init();

  // ========================================
  // CLEANUP ON PAGE UNLOAD
  // ========================================

  window.addEventListener('beforeunload', () => {
    if (window.starfieldInstance) {
      window.starfieldInstance.destroy();
    }
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
  });

});


