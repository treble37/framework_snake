import React from 'react';

export default class Display extends React.Component {
  constructor(props) {
    super(props);
    this.color = '#ff0000';
  }
  render() {
    return (
      <text x={this.props.x} y={this.props.y} fill={this.color}>
        {this.props.message}
      </text>
    );
  }
}
