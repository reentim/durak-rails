import React from 'react'
import styled from 'styled-components'
import { BasicCard } from 'components/BasicCard'
import { Droppable } from 'react-beautiful-dnd'

const InvisibleSlot = styled.div`
  width: 130px;
  height: 200px;
  margin-right: 10px;
  box-sizing: border-box;
  background-color: ${props => (props.isDraggingOver ? 'rgb(0, 100, 0)' : '')};
  border: ${props => (props.isDraggingOver ? '2px solid rgba(0,0,0,0.3)' : 'none')};
  border-radius: 10px;
`

export const DefenceArea = (props) => {
  const card = <BasicCard value={props.card} />

  const invisibleSlot = <InvisibleSlot />

  const droppableSlot = (
    <Droppable droppableId={props.droppableId} direction="horizontal">
      {(provided, snapshot) => (
        <InvisibleSlot
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
          >
          {provided.placeholder}
        </InvisibleSlot>
      )}
    </Droppable>
  )

  return (
    props.card ? card : props.available ? droppableSlot : invisibleSlot
  )
}
