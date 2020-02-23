
const CANVAS = {
  WIDTH: 480,
  HEIGHT: 320,
}

const BALL = {
  RADIUS: 10,
  X: CANVAS.WIDTH / 2,
  Y: CANVAS.HEIGHT - 30,
  DIFFERENTIAL_X: 2,
  DIFFERENTIAL_Y: -2,
}

const PADDLE = {
  HEIGHT: 10,
  WIDTH: 75, 
}

const KEY = {
  LEFT: 37,
  RIGHT: 39,
}

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let x = BALL.X;
let y = BALL.Y;
let dx = BALL.DIFFERENTIAL_X;
let dy = BALL.DIFFERENTIAL_Y;

let paddleX = (CANVAS.WIDTH - PADDLE.WIDTH) / 2;

let rightPressed = false;
let leftPressed = false;

function drawGame () {
  drawBall()
  drawPaddle()

  checkCollision()
  movePaddle()
}

let refreshIntervalId = setInterval(drawGame, 10);

//  코너 케이스에 주의 : nowYPosition + ballRadius = canvas.height인 경우
function checkCollision () {
  //  충돌검사는 <현재 위치>에서 수행한다.
  let nowYPosition = y + dy
  let nowXPosition = x + dx

  if (nowYPosition - BALL.RADIUS < 0) {
    //  상단 충돌 검사
    dy = -dy;
    nowYPosition = y + dy
  } else if (nowYPosition + BALL.RADIUS + PADDLE.HEIGHT > canvas.height &&
            nowXPosition - paddleX > 0 && nowXPosition < paddleX + PADDLE.WIDTH) {
    //  paddle 충돌 검사
    dy = -dy;
    nowYPosition = y + dy
  } else if (nowYPosition + BALL.RADIUS > canvas.height) {
    //   바닥 충돌 검사
    alert('GameOver')
    clearInterval(refreshIntervalId)
    document.location.reload();
  }

  if (nowXPosition + BALL.RADIUS > canvas.width || nowXPosition - BALL.RADIUS < 0) {
    dx = -dx;
    nowXPosition = x + dx
  }

  x = nowXPosition;
  y = nowYPosition;
}

function movePaddle () {
  if (rightPressed && paddleX + PADDLE.WIDTH < canvas.width) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
}

function drawBall () {
  removePastBall()
  context.beginPath();
  const firstAngle = 0
  const lastAngle = Math.PI*2
  const isCounterClockwise = false

  context.arc(x, y, BALL.RADIUS, firstAngle, lastAngle, isCounterClockwise);
  context.fillStyle = "#0095DD";
  context.fill();
  context.closePath();
}

function removePastBall () {
  let leftUpX = 0
  let leftUpY = 0
  let rightDownX = canvas.width
  let rightDownY = canvas.height
  context.clearRect(leftUpX, leftUpY, rightDownX, rightDownY);
}

function drawPaddle () {
  context.beginPath();
  context.rect(paddleX, canvas.height - PADDLE.HEIGHT, PADDLE.WIDTH, PADDLE.HEIGHT);
  context.fillStyle = "#383F96";
  context.fill();
  context.closePath();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler (e) {
  let { keyCode } = e
  if (keyCode === KEY.RIGHT) {
    rightPressed = true;
  } else if (keyCode === KEY.LEFT) {
    leftPressed = true;
  }
}

function keyUpHandler (e) {
  let { keyCode } = e
  if (keyCode === KEY.RIGHT) {
    rightPressed = false;
  } else if (keyCode === KEY.LEFT) {
    leftPressed = false;
  }
}