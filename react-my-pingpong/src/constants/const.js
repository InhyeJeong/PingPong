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

module.exports = { CANVAS, BALL, PADDLE, KEY }