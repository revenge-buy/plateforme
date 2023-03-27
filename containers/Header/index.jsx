import { useState } from "react"

import Logo from "@/components/Logo/Logo"

import style from './index.module.css'

export default function Header() {
  const [searching, setSearching] = useState(false) 
  const [searchKey, setSearchKey] = useState('') 

  return (
    <header className={style.header}>
      <Logo />
      <div onClick={() => setSearching(true)}>Search</div>
      {searching &&
        <div className={style.searchResults}>
          <form action="">
            <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="text" name="search" placeholder="search" />
            <div onClick={() => setSearching(false)}>
              <span></span>
              <span></span>
            </div>
          </form>
          {searchKey !== '' ? (
            <div>
              <img src="" alt="" />
              <div>
                <h2>title</h2>
                <p>short dsecription</p>
              </div>
            </div>
          ) : (
              <div>
                <h2>Recherchez un projet</h2>
              </div>
            )
          }
        </div>
      }
    </header>
  )
}