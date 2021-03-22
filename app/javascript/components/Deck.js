import React from 'react'
import styled from 'styled-components'
import { BasicCard } from 'components/BasicCard'

const Container = styled.div`
  display: flex;
  position: absolute;
  top: 10px;
  right: 200px;
`

export const Deck = (props) => {
  return(
    <Container>
      { props.cards.reverse().map((card, index) => (
          <BasicCard deck={true} key={index} value={card} />
      ))}
    </Container>
  )
}
