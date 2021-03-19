import React from 'react'
import './card.css'
import { Draggable } from 'react-beautiful-dnd'

export const Card = (props) => {
  return(
    <Draggable draggableId={props.value} index={props.index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className='Card'
          style={{
            backgroundImage: `url(/cards/${props.value}.png)`,
            ...provided.draggableProps.style,
          }}
          >
        </div>
      )}
    </Draggable>
  )
}
