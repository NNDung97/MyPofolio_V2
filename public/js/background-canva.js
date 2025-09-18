// const canvas = document.getElementById("canvas");
// const ctx = canvas.getContext("2d");

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const stars = [];
// const numStars = 100;

// for (let i = 0; i < numStars; i++) {
//     stars.push({
//         x: Math.random() * canvas.width,
//         y: Math.random() * canvas.height,
//         radius: Math.random() * 2 + 1,
//         glowSize: Math.random() * 5 + 2,
//         alpha: Math.random(),
//         // Giảm tốc độ ban đầu để lấp lánh chậm hơn
//         speed: Math.random() * 0.01 + 0.0025
//     });
// }

// function drawGlow(x, y, size, alpha) {
//     ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
//     ctx.lineWidth = 1.2;
//     ctx.beginPath();
//     ctx.moveTo(x - size, y);
//     ctx.lineTo(x + size, y);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(x, y - size);
//     ctx.lineTo(x, y + size);
//     ctx.stroke();
// }

// function drawStars() {
//     for (let star of stars) {
//         drawGlow(star.x, star.y, star.glowSize, star.alpha);
//         ctx.beginPath();
//         ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
//         ctx.fill();
//         star.alpha += star.speed;
//         // Sử dụng lại logic giảm tốc độ khi đảo chiều
//         if (star.alpha >= 1 || star.alpha <= 0) {
//             star.speed *= -0.95;
//         }
//     }
// }

// // Chỉ tạo gradient nền một lần để tối ưu hiệu suất
// const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
// backgroundGradient.addColorStop(0, '#1A2A44'); // Xanh đậm ở trên
// backgroundGradient.addColorStop(0.45, '#0D1626'); // Chuyển sang màu trung gian
// backgroundGradient.addColorStop(1, '#000000'); // Đen ở dưới

// function drawBackground() {
//     ctx.fillStyle = backgroundGradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
// }


// class Meteor {
//     constructor() {
//         this.active = false;
//         this.reset();
//     }

//     reset() {
//         this.x = Math.random() * (canvas.width / 2) + (canvas.width / 2);
//         this.y = Math.random() * (canvas.height / 2);
//         const targetX = Math.random() * (canvas.width / 2);
//         const targetY = Math.random() * (canvas.height / 2) + (canvas.height / 2);
//         const distanceX = targetX - this.x;
//         const distanceY = targetY - this.y;
//         const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
//         const speed = distance / 100;
//         this.speedX = distanceX / 100;
//         this.speedY = distanceY / 100;
//         this.size = Math.random() * 2 + 2;
//         this.initialTailLength = Math.random() * 40 + 40;
//         this.tailLength = this.initialTailLength;
//         this.alpha = 1;
//         this.active = true;
//     }

//     update() {
//         if (!this.active) return;
//         this.x += this.speedX;
//         this.y += this.speedY;
//         this.alpha -= 0.01;
//         this.tailLength = this.initialTailLength * this.alpha;
//         if (this.x < 0 || this.y > canvas.height || this.alpha <= 0) {
//             this.active = false;
//         }
//     }

//     draw() {
//         if (!this.active) return;
//         ctx.beginPath();
//         const gradient = ctx.createLinearGradient(
//             this.x,
//             this.y,
//             this.x - this.speedX * this.tailLength,
//             this.y - this.speedY * this.tailLength
//         );
//         gradient.addColorStop(0, `rgba(135, 206, 250, ${this.alpha})`);
//         gradient.addColorStop(1, `rgba(135, 206, 250, 0)`);
//         ctx.strokeStyle = gradient;
//         ctx.lineWidth = this.size * 1.5;
//         ctx.moveTo(this.x, this.y);
//         ctx.lineTo(
//             this.x - this.speedX * this.tailLength,
//             this.y - this.speedY * this.tailLength
//         );
//         ctx.stroke();
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
//         ctx.fillStyle = `rgba(135, 206, 250, ${this.alpha})`;
//         ctx.fill();
//         ctx.beginPath();
//         ctx.moveTo(this.x - 20 * this.alpha, this.y);
//         ctx.lineTo(this.x + 20 * this.alpha, this.y);
//         ctx.moveTo(this.x, this.y - 20 * this.alpha);
//         ctx.lineTo(this.x, this.y + 20 * this.alpha);
//         ctx.strokeStyle = `rgba(135, 206, 250, ${this.alpha * 0.5})`;
//         ctx.lineWidth = 1.5;
//         ctx.stroke();
//         ctx.beginPath();
//         const glowGradient = ctx.createRadialGradient(
//             this.x,
//             this.y,
//             0,
//             this.x,
//             this.y,
//             30 * this.alpha
//         );
//         glowGradient.addColorStop(0, `rgba(135, 206, 250, ${this.alpha * 0.5})`);
//         glowGradient.addColorStop(1, `rgba(135, 206, 250, 0)`);
//         ctx.arc(this.x, this.y, 30 * this.alpha, 0, Math.PI * 2);
//         ctx.fillStyle = glowGradient;
//         ctx.fill();
//     }
// }

// const meteor = new Meteor();
// let nextMeteorTime = 0;
// let frameCount = 0;

// function animate() {
//     drawBackground();
//     drawStars();
//     meteor.update();
//     meteor.draw();
//     frameCount++;
//     if (!meteor.active && frameCount >= nextMeteorTime) {
//         meteor.reset();
//         nextMeteorTime = frameCount + Math.random() * 240 + 360;
//     }
//     requestAnimationFrame(animate);
// }

// animate();

// window.addEventListener("resize", () => {
//     const oldWidth = canvas.width;
//     const oldHeight = canvas.height;
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     stars.forEach(star => {
//         star.x = (star.x / oldWidth) * canvas.width;
//         star.y = (star.y / oldHeight) * canvas.height;
//     });
//     if (meteor.active) {
//         const scaleX = canvas.width / oldWidth;
//         const scaleY = canvas.height / oldHeight;
//         meteor.x *= scaleX;
//         meteor.y *= scaleY;
//         meteor.speedX *= scaleX;
//         meteor.speedY *= scaleY;
//         meteor.initialTailLength *= (scaleX + scaleY) / 2;
//         meteor.tailLength = meteor.initialTailLength * meteor.alpha;
//     }
// });

// === Cấu hình Canvas ===
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// === Hiệu ứng nền và sao ===
const stars = [];
const numStars = 150;

for (let i = 0; i < numStars; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        glowSize: Math.random() * 4 + 2,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.001,
        direction: Math.random() > 0.5 ? 1 : -1
    });
}

function drawGlow(x, y, size, alpha) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${alpha * 0.3})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

function drawStars() {
    for (let star of stars) {
        if (star.radius > 1 || star.alpha > 0.7) {
            drawGlow(star.x, star.y, star.glowSize, star.alpha);
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();

        star.alpha += star.speed * star.direction;

        if (star.alpha >= 1 || star.alpha <= 0) {
            star.direction *= -1;
            star.alpha = Math.max(0, Math.min(1, star.alpha));
        }
    }
}

const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#1A2A44');
backgroundGradient.addColorStop(0.45, '#0D1626');
backgroundGradient.addColorStop(1, '#000000');

function drawBackground() {
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// === Lớp sao băng đã sửa và tối ưu hóa ===
class Meteor {
    constructor() {
        this.active = false;
        this.reset();
    }

    reset() {
        this.active = true;
        this.x = Math.random() * (canvas.width / 2) + (canvas.width / 2);
        this.y = Math.random() * (canvas.height / 2);
        
        const targetX = Math.random() * (canvas.width / 2);
        const targetY = Math.random() * (canvas.height / 2) + (canvas.height / 2);

        const angle = Math.atan2(targetY - this.y, targetX - this.x);
        this.speed = Math.random() * 5 + 3;
        this.speedX = Math.cos(angle) * this.speed;
        this.speedY = Math.sin(angle) * this.speed;
        
        this.size = Math.random() * 1.5 + 1;
        this.initialTailLength = Math.random() * 80 + 120;
        this.tailLength = this.initialTailLength;
        this.alpha = 1;
        this.color = `135, 206, 250`;

        this.sideTrailOffset = this.size * 3;
        this.sideTrailLengthFactor = 0.5;
        this.sideTrailWidthFactor = 0.3;
    }

    update() {
        if (!this.active) return;
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.008;
        this.tailLength = this.initialTailLength * this.alpha;
        if (this.x < -this.initialTailLength || this.y > canvas.height + this.initialTailLength || this.alpha <= 0) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        
        const tailEndX = this.x - this.speedX * this.tailLength;
        const tailEndY = this.y - this.speedY * this.tailLength;

        ctx.beginPath();
        const mainTrailGradient = ctx.createLinearGradient(
            this.x, this.y,
            tailEndX, tailEndY
        );
        mainTrailGradient.addColorStop(0, `rgba(${this.color}, ${this.alpha * 0.8})`);
        mainTrailGradient.addColorStop(0.5, `rgba(${this.color}, ${this.alpha * 0.5})`);
        mainTrailGradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.strokeStyle = mainTrailGradient;
        ctx.lineWidth = this.size * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailEndX, tailEndY);
        ctx.stroke();

        const perpendicularAngle = Math.atan2(this.speedY, this.speedX) + Math.PI / 2;
        const sideTrail1StartX = this.x + Math.cos(perpendicularAngle) * this.sideTrailOffset;
        const sideTrail1StartY = this.y + Math.sin(perpendicularAngle) * this.sideTrailOffset;
        const sideTrail1EndX = tailEndX + Math.cos(perpendicularAngle) * this.sideTrailOffset * this.sideTrailLengthFactor;
        const sideTrail1EndY = tailEndY + Math.sin(perpendicularAngle) * this.sideTrailOffset * this.sideTrailLengthFactor;

        ctx.beginPath();
        const sideTrail1Gradient = ctx.createLinearGradient(
            sideTrail1StartX, sideTrail1StartY,
            sideTrail1EndX, sideTrail1EndY
        );
        sideTrail1Gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha * 0.4})`);
        sideTrail1Gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.strokeStyle = sideTrail1Gradient;
        ctx.lineWidth = this.size * this.sideTrailWidthFactor;
        ctx.moveTo(sideTrail1StartX, sideTrail1StartY);
        ctx.lineTo(sideTrail1EndX, sideTrail1EndY);
        ctx.stroke();

        const sideTrail2StartX = this.x - Math.cos(perpendicularAngle) * this.sideTrailOffset;
        const sideTrail2StartY = this.y - Math.sin(perpendicularAngle) * this.sideTrailOffset;
        const sideTrail2EndX = tailEndX - Math.cos(perpendicularAngle) * this.sideTrailOffset * this.sideTrailLengthFactor;
        const sideTrail2EndY = tailEndY - Math.sin(perpendicularAngle) * this.sideTrailOffset * this.sideTrailLengthFactor;
        
        ctx.beginPath();
        const sideTrail2Gradient = ctx.createLinearGradient(
            sideTrail2StartX, sideTrail2StartY,
            sideTrail2EndX, sideTrail2EndY
        );
        sideTrail2Gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha * 0.4})`);
        sideTrail2Gradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.strokeStyle = sideTrail2Gradient;
        ctx.lineWidth = this.size * this.sideTrailWidthFactor;
        ctx.moveTo(sideTrail2StartX, sideTrail2StartY);
        ctx.lineTo(sideTrail2EndX, sideTrail2EndY);
        ctx.stroke();

        ctx.beginPath();
        const glowRadius = this.size * 15;
        const glowGradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, glowRadius
        );
        glowGradient.addColorStop(0, `rgba(255, 255, 255, ${this.alpha * 0.8})`);
        glowGradient.addColorStop(0.2, `rgba(${this.color}, ${this.alpha * 0.6})`);
        glowGradient.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = glowGradient;
        ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
}

// === Dữ liệu và chức năng vẽ chòm sao Bạch Dương ===
const ariesStars = {
    alpha: { x: 500, y: 300, size: 3, name: "Hamal", alpha: 1, direction: -1 },
    beta: { x: 420, y: 350, size: 2.5, name: "Sheratan", alpha: 1, direction: -1 },
    gamma: { x: 380, y: 250, size: 2, name: "Mesarthim", alpha: 1, direction: -1 },
    delta: { x: 450, y: 200, size: 1.5, name: "Botein", alpha: 1, direction: -1 },
    epsilon: { x: 550, y: 280, size: 1.2, alpha: 1, direction: -1 },
    iota: { x: 600, y: 350, size: 1.2, alpha: 1, direction: -1 },
    lambda: { x: 650, y: 400, size: 1.2, alpha: 1, direction: -1 },
    pi: { x: 580, y: 450, size: 1.2, alpha: 1, direction: -1 },
    kappa: { x: 530, y: 480, size: 1.2, alpha: 1, direction: -1 },
};

function drawAries() {
    for (const key in ariesStars) {
        const star = ariesStars[key];
        
        star.alpha += 0.01 * star.direction;
        if (star.alpha >= 1 || star.alpha <= 0.2) {
            star.direction *= -1;
        }

        drawGlow(star.x, star.y, star.size * 5, star.alpha);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        
        if (star.name) {
            ctx.fillStyle = `white`;
            ctx.font = "12px Arial";
            ctx.fillText(star.name, star.x + 15, star.y + 15);
        }
    }

    ctx.beginPath();
    ctx.strokeStyle = "rgba(100, 149, 237, 0.8)";
    ctx.lineWidth = 1.5;
    
    ctx.moveTo(ariesStars.alpha.x, ariesStars.alpha.y);
    ctx.lineTo(ariesStars.beta.x, ariesStars.beta.y);
    ctx.lineTo(ariesStars.gamma.x, ariesStars.gamma.y);
    
    ctx.moveTo(ariesStars.beta.x, ariesStars.beta.y);
    ctx.lineTo(ariesStars.delta.x, ariesStars.delta.y);
    
    ctx.moveTo(ariesStars.alpha.x, ariesStars.alpha.y);
    ctx.lineTo(ariesStars.epsilon.x, ariesStars.epsilon.y);
    ctx.lineTo(ariesStars.iota.x, ariesStars.iota.y);
    ctx.lineTo(ariesStars.lambda.x, ariesStars.lambda.y);
    ctx.lineTo(ariesStars.pi.x, ariesStars.pi.y);
    ctx.lineTo(ariesStars.kappa.x, ariesStars.kappa.y);
    
    ctx.stroke();

    ctx.fillStyle = "white";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.fillText("ARIES", ariesStars.beta.x + 50, ariesStars.beta.y + 100);
}

const meteor = new Meteor();
let nextMeteorTime = 0;
let frameCount = 0;

function animate(currentTime) {
    drawBackground();
    drawStars();
    drawAries();

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