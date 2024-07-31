const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

let score1 = localStorage.getItem('score1') ? parseInt(localStorage.getItem('score1')) : 0;
let score2 = localStorage.getItem('score2') ? parseInt(localStorage.getItem('score2')) : 0;

document.getElementById('score1').innerText = score1;
document.getElementById('score2').innerText = score2;

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

const paddleWidth = 10;
const paddleHeight = 100;
const paddleSpeed = 8;
const paddle1 = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};
const paddle2 = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(x, y, width, height) {
    ctx.fillStyle = "#FFF";
    ctx.fillRect(x, y, width, height);
}

function movePaddles() {
    paddle1.y += paddle1.dy;
    paddle2.y += paddle2.dy;

    if (paddle1.y < 0) paddle1.y = 0;
    if (paddle1.y + paddleHeight > canvas.height) paddle1.y = canvas.height - paddleHeight;
    if (paddle2.y < 0) paddle2.y = 0;
    if (paddle2.y + paddleHeight > canvas.height) paddle2.y = canvas.height - paddleHeight;
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    if (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) {
        ball.dx *= -1;
    }
    if (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height) {
        ball.dx *= -1;
    }

    if (ball.x + ball.radius > canvas.width) {
        score1++;
        localStorage.setItem('score1', score1);
        document.getElementById('score1').innerText = score1;
        resetBall();
    } else if (ball.x - ball.radius < 0) {
        score2++;
        localStorage.setItem('score2', score2);
        document.getElementById('score2').innerText = score2;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

function update() {
    movePaddles();
    moveBall();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    drawPaddle(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            paddle2.dy = -paddleSpeed;
            break;
        case 'ArrowDown':
            paddle2.dy = paddleSpeed;
            break;
        case 'w':
            paddle1.dy = -paddleSpeed;
            break;
        case 's':
            paddle1.dy = paddleSpeed;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            paddle2.dy = 0;
            break;
        case 'w':
        case 's':
            paddle1.dy = 0;
            break;
    }
});

gameLoop();
