import React from 'react'
import styled from 'styled-components'
import { BasicCard } from 'components/BasicCard'
import { Droppable } from 'react-beautiful-dnd'

const InvisibleSlot = styled.div`
  width: 130px;
  height: 200px;
  margin-right: 10px;
`

export const DefenceArea = (props) => {
  const card = <BasicCard value={props.card} />

  const invisibleSlot = <InvisibleSlot />

  const droppableSlot = (
    <Droppable droppableId={props.droppableId} direction="horizontal">
      {(provided) => (
        <InvisibleSlot
          ref={provided.innerRef}
          {...provided.droppableProps}
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
