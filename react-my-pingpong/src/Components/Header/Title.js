import React, { Component } from 'react'

class Title extends Component {
  constructor (props) {
    super(props)
    this.state = {
      gameProgress: 0,
    }
  }

  render () {
    return (
      <div style={{textAlign: 'center', padding: '20px'}}>
        <span aria-label="a rocket blasting off" role="img">🚀</span>
        <h3>
          Ping Ping Pong Pong
        </h3>
      </div>
    )
  }
}

export default Title