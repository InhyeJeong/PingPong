import React, { Component } from 'react'
import * as THREE from "three";

class Cube extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cube: null,
      scene: null,
      camera: null,
      renderer: null,
      geometry: null,
      material: null,
    }
    this.updateRenderer = this.updateRenderer.bind(this)
    this.setCube = this.setCube.bind(this)
    this.addCubeToScene = this.addCubeToScene.bind(this)
    this.animateCube = this.animateCube.bind(this)
  }

  componentDidMount () {
    this.setState({
      geometry: new THREE.BoxGeometry( 1, 1, 1 ),
      material: new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
      scene: new THREE.Scene(),
      camera: new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 ),
      renderer: new THREE.WebGLRenderer(),
    }, () => {
      this.updateRenderer()
    })
  }

  updateRenderer () {
    let { renderer } = this.state
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    this.setCube()
  }

  setCube () {
    let { geometry, material } = this.state
    this.setState({
      cube: new THREE.Mesh( geometry, material ),
    }, () => {
      this.addCubeToScene()
    })
  }

  addCubeToScene () {
    let { scene, cube, camera } = this.state
    scene.add( cube );
    camera.position.z = 5;
    this.animateCube();
  }

  animateCube () {
    let { cube, renderer, scene, camera } = this.state
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render( scene, camera );
    requestAnimationFrame( this.animateCube );
  }

  render() {
    return (
      <div />
    )
  }
}

export default Cube;