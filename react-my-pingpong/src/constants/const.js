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

const BRICK = {
  ROW: 3,
  COLUMN: 5,
  WIDTH: 75,
  HEIGHT: 20,
  PADDING: 10,
  OFFSET_TOP: 30,
  OFFSET_LEFT: 30,
}


module.exports = { CANVAS, BALL, PADDLE, KEY, BRICK }