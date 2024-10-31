let snake = [];
let snakeLength = 1;
let snakeSize = 30;
let velocityX = 0;
let velocityY = 0;
let foodX, foodY;
let score = 0;
let highScore = 0;
let initVelocity = 5;
let gameState = "welcome";
let bgMusic, gameOverSound;
let canvasWidth, canvasHeight;

function preload() {
    bgMusic = loadSound("back.mp3");
    gameOverSound = loadSound("gameover.mp3");
    if (localStorage.getItem("highScore")) {
        highScore = parseInt(localStorage.getItem("highScore"));
    }
}

function setup() {
    adjustCanvasSize();
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent("game-container");
    textSize(20);
    placeFood();

    // Button event listeners
    document.getElementById('button-up').addEventListener('click', moveUp);
    document.getElementById('button-down').addEventListener('click', moveDown);
    document.getElementById('button-left').addEventListener('click', moveLeft);
    document.getElementById('button-right').addEventListener('click', moveRight);
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
}

function adjustCanvasSize() {
    const container = document.getElementById('game-container');
    canvasWidth = container.clientWidth;  
    canvasHeight = container.clientHeight; 
}

function windowResized() {
    adjustCanvasSize();
    resizeCanvas(canvasWidth, canvasHeight);
}

function draw() {
    if (gameState === "welcome") {
        background(200, 255, 200);
        fill(0);
        textSize(30);
        textAlign(CENTER);
        text("Welcome to DotGame", width / 2, height / 2 - 20);
        text("Press Start to Play", width / 2, height / 2 + 20);
        
        // Show only the start button
        document.getElementById('start-button').style.display = 'inline-block';
        document.getElementById('restart-button').style.display = 'none';
        hideDirectionButtons();
    } else if (gameState === "playing") {
        background(200, 255, 200);
        fill(0);
        textAlign(CENTER);
        text(`Score: ${score}  Highscore: ${highScore}`, width / 2, 30);

        fill(255, 0, 0);
        rect(foodX, foodY, snakeSize, snakeSize);

        let head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
        snake.unshift(head);

        if (dist(head.x, head.y, foodX, foodY) < 15) {
            score += 10;
            snakeLength += 5;
            placeFood();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
            }
        }

        if (snake.length > snakeLength) {
            snake.pop();
        }

        for (let i = 0; i < snake.length; i++) {
            fill(0);
            rect(snake[i].x, snake[i].y, snakeSize, snakeSize);
        }

        if (head.x < 0 || head.x > width || head.y < 0 || head.y > height || snakeCollision()) {
            gameOver();
        }

        // Show direction buttons during the game
        showDirectionButtons();
    } else if (gameState === "gameOver") {
        background(200, 255, 200);
        fill(0);
        textSize(30);
        textAlign(CENTER);
        text("Game Over! Press Restart to Play Again", width / 2, height / 2);
        
        // Show only the restart button
        document.getElementById('restart-button').style.display = 'inline-block';
        document.getElementById('start-button').style.display = 'none';
        hideDirectionButtons();
    }
}

function placeFood() {
    foodX = floor(random(20, width - 20));
    foodY = floor(random(20, height - 20));
}

function snakeCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    gameState = "gameOver";
    bgMusic.stop();
    if (!gameOverSound.isPlaying()) {
        gameOverSound.play();
    }
}

function resetGame() {
    snake = [{ x: 45, y: 55 }];
    snakeLength = 1;
    score = 0;
    velocityX = 0;
    velocityY = 0;
    gameOverSound.stop();
    placeFood();
    if (!bgMusic.isPlaying()) {
        bgMusic.loop();
    }
}

function startGame() {
    gameState = "playing";
    resetGame();
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('restart-button').style.display = 'none';
}

function restartGame() {
    resetGame();
    gameState = "playing";
    document.getElementById('restart-button').style.display = 'none';
}

// Button functions
function moveUp() {
    if (velocityY === 0) {
        velocityX = 0;
        velocityY = -initVelocity;
    }
}

function moveDown() {
    if (velocityY === 0) {
        velocityX = 0;
        velocityY = initVelocity;
    }
}

function moveLeft() {
    if (velocityX === 0) {
        velocityX = -initVelocity;
        velocityY = 0;
    }
}

function moveRight() {
    if (velocityX === 0) {
        velocityX = initVelocity;
        velocityY = 0;
    }
}

function showDirectionButtons() {
    document.getElementById('button-up').style.display = 'inline-block';
    document.getElementById('button-down').style.display = 'inline-block';
    document.getElementById('button-left').style.display = 'inline-block';
    document.getElementById('button-right').style.display = 'inline-block';
}

function hideDirectionButtons() {
    document.getElementById('button-up').style.display = 'none';
    document.getElementById('button-down').style.display = 'none';
    document.getElementById('button-left').style.display = 'none';
    document.getElementById('button-right').style.display = 'none';
}

// Keyboard controls
function keyPressed() {
    if (gameState === "welcome") {
        if (keyCode === 32) { // Space bar starts the game
            startGame();
        }
    } else if (gameState === "gameOver") {
        if (keyCode === ENTER) { // Enter restarts the game
            restartGame();
        }
    } else if (gameState === "playing") {
        if (keyCode === RIGHT_ARROW && velocityX === 0) {
            velocityX = initVelocity;
            velocityY = 0;
        } else if (keyCode === LEFT_ARROW && velocityX === 0) {
            velocityX = -initVelocity;
            velocityY = 0;
        } else if (keyCode === UP_ARROW && velocityY === 0) {
            velocityX = 0;
            velocityY = -initVelocity;
        } else if (keyCode === DOWN_ARROW && velocityY === 0) {
            velocityX = 0;
            velocityY = initVelocity;
        }
    }
}
