import React from 'react';

// React component to display the Snake using svg
export default class Snake extends React.Component {
  render() {
    return this.props.scales.map((scale, i) => (
      <rect
        key={i}
        x={scale.x}
        y={scale.y}
        width={scale.width}
        height={scale.height}
        fill={scale.color}
      />
    ));
  }
}
