import React from 'react'
import styled from 'styled-components'
import { BasicCard } from 'components/BasicCard'

const Container = styled.div`
  display: flex;
  margin-left: auto;
  width: 150px;
`

export const Deck = (props) => {
  return(
    <Container>
      { props.cards.concat().reverse().map((card, index) => (
          <BasicCard deck={true} key={index} value={card} />
      ))}
    </Container>
  )
}
