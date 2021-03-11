import React from "react"
import PropTypes from "prop-types"
import { cookieValue } from 'utils/cookieValue'

import { Hand } from 'components/Hand'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.props.state

    this.updateState = this.updateState.bind(this)
    this.handleCardClick = this.handleCardClick.bind(this)
  }

  updateState() {
    const gameId = this.props.state['game_id']
    const playerId = this.props.state['player_id']
    const secret = cookieValue('_durak_player_secret')

    fetch(`/games/${gameId}/state?` + new URLSearchParams({
      player_id: playerId,
      secret: secret,
    }))
    .then(res => res.json())
    .then(responseJson => this.setState(responseJson))
    .catch(error => console.error(error))
  }

  handleCardClick(clickedCard) {
    const cards = this.state.selectedCards.concat()

    if (cards.some(card => card === clickedCard)) {
      cards.splice(cards.indexOf(clickedCard), 1)
    } else {
      cards.push(clickedCard)
    }

    this.setState({
      selectedCards: cards,
    })
  }

  render () {
    return (
      <React.Fragment>
        <Hand
          handleCardClick={this.handleCardClick}
          selected={this.state.selectedCards}
          cards={this.state.hands[this.state.player_id]} />
      </React.Fragment>
    );
  }
}

Game.propTypes = {
  greeting: PropTypes.string
};
export default Game
