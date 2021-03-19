import React from 'react'
import { Card } from 'components/Card'
import './hand.css'
import { Droppable } from 'react-beautiful-dnd'

export const Hand = (props) => {
  return(
    <Droppable droppableId="1" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`Hand ${props.other ? 'other' : ''}`}>
          {
            props.cards &&
              props.cards.map(
                (card, index) => (
                  <Card index={index} key={card} value={card} />
                )
              )
          }
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}
