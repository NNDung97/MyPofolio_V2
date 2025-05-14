const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const numStars = 150;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        glowSize: Math.random() * 5 + 2,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.01
    });
}

function drawGlow(x, y, size, alpha) {
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();
}

function drawStars() {
    for (let star of stars) {
        drawGlow(star.x, star.y, star.glowSize, star.alpha);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += star.speed;
        if (star.alpha >= 1 || star.alpha <= 0) {
            star.speed *= -0.95;
        }
    }
}

function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1A2A44'); // Xanh đậm ở trên
    gradient.addColorStop(0.45, '#0D1626'); // Chuyển sang màu trung gian
    gradient.addColorStop(1, '#000000'); // Đen ở dưới

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


class Meteor {
    constructor() {
        this.active = false;
        this.reset();
    }

    reset() {
        this.x = Math.random() * (canvas.width / 2) + (canvas.width / 2);
        this.y = Math.random() * (canvas.height / 2);
        const targetX = Math.random() * (canvas.width / 2);
        const targetY = Math.random() * (canvas.height / 2) + (canvas.height / 2);
        const distanceX = targetX - this.x;
        const distanceY = targetY - this.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const speed = distance / 100;
        this.speedX = distanceX / 100;
        this.speedY = distanceY / 100;
        this.size = Math.random() * 2 + 2;
        this.initialTailLength = Math.random() * 40 + 40;
        this.tailLength = this.initialTailLength;
        this.alpha = 1;
        this.active = true;
    }

    update() {
        if (!this.active) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.01;
        this.tailLength = this.initialTailLength * this.alpha;
        if (this.x < 0 || this.y > canvas.height || this.alpha <= 0) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(
            this.x,
            this.y,
            this.x - this.speedX * this.tailLength,
            this.y - this.speedY * this.tailLength
        );
        gradient.addColorStop(0, `rgba(135, 206, 250, ${this.alpha})`);
        gradient.addColorStop(1, `rgba(135, 206, 250, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size * 1.5;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
            this.x - this.speedX * this.tailLength,
            this.y - this.speedY * this.tailLength
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(135, 206, 250, ${this.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(this.x - 20 * this.alpha, this.y);
        ctx.lineTo(this.x + 20 * this.alpha, this.y);
        ctx.moveTo(this.x, this.y - 20 * this.alpha);
        ctx.lineTo(this.x, this.y + 20 * this.alpha);
        ctx.strokeStyle = `rgba(135, 206, 250, ${this.alpha * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        const glowGradient = ctx.createRadialGradient(
            this.x,
            this.y,
            0,
            this.x,
            this.y,
            30 * this.alpha
        );
        glowGradient.addColorStop(0, `rgba(135, 206, 250, ${this.alpha * 0.5})`);
        glowGradient.addColorStop(1, `rgba(135, 206, 250, 0)`);
        ctx.arc(this.x, this.y, 30 * this.alpha, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();
    }
}

const meteor = new Meteor();
let nextMeteorTime = 0;
let frameCount = 0;

function animate() {
    drawBackground();
    drawStars();
    meteor.update();
    meteor.draw();
    frameCount++;
    if (!meteor.active && frameCount >= nextMeteorTime) {
        meteor.reset();
        nextMeteorTime = frameCount + Math.random() * 240 + 360;
    }
    requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars.forEach(star => {
        star.x = (star.x / oldWidth) * canvas.width;
        star.y = (star.y / oldHeight) * canvas.height;
    });
    if (meteor.active) {
        const scaleX = canvas.width / oldWidth;
        const scaleY = canvas.height / oldHeight;
        meteor.x *= scaleX;
        meteor.y *= scaleY;
        meteor.speedX *= scaleX;
        meteor.speedY *= scaleY;
        meteor.initialTailLength *= (scaleX + scaleY) / 2;
        meteor.tailLength = meteor.initialTailLength * meteor.alpha;
    }
});