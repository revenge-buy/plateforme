import React from 'react'

import style from './Exploder.module.css'

const Exploder = ({text}) => {

  const letters = text.split("")

  return (
    <span className={style.exploder}>
      {letters.map((letter, index) => {
        return (
          <span key={index} className={`${style[`span${(index+1)%4}`]}`}>{letter}</span>
        )
      })}
    </span>
  )
}

export default Exploder