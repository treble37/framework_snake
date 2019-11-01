import React from 'react';

// Notes: not used at the moment, but may experiment with this...
// https://towardsdatascience.com/passing-data-between-react-components-parent-children-siblings-a64f89e24ecf
const GameContext = React.createContext();

export default class GameProvider extends React.Component {
  state = {
    headX: 150,
    headY: 50,
    xDir: -1,
    yDir: 0
  }

  render() {
    return (
      <GameContext.Provider value={{state: this.state,
          setHeadState: (headX, headY, xDir, yDir) => this.setState({
            headX: headX, headY: headY, xDir: xDir, yDir: yDir}
          )
      }}>{this.props.children}
      </GameContext.Provider>
    )
  }
}
