import React, { Component } from 'react'
import { CANVAS, BALL, PADDLE, KEY, BRICK } from '../../constants/const'

class PingPong extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animationRequest: () => {},
      canvas: '',
      context: '',
      x: BALL.X,
      y: BALL.Y,
      dx: BALL.DIFFERENTIAL_X,
      dy: BALL.DIFFERENTIAL_Y,
      paddleX: (CANVAS.WIDTH - PADDLE.WIDTH) / 2,
      bricks: [],
      score: 0,
      lives: 3,
      rightPressed: false,
      leftPressed: false,
    }
  }

  componentDidMount () {
    this.setState({
      canvas: this.refs.canvas,
    }, () => {
      this.updateContext()
    })
    document.addEventListener("keydown", (e) => this.keyDownHandler(e), false);
    document.addEventListener("keyup", (e) => this.keyUpHandler(e), false);
    document.addEventListener("mousemove", (e) => this.mouseMoveHandler(e), false);
    this.initBrickPosition()
  }

  updateContext () {
    this.setState({
      context: this.state.canvas.getContext("2d"),
    }, () => {
      this.drawGame()
    })
  }

  drawGame () {
    this.setState({
      animationRequest: requestAnimationFrame(() => this.drawGame())
    })
    this.drawBall()
    this.drawPaddle()
    this.movePaddle()
  }

  //  코너 케이스에 주의 : nowYPosition + ballRadius = canvas.height인 경우
  checkCollision () {
    let { x, y, dx, dy, canvas, paddleX } = this.state
    //  충돌검사는 <현재 위치>에서 수행한다.
    let nowYPosition = y + dy
    let nowXPosition = x + dx
  
    if (nowYPosition - BALL.RADIUS < 0) {
      //  상단 충돌 검사
      this.setState({
        dy: -dy,
      })
      nowYPosition = y + dy
    } else if (nowYPosition + BALL.RADIUS + PADDLE.HEIGHT > canvas.height &&
              nowXPosition - paddleX > 0 && nowXPosition < paddleX + PADDLE.WIDTH) {
      //  paddle 충돌 검사
      this.setState({
        dy: -dy,
      })
      nowYPosition = y + dy
    } else if (nowYPosition + BALL.RADIUS > canvas.height) {
      //   바닥 충돌 검사
      this.updateLives()
    }
  
    if (nowXPosition + BALL.RADIUS > canvas.width || nowXPosition - BALL.RADIUS < 0) {
      this.setState({
        dx: -dx,
      })
      nowXPosition = x + dx
    }

    this.setState({
      x: nowXPosition,
      y: nowYPosition,
    })
  }

  updateLives () {
    let { lives, animationRequest } = this.state

    this.setState({
      lives: --lives,
    })
    if (!lives) {
      alert('GameOver')
      cancelAnimationFrame(animationRequest)
      document.location.reload()
    } else {
      this.setState({
        x: CANVAS.WIDTH / 2,
        y: CANVAS.HEIGHT - 30,
        dx: 2,
        dy: -2,
        paddleX: (CANVAS.WIDTH - PADDLE.WIDTH) / 2,
      })
    }
  }

  movePaddle () {
    let { rightPressed, leftPressed, paddleX, canvas } = this.state
    if (rightPressed && paddleX + PADDLE.WIDTH < canvas.width) {
      paddleX += 7;
      this.setState({
        paddleX: paddleX + 7
      })
    } else if (leftPressed && paddleX > 0) {
      this.setState({
        paddleX: paddleX - 7
      })
    }
  }
  
  drawBall () {
    let { context, x, y } = this.state
    this.removePastBall()
    context.beginPath();
    const firstAngle = 0
    const lastAngle = Math.PI*2
    const isCounterClockwise = false
  
    context.arc(x, y, BALL.RADIUS, firstAngle, lastAngle, isCounterClockwise);
    context.fillStyle = "#FF0000";
    context.fill();
    this.checkCollision()
    context.closePath();
  }
  
  removePastBall () {
    let { canvas, context } = this.state
    let leftUpX = 0
    let leftUpY = 0
    let rightDownX = canvas.width
    let rightDownY = canvas.height
    context.clearRect(leftUpX, leftUpY, rightDownX, rightDownY);
  }

  drawPaddle () {
    let { canvas, context, paddleX } = this.state
    context.beginPath();
    context.rect(paddleX, canvas.height - PADDLE.HEIGHT, PADDLE.WIDTH, PADDLE.HEIGHT);
    context.fillStyle = "#D1AA32";
    context.fill();
    context.closePath();
    this.drawBricks()
    this.detectBrickCollision()
    this.drawScore()
    this.drawLives()
  }

  initBrickPosition () {
    for (let column = 0; column < BRICK.COLUMN; column++) {
      let currentBricks = this.state.bricks
      currentBricks[column] = []
      this.setState({
        bricks: [...this.state.bricks, currentBricks]
      })
      for (let row = 0; row < BRICK.ROW; row++) {
        currentBricks[column][row] = {
          x: 0,
          y: 0,
          status: BRICK.STATUS.ACTIVATE,
        }
        this.setState({
          bricks: [...this.state.bricks, currentBricks],
        })
      }
    }
  }

  drawBricks () {
    let { context, bricks } = this.state
    let currentBricks = bricks
    for(let column = 0; column < BRICK.COLUMN; column++) {
      for(let row = 0; row < BRICK.ROW; row++) {
        if (currentBricks[column][row].status === BRICK.STATUS.ACTIVATE) {
          let BRICK_X = (column * (BRICK.WIDTH + BRICK.PADDING)) + BRICK.OFFSET_LEFT;
          let BRICK_Y = (row * (BRICK.HEIGHT + BRICK.PADDING)) + BRICK.OFFSET_TOP;
          currentBricks[column][row].x = BRICK_X;
          currentBricks[column][row].y = BRICK_Y;
          this.setState({
            bricks: [...bricks, currentBricks]
          })
          context.beginPath();
          context.rect(BRICK_X, BRICK_Y, BRICK.WIDTH, BRICK.HEIGHT);
          context.fillStyle = "#B5482F";
          context.fill();
          context.closePath();
        }
      }
    }
  }

  detectBrickCollision () {
    let { x, y, dy, bricks, score, animationRequest } = this.state

    for (let column = 0; column < BRICK.COLUMN; column++) {
      for (let row = 0; row < BRICK.ROW; row++) {
        let currentBrick = bricks[column][row]
        if (currentBrick.status === BRICK.STATUS.ACTIVATE) {
          if (x > currentBrick.x &&
              x < currentBrick.x + BRICK.WIDTH &&
              y > currentBrick.y &&
              y < currentBrick.y + BRICK.HEIGHT) {
            currentBrick.status = BRICK.STATUS.DEACTIVATE
            this.setState({
              dy: -dy,
              bricks: [...bricks, currentBrick],
              score: ++score,
            })
            if (this.state.score === BRICK.ROW * BRICK.COLUMN) {
              alert(`YOU WIN, CONGRATULATIONS! YOUR SCORE IS ${this.state.score} !!`);
              document.location.reload();
              cancelAnimationFrame(animationRequest)
            }
          }
        }
      }
    }
  }

  drawScore () {
    let { context } = this.state

    context.font = "16px Arial";
    context.fillStyle = "#000000";
    context.fillText(`🎯: ${this.state.score}`, 8, 20)
  }

  drawLives () {
    let { context } = this.state

    context.font = "16px Arial";
    context.fillStyle = "#000000";
    let liveEmoji = '🎖🎖🎖'
    switch (this.state.lives) {
      case 2:
        liveEmoji = '🎖🎖'
        break;
      case 1:
        liveEmoji = '🎖'
        break;
      case 0:
        liveEmoji = '😖'
        break;
      default:
        liveEmoji = '🎖🎖🎖'
        break;
    }
    context.fillText(`Lives: ${liveEmoji}`, CANVAS.WIDTH - 110, 20)
  }

  keyDownHandler (e) {
    let { keyCode } = e
    if (keyCode === KEY.RIGHT) {
      this.setState({
        rightPressed: true,
      })
    } else if (keyCode === KEY.LEFT) {
      this.setState({
        leftPressed: true,
      })
    }
  }
  
  keyUpHandler (e) {
    let { keyCode } = e
    if (keyCode === KEY.RIGHT) {
      this.setState({
        rightPressed: false,
      })
    } else if (keyCode === KEY.LEFT) {
      this.setState({
        leftPressed: false,
      })
    }
  }

  mouseMoveHandler (e) {
    let { canvas } = this.state
    let relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < CANVAS.WIDTH) {
      this.setState({
        paddleX: relativeX - PADDLE.WIDTH / 2,
      })
    }
  }

  render () {
    return (
      <div>
        <canvas
          ref="canvas"
          width={CANVAS.WIDTH}
          height={CANVAS.HEIGHT} />
      </div>
    )
  }
}

export default PingPong