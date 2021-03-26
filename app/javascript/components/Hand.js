import React from 'react'
import styled from 'styled-components'
import { Card } from 'components/Card'
import { Droppable } from 'react-beautiful-dnd'

const Container = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
`

export const Hand = (props) => {
  return(
    <Droppable droppableId="hand" direction="horizontal">
      {(provided) => (
        <Container
          ref={provided.innerRef}
          {...provided.droppableProps}
          >
          {
            props.cards &&
              props.cards.map(
                (card, index) => (
                  <Card
                    handSize={props.cards.length}
                    index={index}
                    key={card}
                    value={card} />
                )
              )
          }
          {provided.placeholder}
        </Container>
      )}
    </Droppable>
  )
}
