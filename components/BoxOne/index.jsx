import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { BiGroup, BiPhone, BiTime } from 'react-icons/bi'
import { GiPriceTag } from 'react-icons/gi'

import style from './style.module.css'
import Logo from '../Logo/Logo'
import { BsPhone } from 'react-icons/bs'
import { AuthContext } from '@/context/auth'

const BoxOne = ({title, text, type, button, dark}) => {
  const router = useRouter()

  const { SetUser } = useContext(AuthContext)
  const click = () => {
    return button?.onClick(router, SetUser)
  }

  return (
    <div className={`${dark && style.boxOneDark} ${style.boxOne}`}>
      {
        type === "price" ? <GiPriceTag /> :
        type === "group" ? <BiGroup /> :
        type === "time" ? <BiTime /> :
        type === "phone" ? <BsPhone /> :
        <Logo />
      }
      <h5>{title}</h5>
      <p>{text || "Amazing einstein riding brilliant turins's ridiculous bike !"}</p>
      {button.type === "action" ?
        <button
          className={style.boxOneButton}
          onClick={click || null}
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