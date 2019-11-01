import React from 'react';

// React component to render the pellet
export default class Pellet extends React.Component {
  render() {
    return (
      <rect
        x={this.props.x}
        y={this.props.y}
        width={this.props.width}
        height={this.props.height}
        fill={this.props.color}
      />
    );
  }
}
