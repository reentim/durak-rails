import PropTypes from "prop-types"
import React from "react"
import consumer from 'src/cable'
import styled from 'styled-components'
import { DragDropContext } from 'react-beautiful-dnd'
import { cookieValue } from 'utils/cookieValue'

import { AttackArea } from 'components/AttackArea'
import { DefenceArea } from 'components/DefenceArea'
import { Hand } from 'components/Hand'
import { Deck } from 'components/Deck'

const AttackContainer = styled.div`
  display: flex;
`
const DefenceContainer = styled.div`
  display: flex;
  margin-top: -100px;
`
const ConcedeButton = styled.button`
  margin-top: auto;
  height: 30px;
`

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.props.state

    this.updateState = this.updateState.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.concedeAttack = this.concedeAttack.bind(this)
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

  adjustHand(playerId, newHand) {
    const gameId = this.props.state['game_id']
    const secret = cookieValue('_durak_player_secret')

    fetch(`/games/${gameId}/hand_adjustments`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hand: newHand,
        playerId: playerId,
        secret: secret,
      })
    })
    .then(response => response.json())
    .then()
    .catch((error) => { console.log(error) })
  }

  defend(card, defences) {
    const gameId = this.props.state['game_id']

    fetch(`/games/${gameId}/defences`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        defences: defences,
        card: card,
      })
    })
    .then(response => response.json())
    .then()
    .catch((error) => { console.log(error) })
  }

  attack(card, attacks) {
    const gameId = this.props.state['game_id']

    fetch(`/games/${gameId}/attacks`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attacks: attacks,
        card: card,
      })
    })
    .then(response => response.json())
    .then()
    .catch((error) => { console.log(error) })
  }

  concedeAttack() {
    const gameId = this.props.state['game_id']

    fetch(`/games/${gameId}/concessions`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then()
    .catch((error) => { console.log(error) })
  }

  onDragEnd(result) {
    console.log(result)
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

    if (source.droppableId === destination.droppableId) {
      const newHand = this.state.hands[this.state.player_id]
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
      this.adjustHand(this.state.player_id, newHand)
    }

    if (destination.droppableId.split('-')[0] === 'attackArea') {
      const newHand = this.state.hands[this.state.player_id]
      const newAttacks = this.state.attacks

      newHand.splice(source.index, 1)
      newAttacks[parseInt(destination.droppableId.split('-')[1])] = draggableId

      const newState = {
        ...this.state,
        attacks: newAttacks,
        hands: {
          ...this.state.hands,
          [this.state.player_id]: newHand,
        }
      }

      this.setState(newState)
      this.attack(draggableId, newAttacks)
    }

    if (destination.droppableId.split('-')[0] === 'defenceArea') {
      const newHand = this.state.hands[this.state.player_id]
      const newDefences = this.state.defences

      newHand.splice(source.index, 1)
      newDefences[parseInt(destination.droppableId.split('-')[1])] = draggableId

      const newState = {
        ...this.state,
        defences: newDefences,
        hands: {
          ...this.state.hands,
          [this.state.player_id]: newHand,
        }
      }

      this.setState(newState)
      this.defend(draggableId, newDefences)
    }
  }

  render () {
    const playerName = this.state.names[this.state.player_id]
    const otherPlayers = this.state.players.filter(id => id !== this.state.player_id)
    const defenderHand = this.state.hands[this.state.defender]
    const isAttacker = this.state.attacker === this.state.player_id
    const isDefender = this.state.defender === this.state.player_id
    const attackCount = this.state.attacks.filter(n => n).length
    const allowedAttacks = Math.min(defenderHand.concat(this.state.defences.filter(n => n)).length, 6)

    return (
      <React.Fragment>
        { this.state.deck.length > 0 && <Deck cards={this.state.deck} />}
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Hand
            droppableId="hand"
            key="hand-1"
            cards={this.state.hands[this.state.player_id]} />
          <AttackContainer>
            {new Array(allowedAttacks).fill().map((x, i) =>
              <AttackArea
                index={i}
                card={this.state.attacks[i]}
                droppableId={`attackArea-${i}`}
                available={!isDefender}
                key={i} />
            )}
            {
              isDefender && attackCount > 0 &&
                <ConcedeButton onClick={this.concedeAttack}>Take all</ConcedeButton>
            }
          </AttackContainer>
          <DefenceContainer>
            {new Array(allowedAttacks).fill().map((x, i) =>
              <DefenceArea
                index={i}
                card={this.state.defences[i]}
                droppableId={`defenceArea-${i}`}
                available={isDefender}
                key={i} />
            )}
          </DefenceContainer>
        </DragDropContext>
        {this.state.player_id}
        <br />
        {playerName}
        <br />
        {this.state.trump}
      </React.Fragment>
    )
  }
}

Game.propTypes = {
  greeting: PropTypes.string
};
export default Game
