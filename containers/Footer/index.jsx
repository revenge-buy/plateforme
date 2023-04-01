import Link from "next/link"
// import { useState } from "react";
import { GiShinyPurse } from "react-icons/gi"
import { BiMenuAltLeft, BiUser } from "react-icons/bi"

import style from './index.module.css'

var user = localStorage.getItem("rb-user") ?
  JSON.parse(localStorage.getItem("rb-user")) :
  {}

export default function Footer() {

  return (
    <footer className={style.footer}>
      <nav>
        <ul>
          <li><Link href='/projects'>
            {/* menu */}
            <BiMenuAltLeft />
          </Link></li>
          <li><Link href='/updates'>
            {/* updates */}
            <GiShinyPurse />
          </Link> </li>
          {/* <li className={style.toggleMenu}>
            <button>profile</button>
            <menu>
              <h4>menu</h4>
              <div />
            </menu>
          </li> */}
          <li className={style.toggleMenu}>
            {
              user?.email ? 
              <>
                <button>
                  {/* compte */}
                  <BiUser />
                </button>
                <menu>
                  <Link href='/account'>Paramètres</Link>
                  <Link href='/account'>Profile</Link>
                  <div />
                </menu>
              </> : <Link className={style.loginBtn} href="/auth">Connexion</Link>
            }
          </li>
        </ul>
      </nav>
    </footer>
  )
}