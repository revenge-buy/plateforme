import Logo from '@/components/Logo/Logo'
import React from 'react'
import style from './style.module.css'

const PageWaiter = () => {
  return (
    <div className={style.pageWaiter}>
      <div class={style.pageLoader}>
        <div class={style.spinner}></div>
        <div className={style.logo}><Logo/></div>
      </div>
      {/* <div class={style.content1}>
        <h1>Well hello there world!</h1>
      </div> */}
    </div>
  )
}

export default PageWaiter
