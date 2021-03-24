import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div`
  width: 130px;
  height: 200px;
  background-size: cover;
  margin-right: 10px;
  box-sizing: border-box;
`

export const Card = (props) => {
  return(
    <Draggable draggableId={props.value} index={props.index}>
      {(provided) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
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
