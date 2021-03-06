import React, { Component } from 'react';
import Tiles from './tiles.jsx';

class Canvas extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let styles = {
      height: '700px', 
      width: '1400px',
      bakgroundColor: 'pink', 
      position: 'relative'
    }
    return (
      <div  id = 'canvas' style = {{height: '700px', width: '1400px', backgroundColor: 'pink', position:'relative'}}>
        <Tiles playlist = {this.props.playlist} />
      </div>
    )
  }
}
export default Canvas