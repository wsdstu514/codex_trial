const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const restartBtn = document.getElementById("restart");

const state = {
  left: false,
  right: false,
  shoot: false,
  score: 0,
  lives: 3,
  gameOver: false,
};

const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 40,
  w: 40,
  h: 20,
  speed: 5,
  cooldown: 0,
};

let bullets = [];
let enemyBullets = [];
let enemies = [];
let enemyDir = 1;
let enemySpeed = 0.35;

function makeEnemies() {
  enemies = [];
  const rows = 4;
  const cols = 9;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      enemies.push({
        x: 70 + c * 55,
        y: 60 + r * 40,
        w: 32,
        h: 20,
        alive: true,
      });
    }
  }
}

function resetGame() {
  state.score = 0;
  state.lives = 3;
  state.gameOver = false;
  player.x = canvas.width / 2 - player.w / 2;
  bullets = [];
  enemyBullets = [];
  enemyDir = 1;
  enemySpeed = 0.35;
  makeEnemies();
  updateHud();
}

function updateHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
}

function rectHit(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function update() {
  if (state.gameOver) return;

  if (state.left) player.x -= player.speed;
  if (state.right) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

  if (state.shoot && player.cooldown <= 0) {
    bullets.push({ x: player.x + player.w / 2 - 2, y: player.y - 8, w: 4, h: 10, speed: 7 });
    player.cooldown = 14;
  }
  if (player.cooldown > 0) player.cooldown -= 1;

  bullets = bullets.filter((b) => {
    b.y -= b.speed;
    return b.y + b.h > 0;
  });

  enemyBullets = enemyBullets.filter((b) => {
    b.y += b.speed;
    if (rectHit(b, player)) {
      state.lives -= 1;
      updateHud();
      if (state.lives <= 0) {
        state.gameOver = true;
      }
      return false;
    }
    return b.y < canvas.height;
  });

  let hitWall = false;
  for (const e of enemies) {
    if (!e.alive) continue;
    e.x += enemyDir * enemySpeed;
    if (e.x <= 10 || e.x + e.w >= canvas.width - 10) hitWall = true;

    if (Math.random() < 0.0015 + state.score * 0.000003) {
      enemyBullets.push({ x: e.x + e.w / 2 - 2, y: e.y + e.h, w: 4, h: 9, speed: 3.5 });
    }

    if (e.y + e.h >= player.y) {
      state.gameOver = true;
    }
  }

  if (hitWall) {
    enemyDir *= -1;
    for (const e of enemies) {
      if (e.alive) e.y += 12;
    }
  }

  for (const b of bullets) {
    for (const e of enemies) {
      if (!e.alive) continue;
      if (rectHit(b, e)) {
        e.alive = false;
        b.y = -100;
        state.score += 10;
        updateHud();
      }
    }
  }

  if (enemies.every((e) => !e.alive)) {
    makeEnemies();
    enemySpeed += 0.08;
  }
}

function drawPlayer() {
  ctx.fillStyle = "#8eff8e";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  ctx.fillRect(player.x + 12, player.y - 8, 16, 8);
}

function drawEnemies() {
  ctx.fillStyle = "#ff6b8c";
  for (const e of enemies) {
    if (!e.alive) continue;
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillRect(e.x - 4, e.y + 6, 4, 8);
    ctx.fillRect(e.x + e.w, e.y + 6, 4, 8);
  }
}

function drawBullets() {
  ctx.fillStyle = "#fff37a";
  for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);

  ctx.fillStyle = "#ffb3c7";
  for (const b of enemyBullets) ctx.fillRect(b.x, b.y, b.w, b.h);
}

function drawGameOver() {
  if (!state.gameOver) return;
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 40px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "20px sans-serif";
  ctx.fillText("リスタートで再挑戦", canvas.width / 2, canvas.height / 2 + 30);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawBullets();
  drawGameOver();
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") state.left = true;
  if (e.key === "ArrowRight") state.right = true;
  if (e.key === " ") state.shoot = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") state.left = false;
  if (e.key === "ArrowRight") state.right = false;
  if (e.key === " ") state.shoot = false;
});

restartBtn.addEventListener("click", resetGame);

resetGame();
loop();
