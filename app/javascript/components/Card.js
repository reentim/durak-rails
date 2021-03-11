import React from 'react'
import './card.css'

export const Card = (props) => {

  return(
    <div
      className={`Card ${props.selected ? 'selected' : '' }`}
      style={{ backgroundImage: `url(/cards/${props.value}.png)`}}
      onClick={() => props.handleClick(props.value)}>
    </div>
  )
}
