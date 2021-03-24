import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 130px;
  height: 200px;
  background-size: cover;
  margin-right: ${props => props.otherHand || props.deck ? '-128px' : '10px'};
  box-sizing: border-box;

  &:first-child {
    transform: ${props => props.deck ? 'translate(-22px, 0px)' : ''};
    z-index: -1;
  }
`

export const BasicCard = (props) => {
  return(
    <Container
      style={{backgroundImage: `url(/cards/${props.value}.png)`}}
      otherHand={props.otherHand}
      deck={props.deck}
    >
    </Container>
  )
}
