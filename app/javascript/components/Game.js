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
import { OtherHand } from 'components/OtherHand'

const AttackContainer = styled.div`
  display: flex;
`
const DefenceContainer = styled.div`
  display: flex;
  margin-top: -100px;
`
const ConcedeButton = styled.button`
  margin-top: auto;
`
const ClaimRoundButton = styled.button`
  margin-top: auto;
`
const NameIndicator = styled.div`
  position: absolute;
  bottom: 220px;
`
const OtherHandsContainer = styled.div`
  display: flex;
`
const PreGame = styled.div`
  text-align: center;
  margin-bottom: 40px;
`

class Game extends React.Component {
  constructor(props) {
    super(props)

    this.state = this.props.state

    this.updateState = this.updateState.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.concedeAttack = this.concedeAttack.bind(this)
    this.claimRound = this.claimRound.bind(this)
  }

  componentDidMount() {
    const gameId = document.getElementById('game_id').textContent
    consumer.subscriptions.create({
      channel: 'NotificationChannel',
      game_id: gameId,
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
    const gameId = this.state.game_id
    const playerId = this.state.player_id
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

    this.setState({
      ...this.state,
      roundClaimable: false,
    })

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
    .then(
      setTimeout(() =>
        this.setState({
          ...this.state,
          roundClaimable: true,
        }),
        5000
      )
    )
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

  claimRound() {
    const gameId = this.props.state['game_id']

    fetch(`/games/${gameId}/round_claims`, {
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
    const fixedPlayers = this.state.fixedPlayers || []
    const otherPlayers = fixedPlayers.filter(id => id !== this.state.player_id)
    const defenderHand = this.state.hands[this.state.defender] || []
    const isAttacker = this.state.attacker === this.state.player_id
    const isDefender = this.state.defender === this.state.player_id
    const attackCount = this.state.attacks.filter(n => n).length
    const defenceCount = this.state.defences.filter(n => n).length
    const allowedAttacks = Math.min(defenderHand.length + defenceCount, 6)
    const defenderName = this.state.names[this.state.defender]
    const gameStarted = this.state['started']

    return (
      <React.Fragment>
        {!this.state.started &&
          <div>
            {this.state.player_id === this.state.created_by &&
              <div className="note">
                Share this link ⬆️
              </div>
            }
            {this.state.player_id !== this.state.created_by &&
              this.state.player_id &&
              <div className="note">
                Waiting for {this.state.names[this.state.created_by]} to start the game
              </div>
            }
            <PreGame>
              <h1>Durak game</h1>
              {this.state.players.map((player, i) =>
                <div key={i}>{this.state.names[player]}</div>
              )}
            </PreGame>
          </div>
        }
        {this.state.started &&
          <div>
            <OtherHandsContainer>
              {otherPlayers.map((player, i) =>
                <OtherHand
                  key={i}
                  cards={this.state.hands[player]}
                  name={this.state.names[player]}
                  isAttacker={this.state.attacker === player} />
              )}
            </OtherHandsContainer>
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Hand
                droppableId="hand"
                key="hand-1"
                cards={this.state.hands[this.state.player_id]} />
              <AttackContainer>
                {new Array(6).fill().map((x, i) =>
                  <AttackArea
                    index={i}
                    card={this.state.attacks[i]}
                    droppableId={`attackArea-${i}`}
                    key={i} />
                )}
                {
                  isDefender && attackCount > 0 && attackCount !== defenceCount &&
                    <ConcedeButton onClick={this.concedeAttack}>Take all</ConcedeButton>
                }
                {
                  isDefender && attackCount > 0 && attackCount === defenceCount &&
                    <ClaimRoundButton
                      disabled={!this.state.roundClaimable}
                      onClick={this.claimRound}>
                      Claim round
                    </ClaimRoundButton>
                }
                { this.state.deck.length > 0 && <Deck cards={this.state.deck} />}
              </AttackContainer>
              <DefenceContainer>
                {new Array(6).fill().map((x, i) =>
                  <DefenceArea
                    index={i}
                    card={this.state.defences[i]}
                    droppableId={`defenceArea-${i}`}
                    available={isDefender}
                    key={i} />
                )}
              </DefenceContainer>
            </DragDropContext>
            <NameIndicator>
              {playerName}
              {isAttacker && <span> ➡️ {defenderName}</span>}
            </NameIndicator>
          </div>
        }
      </React.Fragment>
    )
  }
}

Game.propTypes = {
  greeting: PropTypes.string
};
export default Game
