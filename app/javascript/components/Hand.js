import React from 'react'
import { Card } from 'components/Card'
import './hand.css'

export const Hand = (props) => {
  const isSelected = (handCard) => (
    props.selected.some(card => card === handCard)
  )

  return(
    <div className='Hand'>
      {props.cards.map(card => <Card handleClick={props.handleCardClick} key={card} value={card} selected={isSelected(card)} />)}
    </div>
  )
}
