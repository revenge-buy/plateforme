import { useState } from "react"
import { TbHome } from "react-icons/tb"
import { BiSearch, BiPlus } from "react-icons/bi"

import Logo from "@/components/Logo/Logo"

import style from './index.module.css'
import Link from "next/link"

export default function Header() {
  const [searching, setSearching] = useState(false) 
  const [searchKey, setSearchKey] = useState('') 

  return (
    <header className={style.header}>
      <Link className={style.headerLogo} href="/">
        <TbHome />
        <Logo />
      </Link>
      <div className={`flexed ${style.buttons}`} >
        <div className={style.add}>
          <BiPlus />
          <Link href="/projects/new">Ajouter Un projet</Link>
        </div>
        <div className="btn" onClick={() => setSearching(true)}>
          <BiSearch />
          {/* search */}
        </div>
      </div>
      {searching &&
        <div className={style.searchResults}>
          <form action="">
            <input value={searchKey} onChange={(e) => setSearchKey(e.target.value)} type="text" name="search" placeholder="search" />
            <div className="btn" onClick={() => setSearching(false)}>
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