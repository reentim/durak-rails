import React from 'react'
import './card.css'

export const BasicCard = (props) => {
  return(
    <div className='Card'
      style={{
        backgroundImage: `url(/cards/${props.value}.png)`
      }}>
    </div>
  )
}
