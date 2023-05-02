import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { BiGroup } from 'react-icons/bi'
import { GiPriceTag } from 'react-icons/gi'
import Logo from '../Logo/Logo'
import style from './style.module.css'

const BoxOne = ({title, text, type, button}) => {
  return (
    <div className={style.boxOne} id="advantage">
      {
        type === "price" ? <GiPriceTag /> :
        type === "group" ? <BiGroup /> :
        <Logo />
      }
      <h5>{title}</h5>
      <p>{text || "Amazing einstein riding brilliant turins's ridiculous bike !"}</p>
      {button.type === "action" ?
        <button
          className={style.boxOneButton}
          onClick={function(){button?.onClick} || null}
        >
          {button?.text || "cliquez !"}
        </button> :

        <Link
          className={style.boxOneButton}
          href={button?.link || "#"}
        >
          {button?.text || "cliquez !"}
        </Link>
      }
    </div>
  )
}

export default BoxOne