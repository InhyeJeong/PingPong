import React, { Component } from 'react'
import { CANVAS, BALL, PADDLE, KEY, BRICK } from '../../constants/const'

class PingPong extends Component {
  constructor (props) {
    super(props)
    this.state = {
      canvas: '',
      context: '',
      x: BALL.X,
      y: BALL.Y,
      dx: BALL.DIFFERENTIAL_X,
      dy: BALL.DIFFERENTIAL_Y,
      paddleX: (CANVAS.WIDTH - PADDLE.WIDTH) / 2,
      bricks: [],
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
    let animationRequest = requestAnimationFrame(() => this.drawGame());
    this.drawBall(animationRequest)
    this.drawPaddle()
    this.movePaddle()
  }

  //  코너 케이스에 주의 : nowYPosition + ballRadius = canvas.height인 경우
  checkCollision (animationRequest) {
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
      alert('GameOver')
      cancelAnimationFrame(animationRequest)
      document.location.reload();
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
  
  drawBall (animationRequest) {
    let { context, x, y } = this.state
    this.removePastBall()
    context.beginPath();
    const firstAngle = 0
    const lastAngle = Math.PI*2
    const isCounterClockwise = false
  
    context.arc(x, y, BALL.RADIUS, firstAngle, lastAngle, isCounterClockwise);
    context.fillStyle = "#0095DD";
    context.fill();
    this.checkCollision(animationRequest)
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
    context.fillStyle = "#383F96";
    context.fill();
    context.closePath();
    this.drawBricks()
  }

  initBrickPosition () {
    for (let column = 0; column < BRICK.COLUMN; column++) {
      let tmpBricks = this.state.bricks
      tmpBricks[column] = []
      this.setState({
        bricks: [...this.state.bricks, tmpBricks]
      })
      for (let row = 0; row < BRICK.ROW; row++) {
        tmpBricks[column][row] = { x: 0, y: 0 }
        this.setState({
          bricks: [...this.state.bricks, tmpBricks],
        })
      }
    }
  }

  drawBricks () {
    let { context, bricks } = this.state
    let tmpBricks = bricks
    for(let column = 0; column < BRICK.COLUMN; column++) {
      for(let row = 0; row < BRICK.ROW; row++) {
        let BRICK_X = (column * (BRICK.WIDTH + BRICK.PADDING)) + BRICK.OFFSET_LEFT;
        let BRICK_Y = (row * (BRICK.HEIGHT + BRICK.PADDING)) + BRICK.OFFSET_TOP;
        tmpBricks[column][row].x = BRICK_X;
        tmpBricks[column][row].y = BRICK_Y;
        this.setState({
          bricks: [...bricks, tmpBricks]
        })
        context.beginPath();
        context.rect(BRICK_X, BRICK_Y, BRICK.WIDTH, BRICK.HEIGHT);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
      }
  }
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