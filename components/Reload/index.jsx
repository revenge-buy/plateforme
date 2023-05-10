import { useRouter } from 'next/router'
import React from 'react'
import { TbReload } from 'react-icons/tb'

import style from './style.module.css'

const Reload = ({label, func}) => {
  const router = useRouter()

  return (
    <div className={style.reload} onClick={function(){
      if(func)
        {
          func()
        } else {
          router.reload()
        }
      }}
    >
      <TbReload />
      <p>{label || "Actualiser"}</p>
    </div>
  )
}

export default Reload
