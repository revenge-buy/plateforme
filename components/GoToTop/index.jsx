import Link from 'next/link'
import React from 'react'
import { BiUpArrow } from 'react-icons/bi'

import style from './GoToTop.module.css'

const GoToTop = ({tag}) => {
  return (
    <div className={style.goToTop}>
      <div className="section-gap"></div>
      <Link className={style} href={`#${tag}`}>
        <BiUpArrow />
        <p>Remonter</p>
      </Link>
    </div>
  )
}

export default GoToTop
