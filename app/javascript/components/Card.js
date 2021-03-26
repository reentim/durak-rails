import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  width: 130px;
  height: 200px;
  background-size: cover;
  margin-right: ${props => marginRight(props.handSize)}px;
  box-sizing: border-box;
`

const marginRight = (handSize) => Math.min((window.innerWidth - 16 - ((handSize + 1) * 130)) / (handSize + 1), 10)

export const Card = (props) => {
  return(
    <Draggable draggableId={props.value} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          handSize={props.handSize}
          style={{
            backgroundImage: `url(/cards/${props.value}.png)`,
            ...provided.draggableProps.style,
          }}
          >
        </Container>
      )}
    </Draggable>
  )
}
