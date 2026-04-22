const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let player;
let obstacles;
let score;
let game;
let gameRunning;

function init() {
  player = {
    x: 50,
    y: 150,
    width: 20,
    height: 20,
    velocity: 0,
    gravity: 0.6,
    jump: -10,
    grounded: true
  };

  obstacles = [];
  score = 0;
  gameRunning = true;

  document.getElementById("score").textContent = score;
  document.getElementById("restartBtn").style.display = "none";
}

// kontrol lompat
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && player.grounded && gameRunning) {
    player.velocity = player.jump;
    player.grounded = false;
  }
});

// gambar player
function drawPlayer() {
  ctx.fillStyle = "black";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// update player
function updatePlayer() {
  player.velocity += player.gravity;
  player.y += player.velocity;

  // ground
  if (player.y >= 150) {
    player.y = 150;
    player.velocity = 0;
    player.grounded = true;
  }
}

// obstacle
function createObstacle() {
  obstacles.push({
    x: canvas.width,
    y: 150,
    width: 20,
    height: 20
  });
}

function drawObstacles() {
  ctx.fillStyle = "red";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  });
}

function updateObstacles() {
  obstacles.forEach(obs => {
    obs.x -= 5;

    // collision
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      gameOver();
    }
  });

  obstacles = obstacles.filter(obs => obs.x > -20);
}

// score
function updateScore() {
  score++;
  document.getElementById("score").textContent = score;
}

// game over
function gameOver() {
  gameRunning = false;
  clearInterval(game);
  document.getElementById("restartBtn").style.display = "inline-block";
}

// restart
function restartGame() {
  clearInterval(game);
  init();
  game = setInterval(loop, 20);
}

// loop
function loop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  updatePlayer();

  drawObstacles();
  updateObstacles();

  updateScore();
}

// start
init();
game = setInterval(loop, 20);

// spawn obstacle random
setInterval(() => {
  if (gameRunning) createObstacle();
}, 1500);
