import React from 'react'
import styled from 'styled-components'
import { Droppable } from 'react-beautiful-dnd'
import { BasicCard } from 'components/BasicCard'

const Container = styled.div`
 display: flex;
`
const Slot = styled.div`
  width: 130px;
  height: 200px;
  margin-right: 10px;
  background-color: rgb(0, 100, 0);
  border-radius: 10px;
`

export const AttackArea = (props) => {
  const card = (
    <BasicCard value={props.attack} />
  )

  const empty = (
    <Droppable droppableId={props.droppableId} direction="horizontal">
      {(provided) => (
        <Slot
          ref={provided.innerRef}
          {...provided.droppableProps}
          >
          {provided.placeholder}
        </Slot>
      )}
    </Droppable>
  )
  return (
    props.attack ? card : empty
  )
}
