import React from "react"
import PropTypes from "prop-types"
import { cookieValue } from 'utils/cookieValue'

import { DragDropContext } from 'react-beautiful-dnd'

import { Hand } from 'components/Hand'
import consumer from 'src/cable'

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.props.state

    this.updateState = this.updateState.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
  }

  componentDidMount() {
    consumer.subscriptions.create({
      channel: 'NotificationChannel'
    }, {
      connected: () => console.log('connected'),
      disconnected: () => console.log('disconnected'),
      received: data => this.updateState()
    })
  }

  componentWillUnmount() {
    consumer.disconnect()
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

  onDragEnd(result) {
    const { destination, source, draggableId } = result

    if (!destination) {
      return
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const newHand = this.state.hands[this.state.player_id].concat()
    newHand.splice(source.index, 1)
    newHand.splice(destination.index, 0, draggableId)

    const newState = {
      ...this.state,
      hands: {
        ...this.state.hands,
        [this.state.player_id]: newHand,
      }
    }

    this.setState(newState)
  }

  render () {
    const playerName = this.state.names[this.state.player_id]
    const otherPlayers = this.state.players.filter(id => id !== this.state.player_id)

    return (
      <React.Fragment>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Hand
            key="hand-1"
            playerName={playerName}
            cards={this.state.hands[this.state.player_id]} />
        </DragDropContext>
      </React.Fragment>
    )
  }
}

Game.propTypes = {
  greeting: PropTypes.string
};
export default Game
