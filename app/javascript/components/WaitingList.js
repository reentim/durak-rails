import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  text-align: center;
  margin-bottom: 2em;
`

class WaitingList extends React.Component {
  render() {
    console.log(this.props)
    return (
      <Container>
        <h1>Durak game</h1>
        <h3>Players:</h3>
        {this.props.names.map((v, i) => <div key={i}>{v}</div>)}
      </Container>
    )
  }
}

export default WaitingList
