import React from 'react';
import Snake from './snake/Snake';
import Scale from './snake/Scale';
import Pellet from './board/Pellet';
import Display from './board/Display';
import Util from './util/Util';

// Manage the Snake game
export default class Game extends React.Component {
  static defaultProps = {
    frameRate: 10,
    maxFPS: 60,
    width: 640,
    height: 480,
    pelletWidth: 10,
    pelletHeight: 10,
    pelletColor: '#ff0000',
    backgroundColor: 'black',
    snakeGrowth: 3,
  };

  //updating state messes with the animation frame rate, so use object props
  constructor(props) {
    super(props);
    this.frameCount = 0;
    this.xDir = -1;
    this.yDir = 0;
    this.pelletX = Util.generateRandom(0, props.width);
    this.pelletY = Util.generateRandom(0, props.height);
    this.stopLoop = false;
    this.displayMessage = '';
    this.scales = [
      new Scale(150, 50, -1, 0),
      new Scale(160, 50, -1, 0),
      new Scale(170, 50, -1, 0),
    ];
  }

  _onKeyDown = keyCode => {
    switch (keyCode.which) {
      //left arrow
      case 37:
        this.xDir = -1;
        this.yDir = 0;
        break;
        //up arrow
      case 38:
        this.xDir = 0;
        this.yDir = -1;
        break;
        //right arrow
      case 39:
        this.xDir = 1;
        this.yDir = 0;
        break;
        //down arrow
      case 40:
        this.xDir = 0;
        this.yDir = 1;
        break;
      default:
        this.xDir = -1;
        this.yDir = 0;
        break;
    }
  };

  isPelletEaten = () => {
    return (
      this.pelletBoundaryCrossed(
        this.pelletX,
        this.scales[0].x,
        this.props.pelletWidth,
      ) &&
      this.pelletBoundaryCrossed(
        this.pelletY,
        this.scales[0].y,
        this.props.pelletHeight,
      )
    );
  };

  pelletBoundaryCrossed = (pelletCoord, snakeCoord, r) => {
    return pelletCoord > snakeCoord - r && pelletCoord < snakeCoord + r;
  };

  move = () => {
    let headScale = this.scales[0];
    let newHead = new Scale(
      headScale.x,
      headScale.y,
      this.props.xDir,
      this.props.yDir,
    );
    newHead.x += newHead.width * this.xDir;
    newHead.y += newHead.height * this.yDir;
    this.scales.pop(); //remove tail
    this.scales.unshift(newHead);
  };

  snakeCrashed = () => {
    let headScale = this.scales[0];
    return (
      headScale.x <= 0 ||
      headScale.x >= this.props.width - 10 ||
      headScale.y <= 0 ||
      headScale.y >= this.props.height - 10
    );
  };

  growSnake = () => {
    let n = this.scales.length;
    for (let i = n; i < n + this.props.snakeGrowth; i++) {
      let deltaX = this.scales[i - 1].width * this.xDir;
      let deltaY = this.scales[i - 1].height * this.yDir;
      this.scales.push(
        new Scale(
          this.scales[i - 1].x + deltaX,
          this.scales[i - 1].y + deltaY,
          this.xDir,
          this.yDir,
        ),
      );
    }
  };

  componentDidMount() {
    document.addEventListener('keydown', this._onKeyDown);
    let nextIteration;
    let gameId;
    const gameLoop = time => {
      this.frameCount = this.frameCount + 1;
      if (
        this.frameCount >= Math.round(this.props.maxFPS / this.props.frameRate)
      ) {
        this.frameCount = 0;
        if (this.isPelletEaten()) {
          this.pelletX = Util.generateRandom(0, this.props.width);
          this.pelletY = Util.generateRandom(0, this.props.height);
          this.growSnake();
        }
        if (this.snakeCrashed()) {
          cancelAnimationFrame(gameId);
          this.displayMessage = 'CRASH: Game Over!';
          this.stopLoop = true;
        }
        this.move();
        // force rerender to paint snake
        this.forceUpdate();
      }
      if (!this.stopLoop) {
        nextIteration();
      } else {
        return;
      }
    };

    nextIteration = () => {
      gameId = requestAnimationFrame(gameLoop);
    };
    nextIteration();
  }

  render() {
    const {
      props: {
        backgroundColor,
        width,
        height,
        pelletWidth,
        pelletHeight,
        pelletColor,
      },
      scales,
      pelletX,
      pelletY,
      displayMessage,
    } = this;
    return (
      <svg style={{width, height, backgroundColor}}>
        <Snake scales={scales} />
        <Pellet
          key={Date.now()}
          x={pelletX}
          y={pelletY}
          width={pelletWidth}
          height={pelletHeight}
          color={pelletColor}
        />
        <Display x={150} y={50} message={displayMessage} key={Date.now() + 1} />
      </svg>
    );
  }
}
