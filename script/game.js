
// JavaScript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let gameOver = false;

// ตัวละคร
const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0
};

// วัตถุตก
const fallingObjects = [];
let fallingSpeed = 2; // ปรับเพิ่มเมื่อคะแนนสูงขึ้น

// ดึงปุ่มจาก DOM
const restartButton = document.getElementById('restartButton');
const homeButton = document.getElementById('homeButton');
const infoButton = document.getElementById('infoButton');
const newGameButton = document.getElementById('newGameButton');

// ฟังก์ชันแสดงหรือซ่อนปุ่มเมื่อ Game Over
function toggleGameOverButtons(show) {
    const display = show ? "block" : "none";
    restartButton.style.display = display;
    homeButton.style.display = display;
    infoButton.style.display = display;
}

// ฟังก์ชันแสดงปุ่ม "เริ่มเกมใหม่" เมื่อเกมจบ
function toggleNewGameButton(show) {
    const display = show ? "block" : "none";
    newGameButton.style.display = display;
}

// สร้างวัตถุที่ตกลงมา
function createFallingObject() {
    const x = Math.random() * (canvas.width - 20);
    const width = 20 + Math.random() * 30;
    fallingObjects.push({ x, y: -20, width, height: 20, speed: fallingSpeed });
}

// เคลื่อนที่ตัวละคร
function movePlayer() {
    player.x += player.dx;
    player.x = Math.max(0, Math.min(player.x, canvas.width - player.width));
}

// เคลื่อนที่วัตถุที่ตกลงมา
function moveFallingObjects() {
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
        fallingObjects[i].y += fallingObjects[i].speed;

        // ตรวจสอบการชน
        if (
            fallingObjects[i].x < player.x + player.width &&
            fallingObjects[i].x + fallingObjects[i].width > player.x &&
            fallingObjects[i].y < player.y + player.height &&
            fallingObjects[i].y + fallingObjects[i].height > player.y
        ) {
            gameOver = true;
        }

        // ลบวัตถุที่ตกถึงพื้นและเพิ่มคะแนน
        if (fallingObjects[i].y > canvas.height) {
            fallingObjects.splice(i, 1);
            score++;
            if (score % 10 === 0) fallingSpeed += 0.2; // เพิ่มความเร็วทุกๆ 10 คะแนน
        }
    }
}

// วาดตัวละครและวัตถุตก
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FF6347';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = '#87CEEB';
    fallingObjects.forEach(obj => ctx.fillRect(obj.x, obj.y, obj.width, obj.height));

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('คะแนน: ' + score, 10, 30);
    document.getElementById('score').textContent = 'คะแนน: ' + score;
}

// ฟังก์ชันอัปเดตเกม
function update() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('GAME OVER', canvas.width / 2 - 120, canvas.height / 2);
        toggleGameOverButtons(true);
        toggleNewGameButton(true);  // แสดงปุ่มเริ่มเกมใหม่
        return;
    }

    movePlayer();
    moveFallingObjects();
    draw();

    if (Math.random() < 0.02) createFallingObject();

    requestAnimationFrame(update);
}

// ตรวจสอบการกดปุ่มบนคีย์บอร์ด
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// ปุ่มควบคุมบนมือถือและเมาส์
['leftButton', 'rightButton'].forEach(id => {
    document.getElementById(id).addEventListener('touchstart', (e) => {
        e.preventDefault();
        player.dx = id === 'leftButton' ? -player.speed : player.speed;
    });
    document.getElementById(id).addEventListener('touchend', (e) => {
        e.preventDefault();
        player.dx = 0;
    });
});

// ✅ เพิ่มการควบคุมด้วยเมาส์ (คลิกซ้าย - ขวา)
document.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // คลิกซ้าย
        if (e.clientX < window.innerWidth / 2) {
            player.dx = -player.speed; // ถ้าคลิกฝั่งซ้าย → เดินซ้าย
        } else {
            player.dx = player.speed; // ถ้าคลิกฝั่งขวา → เดินขวา
        }
    }
});

// เมื่อปล่อยเมาส์ให้ตัวละครหยุด
document.addEventListener('mouseup', () => {
    player.dx = 0;
});

// ปุ่มเล่นอีกครั้ง
restartButton.addEventListener('click', () => {
    score = 0;
    gameOver = false;
    fallingObjects.length = 0;
    player.x = canvas.width / 2 - 25;
    fallingSpeed = 2;
    toggleGameOverButtons(false);
    update();
});

// ปุ่ม Home และ Info
homeButton.addEventListener("click", () => window.location.href = "index.html");
infoButton.addEventListener("click", () => window.location.href = "cv.html");

// เมื่อคลิกปุ่ม "เริ่มเกมใหม่"
newGameButton.addEventListener('click', () => {
    score = 0;
    gameOver = false;
    fallingObjects.length = 0;
    player.x = canvas.width / 2 - 25;
    fallingSpeed = 2;
    toggleNewGameButton(false);
    update();
    toggleGameOverButtons(false);
});

// เริ่มเกม
update();

