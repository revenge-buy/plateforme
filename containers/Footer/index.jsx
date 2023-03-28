import Link from "next/link"
import { useState } from "react";
import { GiShinyPurse } from "react-icons/gi"
import { BiMenuAltLeft, BiUser } from "react-icons/bi"

import style from './index.module.css'

export default function Footer() {
  const [toggleMenu, setToggleMenu] = useState(false)

   // checking if code is from client or server side
  let WINDOW = {};

  if (typeof window !== "undefined") {
    // When code is on client-side. So we need to use actual methods and data.
    WINDOW = window;
  } else {
    // When code is on server-side.

    // Other component are mostly server-side and need to match their logic and check their variable with other server-side components and logics.
    // So following code will be use for them to pass the logic checking.
    WINDOW = {
      document: {
        location: {},
      },
      localStorage: {
        getItem :() => {},
        setItem :() => {}
      },
    };
  }
  WINDOW.localStorage.setItem('rb-user', 'durin')
  const user = WINDOW.localStorage.getItem('rb-user')
  return (
    <footer className={style.footer}>
      <nav>
        <ul>
          <li><Link href='/projects'><BiMenuAltLeft /></Link></li>
          <li><Link href='/updates'><GiShinyPurse /></Link> </li>
          {/* <li className={style.toggleMenu}>
            <button>profile</button>
            <menu>
              <h4>menu</h4>
              <div />
            </menu>
          </li> */}
          <li className={style.toggleMenu}>
            <button><BiUser /></button>
            <menu>
              <Link href='/account'>Paramètres</Link>
              <Link href='/account'>Profile</Link>
              <div />
            </menu>
          </li>
        </ul>
      </nav>
    </footer>
  )
}