import React from "react"
import PropTypes from "prop-types"

class Game extends React.Component {
  render () {
    console.log(this.props.state)
    return (
      <React.Fragment>
        Greeting: {this.props.greeting}
      </React.Fragment>
    );
  }
}

Game.propTypes = {
  greeting: PropTypes.string
};
export default Game
