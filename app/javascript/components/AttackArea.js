import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import { BasicCard } from 'components/BasicCard'

const Slot = styled.div`
  width: 130px;
  height: 200px;
  margin-right: 10px;
  background-color: rgb(0, 100, 0);
  box-sizing: border-box;
  border: ${props => (props.isDraggingOver ? '2px solid rgba(0,0,0,0.3)' : 'none')};
  border-radius: 10px;
`

export const AttackArea = (props) => {
  const card = (
    <BasicCard value={props.card} />
  )

  const droppableSlot = (
    <Droppable droppableId={props.droppableId} direction="horizontal">
      {(provided, snapshot) => (
        <Slot
          ref={provided.innerRef}
          {...provided.droppableProps}
          isDraggingOver={snapshot.isDraggingOver}
          >
          {provided.placeholder}
        </Slot>
      )}
    </Droppable>
  )

  const slot = <Slot />

  return (
    props.card ? card : props.available ? droppableSlot : slot
  )
}
