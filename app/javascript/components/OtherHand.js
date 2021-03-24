import React from 'react'
import styled from 'styled-components'
import { BasicCard } from 'components/BasicCard'

const Container = styled.div`
  display: flex;
  margin-right: 250px;
  margin-top: -150px;
  margin-bottom: 200px;
`
const NameContainer = styled.div`
  margin-top: auto;
  margin-left: 135px;
`

export const OtherHand = (props) => {
  return(
    <Container>
      { props.cards.reverse().map((card, index) => (
          <BasicCard otherHand={true} key={index} value={card} />
      ))}
      <NameContainer>
        {props.name}
        {props.isAttacker && <span>🌟</span>}
      </NameContainer>
    </Container>
  )
}
